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
import {
  register,
  login,
  logout,
  updateProfile,
  googleAuthCallback,
  getMe,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// ── Standard email/password auth ──────────────────────────────────────────────
router.post("/register", upload.single("file"), register);
router.post("/login", login);
router.get("/logout", logout);

// ── Get current user ──────────────────────────────────────────────────────────
// Called by the frontend after Google OAuth redirect to load the user into Redux.
router.get("/me", isAuthenticated, getMe);

// ── Google OAuth 2.0 ──────────────────────────────────────────────────────────
//
// Step 1: User hits this URL → Passport redirects them to Google's login page.
//
// ⚠️  state: false — required for Vercel serverless.
//     Passport normally stores a CSRF state token in the session between
//     step 1 (redirect) and step 2 (callback). On Vercel, each request runs
//     in a separate function instance, so the session is gone by step 2.
//     state: false disables this cross-request check. Safe because JWT
//     handles actual auth security — not sessions.
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // request name + email from Google
    state: false,                // ← required for Vercel serverless (see above)
  })
);

// Step 2: Google redirects the user back here after they approve access.
// Passport runs the GoogleStrategy verify function (in utils/passport.js),
// finds or creates the user in MongoDB, then calls googleAuthCallback.
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // On failure: redirect to login page with an error flag the frontend can read
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=google_failed`,
    session: false, // we use JWT cookies, not server-side sessions
    state: false,   // ← must match step 1 (see above)
  }),
  googleAuthCallback // issues JWT + redirects user back to the frontend
);

// ── Protected: update profile ─────────────────────────────────────────────────
router.post(
  "/profile/update",
  isAuthenticated,
  upload.single("file"),
  updateProfile
);

export default router;