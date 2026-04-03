// ─────────────────────────────────────────────────────────────────────────────
// utils/cloudinary.js
//
// Cloudinary v2 + Multer setup for file uploads (profile photos, resumes).
//
// Zero extra packages. Works perfectly with cloudinary v2.
//
// ── HOW FILE UPLOADS WORK ────────────────────────────────────────────────────
//   1. User picks a file on the form (profile photo / resume)
//   2. Form sends it as multipart/form-data
//   3. Multer reads the file and puts raw bytes into req.file.buffer
//   4. getDataUri(req.file) converts those bytes → base64 string
//   5. cloudinary.uploader.upload(base64String) stores the file
//   6. Cloudinary returns a permanent HTTPS URL
//   7. We save that URL in MongoDB
//
// ── SETUP ─────────────────────────────────────────────────────────────────────
//   1. Sign up free at cloudinary.com
//   2. Copy Cloud Name, API Key, API Secret from the dashboard
//   3. Add to backend/.env:
//        CLOUD_NAME=your_cloud_name
//        CLOUD_API_KEY=your_api_key
//        CLOUD_API_SECRET=your_api_secret
// ─────────────────────────────────────────────────────────────────────────────

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";

// ── Configure Cloudinary with credentials from .env ───────────────────────────
// Never hardcode API keys — always use environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ── Multer: keep uploaded files in memory (not on disk) ───────────────────────
// memoryStorage stores the file as a Buffer in req.file.buffer
// This is required on Vercel/serverless where you cannot write to the filesystem
const storage = multer.memoryStorage();

// Attach this to any route that accepts a file upload:
//   router.post("/register", upload.single("file"), register)
//                                           ↑ must match the FormData field name
export const upload = multer({ storage });

// ── Convert a multer Buffer → base64 data URI string ─────────────────────────
//
// Cloudinary's upload() accepts strings in this format:
//   "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
//    ↑ MIME type             ↑ file bytes encoded as text
//
// IMPORTANT — return value changed from old version:
//   OLD: returned an object  { content: "data:image/jpeg;base64,..." }
//   NEW: returns the string  "data:image/jpeg;base64,..."  directly
//
// In controllers, use:
//   const dataUri  = getDataUri(file);
//   const cloudRes = await cloudinary.uploader.upload(dataUri);   ✅
//                                                    ↑ not dataUri.content
//
export function getDataUri(file) {
  // Get the file extension, e.g. ".jpg", ".png", ".pdf"
  const ext = path.extname(file.originalname).toLowerCase();

  // Map extensions to MIME types
  // MIME type = a label that tells browsers/servers what kind of file this is
  const mimeTypes = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".gif":  "image/gif",
    ".webp": "image/webp",
    ".pdf":  "application/pdf",
    ".svg":  "image/svg+xml",
  };

  const mime = mimeTypes[ext] || "application/octet-stream";

  // Buffer.from(file.buffer) wraps the raw bytes in a Node Buffer object
  // .toString("base64") converts those bytes to a base64 text string
  const base64 = Buffer.from(file.buffer).toString("base64");

  // Combine into the full data URI format Cloudinary expects
  return `data:${mime};base64,${base64}`;
}

export { cloudinary };
