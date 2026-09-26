import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { connectKafka, cleanJobConsumer, producer } from "./config/kafka.js";
import { startCleanJobConsumer } from "./consumers/clean-job.consumer.js";
import { redis } from "./config/redis.js";
import jobRoutes from "./routes/jobRoutes.js";
import mongoose from "mongoose";

await connectDB();
await connectKafka();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.get("/health", (_req,res)=>res.json({service:"job-service",status:"ok"}));
app.use("/", jobRoutes);
const server = app.listen(process.env.PORT || 4003, ()=>console.log("Job service running"));

startCleanJobConsumer().catch(error => {
  console.error("Cleaned job consumer stopped", error);
  process.exit(1);
});

async function shutdown(signal) {
  console.log(`${signal} received`);
  server.close();

  await Promise.allSettled([
    cleanJobConsumer.disconnect(),
    producer.disconnect(),
    redis.quit(),
    mongoose.disconnect()
  ]);

  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
