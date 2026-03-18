import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close desktop services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopServicesOpen(false);
      } 
    };

    if (desktopServicesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [desktopServicesOpen]);

  // Close mobile services when mobile menu closes
  useEffect(() => {
    if (!mobileOpen) {
      setMobileServicesOpen(false);
    }
  }, [mobileOpen]);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/assets/sm-logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="block">
            <h1 className="px-2 text-white text-lg">SM STUDIO</h1>
            <h2 className="px-2 text-white text-md">+PARTNERS</h2>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-white text-sm font-sans tracking-wide uppercase">
          <Link to="/projects" className="hover:opacity-80 transition">
            Projects
          </Link>

          {/* Services dropdown (desktop) */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDesktopServicesOpen((prev) => !prev)}
              className="hover:opacity-80 transition flex items-center space-x-1 cursor-pointer text-md font-sans tracking-wide uppercase"
            >
              <span>Services</span>
              <svg
                className={`w-3 h-3 mt-px transition-transform ${
                  desktopServicesOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {desktopServicesOpen && (
              <div className="absolute left-0 top-full bg-white text-black mt-2 rounded shadow-lg min-w-[180px]">
                <Link
                  to="/services/interior-design"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDesktopServicesOpen(false)}
                >
                  Interior Design
                </Link>
                <Link
                  to="/services/architecture-design"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDesktopServicesOpen(false)}
                >
                  Architecture Design
                </Link>
                <Link
                  to="/services/3d-visualization"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDesktopServicesOpen(false)}
                >
                  3D Visualization
                </Link>
                <Link
                  to="/services/interior-fit-outs"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDesktopServicesOpen(false)}
                >
                  Interior Fit-Outs
                </Link>
              </div>
            )}
          </div>

          <Link to="/contact" className="hover:opacity-80 transition">
            Contact
          </Link>
          <Link to="/careers" className="hover:opacity-80 transition">
            Careers
          </Link>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            // X icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#161B1E]/95 backdrop-blur border-t border-white/10">
          <nav className="px-8 py-4 flex flex-col space-y-4 text-white text-sm font-sans tracking-wide uppercase">
            <Link
              to="/projects"
              className="hover:opacity-80 transition"
              onClick={() => setMobileOpen(false)}
            >
              Projects
            </Link>

            {/* Services clickable + accordion (mobile) */}
            <div>
              <div className="flex items-center justify-between">
                <Link
                  to="/services"
                  className="hover:opacity-80 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Services
                </Link>

                {/* Arrow button to open submenu */}
                <button
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  className="ml-2"
                >
                  <svg
                    className={`w-3 h-3 mt-px transition-transform ${
                      mobileServicesOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="mt-2 pl-4 flex flex-col space-y-2 text-xs tracking-normal normal-case">
                  <Link
                    to="/services/interior-design"
                    className="hover:opacity-80 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    Interior Design
                  </Link>
                  <Link
                    to="/services/architecture-design"
                    className="hover:opacity-80 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    Architecture Design
                  </Link>
                  <Link
                    to="/services/3d-visualization"
                    className="hover:opacity-80 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    3D Visualization
                  </Link>
                  <Link
                    to="/services/interior-fit-outs"
                    className="hover:opacity-80 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    Interior Fit-Outs
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className="hover:opacity-80 transition"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/careers"
              className="hover:opacity-80 transition"
              onClick={() => setMobileOpen(false)}
            >
              Careers
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
