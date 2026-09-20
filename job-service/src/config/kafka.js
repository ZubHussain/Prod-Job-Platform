import { Kafka } from "kafkajs";
const kafka = new Kafka({ clientId: "job-service", brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",") });
export const producer = kafka.producer();
export async function connectKafka(){ try { await producer.connect(); } catch(e){ console.error(e.message); } }
export async function publish(topic,payload){ try{ await producer.send({topic,messages:[{value:JSON.stringify(payload)}]}); }catch{} }
