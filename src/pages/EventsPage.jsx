// ...existing code...
import React, { useState } from "react";
import { sampleEvents } from "../assets/data.js";
import NavigationBar from "../components/NavigationBar.jsx";
import Button from "../components/Button.jsx";

// normalize backend status values to UI statuses
function normalizeStatus(status) {
  if (!status) return "past";
  const s = String(status).toLowerCase();
  if (s === "open") return "upcoming";
  if (s === "closed") return "past";
  if (s === "upcoming" || s === "past") return s;
  return "past";
}

// Event Card Component
function EventCard({ event }) {
  return (
    <article
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100/50 via-white/30 to-white/90 shadow-lg"
      style={{ minHeight: 260 }}
    >
      <div className="h-28 bg-gradient-to-r from-sky-300 to-indigo-200 rounded-t-2xl" />

      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
            {(event.type || "").toUpperCase()} ·{" "}
            {event.dateLabel || event.date || ""}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {event.title}
        </h3>

        <p className="text-sm text-slate-500 mb-4">
          {event.desc || event.description}
        </p>

        <div className="text-xs text-slate-500 mb-4">
          <div className="uppercase tracking-wide text-[11px]">Hosted by</div>
          <div className="font-medium text-slate-800">{event.host}</div>
        </div>

        <div className="mt-2">
          <Button
            variant="secondary"
            className="w-full rounded-full px-4 py-2 text-sm"
            onClick={() => alert(`Registering for "${event.title}"`)}
            disabled={event.uiStatus !== "upcoming"}
          >
            {event.uiStatus === "upcoming" ? "Register" : "Closed"}
          </Button>
        </div>
      </div>
    </article>
  );
}

// Filter Button Component
function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
        active
          ? "bg-blue-100 text-blue-700"
          : "bg-white/60 text-slate-600 hover:bg-white/80"
      }`}
    >
      {label}
    </button>
  );
}

// Statistics Card Component
function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md ring-1 ring-white/60 text-center">
      <p className="text-sm text-slate-600 mb-2">{label}</p>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

export default function EventsPage() {
  const [filter, setFilter] = useState("upcoming");

  // normalize and enrich events (map "open" -> "upcoming", "closed" -> "past")
  const normalized = (sampleEvents || []).map((e) => ({
    ...e,
    desc: e.desc || e.description || "",
    dateLabel:
      e.dateLabel ||
      (e.date
        ? new Date(e.date)
            .toLocaleString(undefined, { month: "short", day: "numeric" })
            .toUpperCase()
        : ""),
    uiStatus: normalizeStatus(e.status),
  }));

  const filtered = normalized.filter((e) =>
    filter === "all" ? true : e.uiStatus === filter
  );

  const upcomingCount = normalized.filter(
    (e) => e.uiStatus === "upcoming"
  ).length;
  const pastCount = normalized.filter((e) => e.uiStatus === "past").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar active="/events" />

      <div className="ml-64 flex-1 p-6 lg:p-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>

          <div className="flex items-center gap-3 bg-white/60 rounded-full p-1 shadow-sm">
            <FilterButton
              label="Upcoming"
              active={filter === "upcoming"}
              onClick={() => setFilter("upcoming")}
            />
            <FilterButton
              label="Past"
              active={filter === "past"}
              onClick={() => setFilter("past")}
            />
            <FilterButton
              label="All"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <StatCard label="Upcoming Events" value={upcomingCount} />
          <StatCard label="Past Events" value={pastCount} />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {filtered.map((ev) => (
            <EventCard key={ev.id} event={{ ...ev, uiStatus: ev.uiStatus }} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No {filter} events to show.
          </p>
        )}
      </div>
    </div>
  );
}
// ...existing code...
