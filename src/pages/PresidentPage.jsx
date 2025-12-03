import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import NavigationBar from "../components/NavigationBar.jsx";
import Button from "../components/Button.jsx";
import SectionCard from "../components/SectionCard.jsx";
import PostCard from "../components/PostCard.jsx";
import PopupForm from "../components/PopupForm.jsx";
import { adminClubSeeds, ClubsInfo } from "../assets/data.js";
import { fetchEvents } from "../api/events.js";
import { isObjectId } from "../api/clubs.js";

const club = adminClubSeeds[0];
const stats = Object.entries(ClubsInfo[club.name] || {}).map(
  ([label, value]) => ({
    label,
    value,
  })
);
const initialPosts = [
  {
    id: 1,
    clubInitials: "ISE",
    clubName: "ISE Club",
    timeAgo: "Posted yesterday",
    title: "Lean Workshop Materials",
    body: "Slides and templates from last week's lean manufacturing bootcamp are now available. Download and share with your project teams.",
    imageUrl: "",
    tag: "RESOURCES",
    likes: 42,
  },
  {
    id: 2,
    clubInitials: "ISE",
    clubName: "ISE Club",
    timeAgo: "Posted yesterday",
    title: "Lean Workshop Materials",
    body: "Slides an  d templates from last week's lean manufacturing bootcamp are now available. Download and share with your project teams.",
    imageUrl: "",
    tag: "RESOURCES",
    likes: 42,
  },
  {
    id: 3,
    clubInitials: "ISE",
    clubName: "ISE Club",
    timeAgo: "Posted yesterday",
    title: "Lean Workshop Materials",
    body: "Slides and templates from last week's lean manufacturing bootcamp are now available. Download and share with your project teams.",
    imageUrl: "",
    tag: "RESOURCES",
    likes: 42,
  },
];

export default function PresidentPage() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [posts, setPosts] = useState(initialPosts);
  const [editingPost, setEditingPost] = useState(null);
  const qrRef = useRef(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubsError, setClubsError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        const data = await fetchEvents();
        setEvents(data);
        setEventsLoading(false);
      } catch (err) {
        setEventsError("Failed to load events.");
        setEventsLoading(false);
      }
    };
    const loadClubs = async () => {
      try {
        setClubsLoading(true);
        const { fetchClubs } = await import("../api/clubs.js");
        const clubsData = await fetchClubs();
        setClubs(clubsData);
        setClubsLoading(false);
      } catch (err) {
        setClubsError("Failed to load clubs.");
        setClubsLoading(false);
      }
    };
    loadEvents();
    loadClubs();
  }, []);

  // Copy QR value as link (or text)
  const handleCopyLink = () => {
    if (qrValue) {
      navigator.clipboard.writeText(qrValue);
    }
  };

  // Download QR code as image
  const handleDownloadQR = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const canvas = document.createElement('canvas');
      const img = new window.Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngFile;
        downloadLink.download = 'qr-code.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
    }
  };

  // Post edit handler
  const handlePostEdit = (post) => {
    setEditingPost(post);
  };

  // Close post editor
  const closePostEditor = () => {
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fe]">
      <NavigationBar active="/president" type="president" />
      <main className="px-4 md:px-8 py-6 max-w-[1600px] mx-auto ml-0 md:ml-64 pt-16 md:pt-6">
        {/* Club Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-[#e9f0ff] rounded-2xl shadow p-6 lg:p-8 mb-8 gap-6">
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-200 flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-700">
              {club.initials}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {club.name}
              </h1>
              <div className="text-slate-500 text-sm sm:text-base lg:text-lg">
                President Dashboard
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
            <Button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-base" onClick={() => setShowEventForm(true)}>
              Create Event
            </Button>
            <Button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-base">
              Create Post
            </Button>
          </div>
        </div>

        {/* Event Creation Popup */}
        {showEventForm && clubs.length > 0 && (
          <PopupForm
            method="POST"
            submitLabel="Create Event"
            fields={[
              { name: "title", label: "Title", dataType: "string", placeholder: "Event Title" },
              { name: "description", label: "Description", dataType: "text", placeholder: "Describe the event" },
              { name: "date", label: "Date", dataType: "date", placeholder: "Event Date" },
              { name: "type", label: "Type", dataType: "string", options: [
                { value: "Workshop", label: "Workshop" },
                { value: "Hackathon", label: "Hackathon" },
                { value: "Seminar", label: "Seminar" },
                { value: "Competition", label: "Competition" },
                { value: "Meetup", label: "Meetup" },
                { value: "Other", label: "Other" },
              ] },
              { name: "imageURL", label: "Image URL", dataType: "string", placeholder: "Optional image link", optional: true },
              { name: "club", label: "Club", dataType: "hidden" },
            ]}
            initialValues={{ club: clubs[0]._id }}
            onClose={() => setShowEventForm(false)}
            endpoint="/events"
          />
        )}

        {/* Attendance Check-In */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Attendance Check-In</h2>
          <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Generate a QR for live scans</a>
          <SectionCard className="flex gap-8 items-center">
            <div className="flex-1">
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Select Event</div>
                <select
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  {events.length === 0 ? (
                    <option value="" disabled>{eventsLoading ? "Loading events..." : "No events found"}</option>
                  ) : (
                    events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} @ {ev.date ? new Date(ev.date).toLocaleString("en-US", { month: "short", day: "numeric" }) : "TBA"}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <Button
                className="w-full bg-blue-600 text-white"
                onClick={() => {
                  const event = events.find((ev) => ev.id === selectedEvent);
                  const value = event
                    ? `Event: ${event.title}\nDate: ${event.date ? new Date(event.date).toLocaleString() : "Date TBA"}\nClub: ${event.host}`
                    : "";
                  setQrValue(value);
                  setQrGenerated(true);
                }}
              >
                Generate QR
              </Button>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-40 h-40 flex items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-[#f5f7fe] mb-2" ref={qrRef}>
                {qrGenerated && qrValue ? (
                  <QRCode value={qrValue} size={140} style={{ width: 140, height: 140 }} />
                ) : (
                  <span className="text-2xl text-blue-400 font-bold">QR</span>
                )}
              </div>
              <div className="text-xs text-slate-500 text-center mb-2">Display this code at the venue. Students can scan using the KFUPM Clubs app to check in.</div>
              <div className="flex gap-4">
                <Button variant="outline" className="text-blue-600 border-blue-600" disabled={!qrGenerated} onClick={handleDownloadQR}>Download QR</Button>
                <Button variant="ghost" className="text-blue-600" disabled={!qrGenerated} onClick={handleCopyLink}>Copy Link</Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Manage Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Manage Events</h2>
          {eventsError && <p className="text-sm text-red-600 mb-3">{eventsError}</p>}
          {eventsLoading ? (
            <p className="text-sm text-slate-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-slate-500">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="flex flex-col bg-white rounded-2xl shadow p-6">
                  <div className="h-24 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 mb-4" />
                  {editingId === ev.id ? (
                    <>
                      <input
                        className="text-lg font-semibold text-slate-900 mb-1 border rounded p-1 mb-2"
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                      />
                      <textarea
                        className="text-slate-500 text-sm mb-2 border rounded p-1"
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-semibold text-slate-900 mb-1">{ev.title}</div>
                      <div className="text-slate-500 text-sm mb-2">{ev.description}</div>
                    </>
                  )}
                  <div className="text-xs text-slate-400 mb-2">{ev.date ? new Date(ev.date).toLocaleString("en-US", { month: "short", day: "numeric" }) : "Date TBA"} - {ev.registered || 0} registered</div>
                  <div className="flex gap-2 mb-2">
                    {editingId === ev.id ? (
                      <>
                        <Button variant="secondary" className="w-1/2" onClick={() => {
                          setEvents((prev) => prev.map((e) => e.id === ev.id ? { ...e, ...editForm } : e));
                          setEditingId(null);
                        }}>Save</Button>
                        <Button variant="outline" className="w-1/2 text-gray-600 border-gray-200" onClick={() => setEditingId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="secondary" className="w-1/2" onClick={() => {
                          setEditingId(ev.id);
                          setEditForm({ title: ev.title, description: ev.description });
                        }}>Edit</Button>
                        <Button variant="outline" className="w-1/2 text-red-600 border-red-200" onClick={() => setEvents((prev) => prev.filter((e) => e.id !== ev.id))}>Delete</Button>
                      </>
                    )}
                  </div>
                  <Button variant="ghost" className="w-full border border-blue-200 text-blue-600" onClick={() => alert("joined students will be notified")}>Notify By email</Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Manage Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} type="president" onEdit={handlePostEdit} />
            ))}
          </div>
        </div>
      </main>
      {/* Post Edit Popup */}
      {editingPost && (
        <PopupForm
          method="PUT"
          submitLabel="Save Changes"
          fields={[
            { name: "title", label: "Title", dataType: "string" },
            { name: "body", label: "Body", dataType: "text" },
            { name: "tag", label: "Tag", dataType: "string" },
          ]}
          initialValues={{
            title: editingPost.title,
            body: editingPost.body,
            tag: editingPost.tag,
          }}
          onClose={closePostEditor}
          onSubmit={(values) => {
            setPosts((prev) => prev.map((post) => post.id === editingPost.id ? { ...post, ...values } : post));
            closePostEditor();
          }}
        />
      )}
    </div>
  );
}
