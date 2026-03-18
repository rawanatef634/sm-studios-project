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
import Loader from "./components/Loader.jsx";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();
  return (
    <>
      <Loader pathname={location.pathname} />

      <Navbar />
      <Routes>
        {/* Static Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />

        {/* Dynamic Single Pages */}
        <Route path="/services/:slug" element={<SingleService />} />
        <Route path="/projects/:id" element={<SingleProject />} />
      </Routes>
    </>
  );
}

export default App;
