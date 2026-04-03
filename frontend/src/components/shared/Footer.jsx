// ─────────────────────────────────────────────────────────────────────────────
// components/shared/Footer.jsx
//
// Site-wide footer. Shown at the bottom of every page.
//
// Sections:
//   • Brand + description + social icons
//   • For Job Seekers links
//   • For Recruiters links
//   • Resources links (NEW)
//   • Bottom bar with copyright + tech stack
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import { Briefcase, Github, Twitter, Linkedin, Heart } from "lucide-react";

// ── Footer link columns ───────────────────────────────────────────────────────
const LINKS = {
  "For Job Seekers": [
    { label: "Browse Jobs",   href: "/jobs" },
    { label: "Search",        href: "/browse" },
    { label: "My Profile",    href: "/profile" },
    { label: "Login",         href: "/login" },
  ],
  "For Recruiters": [
    { label: "Post a Job",       href: "/admin/jobs/create" },
    { label: "Manage Companies", href: "/admin/companies" },
    { label: "View Applicants",  href: "/admin/jobs" },
    { label: "Sign Up",          href: "/signup" },
  ],
};

// ── Social icons config ───────────────────────────────────────────────────────
const SOCIALS = [
  { Icon: Github,   href: "https://github.com",   label: "GitHub" },
  { Icon: Twitter,  href: "https://twitter.com",   label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com",  label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-8">
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* ── Brand column ────────────────────────────────────────────── */}
          <div className="col-span-1 md:col-span-5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Briefcase size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                Job<span className="gradient-text">Hunt</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              The modern job portal connecting talent with opportunity.
              Find your dream career — or your next great hire.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 glass-card rounded-lg flex items-center justify-center text-white/40 hover:text-brand-400 hover:border-brand-500/30 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ─────────────────────────────────────────────── */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="col-span-1 md:col-span-3">
              <h4 className="font-display font-semibold text-sm text-white/80 mb-4 uppercase tracking-wider">
                {heading}
              </h4>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-white/40 hover:text-white/70 text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────────── */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} JobHunt. All rights reserved.
          </p>
          <p className="text-white/20 text-xs flex items-center gap-1.5">
            Built with <Heart size={11} className="text-brand-500" /> using React · Node.js · MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
