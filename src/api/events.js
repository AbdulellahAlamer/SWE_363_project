import { request } from "./client";

export async function fetchEvents() {
  const res = await request("/events");
  return res?.data || [];
}
