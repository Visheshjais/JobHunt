// ─────────────────────────────────────────────────────────────────────────────
// routes/job.route.js
//
// All routes starting with /api/v1/job
//
// Public (no login needed):
//   GET /get                → all jobs, optional ?keyword= filter
//   GET /get/:id            → single job details
//
// Protected (JWT cookie required):
//   POST /post              → recruiter posts a new job
//   GET  /getadminjobs      → recruiter sees their own posted jobs
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import { postJob, getAllJobs, getJobById, getAdminJobs } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Protected: only logged-in recruiters can post jobs
router.post("/post", isAuthenticated, postJob);

// Public: anyone can browse jobs (no cookie needed)
router.get("/get", getAllJobs);

// Protected: recruiter sees only their own jobs
router.get("/getadminjobs", isAuthenticated, getAdminJobs);

// Public: view a single job's details
router.get("/get/:id", getJobById);

export default router;
