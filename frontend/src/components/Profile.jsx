// ─────────────────────────────────────────────────────────────────────────────
// components/Profile.jsx
//
// User profile page — shown after clicking "View Profile" in the navbar.
//
// Sections:
//   • Profile header: photo, name, bio, skills
//   • Edit profile button → opens UpdateDialog modal
//   • Applied Jobs table (student only) — fetched by useGetAppliedJobs hook
//
// UpdateDialog is a modal form (no separate route needed) that lets the user
// update their name, email, phone, bio, skills, and upload a resume.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../redux/authSlice.js";
import { USER_API, APPLICATION_API } from "../utils/constant.js";
import Navbar from "./shared/Navbar.jsx";
import Footer from "./shared/Footer.jsx";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs.jsx";
import { useSelector as useAppSelector } from "react-redux";
import { Edit3, FileText, Upload, Loader2, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";

function UpdateDialog({ open, onClose }) {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const change = e => {
    if (e.target.name === "file") setInput({ ...input, file: e.target.files[0] });
    else setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(input).forEach(([k, v]) => { if (v) formData.append(k, v); });
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated!");
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl w-full max-w-md p-8 border border-border">
        <h2 className="font-display font-bold text-xl text-white mb-6">Update Profile</h2>
        <form onSubmit={submit} className="space-y-4">
          {[
            { name: "fullname",    label: "Full Name",    type: "text" },
            { name: "email",       label: "Email",        type: "email" },
            { name: "phoneNumber", label: "Phone",        type: "text" },
            { name: "bio",         label: "Bio",          type: "text" },
            { name: "skills",      label: "Skills (comma-separated)", type: "text" },
          ].map(f => (
            <div key={f.name}>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input name={f.name} type={f.type} value={input[f.name]} onChange={change} className="input-field" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">Resume (PDF)</label>
            <label className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-brand-500/40 transition-all">
              <Upload size={15} className="text-white/30" />
              <span className="text-white/40 text-sm">{input.file ? input.file.name : "Upload resume"}</span>
              <input name="file" type="file" accept=".pdf" onChange={change} className="hidden" />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-glow py-2.5 text-sm flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  pending:  "badge-orange",
  accepted: "badge-green",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20 badge",
};

export default function Profile() {
  useGetAppliedJobs();
  const { user } = useSelector(s => s.auth);
  const { applicants } = useSelector(s => s.application);
  const appliedJobs = useAppSelector(s => s.application.applicants);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <UpdateDialog open={editOpen} onClose={() => setEditOpen(false)} />

      <div className="pt-24 pb-20">
        <div className="section-container max-w-4xl space-y-6">

          {/* Profile card */}
          <div className="glass-card rounded-2xl p-8 border border-border">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <img
                src={user?.profile?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.fullname}&background=ff2d8d&color=fff&size=128`}
                alt={user?.fullname}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-500/30"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-display font-bold text-2xl text-white">{user?.fullname}</h1>
                    <p className="text-white/50 mt-1 text-sm">{user?.profile?.bio || "No bio added yet"}</p>
                  </div>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="flex items-center gap-2 glass-card rounded-xl px-3 py-2 text-white/50 hover:text-white border border-border hover:border-brand-500/30 transition-all text-sm"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-xs text-white/30 mb-1">Email</p>
                    <p className="text-white/70 text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-xs text-white/30 mb-1">Phone</p>
                    <p className="text-white/70 text-sm font-medium">{user?.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card rounded-2xl p-6 border border-border">
            <h2 className="font-display font-semibold text-white mb-4">Skills</h2>
            {user?.profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.map((s, i) => <span key={i} className="badge-purple">{s}</span>)}
              </div>
            ) : (
              <p className="text-white/30 text-sm">No skills added yet</p>
            )}
          </div>

          {/* Resume */}
          <div className="glass-card rounded-2xl p-6 border border-border">
            <h2 className="font-display font-semibold text-white mb-4">Resume</h2>
            {user?.profile?.resume ? (
              <a href={user.profile.resume} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:border-brand-500/30 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <FileText size={16} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium group-hover:text-brand-300 transition-colors">
                    {user.profile.resumeOriginalName || "Resume.pdf"}
                  </p>
                  <p className="text-white/30 text-xs">Click to view</p>
                </div>
              </a>
            ) : (
              <p className="text-white/30 text-sm">No resume uploaded</p>
            )}
          </div>

          {/* Applied Jobs */}
          <div className="glass-card rounded-2xl p-6 border border-border">
            <h2 className="font-display font-semibold text-white mb-5">Applied Jobs</h2>
            {!appliedJobs || appliedJobs.length === 0 ? (
              <div className="text-center py-10">
                <Briefcase size={32} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appliedJobs.map(app => (
                  <div key={app._id} className="flex items-center justify-between bg-card rounded-xl p-4 border border-border hover:border-border/80 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden">
                        {app.job?.company?.logo
                          ? <img src={app.job.company.logo} className="w-full h-full object-cover" />
                          : <Briefcase size={14} className="text-white/20" />
                        }
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-medium">{app.job?.title}</p>
                        <p className="text-white/30 text-xs">{app.job?.company?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-white/20 text-xs">
                        <Clock size={11} />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <span className={STATUS_STYLES[app.status] || "badge-orange"}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
