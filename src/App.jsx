import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/Loader.jsx";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Landing";

const SingleService = lazy(() => import("./pages/SingleService"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const SingleProject = lazy(() => import("./pages/SingleProject"));
const Careers = lazy(() => import("./pages/Careers"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const StudioEntry = lazy(() => import("./pages/StudioEntry"));

function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/login" ||
    location.pathname === "/studio" ||
    location.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isAdminRoute) {
      document.getElementById("initial-loader")?.remove();
      document.body.style.overflow = "";
    }
  }, [isAdminRoute]);

  return (
    <>
      {!isAdminRoute && <Loader enabled={!isAdminRoute} />}

      {!isAdminRoute && <Navbar />}
      <Suspense
        fallback={
          <div className="min-h-screen bg-black" aria-hidden="true" />
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/studio" element={<StudioEntry />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/services/:slug" element={<SingleService />} />
          <Route path="/projects/:id" element={<SingleProject />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
