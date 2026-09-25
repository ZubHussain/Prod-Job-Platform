import "dotenv/config";
import express from "express";
import { env, validateEnv } from "./config/env.js";
import {
  connectProducer,
  disconnectProducer
} from "./config/kafka.js";
import {
  startIngestionScheduler
} from "./scheduler/ingestion.scheduler.js";
import ingestionRoutes from "./routes/ingestion.routes.js";

validateEnv();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: env.serviceName,
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/ingestion", ingestionRoutes);

async function start() {
  await connectProducer();
  startIngestionScheduler();

  app.listen(env.port, () => {
    console.log(`${env.serviceName} running on port ${env.port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received`);
  try {
    await disconnectProducer();
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch(error => {
  console.error("Unable to start ingestion service", error);
  process.exit(1);
});