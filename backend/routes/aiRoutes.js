const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Question = require("../models/Question");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/*
Generate + cache AI explanation for a question
route : POST /api/ai/explain
*/
router.post("/explain", protect, async (req, res) => {
  try {
    const { questionId, questionText, correctAnswer } = req.body;

    if (!questionText || !correctAnswer) {
      return res.status(400).json({ message: "questionText and correctAnswer are required" });
    }

    // 1.Check cache 
    if (questionId) {
      const question = await Question.findById(questionId).select("aiExplanation").lean();
      if (question?.aiExplanation) {
        return res.json({ explanation: question.aiExplanation, cached: true });
      }
    }

    // 2.Call Gemini 
    if (!genAI) {
      return res.status(503).json({ message: "AI service not configured" });
    }

    const prompt = `
You are a helpful tutor. Explain why the following answer is correct in 2-3 clear sentences.
Be concise, educational, and student-friendly.

Question: ${questionText}
Correct Answer: ${correctAnswer}

Respond with just the explanation, no extra formatting or labels.
`.trim();

const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });
    const result = await model.generateContent(prompt);
    const explanation = result.response.text().trim();

    //3.Save to cache
    if (questionId) {
      await Question.findByIdAndUpdate(questionId, { aiExplanation: explanation });
    }

    return res.json({ explanation, cached: false });

  } catch (err) {
    console.error("AI explain error:", err);
    const is429 = err.message?.includes("429");
    const is503 = err.message?.includes("503");
    const status = is429 || is503 ? 503 : 500;
    const message =
      is429 || is503
        ? "AI is busy right now. Please try again in a moment."
        : "Failed to generate explanation";
    return res.status(status).json({ message });
  }
});

module.exports = router;