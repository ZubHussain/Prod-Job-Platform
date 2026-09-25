import crypto from "node:crypto";

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function buildJobFingerprint(job) {
  const title = String(job.title || "").toLowerCase().trim();
  const company = String(job.company || "").toLowerCase().trim();
  const location = String(job.location?.displayName || "")
    .toLowerCase()
    .trim();

  return sha256(`${title}|${company}|${location}`);
}