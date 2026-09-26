const EMPLOYMENT_TYPES = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship"
};

function optionalNumber(value) {
  if (value === null || value === undefined || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function normalizeEmploymentType(value) {
  return EMPLOYMENT_TYPES[String(value || "").toUpperCase()] || "Unspecified";
}

function normalizeExperienceLevel(seniority) {
  switch (seniority) {
    case "ENTRY_LEVEL":
      return "Fresher";
    case "EXPERIENCED":
      return "Experienced";
    case "SENIOR":
      return "Senior";
    default:
      return "Unspecified";
  }
}

export function mapCleanedJobToDocument(job) {
  const source = String(job?.source || "").trim().toUpperCase();
  const sourceJobId = String(job?.externalId || "").trim();
  const title = String(job?.title || "").trim();
  const description = String(job?.description || "").trim();
  const externalApplyUrl = String(job?.sourceUrl || "").trim();

  if (!source || !sourceJobId || !title || !description) {
    throw new Error("Cleaned job is missing required source, ID, title, or description");
  }

  let applyUrl;
  try {
    applyUrl = new URL(externalApplyUrl);
  } catch {
    throw new Error("Cleaned job has an invalid application URL");
  }

  if (!["http:", "https:"].includes(applyUrl.protocol)) {
    throw new Error("Cleaned job has an invalid application URL");
  }

  const location = job.location || {};
  const salary = job.salary || {};
  const skills = Array.isArray(job.skills)
    ? [...new Set(job.skills.map(skill => String(skill).trim()).filter(Boolean))]
    : [];
  const locationParts = Array.isArray(location.areas)
    ? location.areas.map(area => String(area).trim()).filter(Boolean)
    : [];

  const document = {
    recruiterId: "system:ingestion",
    recruiterEmail: "",
    companyName: String(job.company || "").trim() || "Unknown",
    title,
    description,
    responsibilities: [],
    requirements: [],
    skills,
    field: String(job.category || "").trim() || skills[0] || "Other",
    employmentType: normalizeEmploymentType(job.jobType),
    workplaceType: "Unspecified",
    location: String(location.displayName || "").trim() || locationParts.join(", "),
    currency: String(salary.currency || "INR").trim(),
    experienceLevel: normalizeExperienceLevel(job.seniority),
    applyMode: "external",
    externalApplyUrl: applyUrl.toString(),
    status: "published",
    source,
    sourceJobId,
    externalKey: `${source}:${sourceJobId}`,
    autoImported: true
  };

  const minSalary = optionalNumber(salary.min);
  const maxSalary = optionalNumber(salary.max);
  if (minSalary !== undefined) document.minSalary = minSalary;
  if (maxSalary !== undefined) document.maxSalary = maxSalary;

  return document;
}
