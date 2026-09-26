import { Kafka } from "kafkajs";
const kafka = new Kafka({
  clientId: "job-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092")
    .split(",")
    .map(broker => broker.trim())
    .filter(Boolean)
});
export const producer = kafka.producer();
export const cleanJobConsumer = kafka.consumer({
  groupId: process.env.KAFKA_CLEAN_GROUP_ID || "job-service-cleaned-v1"
});

export async function connectKafka() {
  await producer.connect();
}

export async function publish(topic, payload) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }]
  });
}
