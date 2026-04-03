// ─────────────────────────────────────────────────────────────────────────────
// models/job.model.js
//
// Mongoose schema for job listings.
//
// Relationships:
//   company    → Company (the company that posted the job)
//   created_by → User    (the recruiter who posted it)
//   applications → [Application] (all applicants — stored as an array of IDs)
//
// What is ObjectId / ref?
//   Instead of copying company data into every job document, we store just
//   the company's _id and use .populate("company") to fetch its full data
//   when needed. This is called "referencing" — like a foreign key in SQL.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true },           // e.g. "Senior React Developer"
    description:    { type: String, required: true },           // full job description text
    requirements:   [{ type: String }],                         // ["React", "Node.js", "3+ yrs exp"]
    salary:         { type: Number, required: true },           // annual salary in LPA (₹)
    experienceLevel:{ type: Number, required: true },           // minimum years: 0, 1, 3, 5 etc.
    location:       { type: String, required: true },           // "Bangalore", "Remote", etc.
    jobType:        { type: String, required: true },           // "Full Time", "Internship", etc.
    position:       { type: Number, required: true },           // number of open seats

    // References to other collections
    company:    { type: mongoose.Schema.Types.ObjectId, ref: "Company",     required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User",        required: true },
    applications:[{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const Job = mongoose.model("Job", jobSchema);
