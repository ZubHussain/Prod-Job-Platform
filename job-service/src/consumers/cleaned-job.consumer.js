import Job from "../models/Job.js";
import { cleanJobConsumer } from "../config/kafka.js";
import { mapCleanedJobToDocument } from "../mappers/cleaned-job.mapper.js";

const cleanTopic = process.env.KAFKA_CLEAN_TOPIC || "jobs.cleaned";

export async function startCleanJobConsumer() {
  await cleanJobConsumer.connect();
  await cleanJobConsumer.subscribe({
    topic: cleanTopic,
    fromBeginning: true
  });

  await cleanJobConsumer.run({
    eachMessage: async ({ partition, message }) => {
      const value = message.value?.toString();
      if (!value) {
        throw new Error(`Empty cleaned-job message on partition ${partition}`);
      }

      let cleanedJob;
      try {
        cleanedJob = JSON.parse(value);
      } catch (error) {
        console.error("[job-consumer] invalid JSON", { partition });
        throw error;
      }

      const document = mapCleanedJobToDocument(cleanedJob);
      const savedJob = await Job.findOneAndUpdate(
        { externalKey: document.externalKey },
        { $set: document },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

      console.log(
        `[job-consumer] saved ${document.externalKey} as ${savedJob._id}`
      );
    }
  });

  console.log(`[job-consumer] subscribed to ${cleanTopic}`);
}