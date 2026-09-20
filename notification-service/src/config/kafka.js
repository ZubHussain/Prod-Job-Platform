import { Kafka } from "kafkajs";
import Notification from "../models/Notification.js";
import { sendMail } from "./mailer.js";

const kafka = new Kafka({ clientId: "notification-service", brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",") });
const consumer = kafka.consumer({ groupId: "notification-service-group" });

export async function startConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ["application.created","application.status.changed"], fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const data = JSON.parse(message.value.toString());

        if (topic === "application.created") {
          const title = `New applicant for ${data.jobTitle || "your job"}`;
          const msg = `${data.candidateName || "A candidate"} applied to ${data.jobTitle || "your job"}. Match score: ${data.matchScore || 0}%.`;
          await Notification.create({ userId: data.recruiterId, email: data.recruiterEmail, type: "application", title, message: msg, metadata: { applicationId: data._id, jobId: data.jobId } });
          await sendMail(data.recruiterEmail, title, `<h2>${title}</h2><p>${msg}</p><p>Candidate: ${data.candidateEmail || ""}</p>`);
        }

        if (topic === "application.status.changed") {
          const label = String(data.status || "").replace(/\b\w/g, c => c.toUpperCase());
          const title = `Application ${label}`;
          const msg = `Your application for ${data.jobTitle || "the job"} at ${data.companyName || "the company"} is now ${label}. ${data.statusNote || ""}`;
          await Notification.create({ userId: data.candidateId, email: data.candidateEmail, type: "status", title, message: msg, metadata: { applicationId: data._id, jobId: data.jobId, status: data.status } });
          await sendMail(data.candidateEmail, title, `<h2>${title}</h2><p>${msg}</p>`);
        }
      }
    });
  } catch (e) { console.error("Notification Kafka error:", e.message); }
}
