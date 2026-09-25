function csv(value, fallback = []) {
  return value
    ? value.split(",").map(item => item.trim()).filter(Boolean)
    : fallback;
}

export const env = {
  port: Number(process.env.PORT || 5008),
  serviceName: process.env.SERVICE_NAME || "job-digestion-service",

  kafka: {
    brokers: csv(process.env.KAFKA_BROKERS, ["kafka:29092"]),
    clientId: process.env.KAFKA_CLIENT_ID || "job-digestion-service",
    groupId: process.env.KAFKA_GROUP_ID || "job-digestion-service-v1",
    rawTopic: process.env.KAFKA_RAW_TOPIC || "jobs.raw",
    cleanTopic: process.env.KAFKA_CLEAN_TOPIC || "jobs.cleaned",
    rejectedTopic: process.env.KAFKA_REJECTED_TOPIC || "jobs.rejected"
  }
};