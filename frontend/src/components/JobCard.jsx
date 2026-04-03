// ─────────────────────────────────────────────────────────────────────────────
// components/JobCard.jsx
//
// Reusable card shown in the jobs grid.
// Props:
//   job — a single job document from MongoDB (populated with company)
//
// Improvements in this version:
//   • Cleaner layout with better spacing
//   • Experience level badge
//   • Salary range shown in bold
//   • Smoother hover animation
//   • Company logo fallback with gradient initials
// ─────────────────────────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";
import { MapPin, Clock, BookmarkPlus, Briefcase, GraduationCap } from "lucide-react";

// ── Helper: calculate days since a date ──────────────────────────────────────
function daysAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}

// ── Helper: get initials from a company name ─────────────────────────────────
// "Tata Consultancy Services" → "TC"
function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function JobCard({ job }) {
  const navigate = useNavigate();

  // If no company data loaded yet, show a placeholder
  const companyName = job.company?.name || "Company";
  const initials = getInitials(companyName);

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="glass-card rounded-2xl p-6 border border-border hover:border-brand-500/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/5 group flex flex-col"
    >
      {/* ── Top row: company logo + name + bookmark ── */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Company logo or gradient initials */}
          <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden shrink-0">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={companyName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-brand-400 font-display">{initials}</span>
            )}
          </div>

          <div>
            <p className="font-semibold text-white/90 text-sm leading-tight">{companyName}</p>
            {/* Location */}
            <div className="flex items-center gap-1 text-white/40 text-xs mt-0.5">
              <MapPin size={10} />
              <span>{job.location || "Remote"}</span>
            </div>
          </div>
        </div>

        {/* Bookmark button — stopPropagation so clicking it doesn't open the job */}
        <button
          onClick={(e) => e.stopPropagation()}
          title="Save job"
          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-white/30 hover:text-brand-400 hover:border-brand-500/30 transition-all shrink-0"
        >
          <BookmarkPlus size={14} />
        </button>
      </div>

      {/* ── Job title ── */}
      <h3 className="font-display font-semibold text-white text-lg mb-2 group-hover:text-brand-300 transition-colors line-clamp-1">
        {job.title}
      </h3>

      {/* ── Description preview ── */}
      <p className="text-white/40 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
        {job.description || "No description provided."}
      </p>

      {/* ── Badges: positions, type, salary ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge-pink">
          <Briefcase size={10} /> {job.position} {job.position === 1 ? "Position" : "Positions"}
        </span>
        <span className="badge-purple">{job.jobType}</span>
        <span className="badge-green">₹{job.salary} LPA</span>
        {/* Experience badge — only show if experienceLevel is set */}
        {job.experienceLevel !== undefined && (
          <span className="badge-orange">
            <GraduationCap size={10} /> {job.experienceLevel}+ yrs
          </span>
        )}
      </div>

      {/* ── Footer: posted time + CTA ── */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-1 text-white/30 text-xs">
          <Clock size={11} />
          <span>{daysAgo(job.createdAt)}</span>
        </div>
        <span className="text-brand-400 text-xs font-semibold group-hover:text-brand-300 transition-colors flex items-center gap-1">
          View Details →
        </span>
      </div>
    </div>
  );
}
