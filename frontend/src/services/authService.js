// services/authService.js
// Mock replaced with real API calls

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/** POST /api/auth/login */
export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  return data; // { token, user: { _id, name, email, role } }
}

/** POST /api/auth/register */
export async function registerUser({ name, email, password, role = "student" }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");

  return data; // { token, user: { _id, name, email, role } }
}