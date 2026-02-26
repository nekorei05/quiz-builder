const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    subject: {
      type: String,
      default: ""
    },

    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },

    timeLimit: {
      type: Number,
      required: true
    },

    totalMarks: {
      type: Number,
      required: true
    },

    startingDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy"
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);