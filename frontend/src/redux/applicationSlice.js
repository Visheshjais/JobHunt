// ─────────────────────────────────────────────────────────────────────────────
// redux/applicationSlice.js
//
// Redux slice for job application state.
//
// State:
//   applicants — list of job applications
//               For a student: jobs they've applied to
//               For a recruiter: people who applied to their job
//
// Actions:
//   setAllApplicants(arr) — store the fetched applications
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [], // array of application documents from MongoDB
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
  },
});

export const { setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
