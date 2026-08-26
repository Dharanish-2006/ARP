import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { slugify, rowToProperty } from "../utils.js";

const router = Router();

router.get("/", async (_req, res) => {
  const { rows } = await query("SELECT * FROM properties ORDER BY created_at DESC");
  res.json({ properties: rows.map(rowToProperty) });
});

router.get("/:slug", async (req, res) => {
  const { rows } = await query("SELECT * FROM properties WHERE slug = $1", [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ error: "Property not found." });
  res.json({ property: rowToProperty(rows[0]) });
});

router.post("/", requireAuth, async (req, res) => {
  const p = req.body || {};
  if (!p.title || !p.location?.city) {
    return res.status(400).json({ error: "Title and city are required." });
  }

  const baseSlug = slugify(p.title);
  let slug = baseSlug;
  let n = 1;
  while ((await query("SELECT 1 FROM properties WHERE slug = $1", [slug])).rowCount > 0) {
    slug = `${baseSlug}-${n++}`;
  }

  const listingCategory = p.listingCategory === "sold" ? "sold" : "current";

  const { rows } = await query(
    `INSERT INTO properties
      (slug, title, type, status, listing_category, price, price_unit, featured, neighborhood, city, state,
       beds, baths, area_sqft, lot_sqft, year_built, description, features, images, custom_fields,
       agent_name, agent_phone, agent_email)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
     RETURNING *`,
    [
      slug,
      p.title,
      p.type || "Single Family Home",
      p.status || "For Sale",
      listingCategory,
      p.price ?? null,
      p.priceUnit || "sale",
      Boolean(p.featured),
      p.location?.neighborhood || null,
      p.location?.city || null,
      p.location?.state || null,
      p.beds ?? null,
      p.baths ?? null,
      p.areaSqft ?? null,
      p.lotSqft ?? null,
      p.yearBuilt ?? null,
      p.description || null,
      JSON.stringify(p.features || []),
      JSON.stringify(p.images || []),
      JSON.stringify(p.customFields || []),
      p.agent?.name || null,
      p.agent?.phone || null,
      p.agent?.email || null,
    ]
  );

  res.status(201).json({ property: rowToProperty(rows[0]) });
});

router.put("/:id", requireAuth, async (req, res) => {
  const p = req.body || {};
  const existing = await query("SELECT * FROM properties WHERE id = $1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: "Property not found." });

  let slug = existing.rows[0].slug;
  if (p.title && p.title !== existing.rows[0].title) {
    const baseSlug = slugify(p.title);
    slug = baseSlug;
    let n = 1;
    while (
      (await query("SELECT 1 FROM properties WHERE slug = $1 AND id != $2", [slug, req.params.id]))
        .rowCount > 0
    ) {
      slug = `${baseSlug}-${n++}`;
    }
  }

  const listingCategory = p.listingCategory === "sold" ? "sold" : "current";

  const { rows } = await query(
    `UPDATE properties SET
      slug = $1, title = $2, type = $3, status = $4, listing_category = $5, price = $6, price_unit = $7,
      featured = $8, neighborhood = $9, city = $10, state = $11, beds = $12, baths = $13, area_sqft = $14,
      lot_sqft = $15, year_built = $16, description = $17, features = $18, images = $19,
      custom_fields = $20, agent_name = $21, agent_phone = $22, agent_email = $23, updated_at = now()
     WHERE id = $24
     RETURNING *`,
    [
      slug,
      p.title,
      p.type,
      p.status,
      listingCategory,
      p.price ?? null,
      p.priceUnit || "sale",
      Boolean(p.featured),
      p.location?.neighborhood || null,
      p.location?.city || null,
      p.location?.state || null,
      p.beds ?? null,
      p.baths ?? null,
      p.areaSqft ?? null,
      p.lotSqft ?? null,
      p.yearBuilt ?? null,
      p.description || null,
      JSON.stringify(p.features || []),
      JSON.stringify(p.images || []),
      JSON.stringify(p.customFields || []),
      p.agent?.name || null,
      p.agent?.phone || null,
      p.agent?.email || null,
      req.params.id,
    ]
  );

  res.json({ property: rowToProperty(rows[0]) });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { rowCount } = await query("DELETE FROM properties WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Property not found." });
  res.json({ ok: true });
});

export default router;