import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { connectKafka } from "./config/kafka.js";
import jobRoutes from "./routes/jobRoutes.js";

await connectDB();
await connectKafka();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.get("/health", (_req,res)=>res.json({service:"job-service",status:"ok"}));
app.use("/", jobRoutes);
app.listen(process.env.PORT || 4003, ()=>console.log("Job service running"));
