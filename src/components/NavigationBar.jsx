import { useState } from "react";

function NavigationBar({
  fixed = true,
  active = "/",
  hidden = [],
  type = "student",
}) {
  const [open, setOpen] = useState(true);

  const containerClasses = `${
    fixed ? "fixed left-0 top-0 h-full" : "relative"
  } ${open ? "w-64" : "w-20"} bg-white text-gray-700 p-4 flex flex-col transition-all duration-200`;

  const linkClass = (href) => {
    const base = "p-3 rounded-lg transition-colors flex items-center gap-3";
    const activeClass = "bg-blue-600 text-white";
    const hoverClass = "hover:bg-blue-600 hover:text-white";
    const centerWhenCollapsed = open ? "" : "justify-center";
    return `${base} ${centerWhenCollapsed} ${active === href ? activeClass : hoverClass}`;
  };

  let links = [];
  type = type.trim().toLowerCase();
  if (type === "student") {
    links = [
      { href: "/clubs", label: "Clubs" },
      { href: "/events", label: "Events" },
      { href: "/posts", label: "Posts" },
      { href: "/my-profile", label: "My Profile" },
      { href: "/my-clubs", label: "My Clubs" },
    ];
  } else if (type === "admin") {
    links = [
      { href: "/admin", label: "Admin Console" },
      { href: "/user-management", label: "User Management" },
    ];
  } else if (type === "president") {
    links = [{ href: "/president", label: "president console" }];
  } else {
    return (
      <div className="p-4 text-red-600">
        <p className="font-semibold">Navigation unavailable</p>
        <p>Please supply a valid navigation type.</p>
      </div>
    );
  }

  const visibleLinks = links.filter((l) => !hidden.includes(l.href));

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`text-blue-600 font-bold ${open ? "text-xl" : "text-lg"}`}>
            {open ? "KFUPM" : "K"}
          </div>
        </div>

        <button
          aria-expanded={open}
          aria-label={open ? "Collapse navigation" : "Expand navigation"}
          onClick={() => setOpen((s) => !s)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          {/* simple three-line hamburger */}
          <span className="block w-5 h-0.5 bg-gray-600 mb-1 rotate-0 transition-transform" />
          <span className="block w-5 h-0.5 bg-gray-600 mb-1 transition-transform" />
          <span className="block w-5 h-0.5 bg-gray-600 transition-transform" />
        </button>
      </div>

      <nav className="flex flex-col space-y-4 grow">
        {visibleLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={linkClass(link.href)}
            aria-label={link.label}
            title={link.label}
          >
            {/* when collapsed show an initial badge, otherwise full label */}
            {!open ? (
              <span className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-semibold select-none">
                {link.label.charAt(0)}
              </span>
            ) : (
              <>{link.label}</>
            )}
          </a>
        ))}
      </nav>

      <button
        onClick={() => (window.location.href = "/login")}
        className={`mt-auto w-full border border-red-600 text-red-600 font-medium py-3 px-4 rounded-lg hover:bg-red-100 transition-colors ${
          open ? "" : "flex items-center justify-center"
        }`}
      >
        {open ? "Log Out" : "⎋"}
      </button>
    </div>
  );
}

export default NavigationBar;