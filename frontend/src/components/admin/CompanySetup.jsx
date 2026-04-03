// ─────────────────────────────────────────────────────────────────────────────
// components/admin/CompanySetup.jsx
//
// Page where a recruiter fills in / edits company details:
//   name, description, website, location, logo (image upload)
//
// Pre-fills the form with existing data fetched by company _id from the URL.
// Logo is uploaded to Cloudinary via multipart form.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API } from "../../utils/constant.js";
import { setSingleCompany } from "../../redux/companySlice.js";
import Navbar from "../shared/Navbar.jsx";
import { ArrowLeft, Loader2, Upload } from "lucide-react";

export default function CompanySetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({ name: "", description: "", website: "", location: "", file: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${COMPANY_API}/get/${id}`, { withCredentials: true });
        if (res.data.success) {
          const c = res.data.company;
          setInput({ name: c.name || "", description: c.description || "", website: c.website || "", location: c.location || "", file: null });
          dispatch(setSingleCompany(c));
        }
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [id]);

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
      const res = await axios.put(`${COMPANY_API}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Company updated!");
        navigate("/admin/companies");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="section-container max-w-xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="glass-card rounded-2xl p-8 border border-border">
            <h1 className="font-display font-bold text-xl text-white mb-6">Edit Company</h1>
            <form onSubmit={submit} className="space-y-4">
              {[
                { name: "name",        label: "Company Name", placeholder: "Acme Corp" },
                { name: "description", label: "Description",  placeholder: "What does your company do?" },
                { name: "website",     label: "Website",      placeholder: "https://company.com" },
                { name: "location",    label: "Location",     placeholder: "Mumbai, India" },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">{f.label}</label>
                  <input name={f.name} value={input[f.name]} onChange={change} placeholder={f.placeholder} className="input-field" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Company Logo</label>
                <label className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-brand-500/40 transition-all">
                  <Upload size={15} className="text-white/30" />
                  <span className="text-white/40 text-sm">{input.file ? input.file.name : "Upload logo"}</span>
                  <input name="file" type="file" accept="image/*" onChange={change} className="hidden" />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate(-1)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-glow py-2.5 text-sm flex items-center justify-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
