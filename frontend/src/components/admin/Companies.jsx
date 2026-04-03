// ─────────────────────────────────────────────────────────────────────────────
// components/admin/Companies.jsx
//
// Recruiter dashboard — lists all companies this recruiter has registered.
// Recruiters must create a company before they can post jobs.
//
// Features:
//   • Live search filter by company name
//   • "New Company" button → /admin/companies/create
//   • Edit button on each card → /admin/companies/:id
//   • Empty state with prompt to create first company
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../shared/Navbar.jsx";
import useGetAllCompanies from "../../hooks/useGetAllCompanies.jsx";
import { Building2, Plus, Search, Edit2, ExternalLink } from "lucide-react";

export default function Companies() {
  useGetAllCompanies();
  const { companies } = useSelector(s => s.company);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="section-container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-white">My <span className="gradient-text">Companies</span></h1>
              <p className="text-white/40 mt-1">{companies.length} companies registered</p>
            </div>
            <button onClick={() => navigate("/admin/companies/create")} className="btn-glow flex items-center gap-2 self-start">
              <Plus size={16} /> New Company
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..." className="input-field pl-10" />
          </div>

          {/* Companies grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl border border-border">
              <Building2 size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30 font-medium">No companies yet</p>
              <p className="text-white/20 text-sm mt-1">Register your first company to start posting jobs</p>
              <button onClick={() => navigate("/admin/companies/create")} className="btn-glow mt-6 inline-flex items-center gap-2">
                <Plus size={15} /> Create Company
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(company => (
                <div key={company._id} className="glass-card rounded-2xl p-6 border border-border hover:border-brand-500/20 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden">
                      {company.logo
                        ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        : <Building2 size={20} className="text-white/20" />
                      }
                    </div>
                    <button
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-white/30 hover:text-brand-400 hover:border-brand-500/30 transition-all"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                  <h3 className="font-display font-semibold text-white mb-1">{company.name}</h3>
                  <p className="text-white/40 text-sm line-clamp-2 mb-4">{company.description || "No description added"}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-white/30 text-xs">{company.location || "Location not set"}</span>
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noreferrer"
                        className="text-brand-400 hover:text-brand-300 transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    )}
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
