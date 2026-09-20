import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || "true") === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
export async function sendMail(to, subject, html) {
  if (!to || !process.env.SMTP_USER) return;
  await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
}
