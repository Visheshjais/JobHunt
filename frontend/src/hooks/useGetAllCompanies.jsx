// ─────────────────────────────────────────────────────────────────────────────
// hooks/useGetAllCompanies.jsx
//
// Custom hook — fetches all companies registered by the logged-in recruiter.
// Used by: Companies.jsx, CompanySetup.jsx, PostJob.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCompanies } from "../redux/companySlice.js";
import { COMPANY_API } from "../utils/constant.js";

export default function useGetAllCompanies() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API}/get`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (err) {
        console.error("[useGetAllCompanies]", err);
      }
    };

    fetchCompanies();
  }, []);
}
