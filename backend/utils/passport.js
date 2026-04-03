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
//   4. Add "http://localhost:8000/api/v1/user/auth/google/callback" to redirect URIs
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
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;  // Gmail address
          const name  = profile.displayName;       // Full name from Google
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
          // Google users don't set a password — we mark it so the login
          // controller can show a helpful error if they try email/password later.
          user = await User.create({
            fullname:    name,
            email,
            phoneNumber: 0,                    // placeholder — update in profile
            password:    "GOOGLE_OAUTH_USER",  // never used for login
            role:        "student",            // default role
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
  // Passport needs these during the OAuth redirect flow.
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
