import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { seedAdminIfNeeded } from "./seedAdmin.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import enquiryRoutes from "./routes/enquiries.js";
import uploadRoutes from "./routes/uploads.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (err) {
    res.status(500).json({ ok: false, database: "unreachable", error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our end. Please try again." });
});

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("[avatar-realty] Connected to Neon Postgres.");
  } catch (err) {
    console.error(
      "[avatar-realty] Could not connect to the database. Check DATABASE_URL in server/.env.\n",
      err.message
    );
    process.exit(1);
  }

  await seedAdminIfNeeded();

  app.listen(PORT, () => {
    console.log(`[avatar-realty] API listening on http://localhost:${PORT}`);
  });
}

start();
