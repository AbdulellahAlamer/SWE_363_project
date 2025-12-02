import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import EventCard from "../components/EventCard.jsx";
import FilterButton from "../components/FilterButton.jsx";
import StatCard from "../components/StatCard.jsx";
import { fetchEvents } from "../api/events.js";

// normalize backend status values to UI statuses
function normalizeStatus(status, date) {
  if (!status) return "past";
  const s = String(status).toLowerCase();
  if (s === "open") return "upcoming";
  if (s === "closed") return "past";
  if ((s === "upcoming" || s === "past") && date) return s;
  if (date) {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime()) && parsed.getTime() >= Date.now()) {
      return "upcoming";
    }
  }
  if (s === "upcoming" || s === "past") return s;
  return "past";
}

export default function EventsPage() {
  const params = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );
  const clubIdParam = params.get("club") || params.get("clubId");
  const clubNameParam = params.get("clubName");
  const [filter, setFilter] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchEvents({ clubId: clubIdParam || undefined });
      setEvents(data);
    } catch (err) {
      setError(err.message || "Failed to load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [clubIdParam]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const matchesClubFilter = (event) => {
    if (!clubIdParam && !clubNameParam) return true;

    const hostName = (event.host || event.hostName || "").toLowerCase();
    const hostId = event.hostId || event.clubId || event.club;
    const targetName = (clubNameParam || "").toLowerCase();

    if (clubIdParam && hostId && String(hostId) === String(clubIdParam)) {
      return true;
    }
    if (targetName && hostName === targetName) {
      return true;
    }

    return false;
  };

  // normalize and enrich events (map "open" -> "upcoming", "closed" -> "past")
  const normalized = (events || [])
    .filter(matchesClubFilter)
    .map((e) => {
      const uiStatus = e.uiStatus || normalizeStatus(e.status, e.date);
      return {
        ...e,
        description: e.desc || e.description || "",
        dateLabel:
          e.dateLabel ||
          (e.date
            ? new Date(e.date)
                .toLocaleString(undefined, { month: "short", day: "numeric" })
                .toUpperCase()
            : ""),
        uiStatus,
      };
    });

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

      <div className="w-full flex-1 pt-16 md:pt-0 md:ml-64 p-4 sm:p-6 lg:p-10">
        {/* Header Section - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Events
          </h1>

          <div className="flex items-center gap-2 sm:gap-3 bg-white/60 rounded-full p-1 shadow-sm w-full sm:w-auto">
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

        {/* Statistics Section - Mobile Responsive */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <StatCard label="Upcoming Events" value={upcomingCount} />
          <StatCard label="Past Events" value={pastCount} />
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-3">
            {error}
          </p>
        )}

        {/* Events Grid - Mobile Responsive */}
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading events...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
              {filtered.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-500">
                No {filter} events to show.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
