import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// POST /api/uploads/sign — admin-only. Returns a signed payload the browser
// uses to upload an image straight to Cloudinary (the API secret never
// leaves the server).
router.post("/sign", requireAuth, (_req, res) => {
  if (!isConfigured) {
    return res.status(500).json({
      error:
        "Image uploads aren't configured yet. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your server .env.",
    });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "avatar-realty/properties";
  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  res.json({
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

export default router;
