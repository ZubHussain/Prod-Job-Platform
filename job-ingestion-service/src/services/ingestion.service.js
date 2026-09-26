import { env } from "../config/env.js";
import { fetchAdzunaJobs } from "../providers/adzuna.provider.js";
import { mapAdzunaToRawJob } from "../mappers/adzuna.mapper.js";
import { publishRawJobs } from "./publisher.service.js";

let running = false;

export async function runIngestion() {
  if (running) {
    return {
      skipped: true,
      reason: "An ingestion run is already active"
    };
  }

  running = true;

  const stats = {
    searches: 0,
    fetched: 0,
    published: 0,
    failedSearches: 0,
    errors: []
  };

  try {
     if (!env.adzuna.appId || !env.adzuna.appKey) {
      throw new Error("Adzuna credentials are not configured");
    }

    for (const keyword of env.keywords) {
      for (const location of env.locations) {
        stats.searches++;

        try {
          const jobs = await fetchAdzunaJobs({ keyword, location });
          stats.fetched += jobs.length;

          const rawJobs = jobs.map(job =>
            mapAdzunaToRawJob(job, { keyword, location })
          );

          const result = await publishRawJobs(rawJobs);
          stats.published += result.published;

          console.log(`[ingestion] ${keyword} @ ${location}: ${jobs.length} jobs`);
        } catch (error) {
          stats.failedSearches++;
          stats.errors.push({ keyword, location });
          console.error(
            `[ingestion] failed: ${keyword} @ ${location}`,
            error.response?.status || error.code || "request failed"
          );
        }
      }
    }

    return stats;
  } finally {
    running = false;
  }
}