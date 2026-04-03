// ─────────────────────────────────────────────────────────────────────────────
// redux/authSlice.js
//
// Redux slice for authentication state.
//
// What is Redux?
//   It's a global state manager. Instead of passing user data through props
//   from parent → child → grandchild, you store it once in Redux and any
//   component can read it directly.
//
// This slice stores:
//   user    — the logged-in user object (null if not logged in)
//   loading — true while an API call is in progress (shows spinner)
//
// Actions:
//   setUser(userObj)     — call this after login/register to store the user
//   setUser(null)        — call this after logout to clear the user
//   setLoading(bool)     — toggle the loading spinner during API calls
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false, // true during login/register API calls
    user: null,     // null = not logged in; object = logged in user
  },
  reducers: {
    // Set loading state (show/hide spinner)
    setLoading: (state, action) => {
      state.loading = action.payload; // payload is true or false
    },
    // Set user after login, or null after logout
    setUser: (state, action) => {
      state.user = action.payload; // payload is the user object or null
    },
  },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
