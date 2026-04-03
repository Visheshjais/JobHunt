// ─────────────────────────────────────────────────────────────────────────────
// routes/application.route.js
//
// All routes starting with /api/v1/application
// All routes are protected (JWT cookie required).
//
//   GET  /apply/:id             → student applies to job with given id
//   GET  /get                   → student gets all their applied jobs
//   GET  /:id/applicants        → recruiter gets all applicants for their job
//   POST /status/:id/update     → recruiter accepts/rejects an applicant
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/apply/:id",             isAuthenticated, applyJob);
router.get("/get",                   isAuthenticated, getAppliedJobs);
router.get("/:id/applicants",        isAuthenticated, getApplicants);
router.post("/status/:id/update",    isAuthenticated, updateStatus);

export default router;
