import React from "react";

export default function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 sm:p-6 shadow-md ring-1 ring-white/60 text-center">
      <p className="text-xs sm:text-sm text-slate-600 mb-1 sm:mb-2">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}