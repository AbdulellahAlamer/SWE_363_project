
import { useState } from "react";
import QRCode from "react-qr-code";
import { useRef } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import Button from "../components/Button.jsx";
import SectionCard from "../components/SectionCard.jsx";
import PostCard from "../components/PostCard.jsx";
import EventCard from "../components/EventCardProf.jsx";
import { sampleEvents, adminClubSeeds, ClubsInfo } from "../assets/data.js";

const club = adminClubSeeds[0];
const stats = Object.entries(ClubsInfo[club.name] || {}).map(([label, value]) => ({
  label,
  value,
}));
const posts = [
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
    comments: 13,
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
    comments: 13,
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
    comments: 13,
  },
];

export default function PresidentPage() {
  const [selectedEvent, setSelectedEvent] = useState(sampleEvents[0].id);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [events, setEvents] = useState([...sampleEvents]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const qrRef = useRef(null);

  // Download QR as PNG
  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const img = new window.Image();
    const size = 140;
    canvas.width = size;
    canvas.height = size;
    img.onload = function () {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
  };

  // Copy QR value as link (or text)
  const handleCopyLink = () => {
    if (qrValue) {
      navigator.clipboard.writeText(qrValue);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fe]">
      <NavigationBar active="/president" type="president" />
      <main className="px-8 py-6 max-w-[1600px] mx-auto" style={{ paddingLeft: 272 }}>
        {/* Club Header */}
        <div className="flex items-center justify-between bg-[#e9f0ff] rounded-2xl shadow p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700">
              {club.initials}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-1">{club.name}</h1>
              <div className="text-slate-500 text-lg">President Dashboard</div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">Create Event</Button>
            <Button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">Create Post</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="flex-1 bg-[#e9f0ff] rounded-2xl shadow p-6 flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-2">{stat.label}</div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Attendance Check-In */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-900">Attendance Check-In</h2>
            <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Generate a QR for live scans</a>
          </div>
          <SectionCard className="flex gap-8 items-center">
            <div className="flex-1">
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Select Event</div>
                <select
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  value={selectedEvent}
                  onChange={e => setSelectedEvent(e.target.value)}
                >
                  {sampleEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title} @ {new Date(ev.date).toLocaleString('en-US', { month: 'short', day: 'numeric' })}</option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full bg-blue-600 text-white"
                onClick={() => {
                  const event = sampleEvents.find(ev => ev.id === selectedEvent);
                  const value = event
                    ? `Event: ${event.title}\nDate: ${new Date(event.date).toLocaleString()}\nClub: ${event.host}`
                    : "";
                  setQrValue(value);
                  setQrGenerated(true);
                }}
              >
                Generate QR
              </Button>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-40 h-40 flex items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-[#f5f7fe] mb-2"
                ref={qrRef}
              >
                {qrGenerated && qrValue ? (
                  <QRCode value={qrValue} size={140} style={{ width: 140, height: 140 }} />
                ) : (
                  <span className="text-2xl text-blue-400 font-bold">QR</span>
                )}
              </div>
              <div className="text-xs text-slate-500 text-center mb-2">Display this code at the venue. Students can scan using the KFUPM Clubs app to check in.</div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600"
                  disabled={!qrGenerated}
                  onClick={handleDownloadQR}
                >
                  Download QR
                </Button>
                <Button
                  variant="ghost"
                  className="text-blue-600"
                  disabled={!qrGenerated}
                  onClick={handleCopyLink}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Manage Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Manage Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map(ev => (
              <div key={ev.id} className="flex flex-col bg-white rounded-2xl shadow p-6">
                <div className="h-24 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 mb-4" />
                {editingId === ev.id ? (
                  <>
                    <input
                      className="text-lg font-semibold text-slate-900 mb-1 border rounded p-1 mb-2"
                      value={editForm.title}
                      onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                    />
                    <textarea
                      className="text-slate-500 text-sm mb-2 border rounded p-1"
                      value={editForm.description}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </>
                ) : (
                  <>
                    <div className="text-lg font-semibold text-slate-900 mb-1">{ev.title}</div>
                    <div className="text-slate-500 text-sm mb-2">{ev.description}</div>
                  </>
                )}
                <div className="text-xs text-slate-400 mb-2">{new Date(ev.date).toLocaleString('en-US', { month: 'short', day: 'numeric' })} · {ev.registered} registered</div>
                <div className="flex gap-2 mb-2">
                  {editingId === ev.id ? (
                    <>
                      <Button
                        variant="secondary"
                        className="w-1/2"
                        onClick={() => {
                          setEvents(events.map(e => e.id === ev.id ? { ...e, ...editForm } : e));
                          setEditingId(null);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        className="w-1/2 text-gray-600 border-gray-200"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        className="w-1/2"
                        onClick={() => {
                          setEditingId(ev.id);
                          setEditForm({ title: ev.title, description: ev.description });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="w-1/2 text-red-600 border-red-200"
                        onClick={() => setEvents(events.filter(e => e.id !== ev.id))}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="w-full border border-blue-200 text-blue-600"
                  onClick={() => alert("joined students will be notified")}
                >
                  Notify
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Manage Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
