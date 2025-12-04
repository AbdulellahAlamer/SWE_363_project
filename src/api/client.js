const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"
).replace(/\/$/, "");

const defaultHeaders = {
  "Content-Type": "application/json",
};

export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  let authHeaders = {};
  // Only send Authorization header for protected endpoints
  const isProtected = !(
    (options.method === "GET" && (path === "/events" || path.startsWith("/events/"))) ||
    (options.method === "GET" && (path === "/posts" || path.startsWith("/posts/")))
  );
  
  console.log(`[DEBUG] API Request: ${options.method || 'GET'} ${url}`);
  console.log(`[DEBUG] Is protected endpoint: ${isProtected}`);
  
  if (isProtected && typeof localStorage !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      authHeaders.Authorization = `Bearer ${token}`;
      console.log(`[DEBUG] Added auth header with token: ${token.substring(0, 20)}...`);
    } else {
      console.log(`[DEBUG] No token found in localStorage`);
    }
  }

  const finalHeaders = {
    ...defaultHeaders,
    ...authHeaders,
    ...(options.headers || {}),
  };
  
  console.log(`[DEBUG] Final headers:`, finalHeaders);

  const response = await fetch(url, {
    ...options,
    headers: finalHeaders,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // Ignore JSON parse errors; some endpoints may return empty responses
    console.log(err);
  }

  if (!response.ok) {
    const message =
      data?.message ||
      response.statusText ||
      "Request failed. Please try again.";
    throw new Error(message);
  }

  return data;
}

export { API_BASE_URL };
