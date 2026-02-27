// services/quizService.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── ADMIN ───────────────────────────────────────────────

export async function getMyQuizzes() {
  const res = await fetch(`${BASE_URL}/quizzes/admin`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// CREATE QUIZ
export async function createQuiz(data) {
  const res = await fetch(`${BASE_URL}/quizzes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title: data.title,
      description: data.description || "",
      subject: data.subject || "General",
      difficultyLevel: data.difficultyLevel || data.difficulty,
      timeLimit: data.timeLimit,
      totalMarks: data.totalMarks ?? data.questions.length * 10,
      isPublished: data.isPublished, // <-- included

      questions: data.questions.map((q) => ({
        questionText: q.questionText || q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty || data.difficultyLevel || data.difficulty,
      })),
    }),
  });

  return handleResponse(res);
}

// UPDATE QUIZ (ONLY ONE VERSION)
export async function updateQuiz(id, data) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title: data.title,
      description: data.description || "",
      subject: data.subject || "General",
      difficultyLevel: data.difficultyLevel || data.difficulty,
      timeLimit: data.timeLimit,
      totalMarks: data.totalMarks ?? data.questions.length * 10,
      isPublished: data.isPublished, // <-- CRITICAL FIX

      questions: data.questions.map((q) => ({
        ...(q._id ? { _id: q._id } : {}),
        questionText: q.questionText || q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty || data.difficultyLevel || data.difficulty,
      })),
    }),
  });

  return handleResponse(res);
}

// DELETE QUIZ
export async function deleteQuiz(id) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ─── STUDENT ──────────────────────────────────────────────

export async function getAvailableQuizzes() {
  const res = await fetch(`${BASE_URL}/quizzes`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);

  return data.map((q) => ({
    ...q,
    id: q._id,
    difficulty: q.difficultyLevel,
    status: q.isPublished ? "published" : "draft",
  }));
}

export async function getQuizById(id) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function submitQuiz(quizId, answers) {
  const res = await fetch(`${BASE_URL}/quizzes/${quizId}/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers }),
  });
  return handleResponse(res);
}

export async function getQuizResult(quizId) {
  const res = await fetch(`${BASE_URL}/quizzes/${quizId}/result`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getQuizHistory() {
  const res = await fetch(`${BASE_URL}/quizzes/history`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export const quizService = {
  getMyQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAvailableQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResult,
  getQuizHistory,
};