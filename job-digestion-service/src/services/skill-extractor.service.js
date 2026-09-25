import { SKILL_ALIASES } from "../constants/skills.js";

function containsPhrase(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(
    `(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`,
    "i"
  ).test(text);
}

export function extractSkills(title = "", description = "") {
  const text = `${title} ${description}`.toLowerCase();
  const found = [];

  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (aliases.some(alias => containsPhrase(text, alias.toLowerCase()))) {
      found.push(canonical);
    }
  }

  return [...new Set(found)];
}