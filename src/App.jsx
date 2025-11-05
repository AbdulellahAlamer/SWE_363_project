import { useState } from "react";
import Button from "./components/Button.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  const [view, setView] = useState("login");
  const ActivePage = view === "register" ? RegisterPage : LoginPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-2xl ring-1 ring-white/60 backdrop-blur">
        <header className="flex flex-col gap-4 border-b border-slate-100 px-8 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600/80">
              KFUPM Club Hub
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Student Activities Portal
            </h1>
          </div>
          <button
            type="button"
            className="self-start text-sm font-semibold text-blue-600 transition hover:text-blue-700 lg:self-center"
            onClick={() => setView(view === "login" ? "register" : "login")}
          >
            {view === "login" ? "Register" : "Log in"}
          </button>
        </header>

        <main className="flex flex-col lg:flex-row">
          <section className="w-full px-8 py-10 lg:w-1/2 lg:px-12 lg:py-14">
            <ActivePage onNavigate={(nextView) => setView(nextView)} />
          </section>
          <aside className="flex w-full flex-col justify-between gap-10 bg-gradient-to-tr from-blue-50 via-white to-indigo-100 px-8 py-10 lg:w-1/2 lg:px-12 lg:py-14">
            {view === "login" ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold uppercase tracking-wide text-slate-900">
                  Engage with KFUPM clubs
                </h2>
                <p className="text-sm leading-relaxed text-slate-500">
                  Browse events, track attendance, and stay up to date with club
                  announcements in one place. Connect with community leaders and
                  discover opportunities tailored for you.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold uppercase tracking-wide text-slate-900">
                  Collaborate and grow
                </h2>
                <p className="text-sm leading-relaxed text-slate-500">
                  Access exclusive workshops, build project teams, and receive
                  updates tailored to your interests. Grow alongside fellow
                  students who share your passion.
                </p>
              </div>
            )}

            <div className="rounded-3xl border border-white/70 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                What&apos;s new this week?
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Explore the latest club announcements, officer spotlights, and
                volunteer calls happening around campus.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
