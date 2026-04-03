// ─────────────────────────────────────────────────────────────────────────────
// utils/constant.js
//
// Centralized API base URLs.
// All API calls in the app import from here instead of hardcoding URLs.
//
// VITE_API_URL is set in your .env file:
//   - Development: VITE_API_URL=http://localhost:8000/api
//   - Production:  VITE_API_URL=https://your-backend.vercel.app/api
//
// The fallback "/api" works when frontend and backend are on the same domain.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || "/api";

export const USER_API        = `${BASE}/v1/user`;
export const JOB_API         = `${BASE}/v1/job`;
export const APPLICATION_API = `${BASE}/v1/application`;
export const COMPANY_API     = `${BASE}/v1/company`;

// ── Google OAuth ──────────────────────────────────────────────────────────────
// This is the backend URL that starts the Google login flow.
// Clicking this link redirects the user to Google's login page.
// After they log in, Google redirects back to our backend callback,
// which then redirects to /auth/google/success on the frontend.
const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:8000";

export const GOOGLE_AUTH_URL = `${BACKEND_URL}/api/v1/user/auth/google`;
