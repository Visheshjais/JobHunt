// ─────────────────────────────────────────────────────────────────────────────
// controllers/job.controller.js
//
// Handles all job-related API logic:
//   postJob      — recruiter creates a new job listing
//   getAllJobs   — public: returns all jobs (with optional keyword search)
//   getJobById  — public: returns one job by its MongoDB _id
//   getAdminJobs — protected: returns jobs posted by the logged-in recruiter only
// ─────────────────────────────────────────────────────────────────────────────

import { Job } from "../models/job.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/job/post  (protected — recruiter only)
// Creates a new job listing linked to the recruiter's company.
// ─────────────────────────────────────────────────────────────────────────────
export const postJob = async (req, res) => {
  try {
    const {
      title, description, requirements, salary,
      location, jobType, experience, position, companyId,
    } = req.body;

    // All fields are required — validate early and return a clear error
    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    // requirements arrives as a comma-separated string → split into an array
    // e.g. "React, Node.js, MongoDB" → ["React", "Node.js", "MongoDB"]
    const job = await Job.create({
      title, description,
      requirements: requirements.split(",").map((r) => r.trim()),
      salary: Number(salary),
      location, jobType,
      experienceLevel: Number(experience),
      position: Number(position),
      company: companyId,
      created_by: req.id, // set by isAuthenticated middleware
    });

    return res.status(201).json({ message: "Job posted successfully!", job, success: true });
  } catch (error) {
    console.error("[postJob]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/job/get?keyword=react
// Public route — any visitor can browse jobs without logging in.
// Optional ?keyword param does a case-insensitive search on title + description.
// ─────────────────────────────────────────────────────────────────────────────
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    // Build the MongoDB query — $regex is like SQL LIKE '%keyword%'
    // $options: "i" means case-insensitive
    const query = keyword
      ? {
          $or: [
            { title:       { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {}; // empty query = return all jobs

    // .populate("company") fetches the full company document for each job
    // so the frontend gets company name + logo without a second API call
    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("[getAllJobs]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/job/get/:id
// Returns a single job with all its applications populated (for the detail page).
// ─────────────────────────────────────────────────────────────────────────────
export const getJobById = async (req, res) => {
  try {
    // populate("applications") fetches the full Application documents
    // so the frontend knows how many people applied
    const job = await Job.findById(req.params.id).populate({ path: "applications" });
    if (!job) return res.status(404).json({ message: "Job not found", success: false });
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("[getJobById]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/job/getadminjobs  (protected — recruiter only)
// Returns only the jobs that the currently logged-in recruiter posted.
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminJobs = async (req, res) => {
  try {
    // req.id = logged-in recruiter's userId (from isAuthenticated middleware)
    const jobs = await Job.find({ created_by: req.id })
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("[getAdminJobs]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
