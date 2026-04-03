// ─────────────────────────────────────────────────────────────────────────────
// components/LatestJobs.jsx
//
// Shows the 6 most recently posted jobs from the database.
// Displayed on the Home page.
//
// If there are no jobs yet (empty DB), shows a helpful empty state.
// ─────────────────────────────────────────────────────────────────────────────

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import JobCard from "./JobCard.jsx";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function LatestJobs() {
  // Get all jobs from Redux — these were fetched by useGetAllJobs() in Home.jsx
  const { allJobs } = useSelector((s) => s.job);

  // Only show the 6 newest — sorted by date (newest first from backend)
  const latestJobs = allJobs.slice(0, 6);

  return (
    <section className="py-20 border-t border-border">
      <div className="section-container">
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient/15 flex items-center justify-center">
                <TrendingUp size={16} className="text-brand-400" />
              </div>
              <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider">
                Latest Openings
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl text-white">
              Trending <span className="gradient-text">Jobs</span>
            </h2>
            <p className="text-white/40 mt-2">Fresh opportunities added daily</p>
          </div>

          {/* "View all" link on desktop */}
          {latestJobs.length > 0 && (
            <Link
              to="/jobs"
              className="hidden md:flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-semibold transition-colors"
            >
              View all jobs <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {latestJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} className="text-white/20" />
            </div>
            <p className="text-white/30 font-medium">No jobs posted yet</p>
            <p className="text-white/20 text-sm mt-1">Check back soon — recruiters are joining every day!</p>
          </div>
        ) : (
          <>
            {/* ── Job cards grid ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Mobile "view all" button */}
            <div className="text-center mt-10 md:hidden">
              <Link to="/jobs" className="btn-outline inline-flex items-center gap-2">
                View All Jobs <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
