// ─────────────────────────────────────────────────────────────────────────────
// main.jsx — Application Entry Point
//
// This is the very first JavaScript file that runs in the browser.
// It mounts the React app into the <div id="root"> in index.html.
//
// Providers:
//   <Provider store={store}>   — makes Redux state available to ALL components
//   <Toaster />                — renders toast notifications (sonner library)
// ─────────────────────────────────────────────────────────────────────────────

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import store from "./redux/store.js";
import App from "./App.jsx";
import "./index.css"; // Tailwind + global styles

// Find the root div in index.html and mount the React app inside it
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Redux Provider — wraps EVERYTHING so any component can use useSelector/useDispatch */}
    <Provider store={store}>
      {/* The main router and all pages */}
      <App />

      {/* Toast notifications — position bottom-right, dark theme */}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#12121a",   // matches our card color
            border: "1px solid #1e1e2e",
            color: "#fff",
          },
        }}
      />
    </Provider>
  </StrictMode>
);
