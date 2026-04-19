import { Facebook, Instagram, Youtube, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "./icons/WhatsAppIcon";

const labelClass =
  "w-full font-portfolio-sans border-b border-white/[0.12] pb-[10px] text-left text-[11px] font-normal uppercase leading-none tracking-[0.18em] text-[#8b9199]";

function SectionLabel({ children, align = "left" }) {
  return (
    <h4
      className={`${labelClass} ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </h4>
  );
}

const slash = (
  <span className="px-2 text-white/35" aria-hidden>
    /
  </span>
);

export default function Footer() {
  return (
    <footer className="bg-[#161B1E] font-portfolio-sans text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-[4.5rem]">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:items-stretch md:gap-x-16 lg:gap-x-24">
          {/* Left — brand; arrow pinned to column bottom (aligned with copyright baseline) */}
          <div className="flex min-h-[300px] flex-col items-center md:min-h-[360px] md:items-start">
            <img
              src="/assets/sm-logo.png"
              alt="SM Studio Logo"
              className="mb-6 h-[4.5rem] w-[4.5rem] object-contain md:h-20 md:w-20"
            />
            <p className="font-portfolio-serif text-[1.625rem] font-medium leading-none tracking-[0.04em] text-white md:text-[1.75rem]">
              SM STUDIO
            </p>
            <p className="mt-2 font-portfolio-sans text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-white/95">
              +PARTNERS
            </p>

            <div className="mt-auto flex w-full justify-center pt-14 md:justify-start md:pt-20">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-white/80 transition hover:text-white"
                aria-label="Back to top"
              >
                <ArrowUp
                  className="h-[52px] w-[52px] md:h-14 md:w-14"
                  strokeWidth={0.75}
                />
              </button>
            </div>
          </div>

          {/* Center — quick links + large gap + location */}
          <div className="flex flex-col gap-12 text-center md:gap-14 md:text-left">
            <div className="w-full">
              <SectionLabel>Quick Links:</SectionLabel>
              <nav
                className="mt-5 text-[15px] font-normal leading-[1.7] text-white"
                aria-label="Footer quick links"
              >
                <p className="flex flex-wrap justify-center gap-y-1 md:justify-start">
                  <Link to="/" className="hover:text-white/90">
                    Home
                  </Link>
                  {slash}
                  <Link to="/services" className="hover:text-white/90">
                    Our Services
                  </Link>
                  {slash}
                  <Link to="/#about" className="hover:text-white/90">
                    About Us
                  </Link>
                </p>
                <p className="mt-2 flex flex-wrap justify-center gap-y-1 md:justify-start">
                  <span className="pr-2 text-white/35">/</span>
                  <Link to="/projects" className="hover:text-white/90">
                    Portfolio
                  </Link>
                  {slash}
                  <Link to="/contact" className="hover:text-white/90">
                    Contact
                  </Link>
                </p>
              </nav>
            </div>

            <div className="w-full">
              <SectionLabel>Location:</SectionLabel>
              <p className="mt-5 max-w-[22rem] text-[15px] font-normal leading-[1.65] text-white/95">
                207 Office, 2nd Second floor, Bowsher, Muscat, Sultanate of Oman
              </p>
            </div>
          </div>

          {/* Right — contact, social (right-aligned), copyright at column bottom */}
          <div className="flex min-h-[300px] flex-col items-center md:min-h-[360px] md:items-end">
            <div className="w-full md:text-right">
              <SectionLabel align="right">Contact Us:</SectionLabel>
              <div className="mt-5 space-y-1.5 text-[15px] font-normal leading-relaxed text-white/95">
                <p>
                  <a
                    href="mailto:info@smstudios-om.com"
                    className="transition hover:text-white"
                  >
                    info@smstudios-om.com
                  </a>
                </p>
                <p>+968 2412 8488</p>
                <p>+968 78444636</p>
              </div>
            </div>

            <div className="mt-9 flex w-full flex-wrap justify-center gap-[14px] md:justify-end">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white/55 hover:bg-white/[0.04]"
              >
                <Facebook className="h-[17px] w-[17px]" strokeWidth={1.2} />
              </a>
              <a
                href="https://wa.me/96800000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white/55 hover:bg-white/[0.04]"
              >
                <WhatsAppIcon className="h-[17px] w-[17px]" />
              </a>
              <a
                href="https://www.instagram.com/smstudios.om/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white/55 hover:bg-white/[0.04]"
              >
                <Instagram className="h-[17px] w-[17px]" strokeWidth={1.2} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white/55 hover:bg-white/[0.04]"
              >
                <Youtube className="h-[17px] w-[17px]" strokeWidth={1.2} />
              </a>
            </div>

            <p className="mt-auto w-full pt-14 text-center font-portfolio-sans text-[10px] uppercase leading-normal tracking-[0.16em] text-[#8b9199] md:pt-20 md:text-right">
              © 2023 SM STUDIOS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
