// ─────────────────────────────────────────────────────────────────────────────
// components/Browse.jsx
//
// Shows search results when the user uses the hero search bar or category chips.
// Reads searchedQuery from Redux (set by the Home page search).
//
// If no search query, shows all available jobs.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar.jsx";
import Footer from "./shared/Footer.jsx";
import JobCard from "./JobCard.jsx";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx";
import { setSearchedQuery } from "../redux/jobSlice.js";
import { Search, X, Briefcase } from "lucide-react";

export default function Browse() {
  useGetAllJobs(); // make sure jobs are loaded in Redux

  const { allJobs, searchedQuery } = useSelector((s) => s.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Filter jobs by the search query from Redux ────────────────────────────
  const filtered = searchedQuery
    ? allJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          j.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          j.location?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          j.company?.name?.toLowerCase().includes(searchedQuery.toLowerCase())
      )
    : allJobs;

  // ── Clear search and go back to all results ───────────────────────────────
  const clearSearch = () => {
    dispatch(setSearchedQuery(""));
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="section-container">

          {/* ── Page header ────────────────────────────────────────────── */}
          <div className="mb-10">
            {/* Search context badge */}
            {searchedQuery && (
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Search size={14} className="text-brand-400" />
                <span className="text-white/40 text-sm">Results for</span>
                <span className="badge-pink flex items-center gap-2">
                  {searchedQuery}
                  {/* Clear search button */}
                  <button onClick={clearSearch} className="hover:text-white transition-colors">
                    <X size={11} />
                  </button>
                </span>
              </div>
            )}

            <h1 className="font-display font-bold text-4xl text-white">
              {searchedQuery ? "Search" : "Browse"}{" "}
              <span className="gradient-text">Results</span>
            </h1>
            <p className="text-white/40 mt-2">
              {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
            </p>
          </div>

          {/* ── Empty state ─────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
                <Briefcase size={24} className="text-white/20" />
              </div>
              <p className="text-white/30 font-medium text-lg">No jobs found</p>
              <p className="text-white/20 text-sm mt-2">
                Try a different search term or{" "}
                <button onClick={clearSearch} className="text-brand-400 hover:text-brand-300 transition-colors">
                  browse all jobs
                </button>
              </p>
            </div>
          ) : (
            /* ── Job cards grid ──────────────────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
