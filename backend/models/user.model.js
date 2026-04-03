// ─────────────────────────────────────────────────────────────────────────────
// models/user.model.js
//
// Mongoose schema for users (both job seekers and recruiters).
//
// What is a Mongoose Schema?
//   It defines the "shape" of a document in MongoDB — what fields exist,
//   what types they are, and what rules apply (required, unique, default).
//
// What is a Model?
//   A Model is a class that wraps the schema. You use it to CREATE, READ,
//   UPDATE, and DELETE documents: User.create(), User.findOne(), etc.
//
// roles:
//   "student"   — job seeker, can apply to jobs
//   "recruiter" — company rep, can post jobs and view applicants
//
// Google OAuth note:
//   Users who sign up via Google will have:
//     password: "GOOGLE_OAUTH_USER"   (never used for login)
//     phoneNumber: 0                  (placeholder — they update it in profile)
//     profile.profilePhoto: <google photo URL>
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname:    { type: String, required: true },
    email:       { type: String, required: true, unique: true }, // used for login
    phoneNumber: { type: Number, required: true },
    password:    { type: String, required: true }, // bcrypt hash (or "GOOGLE_OAUTH_USER")
    role: {
      type: String,
      enum: ["student", "recruiter"], // only these two values are allowed
      required: true,
    },
    profile: {
      bio:                { type: String, default: "" },
      skills:             [{ type: String }],             // ["React", "Node.js", ...]
      resume:             { type: String, default: "" },  // Cloudinary URL of uploaded PDF
      resumeOriginalName: { type: String, default: "" },  // original filename, e.g. "MyResume.pdf"
      company:            { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // recruiter's company
      profilePhoto:       { type: String, default: "" },  // Cloudinary URL of profile image
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

export const User = mongoose.model("User", userSchema);
