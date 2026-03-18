// src/components/ContactSection.jsx
import { Link } from "react-router-dom";

export default function ContactSection() {
  return (
    <section
      className="h-[440] mx-auto relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/contact.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-[#2520201c] z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center md:items-center md:justify-between gap-8">
        {/* Left text */}
        <div className="text-white md:max-w-xl">
          <h2 className="text-4xl md:text-5xl leading-tight mb-4">
            LET’S CREATE YOUR
            <br />
            NEXT SPACE
          </h2>
          <p className="text-gray-200 text-base md:text-lg">
            Our team is ready to turn your vision into a reality with designs
            that inspire and last.
          </p>
        </div>

        {/* Right button */}
        <div className="flex-shrink-0">
          <Link
            to="/contact"
            className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition duration-300 text-lg"
          >
            GET IN TOUCH
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
      
    </section>
  );
}
