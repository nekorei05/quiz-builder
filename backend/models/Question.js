const mongoose = require("mongoose");

/*
Question Schema

Each question belongs to one Quiz.
Difficulty is required for adaptive engine.
*/

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },

    questionText: {
      type: String,
      required: true
    },

    options: {
      type: [String],   // Array of options
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 2; // At least 2 options required
        },
        message: "A question must have at least 2 options"
      }
    },

    correctAnswer: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);