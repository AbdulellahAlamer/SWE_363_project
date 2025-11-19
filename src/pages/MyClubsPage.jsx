// ...existing code...
import { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/Button";
import { adminClubSeeds, profileJoinedClubs } from "../assets/data";

export default function MyClubsPage() {
  const joinedNames = profileJoinedClubs.map((j) => j.name);
  const initialClubs = adminClubSeeds.filter((c) => joinedNames.includes(c.name));

  // include any joined clubs not present in adminClubSeeds as minimal records
  const missing = joinedNames
    .filter((n) => !initialClubs.find((c) => c.name === n))
    .map((name, idx) => {
      const initials = name
        .split(" ")
        .map((s) => s.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return {
        id: `joined-fallback-${idx}`,
        name,
        initials,
        category: "Member",
        president: "TBD",
        members: "-",
        status: "active",
      };
    });

  const [clubs, setClubs] = useState([...initialClubs, ...missing]);

  const handleUnsubscribe = (id) => {
    setClubs((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex">
      <NavigationBar active="/my-clubs" type="student" />

      <main className="ml-64 flex-1 min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Joined Clubs</h1>
              <p className="text-sm text-slate-500 mt-1">{clubs.length} clubs</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary">Manage memberships</Button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <article
                key={club.id}
                className="card bg-white rounded-2xl p-4 shadow-sm flex flex-col border border-gray-100"
              >
                <div className="h-28 rounded-lg bg-gradient-to-br from-blue-50 to-white mb-4" />

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {club.initials}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900">{club.name}</h2>
                    <div className="text-sm text-slate-500 mt-1">
                      {club.category} · {club.members} members
                    </div>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-3">
                      {club.description ||
                        "Access club events, resources and connect with members."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={`/clubs/${club.id}`}
                    className="flex-1"
                    aria-label={`Open ${club.name} events`}
                  >
                    <Button variant="outline" className="w-full">
                      Events
                    </Button>
                  </a>

                  <Button
                    variant="ghost"
                    className="w-32"
                    onClick={() => handleUnsubscribe(club.id)}
                  >
                    Unsubscribe
                  </Button>
                </div>

              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
