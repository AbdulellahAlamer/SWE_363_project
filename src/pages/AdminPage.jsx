import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import StatisticsNavbar from "../components/StatisticsNavbar.jsx";
import { adminStatistics, adminClubSeeds } from "../assets/data.js";

export default function AdminPage() {
  const [clubs, setClubs] = useState(adminClubSeeds);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", president: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState("Technology & Innovation");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [assignPresident, setAssignPresident] = useState("");

  useEffect(() => {
    // revoke object URL on unmount or when logoFile changes
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const resetForm = () => {
    setClubName("");
    setCategory("Technology & Innovation");
    setDescription("");
    setContactEmail("");
    setAssignPresident("");
    setLogoFile(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
  };

  const publishClub = () => {
    if (!clubName.trim()) {
      window.alert("Please enter a club name before publishing.");
      return;
    }

    const newClub = {
      id: "c" + Date.now(),
      initials: getInitials(clubName),
      name: clubName,
      updated: "Just now",
      president: assignPresident || "Vacant",
      members: 0,
      category,
    };

    setClubs((prev) => [newClub, ...prev]);
    resetForm();
    window.alert(`Club "${newClub.name}" published.`);
  };

  const onDelete = (id) => {
    const club = clubs.find((c) => c.id === id);
    if (!club) return;
    const confirmed = window.confirm(
      `Delete "${club.name}"? This action cannot be undone.`
    );
    if (confirmed) {
      setClubs((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const onEdit = (club) => {
    setEditingId(club.id);
    setEditForm({ name: club.name, president: club.president });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", president: "" });
  };

  const onSaveEdit = (id) => {
    setClubs((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, name: editForm.name, president: editForm.president }
          : c
      )
    );
    onCancelEdit();
  };
  return (
    <div className="flex min-h-screen">
      <NavigationBar active="/admin" type="admin" />
      <div className="flex-1 ml-64">
        <StatisticsNavbar stats={adminStatistics} />
        <div className="mx-8 mb-4">
          <h2 className="text-xl font-semibold">Club Catalog</h2>
        </div>

        <div className="mx-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search clubs"
                className="px-4 py-2 border rounded-lg w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-4">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  All
                </button>
                <button className="px-4 py-2 hover:bg-blue-50 rounded-lg">
                  Awaiting Approval
                </button>
                <button className="px-4 py-2 hover:bg-blue-50 rounded-lg">
                  Inactive
                </button>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 text-gray-600">CLUB</th>
                  <th className="pb-3 text-gray-600">PRESIDENT</th>
                  <th className="pb-3 text-gray-600">MEMBERS</th>
                  <th className="pb-3 text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {clubs
                  .filter((club) => {
                    if (!searchTerm) return true;
                    const first = searchTerm.trim()[0];
                    if (!first) return true;
                    return (
                      club.name.charAt(0).toLowerCase() === first.toLowerCase()
                    );
                  })
                  .map((club) => (
                    <tr key={club.id} className="border-b border-gray-200">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {club.initials}
                        </div>
                        <div className="flex-1">
                          {editingId === club.id ? (
                            <input
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((s) => ({
                                  ...s,
                                  name: e.target.value,
                                }))
                              }
                              className="px-3 py-2 border rounded-lg w-full"
                            />
                          ) : (
                            <>
                              <div>{club.name}</div>
                              <div className="text-sm text-gray-500">
                                {club.updated}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 w-1/4">
                        {editingId === club.id ? (
                          <input
                            value={editForm.president}
                            onChange={(e) =>
                              setEditForm((s) => ({
                                ...s,
                                president: e.target.value,
                              }))
                            }
                            className="px-3 py-2 border rounded-lg w-full"
                          />
                        ) : (
                          club.president
                        )}
                      </td>
                      <td className="py-4 w-24">{club.members}</td>
                      <td className="py-4">
                        <div className="flex gap-4">
                          {editingId === club.id ? (
                            <>
                              <button
                                onClick={() => onSaveEdit(club.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={onCancelEdit}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => onEdit(club)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onDelete(club.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create New Club Section */}
        <div className="mx-8 mb-4 mt-8">
          <h2 className="text-xl font-semibold">Create New Club</h2>
        </div>

        <div className="mx-8 bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
            Draft the club profile, assign the leadership team, and publish when
            you are ready for students to subscribe.
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Club Name</label>
              <input
                type="text"
                placeholder="Enter club name"
                className="px-4 py-2 border rounded-lg w-full"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Category</label>
              <select
                className="px-4 py-2 border rounded-lg w-full bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Academic & Professional</option>
                <option>Cultural & International</option>
                <option>Community Service & Volunteering</option>
                <option>Arts, Media & Creativity</option>
                <option>Sports & Recreation</option>
                <option>Personal Development & Leadership</option>
                <option>Technology & Innovation</option>
                <option>Religious & Ethical</option>
                <option>Student Governance & Representation</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Description</label>
            <textarea
              placeholder="Describe the club focus, target members, and planned activities."
              className="px-4 py-2 border rounded-lg w-full h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Contact Email</label>
              <input
                type="email"
                placeholder="club@kfupm.edu.sa"
                className="px-4 py-2 border rounded-lg w-full"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">
                Assign President
              </label>
              <input
                type="text"
                placeholder="Search user or email"
                className="px-4 py-2 border rounded-lg w-full"
                value={assignPresident}
                onChange={(e) => setAssignPresident(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Logo Upload</label>

            <label
              htmlFor="logoInput"
              className="group relative flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-300 cursor-pointer p-4 text-center"
            >
              <input
                id="logoInput"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  setLogoFile(file);
                  // revoke previous preview if exists
                  if (logoPreview) URL.revokeObjectURL(logoPreview);
                  const url = URL.createObjectURL(file);
                  setLogoPreview(url);
                }}
                className="hidden"
              />

              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="logo preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              ) : (
                <>
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4"
                    ></path>
                  </svg>
                  <div className="text-sm text-gray-500">
                    Click or tap to upload a logo (or take a photo)
                  </div>
                  <div className="text-xs text-gray-400">Show more</div>
                </>
              )}
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Reset
            </button>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              Save Draft
            </button>
            <button
              onClick={publishClub}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Publish Club
            </button>
          </div>
        </div>

        {/* Create President Account Section */}
        <div className="mx-8 mb-4 mt-8">
          <h2 className="text-xl font-semibold">Create President Account</h2>
          <span className="text-blue-600 text-sm ml-4">
            Provision secure leadership access
          </span>
        </div>

        <div className="mx-8 bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
            Invite a new club leader by creating their account, assigning them
            to a club, and triggering an onboarding email with temporary
            credentials.
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="e.g., Latifah Al-Dossary"
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">KFUPM ID</label>
              <input
                type="text"
                placeholder="Student/Staff ID"
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">
                University Email
              </label>
              <input
                type="email"
                placeholder="username@kfupm.edu.sa"
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Phone Number</label>
              <input
                type="text"
                placeholder="05X-XXX-XXXX"
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">
                Role Start Date
              </label>
              <input
                type="text"
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Assign Club</label>
              <input
                type="text"
                placeholder="Select existing club"
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">
                Temporary Password
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Generate secure code"
                  className="px-4 py-2 border rounded-lg w-full"
                  readOnly
                />
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            Share only through official KFUPM channels. The leader will be
            prompted to reset on first login.
          </div>

          <div className="flex justify-end gap-4">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              Clear
            </button>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
