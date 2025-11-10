import React, { useState } from "react";

function NavigationBar({ fixed = true, active = "/", hidden = [] }) {
  const containerClasses = `${
    fixed ? "fixed left-0 top-0 h-full" : "relative"
  } w-64 bg-white text-gray-700 p-4 flex flex-col shadow-lg`;

  const linkClass = (href) => {
    const base = "p-3 rounded-lg transition-colors";
    const activeClass = "bg-blue-600 text-white";
    const hoverClass = "hover:bg-blue-600 hover:text-white";
    return `${base} ${active === href ? activeClass : hoverClass}`;
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/clubs", label: "Clubs" },
    { href: "/events", label: "Events" },
    { href: "/posts", label: "Posts" },
    { href: "/my-clubs", label: "My Clubs" },
    { href: "/profile", label: "My Profile" },
  ];

  const visibleLinks = links.filter((l) => !hidden.includes(l.href));

  return (
    <div className={containerClasses}>
      <h1 className="text-blue-600 font-bold text-xl mb-6">KFUPM</h1>
      <nav className="flex flex-col space-y-4 grow">
        {visibleLinks.map((link) => (
          <a key={link.href} href={link.href} className={linkClass(link.href)}>
            {link.label}
          </a>
        ))}
      </nav>
      <button
        onClick={() => (window.location.href = "/login")}
        className="mt-auto w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}

const attendedEvents = [
  {
    id: 1,
    title: "Cybersecurity 101",
    date: "Feb 10",
    club: "Computer Club",
  },
  {
    id: 2,
    title: "Data Science Meetup",
    date: "Jan 28",
    club: "Computer Club",
  },
  {
    id: 3,
    title: "Leadership Lab",
    date: "Dec 12",
    club: "ISE Club",
  },
  {
    id: 4,
    title: "Formula Student Showcase",
    date: "Nov 30",
    club: "ME Club",
  },
];

const joinedClubs = [
  { id: 1, abbr: "CS", name: "Computer Club" },
  { id: 2, abbr: "ISE", name: "ISE Club" },
  { id: 3, abbr: "ME", name: "ME Club" },
  { id: 4, abbr: "G", name: "Gamers Club" },
  { id: 5, abbr: "PE", name: "Petroleum Eng. Club" },
];

const certificates = [
  {
    id: 1,
    year: "2023",
    title: "AI Bootcamp Completion",
    issuer: "Computer Club",
    date: "Mar 20",
  },
  {
    id: 2,
    year: "2022",
    title: "Leadership Lab Facilitator",
    issuer: "ISE Club",
    date: "Nov 18",
  },
  {
    id: 3,
    year: "2021",
    title: "Volunteer Excellence Award",
    issuer: "Student Affairs",
    date: "May 04",
  },
];

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Student Name",
    major: "Electrical Engineering",
    joinYear: "2022",
    profileImage: null
  });
  const [editForm, setEditForm] = useState({ ...profileData });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setProfileData({
      ...editForm,
      profileImage: imagePreview || editForm.profileImage
    });
    setShowEditModal(false);
    setImagePreview(null);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profileData });
    setImagePreview(null);
    setShowEditModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar active="/profile" />

      <div className="ml-64 flex-1 p-8 lg:p-10">
        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 p-8 shadow-lg relative">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-white shadow-md overflow-hidden">
              {profileData.profileImage ? (
                <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200"></div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {profileData.name}
              </h1>
              <p className="text-sm text-slate-700 mt-1">
                {profileData.major} · Joined {profileData.joinYear}
              </p>
            </div>
            <button 
              onClick={() => setShowEditModal(true)}
              className="absolute top-6 right-6 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Attended Events Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Attended Events
            </h2>
            <span className="text-sm text-blue-600 font-medium">
              15 events
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {attendedEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-24 mb-4 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200"></div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {event.date} · {event.club}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Joined Clubs Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Joined Clubs</h2>
            <span className="text-sm text-blue-600 font-medium">5 clubs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {joinedClubs.map((club) => (
              <div
                key={club.id}
                className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg mb-3">
                    {club.abbr}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-center">
                    {club.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Certificates</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              Download All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                    {cert.year}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Issued by {cert.issuer} · {cert.date}
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white text-blue-600 border border-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                    View
                  </button>
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h2>
            
            {/* Profile Image Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-white shadow-md overflow-hidden mb-3">
                {(imagePreview || editForm.profileImage) ? (
                  <img 
                    src={imagePreview || editForm.profileImage} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200"></div>
                )}
              </div>
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={editForm.major}
                  onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Join Year
                </label>
                <input
                  type="text"
                  value={editForm.joinYear}
                  onChange={(e) => setEditForm({ ...editForm, joinYear: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}