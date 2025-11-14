import { useState } from 'react';
import { adminClubSeeds } from '../assets/data';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-12 text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Clubs</h1>
        <p className="text-lg text-gray-600">Join communities and connect with like-minded students</p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
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
            <button
              key={category}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-2 border-blue-600'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <div
                key={club.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-600 transition flex flex-col"
              >
                {/* Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {club.initials}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{club.category}</p>

                {/* Meta */}
                <div className="flex gap-3 mb-4 text-sm flex-wrap">
                  <span className="font-medium text-blue-600">{club.members} members</span>
                  <span className={`px-3 py-1 rounded font-medium ${
                    club.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {club.status === 'active' ? 'Active' : 'Awaiting President'}
                  </span>
                </div>

                {/* President Info */}
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-medium">President:</span> {club.president}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    Join
                  </button>
                  <button className="flex-1 bg-white text-blue-600 font-medium py-2 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No clubs found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}