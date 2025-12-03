import { useEffect, useMemo, useState } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import Button from "../components/Button.jsx";
import EventCard from "../components/EventCardProf.jsx";
import StatCard from "../components/StatCard.jsx";
import { fetchClub, fetchClubs, getInitials } from "../api/clubs.js";
import { fetchEvents } from "../api/events.js";

export default function ClubProfile() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  const loadClub = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log(eventsLoading);
      console.log(eventsError);

      const searchParams = new URLSearchParams(window.location.search);
      const clubId = searchParams.get("club");

      if (clubId) {
        const data = await fetchClub(clubId);
        setClub(data);
      } else {
        const all = await fetchClubs();
        setClub(all[0] || null);
      }
    } catch (err) {
      setError(err.message || "Failed to load club");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClub();
  }, []);

  useEffect(() => {
    const loadClubEvents = async () => {
      if (!club?.id) return;
      try {
        setEventsError(null);
        setEventsLoading(true);
        const data = await fetchEvents({ clubId: club.id });
        setEvents(data);
      } catch (err) {
        setEventsError(err.message || "Failed to load events");
      } finally {
        setEventsLoading(false);
      }
    };

    loadClubEvents();
  }, [club?.id]);

  const c = club || {
    name: "Club",
    initials: "CL",
    category: "General",
    description: "",
  };

  const initials = c.initials || getInitials(c.name);

  const upcoming = useMemo(
    () =>
      events.filter(
        (e) =>
          (e.host === c.name ||
            e.hostId === c.id ||
            e.clubId === c.id ||
            e.raw?.club === c.id) &&
          (e.status === "open" || e.uiStatus === "upcoming")
      ),
    [events, c.id, c.name]
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar active="/clubs" />

      <div className="w-full md:ml-64 flex-1 p-4 sm:p-6 lg:p-12 pt-16">
        {loading ? (
          <div className="text-center py-12 text-gray-700">Loading club…</div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-700 mb-4">{error}</p>
            <Button variant="primary" onClick={loadClub}>
              Retry
            </Button>
          </div>
        ) : !club ? (
          <div className="text-center py-12 text-gray-700">
            No club found to display.
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-10 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/60 p-4 sm:p-6 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-100 text-lg sm:text-xl font-semibold text-blue-700 shadow-inner flex-shrink-0">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
                    {c.name}
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 break-words">
                    {c.category || c.desc}
                  </p>
                  {c.description && (
                    <p className="mt-2 text-sm text-slate-600 break-words">
                      {c.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant={subscribed ? "default" : "primary"}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm"
                    onClick={() => setSubscribed((s) => !s)}
                  >
                    {subscribed ? "Subscribed" : "Subscribe"}
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {upcoming.length > 0 && (
              <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6 my-8">
                <StatCard label="Total Events" value={upcoming.length} />
                <StatCard
                  label="Workshops"
                  value={upcoming.filter((e) => e.type === "Workshop").length}
                />
                <StatCard
                  label="Hackathons"
                  value={upcoming.filter((e) => e.type === "Hackathon").length}
                />
              </div>
            )}

            <div className="mb-6 sm:mb-8 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Upcoming Events
              </h2>
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {upcoming.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}

              {upcoming.length === 0 && (
                <p className="text-xs sm:text-sm text-slate-500 col-span-full text-center py-8">
                  No upcoming events.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
