// models/Result.js
const mongoose = require("mongoose");

const breakdownSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  questionText: String,
  selected: Number,
  correctAnswer: Number,
  isCorrect: Boolean,
});

const resultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    breakdown: [breakdownSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
