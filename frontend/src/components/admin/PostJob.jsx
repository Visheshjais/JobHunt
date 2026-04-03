// ─────────────────────────────────────────────────────────────────────────────
// components/admin/PostJob.jsx
//
// Page where a recruiter posts a new job listing.
// All fields required: title, description, requirements, salary, location,
// jobType, experience, position count, and which company to link it to.
//
// requirements is entered as comma-separated text and split on the backend.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { JOB_API } from "../../utils/constant.js";
import Navbar from "../shared/Navbar.jsx";
import { ArrowLeft, Loader2, Briefcase } from "lucide-react";

export default function PostJob() {
  const navigate = useNavigate();
  const { companies } = useSelector(s => s.company);
  const [input, setInput] = useState({
    title: "", description: "", requirements: "", salary: "",
    location: "", jobType: "Full Time", experience: "", position: "", companyId: "",
  });
  const [loading, setLoading] = useState(false);

  const change = e => setInput({ ...input, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API}/post`, input, { withCredentials: true });
      if (res.data.success) {
        toast.success("Job posted successfully!");
        navigate("/admin/jobs");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="section-container max-w-2xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="glass-card rounded-2xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/10 flex items-center justify-center">
                <Briefcase size={18} className="text-brand-400" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-white">Post New Job</h1>
                <p className="text-white/40 text-xs">Fill in the details below</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "title",       label: "Job Title",        placeholder: "Senior React Developer" },
                  { name: "salary",      label: "Salary (LPA)",     placeholder: "12" },
                  { name: "location",    label: "Location",         placeholder: "Bangalore, India" },
                  { name: "experience",  label: "Experience (Yrs)", placeholder: "2" },
                  { name: "position",    label: "No. of Positions", placeholder: "3" },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">{f.label}</label>
                    <input name={f.name} value={input[f.name]} onChange={change} placeholder={f.placeholder} className="input-field" required />
                  </div>
                ))}

                {/* Job Type */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Job Type</label>
                  <select name="jobType" value={input.jobType} onChange={change}
                    className="input-field bg-card">
                    {["Full Time", "Part Time", "Remote", "Internship", "Contract"].map(t => (
                      <option key={t} value={t} className="bg-card">{t}</option>
                    ))}
                  </select>
                </div>

                {/* Company */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Company</label>
                  <select name="companyId" value={input.companyId} onChange={change}
                    className="input-field bg-card" required>
                    <option value="" className="bg-card">Select company</option>
                    {companies.map(c => (
                      <option key={c._id} value={c._id} className="bg-card">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Description</label>
                <textarea name="description" value={input.description} onChange={change}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4} className="input-field resize-none" required />
              </div>

              {/* Requirements */}
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Requirements (comma-separated)</label>
                <input name="requirements" value={input.requirements} onChange={change}
                  placeholder="React, Node.js, MongoDB, REST APIs" className="input-field" required />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate(-1)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading || companies.length === 0}
                  className="flex-1 btn-glow py-2.5 text-sm flex items-center justify-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </div>
              {companies.length === 0 && (
                <p className="text-orange-400/70 text-xs text-center">Register a company first before posting jobs</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
