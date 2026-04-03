// ─────────────────────────────────────────────────────────────────────────────
// routes/user.route.js
//
// All routes starting with /api/v1/user
//
// Public routes (no login needed):
//   POST   /register                  — create new account
//   POST   /login                     — sign in with email+password
//   GET    /logout                    — clear cookie
//   GET    /auth/google               — redirect to Google login page
//   GET    /auth/google/callback      — Google sends user back here after login
//
// Protected routes (must have valid JWT cookie):
//   POST   /profile/update            — update profile info
//   GET    /me                        — get current user data
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import passport from "passport";
import { register, login, logout, updateProfile, googleAuthCallback, getMe } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// ── Standard email/password auth ─────────────────────────────────────────────
router.post("/register", upload.single("file"), register);
router.post("/login", login);
router.get("/logout", logout);

// ── Get current user (used after Google OAuth redirect) ──────────────────────
router.get("/me", isAuthenticated, getMe);

// ── Google OAuth 2.0 ─────────────────────────────────────────────────────────
// Step 1: User hits this URL → redirected to Google's login page
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // we ask for name + email from Google
  })
);

// Step 2: Google redirects user back here after they approve
// passport.authenticate runs the GoogleStrategy verify function first,
// then calls googleAuthCallback on success
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=google_failed`,
    session: false, // we use JWT, not sessions
  }),
  googleAuthCallback
);

// ── Protected: update profile ─────────────────────────────────────────────────
router.post("/profile/update", isAuthenticated, upload.single("file"), updateProfile);

export default router;
