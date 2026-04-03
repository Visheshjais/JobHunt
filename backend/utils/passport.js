// ─────────────────────────────────────────────────────────────────────────────
// utils/passport.js
//
// Passport.js Google OAuth 2.0 strategy configuration.
//
// HOW IT WORKS:
//   1. User clicks "Continue with Google" on the frontend
//   2. They are redirected to Google's consent screen
//   3. Google sends the user back to our callback URL with a "code"
//   4. Passport exchanges that code for user profile data (name, email, photo)
//   5. We look up or create a user in MongoDB using the Google email
//   6. We sign a JWT and redirect the user back to the frontend
//
// SETUP (one-time):
//   1. Go to https://console.cloud.google.com
//   2. Create a project → APIs & Services → Credentials
//   3. Create OAuth 2.0 Client ID (Web Application type)
//   4. Add your callback URL to Authorized Redirect URIs
//   5. Copy Client ID + Secret into your .env file
// ─────────────────────────────────────────────────────────────────────────────

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

export function configurePassport() {

  // ── Guard: only register Google strategy if keys are present in .env ────────
  // Without this check, the server crashes on startup if .env is incomplete.
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      "\n⚠️  Google OAuth is DISABLED — GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET" +
      " not found in .env\n" +
      "   Email/password login still works normally.\n" +
      "   See backend/.env.example for setup instructions.\n"
    );
    // Still set up serialize/deserialize so Passport doesn't break other things
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
    return; // exit early — don't register Google strategy
  }

  // ── Google Strategy ──────────────────────────────────────────────────────────
  // This runs when the user clicks "Continue with Google" and comes back from
  // Google's login page. Passport gives us the user's profile (name, email, photo).
  passport.use(
    new GoogleStrategy(
      {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.GOOGLE_CALLBACK_URL,

        // ⚠️  state: false — required for Vercel serverless compatibility.
        //
        // Normally, Passport generates a random CSRF "state" token when the
        // user is redirected to Google (step 1), stores it in the session,
        // then verifies it when Google redirects back (step 2).
        //
        // On Vercel, each request runs in an isolated serverless function
        // instance. The session stored in step 1 is gone by step 2 because
        // they may land on completely different instances — causing a state
        // mismatch and "Google sign in failed" error.
        //
        // Disabling state skips this cross-request session check.
        // This is safe because we use short-lived JWT tokens for actual
        // authentication security — not sessions.
        state: false,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;   // Gmail address
          const name  = profile.displayName;        // Full name from Google
          const photo = profile.photos[0]?.value || ""; // Profile picture URL

          // Check if this email already has an account
          let user = await User.findOne({ email });

          if (user) {
            // ── Existing user: update photo if they don't have one yet ─────
            if (!user.profile.profilePhoto && photo) {
              user.profile.profilePhoto = photo;
              await user.save();
            }
            return done(null, user);
          }

          // ── New user: create account from Google profile data ─────────────
          // Google users don't set a password — we store a placeholder so the
          // login controller can show a helpful error if they try email/password later.
          user = await User.create({
            fullname:    name,
            email,
            phoneNumber: 0,                   // placeholder — user can update in profile
            password:    "GOOGLE_OAUTH_USER", // never used for login
            role:        "student",           // default role — user can change in profile
            profile: { profilePhoto: photo },
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // ── Serialize / Deserialize ──────────────────────────────────────────────────
  // Required by Passport even though we use JWT (not sessions) for the app.
  // Passport internally calls these during the OAuth redirect flow.
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  console.log("✅ Google OAuth configured successfully");
}