import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: String, index: true },
  email: String,
  type: String,
  title: String,
  message: String,
  read: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
export default mongoose.model("Notification", schema);
