// ─────────────────────────────────────────────────────────────────────────────
// components/admin/CompanyCreate.jsx
//
// Page where a recruiter creates a new company profile.
// Only needs a company name to start — full details are added on CompanySetup.
//
// After creating: redirects to /admin/companies (company list).
// ─────────────────────────────────────────────────────────────────────────────

// CompanyCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API } from "../../utils/constant.js";
import Navbar from "../shared/Navbar.jsx";
import { Building2, ArrowLeft, Loader2 } from "lucide-react";

export default function CompanyCreate() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${COMPANY_API}/register`, { companyName: name }, { withCredentials: true });
      if (res.data.success) {
        navigate(`/admin/companies/${res.data.company._id}`);
        toast.success("Company created!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create company");
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient/10 flex items-center justify-center">
                <Building2 size={18} className="text-brand-400" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-white">Register Company</h1>
                <p className="text-white/40 text-xs mt-0.5">You can update details later</p>
              </div>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Company Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Acme Corp" className="input-field" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate(-1)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-glow py-2.5 text-sm flex items-center justify-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Creating..." : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
