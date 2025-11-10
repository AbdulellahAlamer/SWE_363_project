
import React from "react";

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
  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar active="/profile" />

      <div className="ml-64 flex-1 p-8 lg:p-10">
        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 p-8 shadow-lg relative">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-white shadow-md"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                Student Name
              </h1>
              <p className="text-sm text-slate-700 mt-1">
                Electrical Engineering · Joined 2022
              </p>
            </div>
            <button className="absolute top-6 right-6 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
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
    </div>
  );
}