import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import proxy from "express-http-proxy";
import { authenticate, optionalAuth } from "./middleware/auth.js";

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, limit: 300 }));

app.get("/health", (_req, res) => res.json({ service: "api-gateway", status: "ok" }));

const passthrough = (url) => proxy(url, {
  proxyReqPathResolver: req => req.originalUrl.replace(/^\/api\/[^/]+/, "")
});

app.use("/api/auth", passthrough(process.env.AUTH_SERVICE_URL));
app.use("/api/users", authenticate, passthrough(process.env.USER_SERVICE_URL));
app.use("/api/jobs", optionalAuth, passthrough(process.env.JOB_SERVICE_URL));
app.use("/api/applications", authenticate, passthrough(process.env.APPLICATION_SERVICE_URL));
app.use("/api/ai", authenticate, passthrough(process.env.AI_SERVICE_URL));
app.use("/api/notifications", authenticate, passthrough(process.env.NOTIFICATION_SERVICE_URL));

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

app.listen(process.env.PORT || 8080, () => {
  console.log(`API Gateway running on ${process.env.PORT || 8080}`);
});
