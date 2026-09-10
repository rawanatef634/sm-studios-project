import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop";
import { ProjectsProvider } from "./context/ProjectsContext";
import { AuthProvider } from "./context/AuthContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <ScrollToTop />
          <App />
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
