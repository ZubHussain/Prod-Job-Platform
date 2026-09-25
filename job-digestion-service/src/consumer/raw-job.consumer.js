import { consumer } from "../config/kafka.js";
import { env } from "../config/env.js";
import { digestRawJob } from "../services/digestion.service.js";
import {
  publishCleanJob,
  publishRejectedJob
} from "../services/publisher.service.js";

export async function startRawJobConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: env.kafka.rawTopic,
    fromBeginning: false
  });

  console.log(`[consumer] subscribed to ${env.kafka.rawTopic}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawText = message.value?.toString();

      if (!rawText) {
        await publishRejectedJob(null, "EMPTY_MESSAGE");
        return;
      }

      let event;

      try {
        event = JSON.parse(rawText);
      } catch {
        console.error("[consumer] invalid JSON", { topic, partition });
        await publishRejectedJob({ rawText }, "INVALID_JSON");
        return;
      }

      const result = digestRawJob(event);

      if (!result.accepted) {
        await publishRejectedJob(event, result.reason);
        console.log(
          `[digestion] rejected ${event.source}:${event.sourceJobId} - ${result.reason}`
        );
        return;
      }

      await publishCleanJob(result.job);

      console.log(
        `[digestion] cleaned ${result.job.source}:${result.job.externalId}`
      );
    }
  });
}