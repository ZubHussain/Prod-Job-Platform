import Application from "../models/Application.js";
import { publish } from "../config/kafka.js";

const uid = req => req.headers["x-user-id"];
const role = req => req.headers["x-user-role"];

const scoreSkills = (candidate = [], required = []) => {
  if (!required.length) return 0;
  const set = new Set(candidate.map(x => x.toLowerCase()));
  const matched = required.filter(x => set.has(String(x).toLowerCase())).length;
  return Math.round((matched / required.length) * 100);
};

export async function apply(req, res) {
  if (role(req) !== "candidate") return res.status(403).json({ message: "Candidate access required" });
  try {
    const {
      jobId, recruiterId, recruiterEmail, jobTitle, companyName,
      candidateName, candidateEmail, resumeUrl, skills = [], requiredSkills = [],
      coverLetter = "", answers = {}
    } = req.body;

    const application = await Application.create({
      jobId, candidateId: uid(req), recruiterId, recruiterEmail, jobTitle, companyName,
      candidateName, candidateEmail, resumeUrl, skills, requiredSkills,
      coverLetter, answers, matchScore: scoreSkills(skills, requiredSkills)
    });

    await publish("application.created", application.toObject());
    res.status(201).json(application);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "You already applied to this job" });
    res.status(500).json({ message: e.message });
  }
}

export async function candidateApplications(req, res) {
  if (role(req) !== "candidate") return res.status(403).json({ message: "Candidate access required" });
  res.json(await Application.find({ candidateId: uid(req) }).sort({ createdAt: -1 }));
}

export async function recruiterApplications(req, res) {
  if (role(req) !== "recruiter") return res.status(403).json({ message: "Recruiter access required" });
  const query = { recruiterId: uid(req) };
  if (req.query.jobId) query.jobId = req.query.jobId;
  if (req.query.status) query.status = req.query.status;
  res.json(await Application.find(query).sort({ matchScore: -1, createdAt: -1 }));
}

export async function updateStatus(req, res) {
  if (role(req) !== "recruiter") return res.status(403).json({ message: "Recruiter access required" });
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (app.recruiterId !== uid(req)) return res.status(403).json({ message: "Not allowed" });

  app.status = req.body.status;
  app.statusNote = req.body.statusNote || "";
  await app.save();

  await publish("application.status.changed", app.toObject());
  res.json(app);
}

export async function withdraw(req, res) {
  const app = await Application.findById(req.params.id);
  if (!app || app.candidateId !== uid(req)) return res.status(404).json({ message: "Application not found" });
  app.status = "withdrawn";
  await app.save();
  res.json(app);
}
