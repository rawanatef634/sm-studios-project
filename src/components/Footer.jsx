import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";

/** Sampled from Figma footer reference */
const BG = "#191F22";
const LABEL = "#8CACB6";
const LINK = "#738E96";
const BODY = "#8E9192";
const RULE = "#525759";
const ARROW = "#CAC9C4";

function BackToTopArrow({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 3V53"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7 17L24 3L41 17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <h4
      className="mb-3 border-t pt-3 font-['El_Messiri'] text-[11px] uppercase tracking-[0.18em]"
      style={{ color: LABEL, borderColor: RULE }}
    >
      {children}
    </h4>
  );
}

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-14 md:py-16 lg:px-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:min-h-[260px] md:items-stretch md:gap-x-16 lg:gap-x-24">
          {/* Brand + large back-to-top */}
          <div className="flex flex-row items-start justify-between md:flex-col md:items-start">
            <div>
              <img
                src="/assets/sm-logo.png"
                alt="SM Studio Logo"
                className="mb-3 w-[68px] md:w-[76px]"
              />
              <p className="font-['El_Messiri'] text-[24px] leading-none tracking-[0.04em] text-white md:text-[28px]">
                SM STUDIO
              </p>
              <p
                className="mt-1.5 font-['El_Messiri'] text-[10px] tracking-[0.28em]"
                style={{ color: BODY }}
              >
                +PARTNERS
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-0 shrink-0 transition hover:opacity-80 md:mt-auto md:pt-16"
              style={{ color: ARROW }}
              aria-label="Back to top"
            >
              <BackToTopArrow className="h-[88px] w-[72px] md:h-[108px] md:w-[92px]" />
            </button>
          </div>

          {/* Quick Links + Location */}
          <div className="flex flex-col text-left">
            <SectionLabel>Quick Links:</SectionLabel>
            <nav
              className="mb-9 font-['El_Messiri'] text-[15px] leading-[1.85] md:text-[16px]"
              style={{ color: LINK }}
            >
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>
              <span className="px-2 opacity-50">/</span>
              <Link to="/services" className="transition hover:text-white">
                Our Services
              </Link>
              <span className="px-2 opacity-50">/</span>
              <Link to="/#about" className="transition hover:text-white">
                About Us
              </Link>
              <br className="hidden md:block" />
              <span className="px-2 opacity-50 md:pl-0">/</span>
              <Link to="/projects" className="transition hover:text-white">
                Portfolio
              </Link>
              <span className="px-2 opacity-50">/</span>
              <Link to="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </nav>

            <SectionLabel>Location:</SectionLabel>
            <p
              className="max-w-[300px] font-['El_Messiri'] text-[15px] leading-relaxed md:text-[16px]"
              style={{ color: BODY }}
            >
              207 Office, 2nd Second floor, Bowsher, Muscat, Sultanate of Oman
            </p>
          </div>

          {/* Contact + social + copyright */}
          <div className="flex flex-col text-left md:min-h-full">
            <SectionLabel>Contact Us:</SectionLabel>
            <div
              className="space-y-1 font-['El_Messiri'] text-[15px] md:text-[16px]"
              style={{ color: BODY }}
            >
              <p>info@smstudios-om.com</p>
              <p>+968 2412 8488</p>
              <p>+968 78444636</p>
            </div>

            <SocialLinks
              className="mt-7 flex justify-start gap-3"
              itemClassName="flex h-9 w-9 items-center justify-center rounded-full border border-[#525759] text-white transition hover:border-[#8E9192]"
              iconClassName="h-4 w-4"
            />

            <p
              className="mt-10 font-['El_Messiri'] text-[10px] uppercase tracking-[0.16em] md:mt-auto md:pt-10 md:text-right"
              style={{ color: BODY }}
            >
              © 2025 SM STUDIOS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
