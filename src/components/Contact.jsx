import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function ContactSection() {
  return (
    <section
      className="relative mx-auto min-h-[520px] bg-cover bg-center md:min-h-[560px]"
      style={{
        backgroundImage: "url('/assets/contact.jpg')",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-black/20"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-24 text-center md:flex-row md:items-center md:gap-12 md:px-10 md:py-28 md:text-left">
        <div className="text-white md:max-w-2xl">
          <h2 className="mb-5 font-['El_Messiri'] text-4xl font-semibold uppercase leading-[1.05] md:text-[56px] md:leading-[1.05] lg:text-[64px]">
            LET’S CREATE YOUR
            <br />
            NEXT SPACE
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/90 md:text-xl md:leading-relaxed">
            Our team is ready to turn your vision into a reality with designs
            that inspire and last.
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            to="/contact"
            className="relative inline-flex items-center gap-3 bg-transparent px-10 py-4 font-['El_Messiri'] text-lg font-light uppercase tracking-[0.14em] text-white transition-opacity duration-300 hover:opacity-80 md:px-12 md:py-5 md:text-[20px]"
          >
            {/* Full outline with bottom-right cut — transparent fill */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 200 56"
              preserveAspectRatio="none"
            >
              <path
                d="M1 1 H199 V45 L189 55 H1 Z"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            GET IN TOUCH
            <ArrowUpRight size={20} strokeWidth={1.25} className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
