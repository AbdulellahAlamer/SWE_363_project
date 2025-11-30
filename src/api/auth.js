import { request } from "./client.js";

export async function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register({ name, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export const roleRoutes = {
  admin: "/admin",
  president: "/president",
  student: "/clubs",
};

export function persistSession({ token, user }) {
  if (typeof localStorage === "undefined") return;
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredSession() {
  if (typeof localStorage === "undefined") return null;

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  let user = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch (error) {
      // If parsing fails, clear the bad value and treat as no session
      localStorage.removeItem("user");
    }
  }

  if (!token || !user) return null;
  return { token, user };
}
