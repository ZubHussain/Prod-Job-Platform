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
    if (result.skipped) {
      return res.status(409).json({ success: false, result });
    }

    const success = result.failedSearches === 0;
    res.status(success ? 200 : 207).json({ success, result });
  } catch (error) {
    const missingProviderCredentials =
    env.adzuna.appId || !env.adzuna.appKey;

    console.error("[ingestion] run failed", error.message);
    res.status(missingProviderCredentials ? 503 : 500).json({
      success: false,
     message: missingProviderCredentials
        ? "Adzuna credentials are not configured"
        : "Job ingestion failed"
    });
  }
});

export default router;