// ─────────────────────────────────────────────────────────────────────────────
// components/shared/Navbar.jsx
//
// Sticky top navigation bar shown on every page.
//
// Features:
//   • Logo + brand name
//   • Role-based nav links (Job Seeker vs Recruiter)
//   • User avatar dropdown with profile + logout
//   • Mobile hamburger menu (responsive)
//   • Active route highlighting (NEW)
//   • Scroll-aware background — gets slightly more opaque on scroll (NEW)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/authSlice.js";
import { USER_API } from "../../utils/constant.js";
import {
  Briefcase, LogOut, User, ChevronDown,
  Menu, X, LayoutDashboard, Building2,
} from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // track scroll for background change

  // ── Detect scroll to make navbar more opaque ────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll); // cleanup
  }, []);

  // ── Close dropdown when clicking anywhere outside ────────────────────────
  useEffect(() => {
    if (!dropOpen) return;
    const close = () => setDropOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropOpen]);

  // ── Logout: clear cookie on backend, clear Redux state on frontend ────────
  const logout = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null)); // clear user from Redux
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // ── Reusable active NavLink class ────────────────────────────────────────
  // NavLink receives isActive from react-router-dom automatically
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-white" : "text-white/50 hover:text-white"
    }`;

  // ── Avatar image or fallback from UI Avatars ─────────────────────────────
  const avatarSrc =
    user?.profile?.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || "U")}&background=ff2d8d&color=fff&bold=true`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-xl shadow-lg shadow-black/20"
          : "glass-card"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Briefcase size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl">
            Job<span className="gradient-text">Hunt</span>
          </span>
        </Link>

        {/* ── Desktop navigation links ─────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-8">
          {user?.role === "recruiter" ? (
            /* Recruiter nav */
            <>
              <NavLink to="/admin/companies" className={navLinkClass}>
                <span className="flex items-center gap-1.5"><Building2 size={14} />Companies</span>
              </NavLink>
              <NavLink to="/admin/jobs" className={navLinkClass}>
                <span className="flex items-center gap-1.5"><LayoutDashboard size={14} />Jobs</span>
              </NavLink>
            </>
          ) : (
            /* Job seeker nav */
            <>
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
              <NavLink to="/browse" className={navLinkClass}>Browse</NavLink>
            </>
          )}
        </div>

        {/* ── Desktop auth / user menu ─────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            /* Not logged in */
            <>
              <Link to="/login"  className="btn-outline text-sm py-2 px-4">Login</Link>
              <Link to="/signup" className="btn-glow text-sm py-2 px-4">Get Started</Link>
            </>
          ) : (
            /* Logged in — avatar dropdown */
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 glass-card rounded-xl px-3 py-2 hover:border-brand-500/30 transition-all"
              >
                <img
                  src={avatarSrc}
                  alt={user.fullname}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-white/90 leading-none">{user.fullname}</p>
                  <p className="text-xs text-white/30 capitalize mt-0.5">{user.role}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-white/40 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              {dropOpen && (
                <div className="absolute right-0 top-12 w-52 glass-card rounded-xl p-2 shadow-2xl border border-border z-50 animate-fade-in">
                  {/* User info at top */}
                  <div className="px-3 py-2 mb-1 border-b border-border/50">
                    <p className="text-xs font-semibold text-white truncate">{user.fullname}</p>
                    <p className="text-xs text-white/30 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/70 hover:text-white transition-all"
                  >
                    <User size={14} /> View Profile
                  </Link>
                  <button
                    onClick={() => { setDropOpen(false); logout(); }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-500/10 text-sm text-white/70 hover:text-brand-400 transition-all w-full text-left"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile hamburger ─────────────────────────────────────────── */}
        <button
          className="md:hidden text-white/60 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile slide-down menu ────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden glass-card border-t border-border px-4 py-4 space-y-2 animate-fade-in">
          {user?.role === "recruiter" ? (
            <>
              <Link to="/admin/companies" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-white/70 hover:text-white py-2 text-sm">
                <Building2 size={14} /> Companies
              </Link>
              <Link to="/admin/jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-white/70 hover:text-white py-2 text-sm">
                <LayoutDashboard size={14} /> Jobs
              </Link>
            </>
          ) : (
            <>
              <Link to="/"       onClick={() => setMenuOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">Home</Link>
              <Link to="/jobs"   onClick={() => setMenuOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">Jobs</Link>
              <Link to="/browse" onClick={() => setMenuOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">Browse</Link>
            </>
          )}

          {/* Auth buttons in mobile menu */}
          {!user ? (
            <div className="flex gap-3 pt-3 border-t border-border">
              <Link to="/login"  onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-2 px-4 flex-1 text-center">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-glow text-sm py-2 px-4 flex-1 text-center">Sign Up</Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-border space-y-2">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-white/70 py-2 text-sm">
                <User size={14} /> Profile
              </Link>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="flex items-center gap-2 text-brand-400 py-2 text-sm"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
