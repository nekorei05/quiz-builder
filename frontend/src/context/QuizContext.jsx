import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
const QuizContext = createContext();

export function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used inside QuizProvider");
  }

  return context;
}



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
  const { user } = useAuth();
const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState(mockAttempts);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch("http://localhost:5000/api/quizzes", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setQuizzes(data);

    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  if (user) {
    fetchQuizzes();
  }

}, [user]);

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