import {
  Facebook,
  Instagram,
  Youtube,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="bg-[#1D2428] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-80">
          {/* Logo */}
          <div className="flex flex-col text-center items-center flex-1">
            <img
              src="/assets/sm-logo.png"
              alt="SM Studio Logo"
              className="w-20 mb-3"
            />
            <p className="text-xl tracking-wide">SM STUDIO</p>
            <p className="text-md text-gray-300">+PARTNERS</p>
          </div>

          {/* Quick Links + Location */}
          <div className="flex-2 text-center md:text-left">
            <h4 className="uppercase text-xs tracking-widest text-gray-400 mb-3">
              Quick Links:
            </h4>
            <p className="text-md space-x-1 text-gray-300 mb-6">
              <Link to="/" className="hover:text-white">
                Home
              </Link>{" "}
              /{" "}
              <Link to="/services" className="hover:text-white">
                Our Services
              </Link>{" "}
              /{" "}
              <Link to="/projects" className="hover:text-white">
                Projects
              </Link>{" "}
              /{" "}
              <Link to="/careers" className="hover:text-white">
                Careers
              </Link>{" "}
              /{" "}
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </p>

            {/* Location */}
            <h4 className="uppercase text-xs tracking-widest text-gray-400 mb-2">
              Location:
            </h4>
            <p className="text-md text-gray-300 max-w-sm">
              207 Office, 2nd Second floor, Bowsher, Muscat, Sultanate of Oman
            </p>
          </div>

          {/* Contact Us + Social */}
          <div className="flex-1 text-center md:text-left">
            <h4 className="uppercase text-xs tracking-widest text-gray-400 mb-3">
              Contact Us:
            </h4>
            <p className="text-md text-gray-300">info@smstudios-om.com</p>
            <p className="text-md text-gray-300">+968 2412 8488</p>
            <p className="text-md text-gray-300 mb-6">+968 78444636</p>

            {/* Social Icons */}
            <div className="flex gap-6 justify-center md:justify-start">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/smstudios.om/?hl=en"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto px-2 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Arrow Scroll Up */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-2 rounded hover:bg-white/10"
          aria-label="Back to top"
        >
          <ArrowUp className="w-30 h-40 text-gray-300" />
        </button>

        {/* Copyright */}
        <p className="text-sm text-gray-400 text-center md:text-right">
          © 2025 SM STUDIOS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
