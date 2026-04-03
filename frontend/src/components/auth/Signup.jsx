// ─────────────────────────────────────────────────────────────────────────────
// components/auth/Signup.jsx
//
// Registration page with:
//   • Google One-Click signup (NEW — fastest path to joining)
//   • Traditional email/password form
//   • Role selection (Job Seeker / Recruiter)
//   • Optional profile photo upload
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API, GOOGLE_AUTH_URL } from "../../utils/constant.js";
import { Briefcase, Eye, EyeOff, Loader2, Upload } from "lucide-react";

// Google "G" SVG logo — inline, no external dependency
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Signup() {
  const [input, setInput] = useState({
    fullname: "", email: "", phoneNumber: "", password: "",
    role: "student", file: null,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) => {
    if (e.target.name === "file") setInput({ ...input, file: e.target.files[0] });
    else setInput({ ...input, [e.target.name]: e.target.value });
  };

  // ── Email/password registration ──────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    // FormData is needed because we might send a file (profile photo)
    const formData = new FormData();
    Object.entries(input).forEach(([k, v]) => { if (v) formData.append(k, v); });
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Google signup — full-page redirect to backend OAuth URL ─────────────
  const handleGoogleSignup = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 py-12">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">
              Job<span className="gradient-text">Hunt</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white">Create account</h1>
          <p className="text-white/40 mt-2 text-sm">Join thousands finding their dream jobs</p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-border">
          {/* Role toggle */}
          <div className="flex bg-card rounded-xl p-1 mb-6 border border-border">
            {["student", "recruiter"].map((r) => (
              <button
                key={r}
                onClick={() => setInput({ ...input, role: r })}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  input.role === r ? "bg-brand-gradient text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {r === "student" ? "Job Seeker" : "Recruiter"}
              </button>
            ))}
          </div>

          {/* ── Google Sign-Up button ─────────────────────────────────── */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 mb-5 shadow-sm hover:shadow-md"
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-white/30 text-xs font-medium">or fill in the form</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email/password form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Full Name</label>
              <input name="fullname" value={input.fullname} onChange={change}
                placeholder="Your full name" className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Email</label>
              <input name="email" type="email" value={input.email} onChange={change}
                placeholder="you@example.com" className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Phone Number</label>
              <input name="phoneNumber" value={input.phoneNumber} onChange={change}
                placeholder="9876543210" className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} value={input.password} onChange={change}
                  placeholder="••••••••" className="input-field pr-10" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Profile photo upload */}
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                Profile Photo <span className="text-white/20 normal-case font-normal">(optional)</span>
              </label>
              <label className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-brand-500/40 transition-all">
                <Upload size={16} className="text-white/30" />
                <span className="text-white/40 text-sm truncate">
                  {input.file ? input.file.name : "Choose photo..."}
                </span>
                <input name="file" type="file" accept="image/*" onChange={change} className="hidden" />
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
