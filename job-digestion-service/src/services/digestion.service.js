import { cleanText, safeString } from "../utils/text.js";
import { buildJobFingerprint } from "../utils/hash.js";
import { extractSkills } from "./skill-extractor.service.js";
import { extractExperience } from "./experience-extractor.service.js";
import { classifySeniority } from "./job-classifier.service.js";

function normalizeJobType(contractTime, contractType) {
  const value = `${contractTime || ""} ${contractType || ""}`
    .toLowerCase();

  if (value.includes("full_time") || value.includes("full time")) {
    return "FULL_TIME";
  }

  if (value.includes("part_time") || value.includes("part time")) {
    return "PART_TIME";
  }

  if (value.includes("contract")) return "CONTRACT";

  return "UNSPECIFIED";
}

function optionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeLocation(raw) {
  return {
    displayName: safeString(raw.locationDisplayName),
    areas: Array.isArray(raw.locationAreas)
      ? raw.locationAreas.map(safeString).filter(Boolean)
      : [],
    latitude: optionalNumber(raw.latitude),
    longitude: optionalNumber(raw.longitude)
  };
}

function normalizeSalary(raw) {
  return {
    min: optionalNumber(raw.salaryMin),
    max: optionalNumber(raw.salaryMax),
    currency: "INR"
  };
}

export function digestRawJob(event) {
  if (!event || typeof event !== "object") {
    return { accepted: false, reason: "INVALID_EVENT" };
  }

  const raw = event.raw || {};
  const title = cleanText(raw.title || "");
  const company = cleanText(raw.company || "");
  const description = cleanText(raw.description || "");
  const applyUrl = safeString(event.sourceUrl);
  const source = safeString(event.source)?.toUpperCase();
  const sourceJobId = safeString(event.sourceJobId);

  if (!source) {
    return { accepted: false, reason: "MISSING_SOURCE" };
  }

  if (!sourceJobId) {
    return { accepted: false, reason: "MISSING_SOURCE_JOB_ID" };
  }

  if (!title) {
    return { accepted: false, reason: "MISSING_TITLE" };
  }

  if (!description) {
    return { accepted: false, reason: "MISSING_DESCRIPTION" };
  }


  if (!applyUrl) {
    return { accepted: false, reason: "MISSING_APPLY_URL" };
  }

  let parsedApplyUrl;
  try {
    parsedApplyUrl = new URL(applyUrl);
  } catch {
    return { accepted: false, reason: "INVALID_APPLY_URL" };
  }

  if (!["http:", "https:"].includes(parsedApplyUrl.protocol)) {
    return { accepted: false, reason: "INVALID_APPLY_URL" };
  }

  const experience = extractExperience(title, description);

  const cleanedJob = {
    schemaVersion: 1,
    externalId: sourceJobId,
    source,
    sourceUrl: parsedApplyUrl.toString(),
    title,
    company: company || "Unknown",
    description,
    location: normalizeLocation(raw),
    salary: normalizeSalary(raw),
    jobType: normalizeJobType(raw.contractTime, raw.contractType),
    category: safeString(raw.category),
    skills: extractSkills(title, description),
    experience,
    seniority: classifySeniority(title, experience),
    externalApply: true,
    autoImported: true,
    postedAt:
      raw.created && !Number.isNaN(Date.parse(raw.created))
        ? new Date(raw.created).toISOString()
        : null,
    fetchedAt: event.fetchedAt || new Date().toISOString(),
    digestedAt: new Date().toISOString()
  };

  cleanedJob.fingerprint = buildJobFingerprint(cleanedJob);

  return { accepted: true, job: cleanedJob };
}