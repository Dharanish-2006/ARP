import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error(
    "\n[avatar-realty] Missing DATABASE_URL. Set it in server/.env to your Neon connection string, e.g.\n" +
      "  DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require\n"
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
  max: 10,
});

export const query = (text, params) => pool.query(text, params);

pool.on("error", (err) => {
  console.error("[avatar-realty] Unexpected Postgres pool error:", err.message);
});
