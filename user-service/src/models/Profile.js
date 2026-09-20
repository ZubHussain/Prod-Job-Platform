import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: String, company: String, startDate: String, endDate: String, description: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: String, institute: String, startYear: String, endYear: String
}, { _id: false });

const profileSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true, required: true },
  name: String,
  email: String,
  role: { type: String, default: "candidate" },
  companyName: { type: String, default: "" },
  headline: { type: String, default: "" },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  preferredFields: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  links: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" }
  },
  resume: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    fileName: { type: String, default: "" },
    uploadedAt: Date
  }
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
