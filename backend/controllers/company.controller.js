// ─────────────────────────────────────────────────────────────────────────────
// controllers/company.controller.js
//
// Handles all company-related API logic (recruiter only):
//   registerCompany — create a new company profile
//   getCompany      — list all companies belonging to this recruiter
//   getCompanyById  — get one company's details (for edit form)
//   updateCompany   — update name, description, website, location, logo
// ─────────────────────────────────────────────────────────────────────────────

import { Company } from "../models/company.model.js";
import { getDataUri, cloudinary } from "../utils/cloudinary.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/company/register  (protected)
// A recruiter must register a company before they can post jobs.
// ─────────────────────────────────────────────────────────────────────────────
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ message: "Company name required", success: false });
    }

    // Prevent duplicate company names globally
    const existing = await Company.findOne({ name: companyName });
    if (existing) {
      return res.status(400).json({ message: "Company already registered", success: false });
    }

    // userId links this company to the logged-in recruiter
    const company = await Company.create({ name: companyName, userId: req.id });
    return res.status(201).json({ message: "Company registered!", company, success: true });
  } catch (error) {
    console.error("[registerCompany]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/company/get  (protected)
// Returns all companies created by the logged-in recruiter.
// ─────────────────────────────────────────────────────────────────────────────
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id });
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error("[getCompany]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/company/get/:id  (protected)
// Returns a single company by its MongoDB _id (used to pre-fill the edit form).
// ─────────────────────────────────────────────────────────────────────────────
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error("[getCompanyById]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/company/update/:id  (protected, accepts logo file upload)
// Updates company info. If a new logo file is uploaded, it goes to Cloudinary.
// ─────────────────────────────────────────────────────────────────────────────
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file; // logo image (optional)

    let logoUrl = "";
    if (file) {
      // Convert the file buffer to a base64 data URI, then upload to Cloudinary
      const dataUri = getDataUri(file);
      const cloudRes = await cloudinary.uploader.upload(dataUri);
      logoUrl = cloudRes.secure_url; // permanent HTTPS URL
    }

    // Build update object — only include fields that were actually sent
    const updateData = { name, description, website, location };
    if (logoUrl) updateData.logo = logoUrl;

    // { new: true } returns the updated document instead of the old one
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }

    return res.status(200).json({ message: "Company updated successfully!", company, success: true });
  } catch (error) {
    console.error("[updateCompany]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
