import { Router } from "express";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { runIngestion } from "../services/ingestion.service.js";

const router = Router();

router.post("/run", async (req, res) => {
  const provided = Buffer.from(req.get("x-ingest-api-key") || "");
  const expected = Buffer.from(env.ingestApiKey);

  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(provided, expected)
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const result = await runIngestion();
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Job ingestion failed"
    });
  }
});

export default router;