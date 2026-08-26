import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ui/ThemeToggle";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/properties/new", label: "Add Property" },
  { to: "/admin/change-password", label: "Change Password" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="font-admin min-h-screen bg-surface-alt">
      <header className="border-b border-edge bg-ink text-paper">
        <div className="container-wide flex h-16 items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="10" fill="#f4f1e6" />
              <path d="M32 14 L48 46 H40.5 L37.2 39 H26.8 L23.5 46 H16 Z M32 24.5 L27.6 33.5 H36.4 Z" fill="#12211d" />
            </svg>
            <span className="font-admin font-semibold text-base">Avatar Realty — Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-paper/60 hover:text-paper">View live site ↗</Link>
            <span className="hidden text-xs text-paper/60 sm:inline">{admin?.email}</span>
            <ThemeToggle className="text-paper/70 hover:bg-paper/10 hover:text-paper" />
            <button
              type="button"
              onClick={handleLogout}
              className="border border-paper/25 px-3 py-1.5 text-xs text-paper transition-colors hover:border-paper"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-wide grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-emerald-900 text-paper"
                    : "border border-edge bg-surface text-content-muted hover:text-content"
                }`
              }
            >
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
