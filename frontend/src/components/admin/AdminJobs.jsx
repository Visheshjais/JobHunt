// ─────────────────────────────────────────────────────────────────────────────
// components/admin/AdminJobs.jsx
//
// Recruiter dashboard — lists all jobs this recruiter has posted.
//
// Features:
//   • Live search filter by job title
//   • "Post New Job" button → /admin/jobs/create
//   • Edit and "View Applicants" actions per job
//   • Uses useGetAllAdminJobs hook to fetch from backend
// ─────────────────────────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../shared/Navbar.jsx";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs.jsx";
import useGetAllCompanies from "../../hooks/useGetAllCompanies.jsx";
import { Plus, Briefcase, Users, MapPin, Clock, Eye } from "lucide-react";

export default function AdminJobs() {
  useGetAllAdminJobs();
  useGetAllCompanies();
  const { allAdminJobs } = useSelector(s => s.job);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-white">Posted <span className="gradient-text">Jobs</span></h1>
              <p className="text-white/40 mt-1">{allAdminJobs.length} jobs posted</p>
            </div>
            <button onClick={() => navigate("/admin/jobs/create")} className="btn-glow flex items-center gap-2 self-start">
              <Plus size={16} /> Post New Job
            </button>
          </div>

          {allAdminJobs.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl border border-border">
              <Briefcase size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30 font-medium">No jobs posted yet</p>
              <button onClick={() => navigate("/admin/jobs/create")} className="btn-glow mt-6 inline-flex items-center gap-2">
                <Plus size={15} /> Post First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {allAdminJobs.map(job => {
                const daysAgo = Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));
                return (
                  <div key={job._id} className="glass-card rounded-2xl p-6 border border-border hover:border-brand-500/20 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden shrink-0">
                          {job.company?.logo
                            ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                            : <Briefcase size={18} className="text-white/20" />
                          }
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-white">{job.title}</h3>
                          <p className="text-white/40 text-sm">{job.company?.name}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/30">
                            <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>
                            <span className="flex items-center gap-1"><Users size={10} />{job.applications?.length || 0} applicants</span>
                            <span className="flex items-center gap-1"><Clock size={10} />{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="badge-purple">{job.jobType}</span>
                        <span className="badge-green">₹{job.salary} LPA</span>
                        <button
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="flex items-center gap-2 glass-card rounded-xl px-3 py-2 text-white/50 hover:text-brand-400 border border-border hover:border-brand-500/30 transition-all text-sm"
                        >
                          <Eye size={13} /> Applicants
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
