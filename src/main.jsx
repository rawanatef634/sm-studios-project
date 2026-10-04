import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop";
import HeronSignalProvider from "./components/HeronSignalProvider";
import { ProjectsProvider } from "./context/ProjectsContext";
import { AuthProvider } from "./context/AuthContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <HeronSignalProvider />
      <AuthProvider>
        <SiteSettingsProvider>
          <ProjectsProvider>
            <ScrollToTop />
            <App />
          </ProjectsProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
