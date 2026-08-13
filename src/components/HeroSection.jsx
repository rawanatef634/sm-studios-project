"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const HeroSection = ({ title, breadcrumb, backgroundImage }) => {
  const parts = breadcrumb ? breadcrumb.split(" / ") : [];

  return (
    <section className="relative h-[547px] flex items-center overflow-hidden bg-[#161B1E]">
      {backgroundImage && (
        <OptimizedImage
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          sizes="100vw"
          fill
          priority
        />
      )}

      {/* Overlay tint */}
      <div className="absolute inset-0 bg-[#161B1E]/60"></div>
      {/* Bottom gradient shadow */}
      <div className="absolute bottom-0 left-0 w-full h-70 bg-gradient-to-t from-[#161B1E] to-transparent"></div>

      <div className="relative z-10 w-full px-6 md:px-16 flex flex-col justify-center">
        {parts.length > 0 && (
          <motion.nav
            className="text-xs md:text-sm text-gray-300 tracking-wide mb-8 flex flex-wrap items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {parts.map((part, i) => {
              const isLast = i === parts.length - 1;
              let path = "/";

              if (part.toLowerCase() !== "home") {
                path =
                  "/" +
                  parts
                    .slice(1, i + 1)
                    .join("/")
                    .toLowerCase()
                    .replace(/\s+/g, "-");
              }

              return (
                <span key={i} className="flex items-center gap-1">
                  {!isLast ? (
                    <Link
                      to={path}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {part}
                    </Link>
                  ) : (
                    <span className="text-gray-400">{part}</span>
                  )}
                  {!isLast && <span>/</span>}
                </span>
              );
            })}
          </motion.nav>
        )}

        <motion.h1
          className="text-4xl md:text-8xl font-light text-white tracking-wide drop-shadow-lg text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 80 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
};

export default HeroSection;
