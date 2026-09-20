import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: String, required: true, index: true },
  candidateId: { type: String, required: true, index: true },
  recruiterId: { type: String, required: true, index: true },
  candidateName: String,
  candidateEmail: String,
  recruiterEmail: String,
  jobTitle: String,
  companyName: String,
  resumeUrl: String,
  skills: { type: [String], default: [] },
  coverLetter: { type: String, default: "" },
  answers: { type: mongoose.Schema.Types.Mixed, default: {} },
  matchScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["applied","viewed","shortlisted","rejected","interview","hired","withdrawn"],
    default: "applied",
    index: true
  },
  statusNote: { type: String, default: "" }
}, { timestamps: true });

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
export default mongoose.model("Application", applicationSchema);
