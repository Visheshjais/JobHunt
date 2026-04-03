// ─────────────────────────────────────────────────────────────────────────────
// index.js — JobHunt Backend Entry Point
//
// This file sets up the Express server with:
//   • Middleware (JSON parsing, cookies, CORS)
//   • Passport (Google OAuth 2.0 — JWT handles ongoing auth, no sessions needed)
//   • Routes (user, company, job, application)
//   • DB connection (lazy + cached for Vercel serverless compatibility)
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
// ⚠️  express-session + passport.session() are intentionally removed here.
//     Vercel is a stateless serverless platform — in-memory session stores are
//     wiped between function invocations, causing passport.session() to crash.
//     Since our app uses JWT for ongoing auth, sessions are not needed at all.
configurePassport();          // register the Google OAuth strategy with Passport
app.use(passport.initialize()); // attach Passport to Express (no session support)

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allows the frontend (running on a different origin) to call this API.
// credentials: true is required so the browser sends cookies with cross-origin requests.
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Vite dev server (default port)
  "http://localhost:5174", // Vite dev server (alternate port)
  "http://localhost:4173", // Vite preview mode
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Allow all local dev origins
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

      // Allow any Vercel deployment (covers preview + production URLs)
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // Block everything else
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/user",        userRoute);       // auth, profile, Google OAuth
app.use("/api/v1/company",     companyRoute);    // recruiter company management
app.use("/api/v1/job",         jobRoute);        // job listings (CRUD)
app.use("/api/v1/application", applicationRoute); // job applications

// ── Health check ──────────────────────────────────────────────────────────────
// Quick sanity check — visit GET /api/health to confirm the server is alive.
// Useful for Vercel deployment checks and uptime monitoring.
app.get("/api/health", (_, res) => res.json({ ok: true, message: "JobHunt API is running 🚀" }));

// ── Server startup ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  // Development: spin up a real HTTP server on the configured port
  app.listen(PORT, () => {
    connectDB(); // connect to MongoDB after server starts
    console.log(`🚀 JobHunt Backend    → http://localhost:${PORT}`);
    console.log(`📡 Google OAuth start → http://localhost:${PORT}/api/v1/user/auth/google`);
  });
} else {
  // Production (Vercel): no app.listen() — Vercel handles incoming connections.
  // We just need to connect to MongoDB before the first request is served.
  //
  // ⚠️  connectDB() in utils/db.js must cache the connection (check isConnected
  //     before calling mongoose.connect) so repeated cold-start invocations
  //     don't open a new connection every time.
  connectDB().catch((err) =>
    console.error("❌ MongoDB connection failed on startup:", err)
  );
}

// Export the Express app so Vercel can invoke it as a serverless function.
// Vercel looks for this default export in the file specified in vercel.json.
export default app;