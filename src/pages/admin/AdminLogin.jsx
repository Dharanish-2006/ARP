import { useState } from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/admin"} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Secure login for Avatar Realty Group staff." />
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="10" fill="#f4f1e6" />
              <path d="M32 14 L48 46 H40.5 L37.2 39 H26.8 L23.5 46 H16 Z M32 24.5 L27.6 33.5 H36.4 Z" fill="#12211d" />
            </svg>
            <span className="font-display text-lg text-paper">Avatar Realty Group</span>
          </Link>

          <div className="border border-paper/15 bg-ink-soft p-8">
            <h1 className="font-display text-2xl text-paper">Agent &amp; admin sign in</h1>
            <p className="mt-2 text-sm text-paper/60">Manage listings, images, and property details.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs uppercase tracking-wide text-paper/60">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-paper/20 bg-transparent px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/30 focus:border-brass-400 focus:outline-none"
                  placeholder="you@avatarrealtygroup.com"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs uppercase tracking-wide text-paper/60">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-paper/20 bg-transparent px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/30 focus:border-brass-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-sm text-[#e59a8a]">{error}</p>}
              <Button type="submit" variant="brass" disabled={submitting} className="w-full">
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
