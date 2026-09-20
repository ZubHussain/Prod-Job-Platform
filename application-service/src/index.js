import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { connectKafka } from "./config/kafka.js";
import routes from "./routes/applicationRoutes.js";

await connectDB();
await connectKafka();
const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.get("/health", (_req,res)=>res.json({service:"application-service",status:"ok"}));
app.use("/", routes);
app.listen(process.env.PORT || 4004, ()=>console.log("Application service running"));
