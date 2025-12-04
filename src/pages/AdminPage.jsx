import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import StatisticsNavbar from "../components/StatisticsNavbar.jsx";
import SectionCard from "../components/SectionCard.jsx";
import FormField from "../components/FormField.jsx";
import ClubRow from "../components/ClubRow.jsx";
import LogoUpload from "../components/LogoUpload.jsx";
import ButtonGroup from "../components/ButtonGroup.jsx";
// Removed hardcoded statistics import
import {
  fetchClubs,
  createClub,
  updateClub,
  deleteClub,
  isObjectId,
} from "../api/clubs";
import { fetchEvents } from "../api/events";

export default function AdminPage() {
    const [presidents, setPresidents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [adminStatistics, setAdminStatistics] = useState([
    { label: "Total Clubs", value: "-" },
    { label: "Upcoming Events", value: "-" },
    { label: "Event Attendance", value: "-" },
    { label: "New Registrations", value: "-" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // President Account Form State
  const [presFullName, setPresFullName] = useState("");
  const [presId, setPresId] = useState("");
  const [presEmail, setPresEmail] = useState("");
  const [presPhone, setPresPhone] = useState("");
  const [presStartDate, setPresStartDate] = useState("");
  const [presClub, setPresClub] = useState("");
  const [presPassword, setPresPassword] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const loadClubs = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const clubsData = await fetchClubs();
      setClubs(clubsData);
      const eventsData = await fetchEvents();
      // Update admin statistics with true club and event count
      setAdminStatistics((prevStats) =>
        prevStats.map((stat) => {
          if (stat.label === "Total Clubs") {
            return { ...stat, value: clubsData ? String(clubsData.length) : "-" };
          }
          if (stat.label === "Upcoming Events") {
            return { ...stat, value: eventsData ? String(eventsData.length) : "-" };
          }
          return stat;
        })
      );
    } catch (err) {
      setError(err.message || "Failed to load clubs");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadClubs();
    // Fetch users with role 'president'
    async function loadPresidents() {
      try {
        const res = await fetch("/api/v1/users?role=president");
        const data = await res.json();
        const users = Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.users) ? data.data.users : []);
        setPresidents(users);
      } catch (err) {
        setPresidents([]);
      }
    }
    loadPresidents();
  }, []);

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

  const publishClub = async () => {
    if (!clubName.trim()) {
      window.alert("Please enter a club name before publishing.");
      return;
    }

    const payload = {
      name: clubName.trim(),
      description: description.trim(),
      logo: logoPreview || "",
      contactEmail: contactEmail.trim() || undefined,
      category,
    };

    if (assignPresident.trim() && isObjectId(assignPresident)) {
      payload.president = assignPresident.trim();
    }

    try {
      setIsPublishing(true);
      const created = await createClub(payload);
      setClubs((prev) => [created, ...prev]);
      resetForm();
      window.alert(`Club "${created.name}" published.`);
    } catch (err) {
      window.alert(`Failed to publish club: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const onDelete = async (id) => {
    const club = clubs.find((c) => c.id === id);
    if (!club) return;
    const confirmed = window.confirm(
      `Delete "${club.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteClub(id);
      setClubs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      window.alert(`Failed to delete club: ${err.message}`);
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

  const onSaveEdit = async (id) => {
    const payload = {
      name: editForm.name?.trim() || undefined,
    };

    if (isObjectId(editForm.president || "")) {
      payload.president = editForm.president.trim();
    }

    try {
      setIsSavingEdit(true);
      const updated = await updateClub(id, payload);
      setClubs((prev) => prev.map((c) => (c.id === id ? updated : c)));
      onCancelEdit();
    } catch (err) {
      window.alert(`Failed to update club: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const filteredClubs = clubs.filter((club) => {
    if (!searchTerm) return true;
    const first = searchTerm.trim()[0];
    if (!first) return true;
    return club.name.charAt(0).toLowerCase() === first.toLowerCase();
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="md:fixed md:left-0 md:top-0 md:h-full z-10 w-full md:w-64">
        <NavigationBar active="/admin" type="admin" />
      </div>
      <div className="flex-1 w-full max-w-full pt-16 md:pt-0 md:ml-64">
        <div className="px-4 md:px-8">
          <StatisticsNavbar stats={adminStatistics} />
        </div>
        <div className="px-4 md:px-8 mb-4 mt-4 md:mt-0">
          <h2 className="text-xl font-semibold">Club Catalog</h2>
        </div>

        <div className="mx-4 md:mx-8 bg-white rounded-2xl shadow-md p-3 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <input
                type="text"
                placeholder="Search clubs"
                className="px-4 py-2 border rounded-lg w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 text-gray-600">CLUB</th>
                  <th className="pb-3 text-gray-600">PRESIDENT</th>
                  <th className="pb-3 text-gray-600">MEMBERS</th>
                  <th className="pb-3 text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-600">
                      Loading clubs…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center">
                      <div className="text-gray-700 mb-3">{error}</div>
                      <button
                        className="text-blue-600 hover:text-blue-700"
                        onClick={loadClubs}
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : filteredClubs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-600">
                      No clubs to display.
                    </td>
                  </tr>
                ) : (
                  filteredClubs.map((club) => (
                    <ClubRow
                      key={club.id}
                      club={club}
                      editingId={editingId}
                      editForm={editForm}
                      setEditForm={setEditForm}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onSaveEdit={onSaveEdit}
                      onCancelEdit={onCancelEdit}
                      isSaving={isSavingEdit}
                      presidents={presidents}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 md:px-8 mb-4 mt-8">
          <h2 className="text-xl font-semibold">Create New Club</h2>
        </div>

        <SectionCard className="mx-4 md:mx-8">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
            Draft the club profile, assign the leadership team, and publish when
            you are ready for students to subscribe.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField label="Club Name">
              <input
                type="text"
                placeholder="Enter club name"
                className="px-4 py-2 border rounded-lg w-full"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
              />
            </FormField>
            <FormField label="Category">
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
            </FormField>
          </div>
          <FormField label="Description" className="mb-6">
            <textarea
              placeholder="Describe the club focus, target members, and planned activities."
              className="px-4 py-2 border rounded-lg w-full h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField label="Contact Email">
              <input
                type="email"
                placeholder="club@kfupm.edu.sa"
                className="px-4 py-2 border rounded-lg w-full"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </FormField>
            <FormField label="Assign President (User)">
              <select
                className="px-4 py-2 border rounded-lg w-full bg-white"
                value={assignPresident}
                onChange={(e) => setAssignPresident(e.target.value)}
              >
                <option value="">Select president</option>
                {presidents.filter(user => user.status === "active").map((user) => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Logo Upload" className="mb-6">
            <LogoUpload
              logoPreview={logoPreview}
              setLogoPreview={setLogoPreview}
              setLogoFile={setLogoFile}
            />
          </FormField>
          <ButtonGroup
            buttons={[
              {
                label: "Reset",
                onClick: resetForm,
                className:
                  "px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg",
              },
              // {
              //   label: "Save Draft",
              //   className:
              //     "px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg",
              // },
              {
                label: isPublishing ? "Publishing..." : "Publish Club",
                onClick: publishClub,
                className:
                  "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50",
                disabled: isPublishing,
              },
            ]}
          />
        </SectionCard>

      </div>
    </div>
  );
}
