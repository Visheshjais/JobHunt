// ─────────────────────────────────────────────────────────────────────────────
// components/JobDescription.jsx
//
// Single job detail page — shown when a user clicks a JobCard.
// URL: /description/:id
//
// Sections:
//   • Job header: company logo, title, badges, Apply button
//   • Meta info grid: location, experience, applicants, posted date
//   • Full description text
//   • Requirements badges
//
// Apply button is hidden for recruiters (they post jobs, not apply).
// After applying, the button changes to "Applied!" with a green style.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setSingleJob } from "../redux/jobSlice.js";
import { JOB_API, APPLICATION_API } from "../utils/constant.js";
import Navbar from "./shared/Navbar.jsx";
import Footer from "./shared/Footer.jsx";
import { MapPin, Clock, DollarSign, Briefcase, Users, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobDescription() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleJob } = useSelector(s => s.job);
  const { user } = useSelector(s => s.auth);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${JOB_API}/get/${id}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setApplied(res.data.job.applications?.some(app => app.applicant === user?._id));
        }
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [id]);

  const applyJob = async () => {
    try {
      setApplying(true);
      const res = await axios.get(`${APPLICATION_API}/apply/${id}`, { withCredentials: true });
      if (res.data.success) {
        setApplied(true);
        toast.success("Applied successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  const daysAgo = singleJob ? Math.floor((new Date() - new Date(singleJob.createdAt)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="section-container max-w-4xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft size={16} /> Back to jobs
          </button>

          {!singleJob ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-brand-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header card */}
              <div className="glass-card rounded-2xl p-8 border border-border">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {singleJob.company?.logo
                        ? <img src={singleJob.company.logo} alt={singleJob.company.name} className="w-full h-full object-cover" />
                        : <Briefcase size={24} className="text-white/20" />
                      }
                    </div>
                    <div>
                      <h1 className="font-display font-bold text-2xl text-white">{singleJob.title}</h1>
                      <p className="text-white/50 mt-1">{singleJob.company?.name}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="badge-pink">{singleJob.position} Positions</span>
                        <span className="badge-purple">{singleJob.jobType}</span>
                        <span className="badge-green">₹{singleJob.salary} LPA</span>
                      </div>
                    </div>
                  </div>

                  {user?.role !== "recruiter" && (
                    <button
                      onClick={applyJob}
                      disabled={applied || applying}
                      className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                        applied
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-default"
                          : "btn-glow"
                      }`}
                    >
                      {applying ? <Loader2 size={15} className="animate-spin" /> : applied ? <CheckCircle size={15} /> : null}
                      {applying ? "Applying..." : applied ? "Applied!" : "Apply Now"}
                    </button>
                  )}
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                  {[
                    { icon: MapPin,      label: "Location",   val: singleJob.location },
                    { icon: Clock,       label: "Experience", val: `${singleJob.experienceLevel} Years` },
                    { icon: Users,       label: "Applicants", val: singleJob.applications?.length || 0 },
                    { icon: Briefcase,   label: "Posted",     val: daysAgo === 0 ? "Today" : `${daysAgo}d ago` },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-white/30 text-xs mb-1">
                        <Icon size={12} />{label}
                      </div>
                      <p className="text-white font-semibold text-sm">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="glass-card rounded-2xl p-8 border border-border">
                <h2 className="font-display font-semibold text-white text-xl mb-4">Job Description</h2>
                <p className="text-white/60 leading-relaxed">{singleJob.description}</p>
              </div>

              {/* Requirements */}
              {singleJob.requirements?.length > 0 && (
                <div className="glass-card rounded-2xl p-8 border border-border">
                  <h2 className="font-display font-semibold text-white text-xl mb-4">Requirements</h2>
                  <div className="flex flex-wrap gap-2">
                    {singleJob.requirements.map((req, i) => (
                      <span key={i} className="badge-purple">{req}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
