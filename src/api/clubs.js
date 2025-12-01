import { request } from "./client";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const getInitials = (name = "") => {
  if (!name) return "CL";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
};

export const normalizeClub = (club = {}) => {
  const membersCount = Array.isArray(club.members)
    ? club.members.length
    : Number(club.members || 0);

  const presidentName =
    typeof club.president === "string"
      ? club.president
      : club.president?.name ||
        club.president?.fullName ||
        (club.president?._id ? "Assigned" : "Unassigned");

  return {
    id: club._id || club.id,
    name: club.name || "Untitled Club",
    initials: club.initials || getInitials(club.name || "Club"),
    category: club.category || "General",
    president: presidentName || "Unassigned",
    members: Number.isFinite(membersCount) ? membersCount : 0,
    status: club.status || "active",
    description: club.description || "",
    contactEmail: club.contactEmail || "",
    raw: club,
  };
};

export async function fetchClubs() {
  const res = await request("/clubs");
  if (!res?.data) return [];
  return res.data.map(normalizeClub);
}

export async function fetchMyClubs() {
  const res = await request("/clubs/user/mine");
  if (!res?.data) return [];
  return res.data.map(normalizeClub);
}

export async function fetchClub(id) {
  if (!id) throw new Error("Club id is required");
  const res = await request(`/clubs/${id}`);
  return normalizeClub(res.data);
}

export async function createClub(payload) {
  const res = await request("/clubs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeClub(res.data);
}

export async function updateClub(id, payload) {
  const res = await request(`/clubs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizeClub(res.data);
}

export async function deleteClub(id) {
  await request(`/clubs/${id}`, { method: "DELETE" });
  return true;
}

export async function subscribeToClub(id) {
  if (!id) throw new Error("Club id is required");
  const res = await request(`/clubs/${id}/subscribe`, { method: "POST" });
  return normalizeClub(res.data);
}

export async function unsubscribeFromClub(id) {
  if (!id) throw new Error("Club id is required");
  const res = await request(`/clubs/${id}/subscribe`, { method: "DELETE" });
  return normalizeClub(res.data);
}

export const isObjectId = (value = "") => objectIdRegex.test(value.trim());
