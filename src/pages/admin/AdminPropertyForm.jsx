import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";
import ImageDropzone from "../../components/admin/ImageDropzone";
import { PROPERTY_TYPES, STATUSES } from "../../data/properties";
import { useProperties } from "../../context/PropertyContext";
import { ApiError } from "../../lib/api";

const EMPTY_FORM = {
  title: "",
  type: "",
  status: "",
  price: "",
  priceUnit: "sale",
  featured: false,
  neighborhood: "",
  city: "",
  state: "",
  beds: "",
  baths: "",
  areaSqft: "",
  lotSqft: "",
  yearBuilt: "",
  description: "",
  features: [],
  images: [],
  customFields: [],
  agentName: "",
  agentPhone: "",
  agentEmail: "",
};

const inputClasses =
  "w-full border border-edge bg-surface px-3.5 py-2.5 text-sm text-content focus:border-emerald-700 focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-content-muted";

function propertyToForm(p) {
  return {
    title: p.title || "",
    type: p.type || "",
    status: p.status || "",
    price: p.price ?? "",
    priceUnit: p.priceUnit || "sale",
    featured: Boolean(p.featured),
    neighborhood: p.location?.neighborhood || "",
    city: p.location?.city || "",
    state: p.location?.state || "",
    beds: p.beds ?? "",
    baths: p.baths ?? "",
    areaSqft: p.areaSqft ?? "",
    lotSqft: p.lotSqft ?? "",
    yearBuilt: p.yearBuilt ?? "",
    description: p.description || "",
    features: p.features || [],
    images: p.images || [],
    customFields: p.customFields || [],
    agentName: p.agent?.name || "",
    agentPhone: p.agent?.phone || "",
    agentEmail: p.agent?.email || "",
  };
}

function formToProperty(form) {
  const num = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
  return {
    title: form.title,
    type: form.type,
    status: form.status,
    price: num(form.price),
    priceUnit: form.priceUnit,
    featured: form.featured,
    location: { neighborhood: form.neighborhood, city: form.city, state: form.state },
    beds: num(form.beds),
    baths: num(form.baths),
    areaSqft: num(form.areaSqft),
    lotSqft: num(form.lotSqft),
    yearBuilt: num(form.yearBuilt),
    description: form.description,
    features: form.features,
    images: form.images,
    customFields: form.customFields,
    agent: { name: form.agentName, phone: form.agentPhone, email: form.agentEmail },
  };
}

export default function AdminPropertyForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { properties, loading: propertiesLoading, addProperty, updateProperty } = useProperties();

  const [form, setForm] = useState(EMPTY_FORM);
  const [featureDraft, setFeatureDraft] = useState("");
  const [imageDraft, setImageDraft] = useState("");
  const [imageError, setImageError] = useState("");
  const [customDraft, setCustomDraft] = useState({ key: "", value: "" });
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setForm(EMPTY_FORM);
      return;
    }
    if (propertiesLoading) return;
    const existing = properties.find((p) => p.id === id);
    if (existing) setForm(propertyToForm(existing));
    else setNotFound(true);
  }, [id, isEditing, properties, propertiesLoading]);

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const addFeature = () => {
    if (!featureDraft.trim()) return;
    setForm((f) => ({ ...f, features: [...f.features, featureDraft.trim()] }));
    setFeatureDraft("");
  };
  const removeFeature = (i) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const addImage = () => {
    if (!imageDraft.trim()) return;
    setForm((f) => ({ ...f, images: [...f.images, imageDraft.trim()] }));
    setImageDraft("");
  };
  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const addCustomField = () => {
    if (!customDraft.key.trim()) return;
    setForm((f) => ({
      ...f,
      customFields: [...f.customFields, { key: customDraft.key.trim(), value: customDraft.value.trim() }],
    }));
    setCustomDraft({ key: "", value: "" });
  };
  const removeCustomField = (i) =>
    setForm((f) => ({ ...f, customFields: f.customFields.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const payload = formToProperty(form);
      if (isEditing) await updateProperty(id, payload);
      else await addProperty(payload);
      navigate("/admin");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Could not save this property.");
    } finally {
      setSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="border border-edge bg-surface p-8 text-center">
        <p className="text-content-muted">That property no longer exists.</p>
        <Button to="/admin" variant="outline" className="mt-4">Back to dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <SEO title={isEditing ? "Edit Property" : "Add Property"} description="Manage Avatar Realty Group listing details." />

      <h1 className="font-admin text-2xl font-semibold text-content">
        {isEditing ? "Edit property" : "Add new property"}
      </h1>
      <p className="mt-1 text-sm text-content-muted">
        Type and status are free text — enter whatever fits this listing, or pick a common value from
        the suggestions. Use "Custom fields" below for anything not covered by the standard fields.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-10">
        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Basics</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClasses} htmlFor="title">Property title</label>
              <input id="title" required value={form.title} onChange={set("title")} className={inputClasses} placeholder="e.g. Havenwood Modern Estate" />
            </div>
            <div>
              <label className={labelClasses} htmlFor="type">Property type</label>
              <input
                id="type"
                list="type-suggestions"
                required
                value={form.type}
                onChange={set("type")}
                className={inputClasses}
                placeholder="e.g. Single Family Home, Farmhouse, Cabin…"
              />
              <datalist id="type-suggestions">
                {PROPERTY_TYPES.map((t) => <option key={t} value={t} />)}
              </datalist>
            </div>
            <div>
              <label className={labelClasses} htmlFor="status">Availability / status</label>
              <input
                id="status"
                list="status-suggestions"
                required
                value={form.status}
                onChange={set("status")}
                className={inputClasses}
                placeholder="e.g. For Sale, Coming Soon…"
              />
              <datalist id="status-suggestions">
                {STATUSES.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className={labelClasses} htmlFor="price">Price (USD)</label>
              <input id="price" type="number" min="0" value={form.price} onChange={set("price")} className={inputClasses} placeholder="685000" />
            </div>
            <div>
              <label className={labelClasses} htmlFor="priceUnit">Price type</label>
              <select id="priceUnit" value={form.priceUnit} onChange={set("priceUnit")} className={inputClasses}>
                <option value="sale">Sale price</option>
                <option value="lease">Monthly lease</option>
              </select>
            </div>
            <label className="flex items-center gap-2.5 sm:col-span-2">
              <input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4" />
              <span className="text-sm text-content-muted">Show as a featured property on the homepage</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Location</legend>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClasses} htmlFor="neighborhood">Neighborhood</label>
              <input id="neighborhood" value={form.neighborhood} onChange={set("neighborhood")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="city">City</label>
              <input id="city" required value={form.city} onChange={set("city")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="state">State</label>
              <input id="state" value={form.state} onChange={set("state")} className={inputClasses} maxLength={2} />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Specifications</legend>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClasses} htmlFor="beds">Bedrooms</label>
              <input id="beds" type="number" min="0" value={form.beds} onChange={set("beds")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="baths">Bathrooms</label>
              <input id="baths" type="number" min="0" step="0.5" value={form.baths} onChange={set("baths")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="yearBuilt">Year built</label>
              <input id="yearBuilt" type="number" value={form.yearBuilt} onChange={set("yearBuilt")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="areaSqft">Living area (sqft)</label>
              <input id="areaSqft" type="number" min="0" value={form.areaSqft} onChange={set("areaSqft")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="lotSqft">Lot size (sqft)</label>
              <input id="lotSqft" type="number" min="0" value={form.lotSqft} onChange={set("lotSqft")} className={inputClasses} />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Description</legend>
          <textarea
            rows={5}
            value={form.description}
            onChange={set("description")}
            className={inputClasses}
            placeholder="Full property description shown on the detail page…"
          />
        </fieldset>

        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Features</legend>
          <div className="flex gap-2">
            <input
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              placeholder="e.g. Chef's kitchen with dual islands"
              className={inputClasses}
            />
            <Button type="button" variant="outline" onClick={addFeature}>Add</Button>
          </div>
          {form.features.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {form.features.map((f, i) => (
                <li key={f + i} className="flex items-center gap-2 border border-edge bg-surface-alt px-3 py-1.5 text-xs text-content">
                  {f}
                  <button type="button" onClick={() => removeFeature(i)} aria-label={`Remove ${f}`} className="text-content-muted hover:text-[#8c2f24]">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Custom fields</legend>
          <p className="text-xs text-content-muted">
            Add any attribute that doesn't fit the fields above — HOA dues, school district, parcel
            ID, virtual tour link, whatever this listing needs. Shown on the property page as
            "Additional details".
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={customDraft.key}
              onChange={(e) => setCustomDraft((d) => ({ ...d, key: e.target.value }))}
              placeholder="Field name, e.g. HOA Dues"
              className={`${inputClasses} flex-1 min-w-[160px]`}
            />
            <input
              value={customDraft.value}
              onChange={(e) => setCustomDraft((d) => ({ ...d, value: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomField(); } }}
              placeholder="Value, e.g. $145/month"
              className={`${inputClasses} flex-1 min-w-[160px]`}
            />
            <Button type="button" variant="outline" onClick={addCustomField}>Add field</Button>
          </div>
          {form.customFields.length > 0 && (
            <ul className="mt-4 space-y-2">
              {form.customFields.map((f, i) => (
                <li
                  key={f.key + i}
                  className="flex items-center justify-between gap-3 border border-edge bg-surface-alt px-3 py-2 text-sm"
                >
                  <span className="text-content">
                    <span className="font-medium">{f.key}:</span>{" "}
                    <span className="text-content-muted">{f.value}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomField(i)}
                    aria-label={`Remove ${f.key}`}
                    className="text-content-muted hover:text-[#8c2f24]"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Images</legend>
          <p className="text-xs text-content-muted">
            Drag photos in, or click to choose from your device — they upload straight to
            Cloudinary. You can also paste an image URL directly if you already have one hosted.
          </p>
          <div className="mt-3">
            <ImageDropzone
              onUploaded={(url) => {
                setImageError("");
                setForm((f) => ({ ...f, images: [...f.images, url] }));
              }}
              onError={(msg) => setImageError(msg)}
            />
          </div>
          {imageError && (
            <p className="mt-2 border border-[#c0453a]/30 bg-[#c0453a]/5 px-3 py-2 text-xs text-[#c0453a]">
              {imageError}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={imageDraft}
              onChange={(e) => setImageDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
              placeholder="…or paste an already-hosted image URL"
              className={`${inputClasses} flex-1 min-w-[200px]`}
            />
            <Button type="button" variant="outline" onClick={addImage}>Add URL</Button>
          </div>
          {form.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.images.map((src, i) => (
                <div key={src + i} className="group relative aspect-[4/3] overflow-hidden border border-edge">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 bg-ink/80 px-1.5 py-0.5 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset className="border border-edge bg-surface p-6">
          <legend className="px-2 font-admin text-lg font-semibold text-content">Listing agent</legend>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClasses} htmlFor="agentName">Name</label>
              <input id="agentName" value={form.agentName} onChange={set("agentName")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="agentPhone">Phone</label>
              <input id="agentPhone" value={form.agentPhone} onChange={set("agentPhone")} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses} htmlFor="agentEmail">Email</label>
              <input id="agentEmail" type="email" value={form.agentEmail} onChange={set("agentEmail")} className={inputClasses} />
            </div>
          </div>
        </fieldset>

        {submitError && (
          <p className="border border-[#c0453a]/30 bg-[#c0453a]/5 px-4 py-3 text-sm text-[#c0453a]">{submitError}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving…" : isEditing ? "Save changes" : "Publish property"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/admin")}>Cancel</Button>
        </div>
      </form>
    </>
  );
}
