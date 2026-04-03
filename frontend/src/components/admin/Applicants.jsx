// ─────────────────────────────────────────────────────────────────────────────
// components/admin/Applicants.jsx
//
// Page where a recruiter sees everyone who applied to one of their jobs.
// Shows applicant name, email, phone, resume link, and application status.
// Recruiter can accept or reject each applicant directly from this page.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAllApplicants } from "../../redux/applicationSlice.js";
import { APPLICATION_API } from "../../utils/constant.js";
import Navbar from "../shared/Navbar.jsx";
import { ArrowLeft, User, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS = ["accepted", "rejected"];

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants } = useSelector(s => s.application);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API}/${id}/applicants`, { withCredentials: true });
        if (res.data.success) dispatch(setAllApplicants(res.data.job.applications));
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [id]);

  const updateStatus = async (applicationId, status) => {
    try {
      const res = await axios.post(`${APPLICATION_API}/status/${applicationId}/update`, { status }, { withCredentials: true });
      if (res.data.success) {
        toast.success(`Status updated to ${status}`);
        // Refresh
        const res2 = await axios.get(`${APPLICATION_API}/${id}/applicants`, { withCredentials: true });
        if (res2.data.success) dispatch(setAllApplicants(res2.data.job.applications));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="section-container">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft size={16} /> Back to jobs
          </button>

          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-white">
              <span className="gradient-text">Applicants</span>
            </h1>
            <p className="text-white/40 mt-1">{applicants?.length || 0} applications received</p>
          </div>

          {!applicants || applicants.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl border border-border">
              <User size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30 font-medium">No applicants yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map(app => (
                <div key={app._id} className="glass-card rounded-2xl p-6 border border-border hover:border-border/80 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={app.applicant?.profile?.profilePhoto || `https://ui-avatars.com/api/?name=${app.applicant?.fullname}&background=ff2d8d&color=fff`}
                        alt={app.applicant?.fullname}
                        className="w-12 h-12 rounded-xl object-cover border border-border"
                      />
                      <div>
                        <h3 className="font-semibold text-white">{app.applicant?.fullname}</h3>
                        <p className="text-white/40 text-sm">{app.applicant?.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {app.applicant?.profile?.skills?.slice(0, 3).map((s, i) => (
                            <span key={i} className="badge-purple text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {app.applicant?.profile?.resume && (
                        <a href={app.applicant.profile.resume} target="_blank" rel="noreferrer"
                          className="btn-outline text-xs py-1.5 px-3">
                          Resume
                        </a>
                      )}

                      <span className={`badge ${
                        app.status === "accepted" ? "badge-green" :
                        app.status === "rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        "badge-orange"
                      }`}>
                        {app.status}
                      </span>

                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(app._id, "accepted")}
                            className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => updateStatus(app._id, "rejected")}
                            className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all">
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
