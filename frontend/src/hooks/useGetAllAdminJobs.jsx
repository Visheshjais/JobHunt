// ─────────────────────────────────────────────────────────────────────────────
// hooks/useGetAllAdminJobs.jsx
//
// Custom hook — fetches all jobs posted by the currently logged-in recruiter.
// Only works when the user is a recruiter (protected route + JWT cookie).
// Used by: AdminJobs.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllAdminJobs } from "../redux/jobSlice.js";
import { JOB_API } from "../utils/constant.js";

export default function useGetAllAdminJobs() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAdminJobs = async () => {
      try {
        // Backend filters by req.id (the logged-in recruiter's userId from JWT)
        const res = await axios.get(`${JOB_API}/getadminjobs`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (err) {
        console.error("[useGetAllAdminJobs]", err);
      }
    };

    fetchAdminJobs();
  }, []); // only run once when the component mounts
}
