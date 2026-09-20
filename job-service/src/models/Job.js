import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  recruiterId: { type: String, required: true, index: true },
  recruiterEmail: { type: String, default: "" },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: "" },
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  field: { type: String, required: true, index: true },
  employmentType: { type: String, enum: ["Full-time","Part-time","Internship","Contract"], default: "Full-time" },
  workplaceType: { type: String, enum: ["On-site","Remote","Hybrid"], default: "On-site" },
  location: { type: String, default: "" },
  minSalary: Number,
  maxSalary: Number,
  currency: { type: String, default: "INR" },
  experienceLevel: { type: String, default: "Fresher" },
  applyMode: { type: String, enum: ["internal","external","both"], default: "internal" },
  externalApplyUrl: { type: String, default: "" },
  status: { type: String, enum: ["draft","published","closed"], default: "published" },
  expiresAt: Date
}, { timestamps: true });

jobSchema.index({ title: "text", description: "text", skills: "text", companyName: "text", field: "text" });
export default mongoose.model("Job", jobSchema);
