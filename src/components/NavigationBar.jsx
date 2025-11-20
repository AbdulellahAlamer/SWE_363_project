import { useState } from "react";

function NavigationBar({
  fixed = true,
  active = "/",
  hidden = [],
  type = "student",
}) {
  const [open, setOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerClasses = `${
    fixed ? "fixed left-0 top-0 h-full" : "relative"
  } ${open ? "w-64" : "w-20"} bg-white text-gray-700 p-4 flex-col transition-all duration-200 hidden md:flex`;

  const linkClass = (href, collapsed = !open) => {
    const base = "p-3 rounded-lg transition-colors flex items-center gap-3";
    const activeClass = "bg-blue-600 text-white";
    const hoverClass = "hover:bg-blue-600 hover:text-white";
    const centerWhenCollapsed = collapsed ? "justify-center" : "";
    return `${base} ${centerWhenCollapsed} ${
      active === href ? activeClass : hoverClass
    }`;
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
  const brandLabel = "KFUPM";

  const renderLinks = ({ collapsed = false, onNavigate } = {}) =>
    visibleLinks.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className={linkClass(link.href, collapsed)}
        aria-label={link.label}
        title={link.label}
        onClick={onNavigate}
      >
        {collapsed ? (
          <span className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-semibold select-none">
            {link.label.charAt(0)}
          </span>
        ) : (
          link.label
        )}
      </a>
    ));

  const logoutButton = ({ collapsed = false, className = "" } = {}) => (
    <button
      onClick={() => (window.location.href = "/login")}
      className={`mt-auto w-full border border-red-600 text-red-600 font-medium py-3 px-4 rounded-lg hover:bg-red-100 transition-colors ${
        collapsed ? "flex items-center justify-center" : ""
      } ${className}`}
    >
      {collapsed ? "⎋" : "Log Out"}
    </button>
  );

  return (
    <>
      {/* Mobile header and drawer */}
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-lg font-bold text-blue-600">{brandLabel}</span>
            <button
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-slate-100 transition"
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="space-y-1">
                <span
                  className={`block h-0.5 w-6 bg-gray-700 transition-transform ${
                    mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-gray-700 transition ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-gray-700 transition-transform ${
                    mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 bottom-0 left-0 z-40 w-64 bg-white shadow-xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-blue-600">{brandLabel}</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>
              <nav className="flex flex-col space-y-4">{renderLinks()}</nav>
              {logoutButton({ className: "mt-6" })}
            </div>
          </>
        )}
      </div>

      {/* Desktop navigation */}
      <aside className={containerClasses}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`text-blue-600 font-bold ${open ? "text-xl" : "text-lg"}`}>
              {open ? brandLabel : brandLabel.charAt(0)}
            </div>
          </div>

          <button
            aria-expanded={open}
            aria-label={open ? "Collapse navigation" : "Expand navigation"}
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <span
              aria-hidden="true"
              className="text-xl font-semibold text-gray-600 leading-none"
            >
              {open ? "«" : "»"}
            </span>
          </button>
        </div>

        <nav className="flex flex-col space-y-4 grow">
          {renderLinks({ collapsed: !open })}
        </nav>

        {logoutButton({ collapsed: !open })}
      </aside>
    </>
  );
}

export default NavigationBar;
