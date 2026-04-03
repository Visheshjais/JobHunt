// ─────────────────────────────────────────────────────────────────────────────
// components/admin/ProtectedRoute.jsx
//
// A wrapper component that guards recruiter-only pages.
//
// How it works:
//   - Reads the user from Redux (state.auth.user)
//   - If the user is not logged in OR is not a "recruiter" → redirect to "/"
//   - If the user IS a recruiter → render the wrapped page (children)
//
// Usage in App.jsx:
//   <ProtectedRoute><AdminJobs /></ProtectedRoute>
//
// <Navigate replace> does the redirect. "replace" means it replaces the
// current history entry so the user can't press Back to get to the admin page.
// ─────────────────────────────────────────────────────────────────────────────

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((s) => s.auth);

  // Not logged in, or logged in as a student — redirect to home
  if (!user || user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  // User is a recruiter — render the page they asked for
  return children;
}
