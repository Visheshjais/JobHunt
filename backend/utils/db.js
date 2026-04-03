// ─────────────────────────────────────────────────────────────────────────────
// utils/db.js
//
// MongoDB connection helper using Mongoose.
//
// What is Mongoose?
//   Mongoose is an ODM (Object Document Mapper) — it lets us define schemas
//   (like "what fields does a User have?") and interact with MongoDB using
//   JavaScript objects instead of raw MongoDB queries.
//
// Why caching matters on Vercel:
//   Vercel runs your backend as a "serverless function" — meaning it spins up
//   a fresh Node.js process for each incoming request (called a cold start).
//   Without caching, every request would open a brand new MongoDB connection,
//   which is slow and eventually exhausts MongoDB Atlas's connection limit.
//
//   By checking `isConnected` before calling mongoose.connect(), we reuse the
//   existing connection if the function instance is still warm (i.e. Vercel
//   kept the process alive between requests), and only reconnect when truly needed.
//
// Usage:
//   import connectDB from "./utils/db.js";
//   await connectDB(); // safe to call multiple times — only connects once
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

// Module-level flag — persists across requests within the same warm function instance.
// On a cold start this resets to false, triggering a fresh connection.
let isConnected = false;

export default async function connectDB() {
  // If we already have an active connection, skip — no need to reconnect.
  // This is the key optimization for Vercel serverless cold-start performance.
  if (isConnected) {
    console.log("♻️  MongoDB reusing existing connection");
    return;
  }

  try {
    // MONGO_URI is in your .env file — it looks like:
    // mongodb+srv://username:password@cluster.mongodb.net/jobhunt
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Mark as connected so subsequent calls within this function instance skip reconnecting
    isConnected = true;

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);

    // Reset the flag so the next request can attempt to reconnect
    isConnected = false;

    // In production (Vercel), we let the error bubble up to index.js where
    // it is caught and logged — we do NOT call process.exit(1) because that
    // would terminate the entire serverless function instance immediately,
    // preventing any error response from being sent back to the client.
    //
    // In development, you can re-add process.exit(1) here if you prefer the
    // server to stop rather than run without a database.
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }

    // Re-throw so the caller (index.js) can handle or log it
    throw error;
  }
}