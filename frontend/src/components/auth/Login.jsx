// ─────────────────────────────────────────────────────────────────────────────
// components/auth/Login.jsx
//
// Login page with:
//   • Email + password form (existing)
//   • Google OAuth button (NEW)
//   • Role toggle (Student / Recruiter)
//
// Google login flow explained:
//   1. User clicks "Continue with Google"
//   2. Browser navigates to our backend Google auth URL
//   3. Backend redirects to Google's login page
//   4. Google sends user back to backend callback
//   5. Backend sets JWT cookie and redirects to /auth/google/success
//   6. That page calls /api/v1/user/me and stores user in Redux
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setLoading, setUser } from "../../redux/authSlice.js";
import { USER_API, GOOGLE_AUTH_URL } from "../../utils/constant.js";
import { Briefcase, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect } from "react";

// Google "G" logo SVG — inline so no external image dependency
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "", role: "student" });
  const [showPw, setShowPw] = useState(false);
  const { loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── Show error if Google login failed ────────────────────────────────────
  useEffect(() => {
    if (searchParams.get("error") === "google_failed") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  const change = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  // ── Handle email+password form submit ────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Handle Google button click ───────────────────────────────────────────
  // We do a full-page redirect (not fetch) because OAuth requires it.
  // The browser must navigate to Google's domain for the user to log in.
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">
              Job<span className="gradient-text">Hunt</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white">Welcome back</h1>
          <p className="text-white/40 mt-2 text-sm">Sign in to continue your journey</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 border border-border">
          {/* Role toggle */}
          <div className="flex bg-card rounded-xl p-1 mb-6 border border-border">
            {["student", "recruiter"].map((r) => (
              <button
                key={r}
                onClick={() => setInput({ ...input, role: r })}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  input.role === r
                    ? "bg-brand-gradient text-white shadow-lg"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {r === "student" ? "Job Seeker" : "Recruiter"}
              </button>
            ))}
          </div>

          {/* ── Google Sign-In button ─────────────────────────────────── */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 mb-5 shadow-sm hover:shadow-md"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-white/30 text-xs font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email + Password form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={input.email}
                onChange={change}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={input.password}
                  onChange={change}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
