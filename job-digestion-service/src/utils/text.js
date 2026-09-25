export function decodeBasicEntities(value = "") {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

export function stripHtml(value = "") {
  return decodeBasicEntities(
    String(value)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

export function normalizeWhitespace(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

export function cleanText(value = "") {
  return normalizeWhitespace(stripHtml(value));
}

export function safeString(value) {
  if (value === null || value === undefined) return null;
  return normalizeWhitespace(String(value)) || null;
}   