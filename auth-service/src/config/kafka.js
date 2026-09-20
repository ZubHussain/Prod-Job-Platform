import { Kafka } from "kafkajs";
const kafka = new Kafka({ clientId: "auth-service", brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",") });
export const producer = kafka.producer();
export async function connectKafka() {
  try { await producer.connect(); console.log("Auth Kafka connected"); }
  catch (e) { console.error("Kafka unavailable:", e.message); }
}
export async function publish(topic, payload) {
  try { await producer.send({ topic, messages: [{ value: JSON.stringify(payload) }] }); } catch {}
}
