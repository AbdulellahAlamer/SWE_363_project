import React, { useState } from "react";

const sampleEvents = [
  {
    id: 1,
    type: "Workshop",
    dateLabel: "MAR 22",
    title: "Intro to Robotics",
    desc: "Hands-on session building autonomous robots using Arduino kits.",
    host: "Mechanical Engineering Club",
    status: "upcoming",
  },
  {
    id: 2,
    type: "Hackathon",
    dateLabel: "MAR 25",
    title: "Hack the Future",
    desc: "24-hour campus hackathon focused on AI-powered sustainability ideas.",
    host: "Computer Club",
    status: "upcoming",
  },
  {
    id: 3,
    type: "Sprint",
    dateLabel: "APR 4",
    title: "UX Design Sprint",
    desc: "Collaborative sprint to reimagine the KFUPM campus app experience.",
    host: "Design Society",
    status: "upcoming",
  },
  {
    id: 4,
    type: "Seminar",
    dateLabel: "APR 12",
    title: "Cybersecurity 101",
    desc: "Industry experts share the latest in threat detection and prevention.",
    host: "Information Security Club",
    status: "upcoming",
  },
];

export default function Events() {
  const [filter, setFilter] = useState("upcoming"); // 'upcoming' | 'past'

  const filtered = sampleEvents.filter((e) =>
    filter === "all" ? true : e.status === filter
  );

  return (
    <div className="p-6 lg:p-10">
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
            {/* visual header */}
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
  );
}
