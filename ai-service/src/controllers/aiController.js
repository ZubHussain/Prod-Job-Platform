import OpenAI from "openai";
import { extractText } from "../lib/extractText.js";


async function jsonCompletion(system, user) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("AI provider credentials are not configured");
    error.status = 503;
    throw error;
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [{ role: "system", content: system }, { role: "user", content: user }]
  });
  return JSON.parse(response.choices[0].message.content);
}

function respondWithAIError(res, error) {
  console.error("[ai-service] request failed", error.message);
  const missingCredentials = error.status === 503;
  res.status(missingCredentials ? 503 : 500).json({
    message: missingCredentials
      ? "AI provider credentials are not configured"
      : "AI request failed"
  });
}

export async function extractSkills(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "Resume required" });
    const text = await extractText(req.file);
    const result = await jsonCompletion(
      "Extract structured candidate information from a resume. Return JSON with skills:string[], jobFields:string[], summary:string, yearsExperience:number, education:string[]. Be conservative and only include evidence from the resume.",
      text.slice(0, 16000)
    );
    res.json(result);
  } catch (error) { respondWithAIError(res, error); }
}

export async function matchResumeToJob(req, res) {
  try {
    const { candidateSkills = [], jobSkills = [], resumeText = "", jobDescription = "" } = req.body;
    const result = await jsonCompletion(
      "You are a recruitment matching engine. Return JSON only with score integer 0-100, matchedSkills:string[], missingSkills:string[], strengths:string[], gaps:string[]. Do not infer protected characteristics.",
      JSON.stringify({ candidateSkills, jobSkills, resumeText: resumeText.slice(0, 10000), jobDescription: jobDescription.slice(0, 10000) })
    );
    res.json(result);
  } catch (error) { respondWithAIError(res, error); }
}

export async function careerFields(req, res) {
  try {
    const { skills = [] } = req.body;
    const result = await jsonCompletion(
      "Given skills, return JSON with fields as an array of up to 8 suitable job fields and keywords as an array of job-search keywords.",
      JSON.stringify({ skills })
    );
    res.json(result);
  } catch (error) { respondWithAIError(res, error); }
}
