// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Root Router
//
// Defines all the URL routes in the app.
// react-router-dom v6 uses createBrowserRouter for cleaner route definitions.
//
// Routes:
//   /                          → Home page (job listings, stats, hero)
//   /login                     → Login with email or Google
//   /signup                    → Register with email or Google
//   /auth/google/success       → Temporary page after Google OAuth login
//   /jobs                      → All jobs with filters
//   /browse                    → Search results page
//   /description/:id           → Single job details + apply button
//   /profile                   → User profile page
//   /admin/companies           → Recruiter: manage companies (protected)
//   /admin/companies/create    → Recruiter: add a company (protected)
//   /admin/companies/:id       → Recruiter: edit company details (protected)
//   /admin/jobs                → Recruiter: manage posted jobs (protected)
//   /admin/jobs/create         → Recruiter: post a new job (protected)
//   /admin/jobs/:id/applicants → Recruiter: view applicants (protected)
//
// ProtectedRoute wraps recruiter-only pages — it redirects to /login if
// the logged-in user is not a recruiter.
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import GoogleSuccess from "./components/auth/GoogleSuccess.jsx";
import Jobs from "./components/Jobs.jsx";
import Browse from "./components/Browse.jsx";
import JobDescription from "./components/JobDescription.jsx";
import Profile from "./components/Profile.jsx";
import Companies from "./components/admin/Companies.jsx";
import CompanyCreate from "./components/admin/CompanyCreate.jsx";
import CompanySetup from "./components/admin/CompanySetup.jsx";
import AdminJobs from "./components/admin/AdminJobs.jsx";
import PostJob from "./components/admin/PostJob.jsx";
import Applicants from "./components/admin/Applicants.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

const router = createBrowserRouter([
  // ── Public pages ───────────────────────────────────────────────────────────
  { path: "/",                element: <Home /> },
  { path: "/login",           element: <Login /> },
  { path: "/signup",          element: <Signup /> },

  // ── Google OAuth callback page (NEW) ───────────────────────────────────────
  // Backend redirects here after successful Google login.
  // This page fetches the user and stores them in Redux, then goes to "/".
  { path: "/auth/google/success", element: <GoogleSuccess /> },

  // ── Job seeker pages ───────────────────────────────────────────────────────
  { path: "/jobs",              element: <Jobs /> },
  { path: "/browse",            element: <Browse /> },
  { path: "/description/:id",   element: <JobDescription /> },
  { path: "/profile",           element: <Profile /> },

  // ── Recruiter-only pages (wrapped in ProtectedRoute) ───────────────────────
  { path: "/admin/companies",         element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: "/admin/companies/create",  element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> },
  { path: "/admin/companies/:id",     element: <ProtectedRoute><CompanySetup /></ProtectedRoute> },
  { path: "/admin/jobs",              element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
  { path: "/admin/jobs/create",       element: <ProtectedRoute><PostJob /></ProtectedRoute> },
  { path: "/admin/jobs/:id/applicants", element: <ProtectedRoute><Applicants /></ProtectedRoute> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
