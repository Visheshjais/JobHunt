// ─────────────────────────────────────────────────────────────────────────────
// redux/store.js
//
// The Redux store — the single source of truth for all global state.
//
// Slices in this store:
//   auth    → user, loading (see authSlice.js)
//   job     → allJobs, singleJob, searchedQuery, etc. (see jobSlice.js)
//   company → allCompanies, singleCompany (see companySlice.js)
//   application → appliedJobs (see applicationSlice.js)
//
// Usage in any component:
//   const { user } = useSelector(state => state.auth);
//   const { allJobs } = useSelector(state => state.job);
// ─────────────────────────────────────────────────────────────────────────────

import { configureStore } from "@reduxjs/toolkit";
import authReducer        from "./authSlice.js";
import jobReducer         from "./jobSlice.js";
import companyReducer     from "./companySlice.js";
import applicationReducer from "./applicationSlice.js";

const store = configureStore({
  reducer: {
    auth:        authReducer,        // user login state
    job:         jobReducer,         // job listings and search
    company:     companyReducer,     // company data
    application: applicationReducer, // job applications
  },
});

export default store;
