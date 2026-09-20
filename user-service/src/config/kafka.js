import { Kafka } from "kafkajs";
import Profile from "../models/Profile.js";
const kafka = new Kafka({ clientId: "user-service", brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",") });
const consumer = kafka.consumer({ groupId: "user-service-group" });

export async function startUserConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "user.registered", fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        await Profile.findOneAndUpdate(
          { userId: data.userId },
          {
            $setOnInsert: {
              userId: data.userId, name: data.name, email: data.email,
              role: data.role, companyName: data.companyName || ""
            }
          },
          { upsert: true }
        );
      }
    });
  } catch (e) { console.error("User Kafka unavailable:", e.message); }
}
