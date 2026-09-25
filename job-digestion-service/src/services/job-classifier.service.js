const SENIOR_TERMS = [
  "senior",
  "sr.",
  "sr ",
  "staff engineer",
  "principal",
  "tech lead",
  "technical lead",
  "engineering manager",
  "architect"
];

export function classifySeniority(title = "", experience = {}) {
  const lower = title.toLowerCase();

  if (SENIOR_TERMS.some(term => lower.includes(term))) {
    return "SENIOR";
  }

  if (experience.minYears !== null && experience.minYears >= 3) {
    return "EXPERIENCED";
  }

  if (experience.minYears === 0) {
    return "ENTRY_LEVEL";
  }

  return "UNSPECIFIED";
}