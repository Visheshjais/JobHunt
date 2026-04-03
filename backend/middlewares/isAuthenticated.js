// ─────────────────────────────────────────────────────────────────────────────
// middlewares/isAuthenticated.js
//
// Express middleware that checks whether the request comes from a logged-in user.
//
// What is middleware?
//   In Express, middleware is a function that runs BETWEEN receiving a request
//   and sending a response. It can inspect, modify, or block the request.
//
//   Example route with middleware:
//     router.post("/update", isAuthenticated, updateProfile)
//     ↑ This means: first run isAuthenticated, and only if it calls next(),
//       then run updateProfile.
//
// How it works:
//   1. Reads the "token" cookie from the request
//   2. Verifies the JWT using the SECRET_KEY from .env
//   3. If valid → extracts userId and attaches it to req.id, then calls next()
//   4. If invalid or missing → sends 401 Unauthorized
//
// req.id is then available in the controller:
//   const user = await User.findById(req.id);
// ─────────────────────────────────────────────────────────────────────────────

import jwt from "jsonwebtoken";

export default function isAuthenticated(req, res, next) {
  try {
    // Read the JWT from the HttpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "You must be logged in to do this.",
        success: false,
      });
    }

    // Verify the token using the same secret used to sign it
    // jwt.verify() throws an error if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the userId to the request so controllers can use it
    req.id = decoded.userId;

    // Call next() to pass control to the next middleware or controller
    next();
  } catch (error) {
    // Token is expired, invalid, or the secret doesn't match
    return res.status(401).json({
      message: "Session expired. Please log in again.",
      success: false,
    });
  }
}
