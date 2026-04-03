// ─────────────────────────────────────────────────────────────────────────────
// controllers/application.controller.js
//
// Handles job applications:
//   applyJob      — student applies to a job (creates Application document)
//   getAppliedJobs — student: see all jobs they've applied to
//   getApplicants  — recruiter: see all applicants for a specific job
//   updateStatus   — recruiter: accept or reject an applicant
// ─────────────────────────────────────────────────────────────────────────────

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/application/apply/:id  (protected — student)
// Creates an Application record and adds it to the Job's applications array.
// ─────────────────────────────────────────────────────────────────────────────
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;          // student's user ID from JWT
    const jobId  = req.params.id;   // job's MongoDB _id from the URL

    if (!jobId) {
      return res.status(400).json({ message: "Job ID required", success: false });
    }

    // Prevent duplicate applications (one student → one application per job)
    const existing = await Application.findOne({ job: jobId, applicant: userId });
    if (existing) {
      return res.status(400).json({ message: "You've already applied to this job", success: false });
    }

    // Make sure the job still exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Create the application with default status "pending"
    const application = await Application.create({ job: jobId, applicant: userId });

    // Also push the application's _id into the Job document
    // so the recruiter can quickly see all applicants for their job
    job.applications.push(application._id);
    await job.save();

    return res.status(201).json({ message: "Applied successfully! 🎉", success: true });
  } catch (error) {
    console.error("[applyJob]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/application/get  (protected — student)
// Returns all jobs the logged-in student has applied to.
// Uses deep populate: Application → Job → Company
// ─────────────────────────────────────────────────────────────────────────────
export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" }, // nested populate: also get company details
      });

    if (!applications.length) {
      return res.status(404).json({ message: "No applications yet", success: false });
    }

    return res.status(200).json({ applications, success: true });
  } catch (error) {
    console.error("[getAppliedJobs]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/application/:id/applicants  (protected — recruiter)
// Returns all applications for a specific job (used on the Applicants admin page).
// ─────────────────────────────────────────────────────────────────────────────
export const getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant" }, // get each applicant's user data
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("[getApplicants]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/application/status/:id/update  (protected — recruiter)
// Recruiter accepts or rejects an applicant.
// Body: { status: "accepted" | "rejected" }
// ─────────────────────────────────────────────────────────────────────────────
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required", success: false });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found", success: false });
    }

    // status.toLowerCase() ensures "Accepted", "ACCEPTED", "accepted" all work
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error("[updateStatus]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
