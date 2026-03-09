
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAdminAnalytics() {
  const res = await fetch(`${BASE_URL}/analytics/admin`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch analytics");
  return data;
}