function NavigationBar({
  fixed = true,
  active = "/",
  hidden = [],
  type = "student",
}) {
  const containerClasses = `${
    fixed ? "fixed left-0 top-0 h-full" : "relative"
  } w-64 bg-white text-gray-700 p-4 flex flex-col`;

  const linkClass = (href) => {
    const base = "p-3 rounded-lg transition-colors";
    const activeClass = "bg-blue-600 text-white";
    const hoverClass = "hover:bg-blue-600 hover:text-white";
    return `${base} ${active === href ? activeClass : hoverClass}`;
  };
  let links = [];
  type = type.trim().toLowerCase();
  if (type === "student") {
    links = [
      { href: "/clubs", label: "Clubs" },
      { href: "/events", label: "Events" },
      { href: "/posts", label: "Posts" },
      { href: "/profile", label: "My Profile" },
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

export default NavigationBar;
