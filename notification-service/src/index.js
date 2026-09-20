import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { startConsumer } from "./config/kafka.js";
import { list, markRead } from "./controllers/notificationController.js";

await connectDB();
startConsumer();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_req,res)=>res.json({service:"notification-service",status:"ok"}));
app.get("/", list);
app.patch("/:id/read", markRead);
app.listen(process.env.PORT || 4006, ()=>console.log("Notification service running"));
