// ...existing code...
import { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/Button";
import {
  fetchMyClubs,
  getInitials,
  unsubscribeFromClub,
} from "../api/clubs";

export default function MyClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadClubs = async () => {
    try {
      setError(null);
      const data = await fetchMyClubs();
      setClubs(data);
    } catch (err) {
      setError(err.message || "Failed to load clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleUnsubscribe = async (id) => {
    try {
      await unsubscribeFromClub(id);
      setClubs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      window.alert(err.message || "Failed to unsubscribe from club.");
    }
  };

  return (
    <div className="flex">
      <NavigationBar active="/my-clubs" type="student" />
      <main className="ml-0 md:ml-64 flex-1 mt-16">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8 px-8">
            <h1 className="text-3xl font-bold text-slate-900">Joined Clubs</h1>
            <p className="text-sm text-slate-500 mt-1">{clubs.length} clubs</p>
          </header>

          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading clubs…</div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-3">{error}</p>
              <Button variant="primary" onClick={loadClubs}>
                Retry
              </Button>
            </div>
          ) : clubs.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No clubs found. Join a club to see it listed here.
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <article
                  key={club.id}
                  className="card bg-white rounded-2xl p-4 shadow-sm flex flex-col border border-gray-100"
                >
                  <div className="h-28 rounded-lg bg-gradient-to-br from-blue-50 to-white mb-4" />

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {club.initials || getInitials(club.name)}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {club.name}
                      </h2>
                      <div className="text-sm text-slate-500 mt-1">
                        {club.category} · {club.members} members
                      </div>
                      <p className="text-sm text-slate-600 mt-3 line-clamp-3">
                        {club.description ||
                          "Access club events, resources and connect with members."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <a
                      href={`/club-profile?club=${encodeURIComponent(club.id)}`}
                      className="flex-1"
                      aria-label={`Open ${club.name} events`}
                    >
                      <Button variant="outline" className="w-full">
                        Events
                      </Button>
                    </a>

                    <Button
                      variant="ghost"
                      className="w-32"
                      onClick={() => handleUnsubscribe(club.id)}
                    >
                      Unsubscribe
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
