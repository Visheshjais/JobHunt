// ─────────────────────────────────────────────────────────────────────────────
// redux/companySlice.js
//
// Redux slice for company-related state.
//
// State:
//   companies     — all companies registered by the logged-in recruiter
//   searchCompany — text filter used on the Companies admin page
//   singleCompany — the company being edited (CompanySetup page)
//
// Actions:
//   setCompanies(arr)        — store fetched companies
//   setSearchCompanyByText(q) — update live search filter
//   setSingleCompany(obj)    — store company being edited
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies:     [],   // all companies for this recruiter
    searchCompany: "",   // live filter text on admin companies page
    singleCompany: null, // company currently being edited
  },
  reducers: {
    setCompanies:           (state, action) => { state.companies = action.payload; },
    setSearchCompanyByText: (state, action) => { state.searchCompany = action.payload; },
    setSingleCompany:       (state, action) => { state.singleCompany = action.payload; },
  },
});

export const { setCompanies, setSearchCompanyByText, setSingleCompany } = companySlice.actions;
export default companySlice.reducer;
