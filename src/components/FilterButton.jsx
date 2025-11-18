import React from "react";

export default function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
        active 
          ? "bg-blue-100 text-blue-700" 
          : "bg-white/60 text-slate-600 hover:bg-white/80"
      }`}
    >
      {label}
    </button>
  );
}