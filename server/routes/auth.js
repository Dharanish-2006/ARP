import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { rows } = await query("SELECT * FROM admin_users WHERE email = $1", [
    String(email).trim().toLowerCase(),
  ]);
  const admin = rows[0];

  if (!admin) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const token = signToken(admin);
  res.json({
    token,
    admin: {
      email: admin.email,
      name: admin.name,
      mustChangePassword: admin.must_change_password,
    },
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const { rows } = await query(
    "SELECT email, name, must_change_password FROM admin_users WHERE id = $1",
    [req.admin.id]
  );
  const admin = rows[0];
  if (!admin) return res.status(404).json({ error: "Account not found." });
  res.json({
    admin: { email: admin.email, name: admin.name, mustChangePassword: admin.must_change_password },
  });
});

router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters." });
  }
  if (newPassword === currentPassword) {
    return res.status(400).json({ error: "New password must be different from the current password." });
  }

  const { rows } = await query("SELECT * FROM admin_users WHERE id = $1", [req.admin.id]);
  const admin = rows[0];
  if (!admin) return res.status(404).json({ error: "Account not found." });

  const valid = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await query(
    `UPDATE admin_users
     SET password_hash = $1, must_change_password = FALSE, updated_at = now()
     WHERE id = $2`,
    [newHash, admin.id]
  );

  res.json({ ok: true });
});

export default router;
