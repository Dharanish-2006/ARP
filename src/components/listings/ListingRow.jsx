import { Link } from "react-router-dom";
import StatusTag from "../ui/StatusTag";
import { formatPrice, formatLocation } from "../../data/properties";

function buildSpecs(p) {
  const homeSpecs = [
    p.beds != null && { label: "Bedrooms", value: p.beds },
    p.baths != null && { label: "Bathrooms", value: p.baths },
    p.areaSqft != null && { label: "Living Area", value: `${p.areaSqft.toLocaleString()} sqft` },
    p.lotSqft != null && { label: "Lot Size", value: `${p.lotSqft.toLocaleString()} sqft` },
    p.yearBuilt && { label: "Year Built", value: p.yearBuilt },
  ].filter(Boolean);
  const customSpecs = (p.customFields || [])
    .filter((f) => f.key && f.value)
    .map((f) => ({ label: f.key, value: f.value }));

  return [...homeSpecs, ...customSpecs];
}

export default function ListingRow({ property }) {
  const specs = buildSpecs(property);
  const detailHref = property.slug ? `/properties/${property.slug}` : "#";

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-edge bg-surface transition-shadow duration-200 hover:shadow-lg sm:flex-row">
      <Link to={detailHref} className="block h-56 shrink-0 overflow-hidden bg-surface-alt sm:h-auto sm:w-[300px]">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-content-muted">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:flex-row sm:p-6">
        <div className="min-w-0 flex-1">
          <Link
            to={detailHref}
            className="block font-display text-xl leading-snug text-brass-600 transition-colors hover:text-brass-500 sm:text-2xl"
          >
            {property.title}
          </Link>
          <p className="mt-1 text-sm text-content-muted">
            {[formatLocation(property), property.type].filter(Boolean).join(" · ")}
          </p>

          {specs.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-edge pt-4 text-sm sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-2 sm:block">
                  <dt className="text-content-muted">{s.label}:</dt>
                  <dd className="font-medium text-content sm:mt-0.5">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-edge pt-4 sm:w-44 sm:flex-col sm:items-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 sm:text-right">
          <div className="flex flex-col gap-2 sm:items-end">
            <StatusTag status={property.status} />
            <p className="font-mono text-xl font-semibold text-content">{formatPrice(property)}</p>
          </div>
          <Link
            to={detailHref}
            className="inline-flex items-center justify-center rounded-full bg-brass-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brass-400"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}