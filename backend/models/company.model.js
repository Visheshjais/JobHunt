// ─────────────────────────────────────────────────────────────────────────────
// models/company.model.js
//
// Mongoose schema for companies registered by recruiters.
//
// A recruiter must create a Company before they can post jobs.
// Each company belongs to one recruiter (userId).
//
// logo is a Cloudinary URL — uploaded via the CompanySetup page.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true }, // company name must be unique
    description: { type: String, default: "" },
    website:     { type: String, default: "" },                  // e.g. "https://google.com"
    location:    { type: String, default: "" },                  // HQ location
    logo:        { type: String, default: "" },                  // Cloudinary URL

    // The recruiter who created this company
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model("Company", companySchema);
