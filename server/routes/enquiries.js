import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { sendEnquiryNotification } from "../mailer.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, phone, message, propertyId } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const { rows } = await query(
    `INSERT INTO enquiries (property_id, name, email, phone, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [propertyId || null, name, email, phone || null, message || null]
  );

  res.status(201).json({ ok: true });
  sendEnquiryNotification(rows[0]);
});

// Protected so only signed-in admins can review submitted enquiries.
router.get("/", requireAuth, async (_req, res) => {
  const { rows } = await query("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200");
  res.json({ enquiries: rows });
});

export default router;