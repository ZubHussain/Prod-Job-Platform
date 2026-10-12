function csv(value, fallback = []) {
  return value
    ? value.split(",").map(item => item.trim()).filter(Boolean)
    : fallback;
}

function kafkaBrokers(value) {
  return csv(value, ["localhost:9092"]).map(broker =>
    /:\d+$/u.test(broker) ? broker : `${broker}:9092`
  );
}

export const env = {
  port: Number(process.env.PORT || 5008),
  serviceName: process.env.SERVICE_NAME || "job-digestion-service",

  kafka: {
    brokers: kafkaBrokers(process.env.KAFKA_BROKERS),
    clientId: process.env.KAFKA_CLIENT_ID || "job-digestion-service",
    groupId: process.env.KAFKA_GROUP_ID || "job-digestion-service-v1",
    rawTopic: process.env.KAFKA_RAW_TOPIC || "jobs.raw",
    cleanTopic: process.env.KAFKA_CLEAN_TOPIC || "jobs.cleaned",
    rejectedTopic: process.env.KAFKA_REJECTED_TOPIC || "jobs.rejected"
  }
};