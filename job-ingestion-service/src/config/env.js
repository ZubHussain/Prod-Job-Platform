function csv(value, fallback = []) {
  return value
    ? value.split(",").map(item => item.trim()).filter(Boolean)
    : fallback;
}

export const env = {
  port: Number(process.env.PORT || 5007),
  serviceName: process.env.SERVICE_NAME || "job-ingestion-service",
  ingestApiKey: process.env.INGEST_API_KEY,

  kafka: {
    brokers: csv(process.env.KAFKA_BROKERS, ["kafka:29092"]),
    clientId: process.env.KAFKA_CLIENT_ID || "job-ingestion-service",
    rawTopic: process.env.KAFKA_RAW_TOPIC || "jobs.raw"
  },

  adzuna: {
    appId: process.env.ADZUNA_APP_ID,
    appKey: process.env.ADZUNA_APP_KEY,
    country: process.env.ADZUNA_COUNTRY || "in",
    resultsPerPage: Number(process.env.ADZUNA_RESULTS_PER_PAGE || 20)
  },

  scheduler: {
    cron: process.env.INGEST_CRON || "0 */6 * * *",
    timezone: process.env.INGEST_TIMEZONE || "Asia/Kolkata"
  },

  keywords: csv(process.env.JOB_KEYWORDS, [
    "software engineer",
    "backend developer",
    "java developer",
    "spring boot developer",
    "node js developer",
    "mern developer",
    "full stack developer"
  ]),

  locations: csv(process.env.JOB_LOCATIONS, [
    "Delhi", "Noida", "Gurugram"
  ])
};

export function validateEnv() {
  const missing = [];

  if (!env.adzuna.appId) missing.push("ADZUNA_APP_ID");
  if (!env.adzuna.appKey) missing.push("ADZUNA_APP_KEY");
  if (!env.ingestApiKey) missing.push("INGEST_API_KEY");

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}