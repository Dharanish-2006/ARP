import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ui/ThemeToggle";

const LINKS = [
  {
    to: "/admin",
    label: "Dashboard",
    end: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="12" width="8" height="9" rx="1.5" />
        <rect x="3" y="14" width="8" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: "/admin/properties/new",
    label: "Add Property",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    to: "/admin/change-password",
    label: "Change Password",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="5" y="11" width="14" height="9" rx="1.5" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="font-admin min-h-screen bg-surface-alt">
      <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink text-paper">
        <div className="container-wide flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavOpen((o) => !o)}
              aria-label="Toggle navigation"
              className="flex h-9 w-9 items-center justify-center rounded-md text-paper/70 hover:bg-paper/10 hover:text-paper lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/admin" className="flex items-center gap-2.5">
              <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="10" fill="#f4f1e6" />
                <path d="M32 14 L48 46 H40.5 L37.2 39 H26.8 L23.5 46 H16 Z M32 24.5 L27.6 33.5 H36.4 Z" fill="#12211d" />
              </svg>
              <span className="font-admin text-base font-semibold tracking-tight">
                Avatar Realty <span className="text-brass-400">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden items-center gap-1 text-xs text-paper/60 hover:text-paper sm:inline-flex"
            >
              View live site
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </Link>
            <span className="hidden max-w-[160px] truncate text-xs text-paper/60 md:inline">{admin?.email}</span>
            <ThemeToggle className="text-paper/70 hover:bg-paper/10 hover:text-paper" />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-paper/25 px-3.5 py-1.5 text-xs font-medium text-paper transition-colors hover:border-paper hover:bg-paper/5"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-wide grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <nav
          className={`${navOpen ? "flex" : "hidden"} flex-col gap-1.5 lg:flex lg:sticky lg:top-24 lg:self-start`}
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-900 text-paper"
                    : "border border-edge bg-surface text-content-muted hover:border-emerald-700/40 hover:text-content"
                }`
              }
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
