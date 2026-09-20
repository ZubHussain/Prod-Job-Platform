import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    req.headers["x-user-id"] = payload.sub;
    req.headers["x-user-role"] = payload.role;
    req.headers["x-user-email"] = payload.email || "";
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuth(req, _res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    req.headers["x-user-id"] = payload.sub;
    req.headers["x-user-role"] = payload.role;
    req.headers["x-user-email"] = payload.email || "";
  } catch {}
  next();
}
