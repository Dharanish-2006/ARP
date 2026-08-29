import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import PropertyGallery from "../components/property/PropertyGallery";
import StatusTag from "../components/ui/StatusTag";
import Button from "../components/ui/Button";
import { formatPrice, formatLocation } from "../data/properties";
import { api, ApiError } from "../lib/api";

function Spec({ label, value }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex flex-col items-center gap-1 border border-edge bg-surface-alt px-4 py-4 text-center sm:px-6">
      <span className="font-mono text-xl font-semibold text-content sm:text-2xl">{value}</span>
      <span className="eyebrow text-content-muted">{label}</span>
    </div>
  );
}

function EnquiryForm({ propertyId }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("submitting");
    try {
      await api.post("/enquiries", { ...form, propertyId });
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  };

  if (status === "submitted") {
    return (
      <div className="border border-edge bg-surface-alt p-6 text-center">
        <p className="font-display text-lg text-content">Thank you!</p>
        <p className="mt-1 text-sm text-content-muted">
          Your enquiry has been received — we'll be in touch shortly.
        </p>
      </div>
    );
  }

  const fieldClasses =
    "w-full border border-edge bg-surface px-3.5 py-2.5 text-sm text-content focus:border-emerald-700 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" placeholder="Your name" required value={form.name} onChange={handleChange} className={fieldClasses} />
      <input name="email" type="email" placeholder="Email address" required value={form.email} onChange={handleChange} className={fieldClasses} />
      <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className={fieldClasses} />
      <textarea
        name="message"
        rows={4}
        placeholder="I'd like to know more about this property…"
        value={form.message}
        onChange={handleChange}
        className={fieldClasses}
      />
      {status === "error" && <p className="text-sm text-[#c0453a]">Something went wrong — please try again.</p>}
      <Button type="submit" variant="primary" disabled={status === "submitting"} className="w-full">
        {status === "submitting" ? "Sending…" : "Request info"}
      </Button>
    </form>
  );
}

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get(`/properties/${slug}`)
      .then(({ property }) => {
        if (!cancelled) setProperty(property);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Could not load this property.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-wide py-16">
        <div className="h-[380px] animate-pulse border border-edge bg-surface-alt sm:h-[440px]" />
        <div className="mt-6 h-8 w-2/3 animate-pulse bg-surface-alt" />
        <div className="mt-3 h-5 w-1/3 animate-pulse bg-surface-alt" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-display text-2xl text-content">Property not found</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-content-muted">
          {error || "This listing may have been sold or removed."}
        </p>
        <Button to="/" variant="outline" className="mt-6">
          Back to listings
        </Button>
      </div>
    );
  }

  const specs = [
    property.beds != null && { label: "Bedrooms", value: property.beds },
    property.baths != null && { label: "Bathrooms", value: property.baths },
    property.areaSqft != null && { label: "Living Area", value: `${property.areaSqft.toLocaleString()} sqft` },
    property.lotSqft != null && { label: "Lot Size", value: `${property.lotSqft.toLocaleString()} sqft` },
    property.yearBuilt && { label: "Year Built", value: property.yearBuilt },
  ].filter(Boolean);

  return (
    <>
      <SEO
        title={property.title}
        description={property.description?.slice(0, 155) || `${property.title} — ${formatLocation(property)}`}
        path={`/properties/${property.slug}`}
      />

      <div className="container-wide py-8 sm:py-12">
        <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to listings
        </Link>

        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <PropertyGallery images={property.images} title={property.title} />

            <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  
                  <span className="text-sm text-content-muted">{property.type}</span>
                </div>
                <h1 className="mt-2 font-display text-3xl leading-tight text-content sm:text-4xl">{property.title}</h1>
                <p className="mt-1.5 text-content-muted">{formatLocation(property) || "Location on request"}</p>
              </div>
              <p className="font-mono font-semibold text-brass-600 ">{formatPrice(property)}</p>
            </div>

            {specs.length > 0 && (
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {specs.map((s) => (
                  <Spec key={s.label} {...s} />
                ))}
              </div>
            )}

            {property.description && (
              <div className="mt-9">
                <h2 className="font-display text-xl text-content">About this property</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-content-muted">{property.description}</p>
              </div>
            )}

            {property.features?.length > 0 && (
              <div className="mt-9">
                <h2 className="font-display text-xl text-content">Features</h2>
                <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {property.features.map((f, i) => (
                    <li key={f + i} className="flex items-start gap-2 text-sm text-content-muted">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mt-0.5 shrink-0 text-emerald-700"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {property.customFields?.length > 0 && (
              <div className="mt-9">
                <h2 className="font-display text-xl text-content">Additional details</h2>
                <dl className="mt-3 grid gap-x-6 gap-y-2.5 border-t border-edge pt-4 sm:grid-cols-2">
                  {property.customFields.map((f, i) => (
                    <div
                      key={f.key + i}
                      className="flex items-baseline justify-between gap-3 border-b border-edge/60 pb-2 text-sm"
                    >
                      <dt className="text-content-muted">{f.key}</dt>
                      <dd className="font-medium text-content">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-edge bg-surface p-6">
              {(property.agent?.name || property.agent?.phone || property.agent?.email) && (
                <div className="mb-6 border-b border-edge pb-5">
                  <p className="eyebrow text-content-muted">Listing agent</p>
                  {property.agent?.name && (
                    <p className="mt-1.5 font-display text-lg text-content">{property.agent.name}</p>
                  )}
                  {property.agent?.phone && (
                    <a href={`tel:${property.agent.phone}`} className="mt-1 block text-sm text-content-muted hover:text-content">
                      {property.agent.phone}
                    </a>
                  )}
                  {property.agent?.email && (
                    <a href={`mailto:${property.agent.email}`} className="block text-sm text-content-muted hover:text-content">
                      {property.agent.email}
                    </a>
                  )}
                </div>
              )}
              <p className="eyebrow text-content-muted">Interested?</p>
              <p className="mt-1.5 mb-4 text-sm text-content-muted">
                Send an enquiry and we'll be in touch about this property.
              </p>
              <EnquiryForm propertyId={property.id} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}