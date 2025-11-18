import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import Button from "../components/Button.jsx";
import EventCard from "../components/EventCardProf.jsx";
import StatCard from "../components/StatCard.jsx";
import { sampleEvents, adminClubSeeds } from "../assets/data.js";

export default function ClubProfile({ club }) {
  // Find club data from adminClubSeeds or use default
  const defaultClub = adminClubSeeds.find(c => c.id === "club-cs") || {
    name: "Computer Club",
    initials: "CS",
    category: "Technology & Innovation",
  };
  
  const c = club || defaultClub;

  const [subscribed, setSubscribed] = useState(false);

  // Filter events for this club that are open (upcoming)
  const upcoming = sampleEvents.filter(
    (e) => e.host === c.name && e.status === "open"
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Hide navigation on mobile, show on larger screens */}
      <div className="hidden md:block">
        <NavigationBar active="/clubs" />
      </div>

      <div className="w-full md:ml-64 flex-1 p-4 sm:p-6 lg:p-12">
        {/* Club Header Card - Responsive */}
        <div className="mb-6 sm:mb-10 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/60 p-4 sm:p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-100 text-lg sm:text-xl font-semibold text-blue-700 shadow-inner flex-shrink-0">
              {c.initials || c.abbr}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
                {c.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 break-words">
                {c.category || c.desc}
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant={subscribed ? "default" : "primary"}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm"
                onClick={() => setSubscribed((s) => !s)}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>

              <Button 
                variant="secondary" 
                className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm"
              >
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Section Header for Events */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Upcoming Events
          </h2>
          <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </button>
        </div>

        {/* Events Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {upcoming.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}

          {upcoming.length === 0 && (
            <p className="text-xs sm:text-sm text-slate-500 col-span-full text-center py-8">
              No upcoming events.
            </p>
          )}
        </div>

        {/* Statistics Section - Responsive */}
        {upcoming.length > 0 && (
          <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6">
            <StatCard label="Total Events" value={upcoming.length} />
            <StatCard 
              label="Workshops" 
              value={upcoming.filter(e => e.type === "Workshop").length} 
            />
            <StatCard 
              label="Hackathons" 
              value={upcoming.filter(e => e.type === "Hackathon").length} 
            />
          </div>
        )}
      </div>
    </div>
  );
}