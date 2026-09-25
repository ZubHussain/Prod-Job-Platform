import "dotenv/config";
import express from "express";
import { env } from "./config/env.js";
import { producer, consumer } from "./config/kafka.js";
import { startRawJobConsumer } from "./consumer/raw-job.consumer.js";

const app = express();

app.get("/health", (req, res) => {
  res.json({
    service: env.serviceName,
    status: "UP",
    topics: {
      consume: env.kafka.rawTopic,
      produce: env.kafka.cleanTopic,
      rejected: env.kafka.rejectedTopic
    },
    timestamp: new Date().toISOString()
  });
});

async function start() {
  await producer.connect();

  startRawJobConsumer().catch(error => {
    console.error("Kafka consumer stopped", error);
    process.exit(1);
  });

  app.listen(env.port, () => {
    console.log(`${env.serviceName} running on port ${env.port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received`);

  try {
    await Promise.allSettled([
      consumer.disconnect(),
      producer.disconnect()
    ]);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch(error => {
  console.error("Unable to start digestion service", error);
  process.exit(1);
});