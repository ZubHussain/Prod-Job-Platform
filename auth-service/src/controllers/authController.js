import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { publish } from "../config/kafka.js";

const tokenFor = user => jwt.sign(
  { sub: user._id.toString(), role: user.role, email: user.email, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);

export async function register(req, res) {
  try {
    const { name, email, password, role = "candidate", companyName = "" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "name, email and password are required" });
    if (!["candidate", "recruiter"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role, companyName });

    await publish("user.registered", {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName
    });

    res.status(201).json({
      token: tokenFor(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, companyName: user.companyName }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isActive) return res.status(403).json({ message: "Account disabled" });

    res.json({
      token: tokenFor(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, companyName: user.companyName }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function me(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, companyName: user.companyName });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
