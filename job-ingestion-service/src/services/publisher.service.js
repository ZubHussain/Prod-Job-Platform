import { producer } from "../config/kafka.js";
import { env } from "../config/env.js";

export async function publishRawJobs(jobs) {
  if (!jobs.length) return { published: 0 };

  const messages = jobs.map(job => ({
    key: `${job.source}:${job.sourceJobId || "unknown"}`,
    value: JSON.stringify(job),
    headers: {
      eventType: "job.raw.ingested",
      source: job.source
    }
  }));

  await producer.send({
    topic: env.kafka.rawTopic,
    messages
  });

  return { published: messages.length };
}