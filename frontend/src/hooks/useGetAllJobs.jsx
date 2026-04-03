// ─────────────────────────────────────────────────────────────────────────────
// hooks/useGetAllJobs.jsx
//
// Custom React hook — fetches all public jobs from the backend API
// and stores them in Redux (state.job.allJobs).
//
// Used by: Home.jsx, Jobs.jsx, Browse.jsx
//
// How custom hooks work:
//   A custom hook is just a function that starts with "use" and can call
//   other hooks like useEffect and useDispatch. It's a way to share logic
//   between multiple components without copy-pasting code.
//
// Why useEffect?
//   useEffect runs code AFTER the component mounts (appears on screen).
//   The empty dependency array [] means it only runs once, not on every render.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllJobs } from "../redux/jobSlice.js";
import { JOB_API } from "../utils/constant.js";

export default function useGetAllJobs() {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((s) => s.job);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // GET /api/v1/job/get?keyword=searchedQuery
        // The backend filters by keyword if provided
        const res = await axios.get(`${JOB_API}/get?keyword=${searchedQuery || ""}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs)); // store in Redux
        }
      } catch (err) {
        console.error("[useGetAllJobs]", err);
      }
    };

    fetchJobs();
  }, [searchedQuery]); // re-fetch when the search query changes
}
