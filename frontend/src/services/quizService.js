// services/quizService.js
// All mock data removed — wired to real Express backend

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

/** GET /api/quizzes/admin — Admin: fetch their own quizzes */
export async function getMyQuizzes() {
  const res = await fetch(`${BASE_URL}/quizzes/admin`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

/** POST /api/quizzes — Admin: create a quiz with questions */
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
      totalMarks: data.totalMarks || data.questions.length * 10,
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

/** PUT /api/quizzes/:id — Admin: update a quiz */
export async function updateQuiz(id, data) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/** DELETE /api/quizzes/:id — Admin: delete a quiz */
export async function deleteQuiz(id) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ─── STUDENT ──────────────────────────────────────────────

/** GET /api/quizzes — Student: fetch all published quizzes */
export async function getAvailableQuizzes() {
  const res = await fetch(`${BASE_URL}/quizzes`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);
  // Normalize _id → id and map field names to match frontend expectations
  return data.map((q) => ({
    ...q,
    id: q._id,
    difficulty: q.difficultyLevel,
    status: q.isPublished ? "published" : "draft",
  }));
}

/** GET /api/quizzes/:id — Student: fetch a single quiz with its questions */
export async function getQuizById(id) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // returns { quiz, questions }
}

/** POST /api/quizzes/:id/submit — Student: submit answers and get score */
export async function submitQuiz(quizId, answers) {
  const res = await fetch(`${BASE_URL}/quizzes/${quizId}/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers }),
  });
  return handleResponse(res); // returns { score, total, percentage, resultId }
}

/** GET /api/quizzes/:id/result — Student: fetch a stored result */
export async function getQuizResult(quizId) {
  const res = await fetch(`${BASE_URL}/quizzes/${quizId}/result`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

/** GET /api/quizzes/history — Student: fetch attempt history */
export async function getQuizHistory() {
  const res = await fetch(`${BASE_URL}/quizzes/history`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ─── NAMED EXPORT (for components using quizService.method()) ──
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