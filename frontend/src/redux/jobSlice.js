// ─────────────────────────────────────────────────────────────────────────────
// redux/jobSlice.js
//
// Redux slice for job-related state.
//
// State:
//   allJobs       — array of all jobs fetched from the API
//   allAdminJobs  — jobs posted by the logged-in recruiter
//   singleJob     — the job currently being viewed (JobDescription page)
//   searchedQuery — the search term entered on the Home page hero
//   filterJobs    — jobs after applying filters (Jobs page)
//
// Actions:
//   setAllJobs(jobs)        — called by useGetAllJobs hook after API fetch
//   setAllAdminJobs(jobs)   — called by useGetAllAdminJobs hook
//   setSingleJob(job)       — called by JobDescription when a job is fetched
//   setSearchedQuery(query) — called when user searches on the Home page
//   setFilterJobs(jobs)     — called by the Jobs page filter logic
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs:       [],    // all jobs from the public API
    allAdminJobs:  [],    // jobs posted by the current recruiter
    singleJob:     null,  // job being viewed on the description page
    searchedQuery: "",    // last search text from the home page
    filterJobs:    [],    // result after frontend filtering
  },
  reducers: {
    setAllJobs:       (state, action) => { state.allJobs = action.payload; },
    setAllAdminJobs:  (state, action) => { state.allAdminJobs = action.payload; },
    setSingleJob:     (state, action) => { state.singleJob = action.payload; },
    setSearchedQuery: (state, action) => { state.searchedQuery = action.payload; },
    setFilterJobs:    (state, action) => { state.filterJobs = action.payload; },
  },
});

export const {
  setAllJobs,
  setAllAdminJobs,
  setSingleJob,
  setSearchedQuery,
  setFilterJobs,
} = jobSlice.actions;

export default jobSlice.reducer;
