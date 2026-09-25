const RANGE_PATTERNS = [
  /(\d+)\s*(?:-|–|to)\s*(\d+)\s*(?:years?|yrs?)/i,
  /(\d+)\s*(?:-|–|to)\s*(\d+)\s*(?:year|yr)\b/i
];

const MINIMUM_PATTERNS = [
  /minimum\s+(\d+)\s*(?:years?|yrs?)/i,
  /at\s+least\s+(\d+)\s*(?:years?|yrs?)/i,
  /(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience/i
];

export function extractExperience(title = "", description = "") {
  const text = `${title} ${description}`;
  const lower = text.toLowerCase();

  if (
    /\bfresher\b/.test(lower) ||
    /\bentry[- ]level\b/.test(lower) ||
    /\bgraduate\b/.test(lower)
  ) {
    return {
      minYears: 0,
      maxYears: 1,
      label: "FRESHER_OR_ENTRY_LEVEL"
    };
  }

  for (const pattern of RANGE_PATTERNS) {
    const match = text.match(pattern);

    if (match) {
      return {
        minYears: Number(match[1]),
        maxYears: Number(match[2]),
        label: "EXPLICIT_RANGE"
      };
    }
  }

  for (const pattern of MINIMUM_PATTERNS) {
    const match = text.match(pattern);

    if (match) {
      return {
        minYears: Number(match[1]),
        maxYears: null,
        label: "MINIMUM_EXPERIENCE"
      };
    }
  }

  return {
    minYears: null,
    maxYears: null,
    label: "UNKNOWN"
  };
}