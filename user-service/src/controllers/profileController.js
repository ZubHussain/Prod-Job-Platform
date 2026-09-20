import streamifier from "streamifier";
import Profile from "../models/Profile.js";
import cloudinary from "../config/cloudinary.js";

const id = req => req.headers["x-user-id"];

export async function getMe(req, res) {
  const profile = await Profile.findOne({ userId: id(req) });
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.json(profile);
}

export async function updateMe(req, res) {
  const allowed = ["name","headline","bio","phone","location","preferredFields","skills","experience","education","links","companyName"];
  const patch = {};
  for (const key of allowed) if (req.body[key] !== undefined) patch[key] = req.body[key];
  const profile = await Profile.findOneAndUpdate({ userId: id(req) }, { $set: patch }, { new: true, upsert: true });
  res.json(profile);
}

export async function uploadResume(req, res) {
  if (!req.file) return res.status(400).json({ message: "Resume file required" });
  const streamUpload = () => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "jobnova/resumes", resource_type: "raw", use_filename: true, unique_filename: true },
      (error, result) => error ? reject(error) : resolve(result)
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  try {
    const uploaded = await streamUpload();
    const profile = await Profile.findOneAndUpdate(
      { userId: id(req) },
      { $set: { resume: { url: uploaded.secure_url, publicId: uploaded.public_id, fileName: req.file.originalname, uploadedAt: new Date() } } },
      { new: true, upsert: true }
    );
    res.json(profile.resume);
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getPublicProfile(req, res) {
  const profile = await Profile.findOne({ userId: req.params.userId }).select("-phone");
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.json(profile);
}
