import bcrypt from "bcryptjs";
import { query } from "./db.js";

const DEFAULT_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@avatarrealtygroup.com";
const DEFAULT_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "ChangeMe!2026";

/**
 * Ensures at least one admin account exists. Runs once at server boot.
 * The seeded account is flagged must_change_password = true so the very
 * first login is forced into the change-password flow.
 */
export async function seedAdminIfNeeded() {
  const { rows } = await query("SELECT COUNT(*)::int AS count FROM admin_users");
  if (rows[0].count > 0) return;

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  await query(
    `INSERT INTO admin_users (email, password_hash, name, must_change_password)
     VALUES ($1, $2, $3, TRUE)`,
    [DEFAULT_EMAIL.toLowerCase(), passwordHash, "Avatar Admin"]
  );

  console.log("\n[avatar-realty] Created default admin account:");
  console.log(`  Email:    ${DEFAULT_EMAIL}`);
  console.log(`  Password: ${DEFAULT_PASSWORD}`);
  console.log("  You will be required to change this password on first login.\n");
}
