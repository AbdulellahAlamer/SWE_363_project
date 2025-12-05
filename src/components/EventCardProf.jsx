import Button from "./Button.jsx";

export default function EventCard({ event }) {
  return (
    <article className="rounded-xl bg-white p-4 sm:p-5 shadow-md ring-1 ring-white/60">
      {event.imageData || event.imageURL ? (
        <img
          src={event.imageData || event.imageURL}
          alt={event.title}
          className="h-24 sm:h-28 mb-3 sm:mb-4 rounded-md w-full object-cover"
        />
      ) : (
        <div className="h-24 sm:h-28 mb-3 sm:mb-4 rounded-md bg-linear-to-r from-sky-200 to-indigo-100" />
      )}

      <div className="mb-3">
        <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
          {event.type} ·{" "}
          {new Date(event.date)
            .toLocaleDateString("en-US", { month: "short", day: "numeric" })
            .toUpperCase()}
        </span>
      </div>

      <h3 className="text-sm sm:text-md font-semibold text-slate-900 mb-2">
        {event.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 line-clamp-2">
        {event.description}
      </p>

      <div className="text-xs text-slate-500 mb-3 sm:mb-4">
        <div className="uppercase tracking-wide text-[10px] sm:text-[11px]">
          Hosted by
        </div>
        <div className="font-medium text-slate-800 text-xs sm:text-sm">
          {event.host}
        </div>
      </div>

      <Button
        variant="secondary"
        className="text-xs sm:text-sm w-full sm:w-max px-3 py-1.5"
        onClick={() => alert(`Registered for ${event.title}`)}
      >
        Register
      </Button>
    </article>
  );
}
