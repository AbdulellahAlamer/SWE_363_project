import { request } from "./client.js";

const toUiStatus = (status, date) => {
  const normalized = status ? String(status).toLowerCase() : "";
  if (normalized === "open" || normalized === "upcoming") return "upcoming";
  if (normalized === "closed" || normalized === "past") return "past";

  if (date) {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime()) && parsed.getTime() >= Date.now()) {
      return "upcoming";
    }
  }

  return "past";
};

const extractEventsArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.events)) return payload.events;
  return [];
};

export const normalizeEvent = (event = {}) => {
  const clubObject =
    event.club && typeof event.club === "object" && !Array.isArray(event.club)
      ? event.club
      : null;
  const registrations = Array.isArray(event.registrations)
    ? event.registrations
    : [];

  const date = event.date || event.eventDate;
  const status = event.status || event.eventStatus;
  const uiStatus = toUiStatus(status, date);

  return {
    id: event._id || event.id,
    title: event.title || "Untitled Event",
    description: event.description || event.desc || "",
    type: event.type || event.eventType || "Event",
    date,
    location: event.location || "",
    host: clubObject?.name || event.host || event.clubName || "Club",
    hostId: clubObject?._id || event.hostId || event.clubId || event.club,
    clubId: clubObject?._id || event.clubId || event.club,
    registered:
      typeof event.registered === "number"
        ? event.registered
        : registrations.length,
    status: status || uiStatus,
    uiStatus,
    raw: event,
  };
};

export async function fetchEvents({ clubId, userId } = {}) {
  const params = new URLSearchParams();
  if (clubId) params.set("club", clubId);
  if (userId) params.set("user", userId);

  const query = params.toString();
  const res = await request(query ? `/events?${query}` : "/events");
  // Patch: handle backend response with { status, count, data }
  let events = [];
  if (Array.isArray(res)) {
    events = res;
  } else if (Array.isArray(res?.data)) {
    events = res.data;
  } else if (Array.isArray(res?.events)) {
    events = res.events;
  } else {
    events = [];
  }
  return events.map(normalizeEvent);
}

export async function fetchEventsByClub(clubId) {
  if (!clubId) throw new Error("Club id is required");
  return fetchEvents({ clubId });
}
