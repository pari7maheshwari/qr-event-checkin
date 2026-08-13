import { getToken, removeToken } from "./auth";

const API_URL = "http://127.0.0.1:8000";

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();

    window.location.reload();

    throw new Error("Your session has expired. Please log in again.");
  }

  return response;
}