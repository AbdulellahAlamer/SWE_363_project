import { useEffect, useMemo, useState } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import { certificates as fallbackCertificates } from "../assets/data.js";
import { fetchMyClubs } from "../api/clubs";
import { fetchCurrentUser, updateCurrentUser } from "../api/users";
import { getStoredSession } from "../api/auth";
import { fetchEvents } from "../api/events.js";

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    major: "",
    joinYear: "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [eventsError, setEventsError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const loadProfile = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await fetchCurrentUser();
      const [clubs, events] = await Promise.all([
        fetchMyClubs(),
        fetchEvents({ userId: user.id }),
      ]);
      setProfileData({
        name: user.name || "Student",
        major: user.major || "Major not set",
        joinYear: user.joinYear || "N/A",
        profileImage: user.photoUrl || null,
        certificates: user.certificates || [],
        raw: user,
      });
      setEditForm({
        name: user.name || "",
        major: user.major || "",
        joinYear: user.joinYear || "",
        profileImage: user.photoUrl || null,
      });
      setJoinedClubs(clubs || []);
      setAttendedEvents(events || []);
      setEventsError(null);
    } catch (err) {
      setError(err.message || "Failed to load profile");
      setAttendedEvents([]);
      setEventsError("Unable to load attended events right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        name: editForm.name?.trim(),
        major: editForm.major?.trim(),
        Join_Year: editForm.joinYear?.trim(),
        photo_URL: imagePreview || editForm.profileImage || undefined,
      };
      const updated = await updateCurrentUser(payload);

      const session = getStoredSession();
      if (session?.user) {
        const merged = { ...session.user, ...updated.raw };
        localStorage.setItem("user", JSON.stringify(merged));
      }

      setProfileData({
        name: updated.name || editForm.name,
        major: updated.major || editForm.major,
        joinYear: updated.joinYear || editForm.joinYear,
        profileImage: updated.photoUrl || imagePreview || editForm.profileImage,
        raw: updated.raw,
      });
      setEditForm((prev) => ({
        ...prev,
        profileImage: updated.photoUrl || imagePreview || prev.profileImage,
      }));
      setShowEditModal(false);
      setImagePreview(null);
    } catch (err) {
      window.alert(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: profileData?.name || "",
      major: profileData?.major || "",
      joinYear: profileData?.joinYear || "",
      profileImage: profileData?.profileImage || null,
    });
    setImagePreview(null);
    setShowEditModal(false);
  };

  const handleViewCertificate = (cert) => {
    const url =
      cert?.imageUrl ||
      cert?.URL ||
      cert?.url ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsfYYckqdKARgMY6TUhcOnl8Fy5IuPIrj8qQ&s";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadCertificate = (cert) => {
    const link = document.createElement("a");
    link.href = cert.imageUrl || cert.URL || cert.url;
    link.download = `${cert.title.replace(/\s+/g, "_")}_${cert.year}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    effectiveCertificates.forEach((cert, index) => {
      setTimeout(() => {
        handleDownloadCertificate(cert);
      }, index * 500);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Date TBA";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const clubAbbreviations = useMemo(
    () =>
      Object.fromEntries(
        (joinedClubs || []).map((club) => [
          club.name,
          club.name?.slice(0, 3)?.toUpperCase() || "C",
        ])
      ),
    [joinedClubs]
  );

  const userEvents = useMemo(() => {
    if (Array.isArray(attendedEvents)) {
      return attendedEvents;
    }
    return [];
  }, [attendedEvents]);

  const userCertificates = useMemo(
    () =>
      profileData?.certificates ||
      profileData?.raw?.certificates ||
      profileData?.raw?.Certificates ||
      [],
    [profileData]
  );

  const effectiveCertificates =
    userCertificates.length > 0 ? userCertificates : fallbackCertificates;

  const effectiveEvents = userEvents.length > 0 ? userEvents : [];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <NavigationBar active="/my-profile" />
        <div className="w-full flex-1 pt-16 md:pt-0 md:ml-64 p-4 sm:p-6 lg:p-10">
          <div className="text-center py-16 text-slate-600">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <NavigationBar active="/my-profile" />
        <div className="w-full flex-1 pt-16 md:pt-0 md:ml-64 p-4 sm:p-6 lg:p-10">
          <div className="text-center py-16 text-slate-700">
            <p className="mb-4">{error}</p>
            <button
              className="text-blue-600 hover:text-blue-700 font-semibold"
              onClick={loadProfile}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const safeProfile = profileData || {
    name: "Student",
    major: "Major not set",
    joinYear: "N/A",
    profileImage: null,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar active="/my-profile" />

      <div className="w-full flex-1 pt-16 md:pt-0 md:ml-64 p-4 sm:p-6 lg:p-10">
        {/* Profile Header */}
        <div className="mb-6 sm:mb-8 rounded-2xl bg-linear-to-r from-slate-200 to-slate-300 p-4 sm:p-6 lg:p-8 shadow-lg relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white shadow-md overflow-hidden shrink-0">
              {safeProfile.profileImage ? (
                <img
                  src={safeProfile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200"></div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                {safeProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                {safeProfile.major} - Joined {safeProfile.joinYear}
              </p>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="sm:absolute sm:top-4 sm:right-4 lg:top-6 lg:right-6 bg-white text-blue-600 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors w-full sm:w-auto"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Attended Events */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Attended Events
            </h2>
            <span className="text-xs sm:text-sm text-blue-600 font-medium">
          {effectiveEvents.length} events
        </span>
      </div>

      {eventsError && (
        <p className="text-xs sm:text-sm text-red-600 mb-3">{eventsError}</p>
      )}

      {effectiveEvents.length === 0 ? (
        <p className="text-xs sm:text-sm text-slate-500">
          No attended events yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {effectiveEvents.map((event) => (
            <div
              key={event.id || event._id || event.title}
              className="rounded-xl bg-white p-4 sm:p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-20 sm:h-24 mb-3 sm:mb-4 rounded-lg bg-linear-to-br from-blue-100 to-blue-200"></div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1">
                {event.title}
              </h3>
              <p className="text-xs text-slate-500">
                {event.date ? formatDate(event.date) : "Date TBA"} -{" "}
                {event.club?.name ||
                  event.club ||
                  event.host ||
                  event.hostName ||
                  "Club"}
              </p>
            </div>
          ))}
        </div>
      )}
        </div>

        {/* Joined Clubs */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Joined Clubs
            </h2>
            <span className="text-xs sm:text-sm text-blue-600 font-medium">
              {joinedClubs?.length || 0} clubs
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {joinedClubs && joinedClubs.length > 0 ? (
              joinedClubs.map((club) => (
                <div
                  key={club.id}
                  className="rounded-xl bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base sm:text-lg mb-2 sm:mb-3">
                      {clubAbbreviations[club?.name] ||
                        club?.name?.charAt(0) ||
                        "C"}
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 text-center">
                      {club.name || "Club Name"}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-6 sm:py-8">
                <div className="text-slate-400 mb-2">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm">
                  No clubs joined yet
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Join clubs to see them here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Certificates
            </h2>
            <button
              onClick={handleDownloadAll}
              className="text-xs sm:text-sm text-blue-600 font-medium hover:underline"
            >
              Download All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {effectiveCertificates.length === 0 ? (
              <p className="text-slate-500 text-sm col-span-full text-center py-6">
                No certificates yet.
              </p>
            ) : (
              effectiveCertificates.map((cert, idx) => (
              <div
                key={cert.id || idx}
                className="rounded-xl bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 sm:mb-4">
                  Issued by {cert.issuer || cert.issuedBy || "Unknown"} -{" "}
                  {cert.date || cert.year || ""}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewCertificate(cert)}
                    className="flex-1 bg-white text-blue-600 border border-blue-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadCertificate(cert)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
              Edit Profile
            </h2>

            <div className="mb-4 sm:mb-6 flex flex-col items-center">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white shadow-md overflow-hidden mb-3">
                {imagePreview || editForm.profileImage ? (
                  <img
                    src={imagePreview || editForm.profileImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200"></div>
                )}
              </div>
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={editForm.major}
                  onChange={(e) =>
                    setEditForm({ ...editForm, major: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Join Year
                </label>
                <input
                  type="text"
                  value={editForm.joinYear}
                  onChange={(e) =>
                    setEditForm({ ...editForm, joinYear: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
