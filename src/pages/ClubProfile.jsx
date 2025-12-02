import { useEffect, useMemo, useState } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import Button from "../components/Button.jsx";
import EventCard from "../components/EventCardProf.jsx";
import StatCard from "../components/StatCard.jsx";
import { sampleEvents } from "../assets/data.js";
import {
  fetchClub,
  fetchClubs,
  fetchMyClubs,
  subscribeToClub,
  unsubscribeFromClub,
} from "../api/clubs";

export default function ClubProfile() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const shareClub = async () => {
    try {
      const shareUrl = club?.id
        ? `${window.location.origin}/club-profile?club=${encodeURIComponent(
            club.id
          )}`
        : window.location.href;

      const shareData = {
        title: c.name || "KFUPM Club",
        text: c.description
          ? `Check out ${c.name}: ${c.description}`
          : `Check out ${c.name}`,
        url: shareUrl,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        window.alert("Club link copied to clipboard.");
        return;
      }

      window.prompt("Copy this link to share:", shareUrl);
    } catch (err) {
      window.alert("Unable to share this club right now.");
      console.error("Share club failed:", err);
    }
  };

  const syncSubscription = async (clubId) => {
    if (!clubId) return;
    try {
      const mine = await fetchMyClubs();
      const joined = mine.some((c) => c.id === clubId);
      setSubscribed(joined);
    } catch (err) {
      // likely unauthenticated; leave as not subscribed
      setSubscribed(false);
    }
  };

  const loadClub = async () => {
    try {
      setError(null);
      setLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      const clubId = searchParams.get("club");

      if (clubId) {
        const data = await fetchClub(clubId);
        setClub(data);
        await syncSubscription(data?.id);
      } else {
        const all = await fetchClubs();
        const first = all[0] || null;
        setClub(first);
        await syncSubscription(first?.id);
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

  const toggleSubscription = async () => {
    if (!club?.id || isSaving) return;
    try {
      setIsSaving(true);
      const updated = subscribed
        ? await unsubscribeFromClub(club.id)
        : await subscribeToClub(club.id);
      setClub(updated);
      setSubscribed((s) => !s);
    } catch (err) {
      window.alert(
        err.message ||
          (subscribed
            ? "Failed to unsubscribe from club."
            : "Failed to subscribe to club.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const c = club || {
    name: "Club",
    initials: "CL",
    category: "General",
    description: "",
  };

  const upcoming = useMemo(
    () => sampleEvents.filter((e) => e.host === c.name && e.status === "open"),
    [c.name]
  );
  const handleView = (clubId) => {
    // navigate to club-profile page
    window.location.href = "/club-profile";
  };

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
                  {c.initials || c.abbr}
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
                    variant={subscribed ? "ghost" : "primary"}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm"
                    onClick={toggleSubscription}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Saving..."
                      : subscribed
                        ? "Unsubscribe"
                        : "Subscribe"}
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm"
                    onClick={shareClub}
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
              <a
                href={
                  club?.id
                    ? `/events?club=${encodeURIComponent(
                        club.id
                      )}&clubName=${encodeURIComponent(c.name)}`
                    : "/events"
                }
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </a>
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
