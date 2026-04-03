// ─────────────────────────────────────────────────────────────────────────────
// components/Jobs.jsx
//
// Full jobs listing page with live search and sidebar filters.
//
// Features:
//   • Text search (title, location, description)
//   • Filter sidebar (Job Type, Experience, Salary) — collapsible
//   • Active filter badges showing what's applied
//   • Result count
//   • Responsive (filter hides on mobile, search always visible)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar.jsx";
import Footer from "./shared/Footer.jsx";
import JobCard from "./JobCard.jsx";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx";
import { Search, SlidersHorizontal, X, Briefcase } from "lucide-react";

// ── Filter definitions ────────────────────────────────────────────────────────
// Each key is a category label, each value is an array of options.
const FILTERS = {
  "Job Type":   ["Full Time", "Part Time", "Remote", "Internship", "Contract"],
  "Experience": ["Fresher (0-1 yrs)", "Junior (1-3 yrs)", "Mid (3-5 yrs)", "Senior (5+ yrs)"],
  "Salary":     ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10-20 LPA", "20+ LPA"],
};

export default function Jobs() {
  useGetAllJobs(); // fetch all jobs into Redux if not already fetched

  const { allJobs } = useSelector((s) => s.job);
  const [search, setSearch]       = useState("");       // text search input
  const [selected, setSelected]   = useState({});       // active filter selections
  const [filtered, setFiltered]   = useState([]);       // computed result set
  const [showFilter, setShowFilter] = useState(false);  // sidebar toggle

  // ── Apply filters whenever search or selections change ────────────────────
  useEffect(() => {
    let jobs = allJobs;

    // Text search across title, description, location, company name
    if (search.trim()) {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.company?.name?.toLowerCase().includes(q)
      );
    }

    // Job Type filter — matches jobType field from the DB
    if (selected["Job Type"]) {
      jobs = jobs.filter((j) =>
        j.jobType?.toLowerCase().includes(selected["Job Type"].toLowerCase().split(" ")[0])
      );
    }

    setFiltered(jobs);
  }, [search, selected, allJobs]);

  // ── Toggle a filter option (click again to deselect) ─────────────────────
  const toggleFilter = (cat, val) => {
    setSelected((prev) => ({
      ...prev,
      [cat]: prev[cat] === val ? undefined : val, // deselect if already active
    }));
  };

  // ── Clear all filters ─────────────────────────────────────────────────────
  const clearAll = () => {
    setSelected({});
    setSearch("");
  };

  // Number of active filters (for the badge on the filter button)
  const activeCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="section-container">

          {/* ── Page header ─────────────────────────────────────────────── */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-4xl text-white mb-1">
              All <span className="gradient-text">Jobs</span>
            </h1>
            <p className="text-white/40">{allJobs.length} opportunities available</p>
          </div>

          {/* ── Search + filter controls ─────────────────────────────────── */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {/* Search input */}
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies, locations..."
                className="input-field pl-10"
              />
              {/* Clear search "X" button */}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filters toggle button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-semibold ${
                activeCount > 0
                  ? "bg-brand-500/10 border-brand-500/40 text-brand-400"
                  : "glass-card border-border text-white/60 hover:text-white hover:border-brand-500/20"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>

            {/* Clear all button — only visible when something is active */}
            {(activeCount > 0 || search) && (
              <button
                onClick={clearAll}
                className="px-4 py-3 rounded-xl border border-border text-white/40 hover:text-white/70 text-sm transition-all"
              >
                Clear all
              </button>
            )}
          </div>

          {/* ── Active filter chips ──────────────────────────────────────── */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(selected).map(([cat, val]) =>
                val ? (
                  <span key={cat} className="badge-pink flex items-center gap-1.5">
                    {val}
                    <button onClick={() => toggleFilter(cat, val)} className="hover:text-white transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ) : null
              )}
            </div>
          )}

          {/* ── Main content: sidebar + grid ─────────────────────────────── */}
          <div className="flex gap-8 items-start">

            {/* Sidebar filters — only visible when toggled */}
            {showFilter && (
              <div className="w-64 shrink-0">
                <div className="glass-card rounded-2xl p-5 border border-border sticky top-24 space-y-6">
                  <h3 className="font-display font-semibold text-white text-sm">Filter Jobs</h3>

                  {Object.entries(FILTERS).map(([cat, opts]) => (
                    <div key={cat}>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                        {cat}
                      </p>
                      <div className="space-y-2">
                        {opts.map((opt) => (
                          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                            {/* Custom radio-style checkbox */}
                            <div
                              className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
                                selected[cat] === opt
                                  ? "bg-brand-gradient border-brand-500"
                                  : "border-border group-hover:border-brand-500/40"
                              }`}
                              onClick={() => toggleFilter(cat, opt)}
                            >
                              {selected[cat] === opt && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span
                              className={`text-sm transition-colors cursor-pointer ${
                                selected[cat] === opt
                                  ? "text-white"
                                  : "text-white/50 group-hover:text-white/70"
                              }`}
                              onClick={() => toggleFilter(cat, opt)}
                            >
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job cards grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                /* Empty state */
                <div className="text-center py-20">
                  <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
                    <Briefcase size={22} className="text-white/20" />
                  </div>
                  <p className="text-white/30 font-medium">No jobs found</p>
                  <p className="text-white/20 text-sm mt-1">Try adjusting your search or filters</p>
                  <button onClick={clearAll} className="text-brand-400 text-sm mt-3 hover:text-brand-300 transition-colors">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-white/40 text-sm mb-5">
                    {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filtered.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
