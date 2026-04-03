// ─────────────────────────────────────────────────────────────────────────────
// controllers/user.controller.js
//
// Handles all user-related API logic:
//   • register         — create a new account (email + password)
//   • login            — sign in with email + password
//   • logout           — clear the cookie
//   • updateProfile    — edit name, skills, resume, etc.
//   • googleAuthCallback — called by Google OAuth after user approves login
//   • getMe            — get current logged-in user (used after Google redirect)
//
// What is JWT?
//   JSON Web Token — a signed string that proves the user is authenticated.
//   We store it in an HttpOnly cookie so JavaScript cannot steal it (XSS safe).
// ─────────────────────────────────────────────────────────────────────────────

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDataUri, cloudinary } from "../utils/cloudinary.js";

// ── Helper: build the public-safe user object sent to frontend ───────────────
// We NEVER send the hashed password to the client.
const buildUserPayload = (user) => ({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  profile: user.profile,
});

const issueTokenCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "7d" });
  
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",  // lax works for localhost
    secure: isProduction ? true : false,       // false for http localhost
  });
  return token;
};

// POST /api/v1/user/register
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }
    const file = req.file;
    let profilePhotoUrl = "";
    if (file) {
      const dataUri = getDataUri(file);
      const cloudRes = await cloudinary.uploader.upload(dataUri);
      profilePhotoUrl = cloudRes.secure_url;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered", success: false });
    }
    // bcrypt hashes the password with a salt — NEVER store plain text passwords!
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname, email, phoneNumber: Number(phoneNumber),
      password: hashedPassword, role,
      profile: { profilePhoto: profilePhotoUrl },
    });
    return res.status(201).json({ message: "Account created! Please log in.", success: true });
  } catch (error) {
    console.error("[register]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// POST /api/v1/user/login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password", success: false });
    }
    // Google-only accounts cannot use email+password login
    if (user.password === "GOOGLE_OAUTH_USER") {
      return res.status(400).json({
        message: "This account uses Google Sign-In. Click 'Continue with Google' below.",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password", success: false });
    }
    if (role !== user.role) {
      return res.status(400).json({ message: "Account doesn't exist with this role", success: false });
    }
    issueTokenCookie(res, user._id);
    return res.status(200).json({
      message: `Welcome back, ${user.fullname}! 🎉`,
      user: buildUserPayload(user),
      success: true,
    });
  } catch (error) {
    console.error("[login]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// GET /api/v1/user/logout
export const logout = async (_, res) => {
  try {
    // maxAge: 0 tells the browser to immediately delete the cookie
    return res.status(200).cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("[logout]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// POST /api/v1/user/profile/update (protected — requires valid JWT cookie)
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    let resumeUrl = "", resumeOriginalName = "";
    if (file) {
      const dataUri = getDataUri(file);
      const cloudRes = await cloudinary.uploader.upload(dataUri);
      resumeUrl = cloudRes.secure_url;
      resumeOriginalName = file.originalname;
    }
    // skills arrives as a comma-separated string → convert to array
    const skillsArray = skills ? skills.split(",").map((s) => s.trim()) : [];
    const userId = req.id; // set by isAuthenticated middleware
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = Number(phoneNumber);
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    if (resumeUrl) { user.profile.resume = resumeUrl; user.profile.resumeOriginalName = resumeOriginalName; }
    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user: buildUserPayload(user), success: true });
  } catch (error) {
    console.error("[updateProfile]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/user/auth/google/callback
//
// This is called by Google AFTER the user clicks "Allow" on Google's page.
// Passport has already run and set req.user = the MongoDB user document.
//
// Flow:
//   1. Issue JWT cookie for this user (same as normal login)
//   2. Redirect to frontend /auth/google/success page
//   3. That page reads the cookie and calls /api/v1/user/me to hydrate state
// ─────────────────────────────────────────────────────────────────────────────
export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user; // Passport sets this
    issueTokenCookie(res, user._id);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/auth/google/success`);
  } catch (error) {
    console.error("[googleAuthCallback]", error);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/login?error=google_failed`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/user/me  (protected)
// Returns the currently-logged-in user.
// Used by the frontend /auth/google/success page to hydrate Redux state.
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found", success: false });
    return res.status(200).json({ user: buildUserPayload(user), success: true });
  } catch (error) {
    console.error("[getMe]", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
