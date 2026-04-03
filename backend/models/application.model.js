// ─────────────────────────────────────────────────────────────────────────────
// models/application.model.js
//
// Mongoose schema for job applications.
//
// When a student clicks "Apply Now" on a job:
//   1. A new Application document is created (job + applicant + status "pending")
//   2. The application's _id is pushed into the Job's applications array
//
// Status lifecycle:
//   "pending"  → recruiter hasn't reviewed yet (default)
//   "accepted" → recruiter clicked Accept
//   "rejected" → recruiter clicked Reject
//
// Unique constraint: one student can only apply to each job once.
// (Enforced in the controller with a findOne check.)
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job:       { type: mongoose.Schema.Types.ObjectId, ref: "Job",  required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type:    String,
      enum:    ["pending", "accepted", "rejected"], // only these values allowed
      default: "pending",
    },
  },
  {
    timestamps: true, // createdAt = when they applied
  }
);

export const Application = mongoose.model("Application", applicationSchema);
