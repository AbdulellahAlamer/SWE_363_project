import { useEffect, useState } from "react";
import {
  fetchClubs,
  fetchMyClubs,
  subscribeToClub,
  unsubscribeFromClub,
} from "../api/clubs.js";
import ClubCard from "../components/ClubCard";
import Button from "../components/Button";
import NavigationBar from "../components/NavigationBar";

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // track joined clubs by id
  const [joinedIds, setJoinedIds] = useState(new Set());
  // club object used to show popup after join
  const [joinedClubPopup, setJoinedClubPopup] = useState(null);

  const categories = [
    "All",
    ...new Set(clubs.map((club) => club.category || "General")),
  ];

  // Filter clubs based on search and category
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loadClubs = async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      const data = await fetchClubs();
      setClubs(data);
    } catch (err) {
      setError(err.message || "Failed to load clubs");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadJoined = async () => {
    try {
      const mine = await fetchMyClubs();
      setJoinedIds(new Set(mine.map((c) => c.id)));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadClubs();
    loadJoined();
  }, []);

  const handleToggleSubscription = async (club) => {
    try {
      const isJoined = joinedIds.has(club.id);
      const updated = isJoined
        ? await unsubscribeFromClub(club.id)
        : await subscribeToClub(club.id);

      setJoinedIds((prev) => {
        const next = new Set(prev);
        if (isJoined) {
          next.delete(club.id);
        } else {
          next.add(club.id);
        }
        return next;
      });

      setClubs((prev) => prev.map((c) => (c.id === club.id ? updated : c)));

      if (!isJoined) {
        setJoinedClubPopup(club);
      } else {
        setJoinedClubPopup(null);
      }
    } catch (err) {
      window.alert(
        err.message ||
          (joinedIds.has(club.id)
            ? "Failed to unsubscribe from club."
            : "Failed to subscribe to club.")
      );
    }
  };

  // NAVIGATION: open club-profile and include club id so ClubProfile can load correct club
  const handleView = (clubId) => {
    window.location.href = `/club-profile?club=${encodeURIComponent(clubId)}`;
  };

  return (
    <div className="flex">
      <NavigationBar active="/clubs" type="student" />

      <div className="ml-0 md:ml-64 flex-1 min-h-screen bg-gray-50 mt-8">
        <div className="max-w-6xl mx-auto px-8 py-12 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Clubs
          </h1>
          <p className="text-lg text-gray-600">
            Join communities and connect with like-minded students
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-8 mb-8">
          <div className="mb-6">
            <input
              type="text"
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "default"}
                onClick={() => setSelectedCategory(category)}
                className="border-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 pb-12">
          {loading ? (
            <div className="text-center py-12 text-gray-600">
              Loading clubs…
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-3">{error}</p>
              <Button
                variant="primary"
                onClick={loadClubs}
                disabled={isRefreshing}
              >
                {isRefreshing ? "Refreshing..." : "Retry"}
              </Button>
            </div>
          ) : filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  isJoined={joinedIds.has(club.id)}
                  onToggle={() => handleToggleSubscription(club)}
                  onView={handleView} // pass handler; ClubCard will call with id
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No clubs found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {joinedClubPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">You're in!</h2>
            <p className="text-sm text-slate-600 mb-4">
              You have joined{" "}
              <span className="font-medium">{joinedClubPopup.name}</span>.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-slate-700"
                onClick={() => setJoinedClubPopup(null)}
              >
                Close
              </button>
              <a
                href={`/events?club=${encodeURIComponent(joinedClubPopup.id)}`}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                View club events
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
