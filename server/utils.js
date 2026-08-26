export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "listing";
}

export function rowToProperty(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    status: row.status,
    price: row.price === null ? null : Number(row.price),
    priceUnit: row.price_unit,
    featured: row.featured,
    location: {
      neighborhood: row.neighborhood,
      city: row.city,
      state: row.state,
    },
    beds: row.beds === null ? null : Number(row.beds),
    baths: row.baths === null ? null : Number(row.baths),
    areaSqft: row.area_sqft === null ? null : Number(row.area_sqft),
    lotSqft: row.lot_sqft === null ? null : Number(row.lot_sqft),
    yearBuilt: row.year_built,
    description: row.description,
    features: row.features || [],
    images: row.images || [],
    customFields: row.custom_fields || [],
    agent: {
      name: row.agent_name,
      phone: row.agent_phone,
      email: row.agent_email,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
