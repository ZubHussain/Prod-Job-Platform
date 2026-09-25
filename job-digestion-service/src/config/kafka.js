import { Kafka, logLevel } from "kafkajs";
import { env } from "./env.js";

const kafka = new Kafka({
  clientId: env.kafka.clientId,
  brokers: env.kafka.brokers,
  logLevel: logLevel.INFO,
  retry: { initialRetryTime: 500, retries: 10 }
});

export const producer = kafka.producer({
  allowAutoTopicCreation: true
});

export const consumer = kafka.consumer({
  groupId: env.kafka.groupId
});