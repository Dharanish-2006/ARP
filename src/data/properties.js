export const PROPERTY_TYPES = [
  "Single Family Home",
  "Condominium",
  "Townhouse",
  "Luxury Estate",
  "Multi-Family",
  "Land",
];

export const STATUSES = ["For Sale", "For Lease", "Pending", "Sold"];

export const LISTING_CATEGORIES = [
  { value: "current", label: "Current Listing" },
  { value: "sold", label: "Sold Listing" },
];

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
