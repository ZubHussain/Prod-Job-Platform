import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { startUserConsumer } from "./config/kafka.js";
import profileRoutes from "./routes/profileRoutes.js";

await connectDB();
startUserConsumer();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.get("/health", (_req, res) => res.json({ service: "user-service", status: "ok" }));
app.use("/", profileRoutes);
app.listen(process.env.PORT || 4002, () => console.log("User service running"));
