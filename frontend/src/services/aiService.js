export async function generateQuestions() {
  throw new Error("Use the backend AI generate route instead");
}


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/*
  explainAnswer — calls backend which checks DB cache first,
  only calls Gemini if no cached explanation exists
*/
export async function explainAnswer({ questionId, questionText, correctAnswer }) {
  const res = await fetch(`${BASE_URL}/ai/explain`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ questionId, questionText, correctAnswer }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get explanation");
  }

  return data;
}