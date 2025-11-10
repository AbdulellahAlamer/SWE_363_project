import React, { useState } from "react";
import { sampleEvents } from "../assets/data.js";
// Navigation Bar Component
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
    { href: "/profile", label: "My Profile" },
    { href: "/my-clubs", label: "My Clubs" },
    { href: "/admin", label: "Admin Console" },
    { href: "/user-management", label: "User Management" },
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

export default function Events() {
  const [filter, setFilter] = useState("upcoming");

  const filtered = sampleEvents.filter((e) =>
    filter === "all" ? true : e.status === filter
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar active="/events" />
      
      <div className="ml-64 flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>

          <div className="flex items-center gap-3 bg-transparent rounded-full p-1">
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                filter === "upcoming"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white/60 text-slate-600"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                filter === "past"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white/60 text-slate-600"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((ev) => (
            <article
              key={ev.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100/50 via-white/30 to-white/90 shadow-lg"
              style={{ minHeight: 260 }}
            >
              <div className="h-28 bg-gradient-to-r from-sky-300 to-indigo-200 rounded-t-2xl" />

              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                    {ev.type.toUpperCase()} · {ev.dateLabel}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {ev.title}
                </h3>

                <p className="text-sm text-slate-500 mb-4">{ev.desc}</p>

                <div className="text-xs text-slate-500 mb-4">
                  <div className="uppercase tracking-wide text-[11px]">
                    Hosted by
                  </div>
                  <div className="font-medium text-slate-800">{ev.host}</div>
                </div>

                <div className="mt-2">
                  <button
                    type="button"
                    className="w-full rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-white"
                    onClick={() => alert(`Registering for "${ev.title}"`)}
                  >
                    Register
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No events to show.
          </p>
        )}
      </div>
    </div>
  );
}
