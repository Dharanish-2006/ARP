import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";
import StatusTag from "../../components/ui/StatusTag";
import { formatPrice, formatLocation } from "../../data/properties";
import { useProperties } from "../../context/PropertyContext";
import { ApiError } from "../../lib/api";

export default function AdminDashboard() {
  const { properties, loading, error, refresh, deleteProperty } = useProperties();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const filtered = useMemo(() => {
    if (!query) return properties;
    const q = query.toLowerCase();
    return properties.filter((p) => `${p.title} ${p.location?.city}`.toLowerCase().includes(q));
  }, [properties, query]);

  const stats = useMemo(
    () => ({
      total: properties.length,
      forSale: properties.filter((p) => p.status === "For Sale").length,
      forLease: properties.filter((p) => p.status === "For Lease").length,
      featured: properties.filter((p) => p.featured).length,
    }),
    [properties]
  );

  const confirmDelete = async (id) => {
    setDeleting(id);
    setDeleteError("");
    try {
      await deleteProperty(id);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Could not delete this property.");
    } finally {
      setDeleting(null);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <SEO title="Admin Dashboard" description="Manage Avatar Realty Group property listings." />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-admin text-2xl font-semibold text-content">Property listings</h1>
          <p className="mt-1 text-sm text-content-muted">
            Data lives in Neon Postgres — changes here update the public site immediately.
          </p>
        </div>
        <Button to="/admin/properties/new" variant="primary">
          + Add new property
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total listings", value: stats.total },
          { label: "For sale", value: stats.forSale },
          { label: "For lease", value: stats.forLease },
          { label: "Featured", value: stats.featured },
        ].map((s) => (
          <div key={s.label} className="border border-edge bg-surface p-4">
            <p className="font-mono text-2xl text-content">{s.value}</p>
            <p className="mt-1 text-xs text-content-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by title or city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xs border border-edge bg-surface px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
        />
      </div>

      {deleteError && (
        <p className="mt-4 border border-[#c0453a]/30 bg-[#c0453a]/5 px-4 py-3 text-sm text-[#c0453a]">
          {deleteError}
        </p>
      )}

      {loading ? (
        <div className="mt-5 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse border border-edge bg-surface" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-5 border border-[#c0453a]/30 bg-[#c0453a]/5 px-8 py-14 text-center">
          <p className="font-admin font-semibold text-content">Couldn't reach the database</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-content-muted">{error}</p>
          <Button variant="outline" size="sm" onClick={refresh} className="mt-6">
            Try again
          </Button>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto border border-edge bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-edge bg-surface-alt text-xs uppercase tracking-wide text-content-muted">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-edge last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="h-11 w-14 shrink-0 object-cover" />
                      ) : (
                        <div className="flex h-11 w-14 shrink-0 items-center justify-center bg-surface-alt text-content-muted">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 10.5 12 3l9 7.5" />
                            <path d="M5 9.5V21h14V9.5" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-content">{p.title}</p>
                        <p className="text-xs text-content-muted">{p.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-content-muted">{formatLocation(p) || "—"}</td>
                  <td className="px-4 py-3 font-mono text-content">{formatPrice(p)}</td>
                  <td className="px-4 py-3"><StatusTag status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/properties/${p.slug}`}
                        target="_blank"
                        className="px-2.5 py-1.5 text-xs text-content-muted hover:text-content"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/properties/${p.id}/edit`}
                        className="border border-edge px-2.5 py-1.5 text-xs text-content hover:border-emerald-700"
                      >
                        Edit
                      </Link>
                      {pendingDelete === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => confirmDelete(p.id)}
                            disabled={deleting === p.id}
                            className="bg-[#8c2f24] px-2.5 py-1.5 text-xs text-paper disabled:opacity-60"
                          >
                            {deleting === p.id ? "Deleting…" : "Confirm"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(null)}
                            className="px-2 py-1.5 text-xs text-content-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingDelete(p.id)}
                          className="border border-edge px-2.5 py-1.5 text-xs text-[#8c2f24] hover:border-[#8c2f24]"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-content-muted">
                    {properties.length === 0
                      ? "No properties yet — add your first listing to get started."
                      : `No properties match "${query}".`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
