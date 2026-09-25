import { producer } from "../config/kafka.js";
import { env } from "../config/env.js";

export async function publishCleanJob(job) {
  await producer.send({
    topic: env.kafka.cleanTopic,
    messages: [{
      key: `${job.source}:${job.externalId}`,
      value: JSON.stringify(job),
      headers: { eventType: "job.cleaned" }
    }]
  });
}

export async function publishRejectedJob(rawEvent, reason) {
  await producer.send({
    topic: env.kafka.rejectedTopic,
    messages: [{
      key: rawEvent?.sourceJobId
        ? `${rawEvent.source}:${rawEvent.sourceJobId}`
        : undefined,
      value: JSON.stringify({
        reason,
        rejectedAt: new Date().toISOString(),
        event: rawEvent
      }),
      headers: { eventType: "job.rejected" }
    }]
  });
}