import { useState } from 'react';
import { adminClubSeeds } from '../assets/data';
import ClubCard from '../components/ClubCard';
import Button from '../components/Button';
import NavigationBar from '../components/NavigationBar';

export default function ClubsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // track joined clubs by id
  const [joinedIds, setJoinedIds] = useState(new Set());
  // club object used to show popup after join
  const [joinedClubPopup, setJoinedClubPopup] = useState(null);

  // Extract unique categories
  const categories = ['All', ...new Set(adminClubSeeds.map(club => club.category))];

  // Filter clubs based on search and category
  const filteredClubs = adminClubSeeds.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoin = (club) => {
    setJoinedIds(prev => {
      const next = new Set(prev);
      next.add(club.id);
      return next;
    });
    setJoinedClubPopup(club);
  };

  // NAVIGATION: open club-profile and include club id so ClubProfile can load correct club
  const handleView = (clubId) => {
    window.location.href = `/club-profile?club=${encodeURIComponent(clubId)}`;
  };

  return (
    <div className="flex">
      <NavigationBar active="/clubs" type="student" />

      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-12 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Clubs</h1>
          <p className="text-lg text-gray-600">Join communities and connect with like-minded students</p>
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
            {categories.map(category => (
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
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map(club => (
                <ClubCard
                  key={club.id}
                  club={club}
                  isJoined={joinedIds.has(club.id)}
                  onJoin={() => handleJoin(club)}
                  onView={handleView} // pass handler; ClubCard will call with id
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No clubs found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {joinedClubPopup && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">You're in!</h2>
            <p className="text-sm text-slate-600 mb-4">You have joined <span className="font-medium">{joinedClubPopup.name}</span>.</p>
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