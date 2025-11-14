import { useState } from 'react';
import { adminClubSeeds } from '../assets/data';
import ClubCard from '../components/ClubCard';
import Button from '../components/Button';
import NavigationBar from '../components/NavigationBar';

export default function ClubsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(adminClubSeeds.map(club => club.category))];

  // Filter clubs based on search and category
  const filteredClubs = adminClubSeeds.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoin = (clubId) => {
    console.log('Join club:', clubId);
    // Add join logic here
  };

  const handleView = (clubId) => {
    console.log('View club:', clubId);
    // Add navigation logic here
  };

  return (
    <div className="flex">
      {/* Navigation Sidebar */}
      <NavigationBar active="/clubs" type="student" />

      {/* Main Content */}
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-8 py-12 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Clubs</h1>
          <p className="text-lg text-gray-600">Join communities and connect with like-minded students</p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-8 mb-8">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
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

        {/* Clubs Grid */}
        <div className="max-w-6xl mx-auto px-8 pb-12">
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map(club => (
                <ClubCard
                  key={club.id}
                  club={club}
                  onJoin={() => handleJoin(club.id)}
                  onView={() => handleView(club.id)}
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
    </div>
  );
}