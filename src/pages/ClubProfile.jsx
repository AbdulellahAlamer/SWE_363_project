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

function Button({ variant = "primary", className = "", children, ...props }) {
  const baseStyle = "rounded-lg font-semibold transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    default: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    secondary: "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const sampleEvents = [
  {
    id: 1,
    type: "Workshop",
    dateLabel: "MAR 22",
    title: "Intro to Robotics",
    desc: "Hands-on session building autonomous robots using Arduino kits.",
    host: "Computer Club",
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

export default function ClubProfile({ club }) {
  const defaultClub = {
    name: "Computer Club",
    abbr: "CS",
    desc: "Leading KFUPM students into the future of software and AI.",
  };
  const c = club || defaultClub;

  const [subscribed, setSubscribed] = useState(false);

  const upcoming = sampleEvents.filter(
    (e) => e.host === c.name && e.status === "upcoming"
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar active="/clubs" />
      
      <div className="ml-64 flex-1 p-8 lg:p-12">
        {/* club header */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/60 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700 shadow-inner">
              {c.abbr}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{c.name}</h1>
              <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant={subscribed ? "default" : "primary"}
                className="px-4 py-2 text-sm"
                onClick={() => setSubscribed((s) => !s)}
                aria-pressed={subscribed}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>

              <Button variant="secondary" className="px-3 py-2 text-sm">
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* upcoming events header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Upcoming Events
          </h2>
          <a href="#" className="text-sm text-blue-600">
            View all
          </a>
        </div>

        {/* events grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcoming.map((ev) => (
            <article
              key={ev.id}
              className="rounded-xl bg-white p-5 shadow-md ring-1 ring-white/60"
            >
              <div className="h-28 mb-4 rounded-md bg-gradient-to-r from-sky-200 to-indigo-100" />

              <div className="mb-3">
                <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  {ev.type} · {ev.dateLabel}
                </span>
              </div>

              <h3 className="text-md font-semibold text-slate-900 mb-2">
                {ev.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{ev.desc}</p>

              <div className="text-xs text-slate-500 mb-4">
                <div className="uppercase tracking-wide text-[11px]">
                  Hosted by
                </div>
                <div className="font-medium text-slate-800">{ev.host}</div>
              </div>

              <div>
                <Button
                  variant="secondary"
                  className="text-sm w-max px-3 py-1.5"
                  onClick={() => alert(`Registered for ${ev.title}`)}
                >
                  Register
                </Button>
              </div>
            </article>
          ))}

          {upcoming.length === 0 && (
            <p className="text-sm text-slate-500 col-span-full">
              No upcoming events.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}