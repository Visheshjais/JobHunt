// ─────────────────────────────────────────────────────────────────────────────
// components/Home.jsx
//
// The main landing page. Sections:
//   1. Hero         — headline, search bar, category chips
//   2. Stats        — animated numbers (jobs, companies, seekers, rate)
//   3. Featured Companies — real-looking company logos + open positions (NEW)
//   4. Latest Jobs  — most recently posted jobs from DB
//   5. How It Works — 3-step process explanation (NEW)
//   6. Footer
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice.js";
import Navbar from "./shared/Navbar.jsx";
import Footer from "./shared/Footer.jsx";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx";
import LatestJobs from "./LatestJobs.jsx";
import {
  Search, Zap, Shield, TrendingUp, Star,
  Building2, Users, CheckCircle, ArrowRight, Sparkles,
} from "lucide-react";

// ── Quick-search category chips shown below the hero search bar ───────────────
const CATEGORIES = [
  "Frontend Developer", "Backend Developer", "Data Science",
  "UI/UX Designer", "DevOps", "Product Manager",
  "Full Stack", "Mobile Developer",
];

// ── Featured companies data ───────────────────────────────────────────────────
// In a real app these could come from an API. For now, realistic seed data.
// Each company has a color for its avatar placeholder when no logo is loaded.
const FEATURED_COMPANIES = [
  { name: "Google",    role: "Multiple Roles",     openings: 234, tag: "Tech Giant",    color: "from-blue-500 to-cyan-400",   letter: "G" },
  { name: "Microsoft", role: "Cloud & AI",          openings: 189, tag: "Fortune 500",  color: "from-blue-600 to-indigo-500", letter: "M" },
  { name: "Amazon",    role: "Engineering & Ops",   openings: 412, tag: "E-Commerce",   color: "from-orange-500 to-amber-400",letter: "A" },
  { name: "Flipkart",  role: "Product & Tech",      openings: 98,  tag: "Startup",      color: "from-yellow-500 to-orange-400",letter: "F" },
  { name: "Infosys",   role: "IT Services",         openings: 630, tag: "MNC",          color: "from-blue-700 to-blue-500",   letter: "I" },
  { name: "Razorpay",  role: "Fintech Engineering", openings: 47,  tag: "Unicorn",      color: "from-violet-600 to-purple-500",letter: "R" },
  { name: "Swiggy",    role: "Tech & Ops",          openings: 73,  tag: "Startup",      color: "from-orange-600 to-red-500",  letter: "S" },
  { name: "CRED",      role: "Data & Engineering",  openings: 31,  tag: "Fintech",      color: "from-brand-500 to-violet-600",letter: "C" },
];

// ── How It Works steps ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Profile",
    desc: "Sign up in seconds with email or Google. Add your skills, resume, and what you're looking for.",
    icon: Users,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
  },
  {
    step: "02",
    title: "Discover Opportunities",
    desc: "Browse thousands of jobs filtered by role, location, salary, and experience level.",
    icon: Search,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    step: "03",
    title: "Apply & Get Hired",
    desc: "One-click apply. Recruiters review your profile and reach out. Land your dream job.",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function Home() {
  useGetAllJobs(); // fetches all jobs and stores them in Redux
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Dispatch search query to Redux and navigate to browse page ────────────
  const search = () => {
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient background gradients */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-500/12 rounded-full blur-3xl" />
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="section-container relative text-center">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 border border-brand-500/20 animate-fade-up">
            <Sparkles size={13} className="text-brand-400" />
            <span className="text-xs font-semibold text-white/70">
              Over 10,000 jobs posted this month
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="font-display font-bold text-5xl md:text-7xl leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Find Your{" "}
            <span className="gradient-text">Dream Career</span>
            <br />
            <span className="text-white/70">Without The Hassle</span>
          </h1>

          <p
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Connect with top companies, discover opportunities that match your skills,
            and land the job you&apos;ve always wanted.
          </p>

          {/* Search bar */}
          <div
            className="flex gap-3 max-w-xl mx-auto mb-8 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Job title, company, or skill..."
                className="input-field pl-10"
              />
            </div>
            <button onClick={search} className="btn-glow px-6 whitespace-nowrap">
              Search Jobs
            </button>
          </div>

          {/* Category chips */}
          <div
            className="flex flex-wrap justify-center gap-2 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { dispatch(setSearchedQuery(cat)); navigate("/browse"); }}
                className="badge-purple cursor-pointer hover:bg-violet-500/25 transition-all text-xs py-1.5 px-3"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. STATS ────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-border">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10K+", label: "Active Jobs",     icon: TrendingUp },
              { value: "5K+",  label: "Companies",       icon: Building2 },
              { value: "50K+", label: "Job Seekers",     icon: Star },
              { value: "95%",  label: "Placement Rate",  icon: Zap },
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="glass-card rounded-2xl p-6 text-center border border-border hover:border-brand-500/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gradient/10 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div className="font-display font-bold text-3xl gradient-text">{value}</div>
                <div className="text-white/40 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED COMPANIES ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          {/* Section header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  <Building2 size={16} className="text-violet-400" />
                </div>
                <span className="text-violet-400 text-sm font-semibold uppercase tracking-wider">
                  Top Recruiters
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl text-white">
                Featured <span className="gradient-text">Companies</span>
              </h2>
              <p className="text-white/40 mt-2">Actively hiring right now</p>
            </div>
            <Link
              to="/browse"
              className="hidden md:flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-semibold transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Company cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_COMPANIES.map((company) => (
              <button
                key={company.name}
                onClick={() => { dispatch(setSearchedQuery(company.name)); navigate("/browse"); }}
                className="glass-card rounded-2xl p-5 border border-border hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5 text-left group"
              >
                {/* Company logo avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center font-display font-bold text-white text-lg shadow-lg`}>
                    {company.letter}
                  </div>
                  {/* "Hiring" badge */}
                  <span className="badge-green text-xs py-0.5 px-2">Hiring</span>
                </div>

                {/* Company name + role */}
                <h3 className="font-display font-bold text-white text-base group-hover:text-brand-300 transition-colors">
                  {company.name}
                </h3>
                <p className="text-white/40 text-xs mt-0.5 mb-3">{company.role}</p>

                {/* Footer: tag + opening count */}
                <div className="flex items-center justify-between">
                  <span className="badge-purple text-xs py-0.5 px-2">{company.tag}</span>
                  <span className="text-white/30 text-xs">
                    {company.openings} openings
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. LATEST JOBS (from DB) ────────────────────────────────────── */}
      <LatestJobs />

      {/* ── 5. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="section-container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6 border border-violet-500/20">
              <Zap size={13} className="text-violet-400" />
              <span className="text-xs font-semibold text-white/70">Simple Process</span>
            </div>
            <h2 className="font-display font-bold text-4xl text-white">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-white/40 mt-3 max-w-md mx-auto">
              From profile to placement in 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line between steps (desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon, color, bg }) => (
              <div key={step} className="relative text-center">
                {/* Step number badge */}
                <div className="text-xs font-bold text-white/20 tracking-[0.2em] mb-4">{step}</div>

                {/* Icon circle */}
                <div className={`w-20 h-20 rounded-2xl ${bg} border border-border flex items-center justify-center mx-auto mb-5`}>
                  <Icon size={28} className={color} />
                </div>

                <h3 className="font-display font-bold text-white text-xl mb-3">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA below the steps */}
          <div className="text-center mt-14">
            <Link to="/signup" className="btn-glow inline-flex items-center gap-2 px-8 py-4 text-base">
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
