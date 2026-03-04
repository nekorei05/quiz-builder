// services/aiService.js — GEMINI SERVER VERSION (with DEMO_MODE)
// --------------------------------------------------------------
const { GoogleGenerativeAI } = require("@google/generative-ai");

const DEMO_MODE = String(process.env.DEMO_MODE).toLowerCase() === "true";
const MAX_QUESTIONS = Number(process.env.MAX_QUESTIONS) || 10;

// Create client only when not in demo mode
const genAI = !DEMO_MODE && process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Small sanitizer for typical LLM JSON glitches
function cleanJson(text) {
  return (text || "")
    .replace(/```json|```/g, "")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

async function generateQuizFromText(text, numberOfQuestions) {
  if (Number(numberOfQuestions) > MAX_QUESTIONS) {
    throw new Error(`Maximum ${MAX_QUESTIONS} questions allowed`);
  }

  // DEMO MODE: do not call Gemini at all
  if (DEMO_MODE || !genAI) {
    return JSON.stringify({
      title: "AI Disabled in Demo",
      description:
        "Full AI quiz generation works locally. Disabled online to avoid API costs.",
      timeLimit: 10,
      questions: [],
      demo: true,
    });
  }

  const trimmedText = (text || "").slice(0, 6000);

  const prompt = `
Generate exactly ${numberOfQuestions} multiple-choice questions based strictly on the provided material.

Return ONLY valid JSON. No markdown, no code fences, no commentary.

Format:
{
  "title": "Auto Generated Quiz",
  "description": "Generated from uploaded material",
  "timeLimit": 10,
  "questions": [
    {
      "questionText": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "difficulty": "medium"
    }
  ]
}

Rules:
- options is an array of 4 plain strings
- correctAnswer is the INDEX (0-3) of the correct option
- difficulty is one of: "easy", "medium", "hard"

Material:
${trimmedText}
`.trim();

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  // Use generateContent with a single text input
  const result = await model.generateContent(prompt);
  const out = result.response.text();

  // Return cleaned JSON string
  return cleanJson(out);
}

module.exports = { generateQuizFromText, cleanJson };