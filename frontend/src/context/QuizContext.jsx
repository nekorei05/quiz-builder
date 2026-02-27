// context/QuizContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getAvailableQuizzes,
  getMyQuizzes,
  createQuiz as apiCreateQuiz,
  updateQuiz as apiUpdateQuiz,
  deleteQuiz as apiDeleteQuiz,
  submitQuiz as apiSubmitQuiz,
} from "@/services/quizService";

const QuizContext = createContext();

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz must be used inside QuizProvider");
  return context;
}

export function QuizProvider({ children }) {
  const { user } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quizzes based on role when user changes
  useEffect(() => {
    if (!user) return;

    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data =
          user.role === "admin"
            ? await getMyQuizzes()
            : await getAvailableQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  // ── ADMIN ACTIONS ──────────────────────────────────────

  const createQuiz = async (quizData) => {
    const data = await apiCreateQuiz(quizData);
    // Re-fetch admin quizzes so list stays in sync
    const updated = await getMyQuizzes();
    setQuizzes(updated);
    return data;
  };

  const updateQuiz = async (id, quizData) => {
    const updated = await apiUpdateQuiz(id, quizData);
    setQuizzes((prev) =>
      prev.map((q) => (String(q._id || q.id) === String(id) ? { ...q, ...updated } : q))
    );
    return updated;
  };

  const deleteQuiz = async (id) => {
    await apiDeleteQuiz(id);
    setQuizzes((prev) =>
      prev.filter((q) => String(q._id || q.id) !== String(id))
    );
  };

  // ── STUDENT ACTIONS ────────────────────────────────────

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setScore(0);
  };

  const submitQuiz = async (quizId, answers) => {
    const result = await apiSubmitQuiz(quizId, answers);
    setScore(result.score);
    setAttempts((prev) => [...prev, { ...result, quizId }]);
    return result;
  };

  const finishQuiz = (finalScore) => setScore(finalScore);
  const clearQuiz = () => { setCurrentQuiz(null); setScore(0); };
  const addAttempt = (attempt) => setAttempts((prev) => [...prev, attempt]);

  const value = {
    quizzes,
    attempts,
    currentQuiz,
    score,
    loading,
    error,
    startQuiz,
    finishQuiz,
    clearQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    addAttempt,
    setQuizzes,
    setAttempts,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}