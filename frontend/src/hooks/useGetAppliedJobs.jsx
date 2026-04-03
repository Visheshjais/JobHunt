// ─────────────────────────────────────────────────────────────────────────────
// hooks/useGetAppliedJobs.jsx
//
// Custom hook — fetches all jobs the logged-in student has applied to.
// Used by: Profile.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllApplicants } from "../redux/applicationSlice.js";
import { APPLICATION_API } from "../utils/constant.js";

export default function useGetAppliedJobs() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        // GET /api/v1/application/get — returns applications for the logged-in user
        const res = await axios.get(`${APPLICATION_API}/get`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.applications));
        }
      } catch (err) {
        console.error("[useGetAppliedJobs]", err);
      }
    };

    fetchApplied();
  }, []);
}
