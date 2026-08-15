import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-[#1a1c1e] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 md:items-stretch md:min-h-[280px]">
          {/* Brand */}
          <div className="flex flex-row items-start justify-between md:flex-col md:items-start text-left">
            <div>
              <img
                src="/assets/sm-logo.png"
                alt="SM Studio Logo"
                className="w-16 mb-4"
              />
              <p className="font-['El_Messiri'] text-2xl tracking-[0.06em]">
                SM STUDIO
              </p>
              <p className="font-['El_Messiri'] text-xs tracking-[0.22em] text-white/80 mt-1">
                +PARTNERS
              </p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-0 md:mt-auto pt-0 md:pt-10 p-1 text-gray-300 hover:text-white transition"
              aria-label="Back to top"
            >
              <ArrowUp className="w-8 h-8" strokeWidth={1.25} />
            </button>
          </div>

          {/* Quick Links + Location */}
          <div className="text-left flex flex-col">
            <h4 className="uppercase font-['El_Messiri'] text-[11px] tracking-[0.18em] text-[#8b9199] mb-3 pb-2 border-b border-white/12">
              Quick Links:
            </h4>
            <p className="font-['El_Messiri'] text-sm text-gray-300 mb-8 leading-7">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <span className="px-2 text-white/40">/</span>
              <Link to="/services" className="hover:text-white">
                Our Services
              </Link>
              <span className="px-2 text-white/40 md:hidden">/</span>
              <br className="hidden md:block" />
              <span className="hidden md:inline text-white/40">/</span>
              <Link to="/projects" className="hover:text-white px-2">
                Portfolio
              </Link>
              <span className="text-white/40">/</span>
              <Link to="/contact" className="hover:text-white px-2">
                Contact
              </Link>
            </p>

            <h4 className="uppercase font-['El_Messiri'] text-[11px] tracking-[0.18em] text-[#8b9199] mb-3 pb-2 border-b border-white/12">
              Location:
            </h4>
            <p className="font-['El_Messiri'] text-sm text-gray-300 max-w-sm mx-0 leading-relaxed">
              207 Office, 2nd Second floor, Bowsher, Muscat, Sultanate of Oman
            </p>
          </div>

          {/* Contact Us + Social */}
          <div className="text-left flex flex-col">
            <h4 className="uppercase font-['El_Messiri'] text-[11px] tracking-[0.18em] text-[#8b9199] mb-3 pb-2 border-b border-white/12">
              Contact Us:
            </h4>
            <p className="font-['El_Messiri'] text-sm text-gray-300">
              info@smstudios-om.com
            </p>
            <p className="font-['El_Messiri'] text-sm text-gray-300">
              +968 2412 8488
            </p>
            <p className="font-['El_Messiri'] text-sm text-gray-300 mb-6">
              +968 78444636
            </p>

            <SocialLinks
              className="flex gap-4 justify-start"
              itemClassName="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
              iconClassName="w-5 h-5"
            />

            <p className="mt-auto pt-10 font-['El_Messiri'] text-[11px] tracking-[0.12em] text-[#8b9199] text-left md:text-right">
              © 2026 SM STUDIOS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
