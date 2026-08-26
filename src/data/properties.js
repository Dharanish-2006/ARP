// Suggestion lists only (used as <datalist> options in the admin form so
// staff get consistent labels while still being free to type any value).
// All actual property records live in Neon Postgres — see server/schema.sql
// and src/context/PropertyContext.jsx.

export const PROPERTY_TYPES = [
  "Single Family Home",
  "Condominium",
  "Townhouse",
  "Luxury Estate",
  "Multi-Family",
  "Land",
];

export const STATUSES = ["For Sale", "For Lease", "Pending", "Sold"];

export const formatPrice = (property) => {
  if (property.price == null) return "Price on request";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);
  return property.priceUnit === "lease" ? `${formatted}/mo` : formatted;
};

export const formatLocation = (property) =>
  [property.location?.neighborhood, property.location?.city, property.location?.state]
    .filter(Boolean)
    .join(", ");
