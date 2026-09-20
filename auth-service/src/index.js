import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { connectKafka } from "./config/kafka.js";
import authRoutes from "./routes/authRoutes.js";

await connectDB();
await connectKafka();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req, res) => res.json({ service: "auth-service", status: "ok" }));
app.use("/", authRoutes);
app.listen(process.env.PORT || 4001, () => console.log("Auth service running"));
