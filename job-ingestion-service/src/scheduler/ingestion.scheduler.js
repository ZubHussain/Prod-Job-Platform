import cron from "node-cron";
import { env } from "../config/env.js";
import { runIngestion } from "../services/ingestion.service.js";

export function startIngestionScheduler() {
  cron.schedule(
    env.scheduler.cron,
    async () => {
      try {
        console.log(`[scheduler] started ${new Date().toISOString()}`);
        const result = await runIngestion();
        console.log("[scheduler] finished", result);
      } catch (error) {
        console.error("[scheduler] failed", error);
      }
    },
    { timezone: env.scheduler.timezone }
  );

  console.log(
    `[scheduler] ${env.scheduler.cron} (${env.scheduler.timezone})`
  );
}