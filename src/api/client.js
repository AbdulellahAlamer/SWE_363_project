const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

const defaultHeaders = {
  "Content-Type": "application/json",
};

export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  let authHeaders = {};
  if (typeof localStorage !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      authHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...authHeaders,
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // Ignore JSON parse errors; some endpoints may return empty responses
  }

  if (!response.ok) {
    const message =
      data?.message || response.statusText || "Request failed. Please try again.";
    throw new Error(message);
  }

  return data;
}

export { API_BASE_URL };
