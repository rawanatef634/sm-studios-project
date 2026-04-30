import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Landing";
import SingleService from "./pages/SingleService";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import SingleProject from "./pages/SingleProject";
import Careers from "./pages/Careers";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Loader from "./components/Loader.jsx";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/login" || location.pathname.startsWith("/dashboard");
  return (
    <>
      {!isAdminRoute && <Loader pathname={location.pathname} />}

      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* Static Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Dynamic Single Pages */}
        <Route path="/services/:slug" element={<SingleService />} />
        <Route path="/projects/:id" element={<SingleProject />} />
      </Routes>
    </>
  );
}

export default App;
