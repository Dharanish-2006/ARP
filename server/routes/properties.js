import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { slugify, rowToProperty } from "../utils.js";

const router = Router();

// GET /api/properties — public list, all filtering/sorting done client-side
// against the full result set (kept simple; swap for SQL WHERE/ORDER BY
// clauses if the catalog grows large enough to need server-side paging).
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

  const { rows } = await query(
    `INSERT INTO properties
      (slug, title, type, status, price, price_unit, featured, neighborhood, city, state,
       beds, baths, area_sqft, lot_sqft, year_built, description, features, images, custom_fields,
       agent_name, agent_phone, agent_email)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
     RETURNING *`,
    [
      slug,
      p.title,
      p.type || "Single Family Home",
      p.status || "For Sale",
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

  const { rows } = await query(
    `UPDATE properties SET
      slug = $1, title = $2, type = $3, status = $4, price = $5, price_unit = $6, featured = $7,
      neighborhood = $8, city = $9, state = $10, beds = $11, baths = $12, area_sqft = $13,
      lot_sqft = $14, year_built = $15, description = $16, features = $17, images = $18,
      custom_fields = $19, agent_name = $20, agent_phone = $21, agent_email = $22, updated_at = now()
     WHERE id = $23
     RETURNING *`,
    [
      slug,
      p.title,
      p.type,
      p.status,
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
