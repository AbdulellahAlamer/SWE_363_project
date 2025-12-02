import { request } from "./client.js";

export const normalizeUser = (user = {}) => {
  return {
    id: user._id || user.id,
    name: user.name || user.username || "",
    email: user.email || "",
    role: user.role,
    major: user.major || "",
    joinYear: user.Join_Year || user.joinYear || "",
    photoUrl: user.photo_URL || user.photoUrl || "",
    certificates: Array.isArray(user.Certificates) ? user.Certificates : [],
    raw: user,
  };
};

export async function fetchCurrentUser() {
  const res = await request("/users/me");
  const user = res?.data || res;
  return normalizeUser(user);
}

export async function updateCurrentUser(payload = {}) {
  const res = await request("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const user = res?.data || res;
  return normalizeUser(user);
}
