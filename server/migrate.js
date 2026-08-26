import dotenv from "dotenv";
import { execFileSync } from "node:child_process";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is undefined");
  process.exit(1);
}

console.log("DATABASE_URL loaded successfully");

execFileSync(
  "psql",
  [process.env.DATABASE_URL, "-f", "server/schema.sql"],
  {
    stdio: "inherit",
  }
);