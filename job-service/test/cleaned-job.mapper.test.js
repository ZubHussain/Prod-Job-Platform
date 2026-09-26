import test from "node:test";
import assert from "node:assert/strict";
import { mapCleanedJobToDocument } from "../src/mappers/cleaned-job.mapper.js";

test("maps cleaned provider jobs into published external jobs", () => {
  const job = mapCleanedJobToDocument({
    source: "adzuna",
    externalId: "123",
    sourceUrl: "https://jobs.example/apply/123",
    title: "Backend Engineer",
    company: "Example Ltd",
    description: "Build reliable services.",
    category: "IT Jobs",
    skills: ["Node.js", "Node.js", "MongoDB"],
    location: { displayName: "Delhi", areas: ["India", "Delhi"] },
    salary: { min: "1200000", max: 1500000, currency: "INR" },
    jobType: "FULL_TIME",
    seniority: "EXPERIENCED"
  });

  assert.equal(job.externalKey, "ADZUNA:123");
  assert.equal(job.applyMode, "external");
  assert.equal(job.externalApplyUrl, "https://jobs.example/apply/123");
  assert.equal(job.employmentType, "Full-time");
  assert.equal(job.workplaceType, "Unspecified");
  assert.equal(job.location, "Delhi");
  assert.deepEqual(job.skills, ["Node.js", "MongoDB"]);
  assert.equal(job.minSalary, 1200000);
  assert.equal(job.maxSalary, 1500000);
  assert.equal(job.experienceLevel, "Experienced");
});

test("rejects cleaned jobs with missing required values or unsafe URLs", () => {
  assert.throws(
    () => mapCleanedJobToDocument({}),
    /missing required/
  );
  assert.throws(
    () => mapCleanedJobToDocument({
      source: "ADZUNA",
      externalId: "123",
      sourceUrl: "javascript:alert(1)",
      title: "Engineer",
      description: "Build services."
    }),
    /invalid application URL/
  );
});