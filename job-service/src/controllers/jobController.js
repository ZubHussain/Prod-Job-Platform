import Job from "../models/Job.js";
import { redis } from "../config/redis.js";
import { publish } from "../config/kafka.js";

const userId = req => req.headers["x-user-id"];
const role = req => req.headers["x-user-role"];

export async function createJob(req, res) {
  if (role(req) !== "recruiter") return res.status(403).json({ message: "Recruiter access required" });
  const job = await Job.create({
    ...req.body,
    recruiterId: userId(req),
    recruiterEmail: req.headers["x-user-email"] || ""
  });
  await redis.del("jobs:latest");
  await publish("job.created", { jobId: job._id.toString(), recruiterId: job.recruiterId, title: job.title });
  res.status(201).json(job);
}

export async function listJobs(req, res) {
  const { q = "", field = "", location = "", workplaceType = "", employmentType = "", page = 1, limit = 12 } = req.query;
  const query = { status: "published" };
  if (q) query.$text = { $search: q };
  if (field) query.field = new RegExp(field, "i");
  if (location) query.location = new RegExp(location, "i");
  if (workplaceType) query.workplaceType = workplaceType;
  if (employmentType) query.employmentType = employmentType;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Job.countDocuments(query)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

export async function getJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
}

export async function updateJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (job.recruiterId !== userId(req)) return res.status(403).json({ message: "Not allowed" });
  Object.assign(job, req.body);
  await job.save();
  await redis.del("jobs:latest");
  res.json(job);
}

export async function deleteJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (job.recruiterId !== userId(req)) return res.status(403).json({ message: "Not allowed" });
  await job.deleteOne();
  await redis.del("jobs:latest");
  res.status(204).send();
}

export async function myJobs(req, res) {
  if (role(req) !== "recruiter") return res.status(403).json({ message: "Recruiter access required" });
  res.json(await Job.find({ recruiterId: userId(req) }).sort({ createdAt: -1 }));
}

export async function recommended(req, res) {
  const fields = String(req.query.fields || "").split(",").map(s => s.trim()).filter(Boolean);
  const skills = String(req.query.skills || "").split(",").map(s => s.trim()).filter(Boolean);
  const clauses = [];
  if (fields.length) clauses.push({ field: { $in: fields.map(x => new RegExp(`^${x}$`, "i")) } });
  if (skills.length) clauses.push({ skills: { $in: skills.map(x => new RegExp(x, "i")) } });
  const query = { status: "published", ...(clauses.length ? { $or: clauses } : {}) };
  res.json(await Job.find(query).sort({ createdAt: -1 }).limit(30));
}
