import test from "node:test";
import assert from "node:assert/strict";
import { digestRawJob } from "../src/services/digestion.service.js";

test("cleans a provider event into a frontend-ready job", () => {
  const result = digestRawJob({
    source: "adzuna",
    sourceJobId: 123,
    sourceUrl: "https://jobs.example/apply/123",
    fetchedAt: "2026-09-25T10:00:00.000Z",
    raw: {
      title: "Senior Backend Engineer",
      company: "Example Ltd",
      description: "<p>5 years of experience building Node.js services.</p>",
      locationDisplayName: "Delhi",
      salaryMin: 1200000,
      salaryMax: 1800000,
      contractTime: "full_time",
      category: "IT Jobs"
    }
  });

  assert.equal(result.accepted, true);
  assert.equal(result.job.source, "ADZUNA");
  assert.equal(result.job.externalId, "123");
  assert.equal(result.job.description, "5 years of experience building Node.js services.");
  assert.equal(result.job.jobType, "FULL_TIME");
  assert.equal(result.job.seniority, "SENIOR");
  assert.ok(result.job.fingerprint);
});

test("rejects missing descriptions and non-web application URLs", () => {
  const base = {
    source: "ADZUNA",
    sourceJobId: "123",
    raw: { title: "Engineer", description: "Build services." }
  };

  assert.deepEqual(
    digestRawJob({ ...base, raw: { title: "Engineer" }, sourceUrl: "https://jobs.example" }),
    { accepted: false, reason: "MISSING_DESCRIPTION" }
  );
  assert.deepEqual(
    digestRawJob({ ...base, sourceUrl: "javascript:alert(1)" }),
    { accepted: false, reason: "INVALID_APPLY_URL" }
  );
});
