import { createContext, useContext, useState } from "react";

const QuizContext = createContext();

export function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used inside QuizProvider");
  }

  return context;
}

const mockQuizzes = [
  {
    id: "1",
    title: "Math Basics",
    difficulty: "easy",
    timeLimit: 10,
    status: "published",
    description: "Basic arithmetic operations",
    questions: [
      {
        id: "q1",
        text: "2 + 2 = ?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
      },
      {
        id: "q2",
        text: "5 - 3 = ?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "2",
    title: "Science 101",
    difficulty: "medium",
    timeLimit: 15,
    status: "published",
    description: "Fundamental science concepts",
    questions: [
      {
        id: "q1",
        text: "What is the chemical formula for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correctAnswer: 0,
      },
    ],
  },
];

const mockAttempts = [
  {
    id: "a1",
    userId: "101",
    quizId: "1",
    score: 8,
    total: 10,
    completedAt: "2025-04-10",
  },
  {
    id: "a2",
    userId: "102",
    quizId: "2",
    score: 7,
    total: 10,
    completedAt: "2025-04-12",
  },
];

export function QuizProvider({ children }) {
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [attempts, setAttempts] = useState(mockAttempts);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [score, setScore] = useState(0);

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setScore(0);
  };

  const finishQuiz = (finalScore) => {
    setScore(finalScore);
  };

  const clearQuiz = () => {
    setCurrentQuiz(null);
    setScore(0);
  };

  //create quiz
  const createQuiz = async (quizData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: quizData.title,
        description: quizData.description,
        subject: "General",
        difficultyLevel: quizData.difficulty,
        timeLimit: quizData.timeLimit,
        totalMarks: quizData.questions.length * 10,
        questions: quizData.questions.map((q) => ({
          questionText: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          difficulty: quizData.difficulty,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;

  } catch (error) {
    console.error("Create quiz error:", error);
    throw error;
  }
};

  const updateQuiz = (id, quizData) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (String(quiz.id) === String(id)) {
          return { ...quiz, ...quizData };
        }
        return quiz;
      })
    );
  };

  const deleteQuiz = (id) => {
    setQuizzes((prev) =>
      prev.filter((quiz) => String(quiz.id) !== String(id))
    );
  };

  const addAttempt = (attempt) => {
    setAttempts((prev) => [...prev, attempt]);
  };

  const value = {
    quizzes, attempts,currentQuiz,score,startQuiz, finishQuiz, clearQuiz, createQuiz, updateQuiz, deleteQuiz, addAttempt, setQuizzes,
    setAttempts};

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}