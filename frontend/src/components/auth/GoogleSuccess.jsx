// ─────────────────────────────────────────────────────────────────────────────
// components/auth/GoogleSuccess.jsx
//
// This page is shown BRIEFLY after a successful Google login.
//
// The flow:
//   1. Google redirects user to our backend callback
//   2. Backend sets a JWT cookie and redirects to THIS page (/auth/google/success)
//   3. This page calls GET /api/v1/user/me (which reads the JWT cookie)
//   4. We get the user data back and store it in Redux
//   5. We redirect the user to the homepage
//
// Why not redirect directly to "/"?
//   Because the frontend needs to load the user into Redux state.
//   A direct redirect would skip this step — the user would appear logged out
//   even though the cookie exists.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/authSlice.js";
import { USER_API } from "../../utils/constant.js";
import { Loader2, Briefcase } from "lucide-react";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // ── Fetch the current user using the JWT cookie set by backend ─────────
    // withCredentials: true is required to send the cookie cross-origin
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${USER_API}/me`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUser(res.data.user)); // store user in Redux
          toast.success(`Welcome, ${res.data.user.fullname}! 🎉`);
          navigate("/"); // go to homepage
        } else {
          throw new Error("Failed to get user");
        }
      } catch (err) {
        console.error("[GoogleSuccess] Error fetching user:", err);
        toast.error("Google sign-in failed. Please try again.");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, dispatch]);

  // ── Loading screen shown while we fetch user data ─────────────────────────
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
      {/* Animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-2xl shadow-brand-500/30">
        <Briefcase size={24} className="text-white" />
      </div>

      {/* Spinner + message */}
      <div className="text-center">
        <Loader2 size={32} className="animate-spin text-brand-400 mx-auto mb-4" />
        <p className="text-white font-semibold text-lg">Signing you in with Google...</p>
        <p className="text-white/40 text-sm mt-2">This will only take a moment</p>
      </div>
    </div>
  );
}
