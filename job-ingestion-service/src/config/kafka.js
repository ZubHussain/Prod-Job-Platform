import { Kafka, logLevel } from "kafkajs";
import { env } from "./env.js";

const kafka = new Kafka({
  clientId: env.kafka.clientId,
  brokers: env.kafka.brokers,
  logLevel: logLevel.INFO,
  retry: { initialRetryTime: 500, retries: 8 }
});

export const producer = kafka.producer({
  allowAutoTopicCreation: true
});

let connected = false;

export async function connectProducer() {
  if (connected) return;

  await producer.connect();
  connected = true;
  console.log(`[kafka] producer connected`);
}

export async function disconnectProducer() {
  if (!connected) return;

  await producer.disconnect();
  connected = false;
}