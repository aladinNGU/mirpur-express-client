import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router.jsx";
import AuthProvider from "./contexts/AuthContext/AuthProvider.jsx";
// for map display
import "leaflet/dist/leaflet.css";
import "./utils/leafletIconFix.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-7xl mx-auto">
      <AuthProvider>
        <RouterProvider
          router={router}
          fallbackElement={
            <div className="flex items-center justify-center min-h-screen">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          }
        ></RouterProvider>
      </AuthProvider>
    </div>
  </StrictMode>,
);
