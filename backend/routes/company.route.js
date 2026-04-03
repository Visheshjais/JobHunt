// ─────────────────────────────────────────────────────────────────────────────
// routes/company.route.js
//
// All routes starting with /api/v1/company
// All routes are protected — must be logged in as a recruiter.
//
//   POST /register          → create a new company
//   GET  /get               → list recruiter's companies
//   GET  /get/:id           → get single company (for edit form)
//   PUT  /update/:id        → update company info + optional logo upload
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import { registerCompany, getCompany, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.post("/register",    isAuthenticated,                          registerCompany);
router.get("/get",          isAuthenticated,                          getCompany);
router.get("/get/:id",      isAuthenticated,                          getCompanyById);
router.put("/update/:id",   isAuthenticated, upload.single("file"),   updateCompany); // file = logo image

export default router;
