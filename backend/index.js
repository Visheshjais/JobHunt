// ─────────────────────────────────────────────────────────────────────────────
// index.js — JobHunt Backend Entry Point
//
// This file sets up the Express server with:
//   • Middleware (JSON parsing, cookies, CORS)
//   • Passport (Google OAuth 2.0 — JWT handles ongoing auth, no sessions needed)
//   • DB middleware (ensures MongoDB is ready before every request)
//   • Routes (user, company, job, application)
//
// Vercel serverless model:
//   Vercel does not run a persistent server. Instead, each incoming HTTP request
//   spins up (or reuses) a short-lived function instance. This means:
//     1. app.listen() must NOT be called in production — Vercel handles that.
//     2. MongoDB can't be connected once at startup — it must be awaited per-request
//        (but cached so we don't open a new connection every time).
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import connectDB from "./utils/db.js";
import { configurePassport } from "./utils/passport.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

// Load .env variables first — must happen before any process.env usage
dotenv.config();

const app = express();

// ── Body parsing middleware ───────────────────────────────────────────────────
app.use(express.json());                         // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded form data
app.use(cookieParser());                         // parse cookies (required for JWT reading)

// ── Passport (Google OAuth) ───────────────────────────────────────────────────
// We use Passport ONLY for the Google OAuth handshake.
// Once the handshake completes, we issue a JWT and store it in a cookie.
// All subsequent requests are authenticated via JWT — NOT sessions.
//
// ⚠️  express-session + passport.session() are intentionally omitted.
//     Vercel is stateless — in-memory session stores are wiped between
//     function invocations, causing passport.session() to crash.
//     Since our app uses JWT for ongoing auth, sessions are not needed.
configurePassport();            // register the Google OAuth strategy with Passport
app.use(passport.initialize()); // attach Passport to Express (no session support)

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allows the frontend (running on a different origin) to call this API.
// credentials: true is required so the browser sends cookies cross-origin.
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Vite dev server (default port)
  "http://localhost:5174", // Vite dev server (alternate port)
  "http://localhost:4173", // Vite preview mode
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server calls)
      if (!origin) return callback(null, true);

      // Allow all local dev origins
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

      // Allow any Vercel deployment (covers all preview + production URLs)
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // Block everything else
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ── Database middleware ───────────────────────────────────────────────────────
// WHY THIS EXISTS:
//   On Vercel, a request can arrive before connectDB() finishes (race condition).
//   Calling mongoose queries on a disconnected client causes:
//     "MongooseError: Operation buffering timed out after 10000ms"
//
// HOW IT WORKS:
//   Before every request reaches a route handler, we await connectDB().
//   connectDB() in utils/db.js is cached — it only opens a new connection
//   on a cold start. Warm instances reuse the existing connection instantly.
//   This guarantees the DB is always ready before any query runs.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next(); // DB is ready — proceed to route handler
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    res.status(500).json({ message: "Database connection failed. Please try again." });
  }
});

// ── API Routes ────────────────────────────────────────────────────────────────
// All routes are prefixed with /api/v1 to version the API.
// If we ever make breaking changes, we can add /api/v2 routes alongside these.
app.use("/api/v1/user",        userRoute);        // auth, profile, Google OAuth
app.use("/api/v1/company",     companyRoute);     // recruiter company management
app.use("/api/v1/job",         jobRoute);         // job listings (CRUD)
app.use("/api/v1/application", applicationRoute); // job applications

// ── Health check ──────────────────────────────────────────────────────────────
// Quick sanity check — GET /api/health confirms the server + DB are alive.
// Useful for Vercel deployment verification and uptime monitoring.
app.get("/api/health", (_, res) =>
  res.json({ ok: true, message: "JobHunt API is running 🚀" })
);

// ── Server startup ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  // Development: start a real HTTP server on the configured port.
  // We connect to DB here too so local dev works normally.
  app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 JobHunt Backend    → http://localhost:${PORT}`);
    console.log(`📡 Google OAuth start → http://localhost:${PORT}/api/v1/user/auth/google`);
  });
}

// ── Vercel export ─────────────────────────────────────────────────────────────
// In production, Vercel imports this file and calls the exported app
// directly as a serverless function — no app.listen() needed.
// The DB middleware above handles connection on every cold start.
export default app;