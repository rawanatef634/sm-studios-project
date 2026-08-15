import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialLinks from "./SocialLinks";
import OptimizedImage from "./OptimizedImage";

const slides = [
  {
    id: 1,
    title: "MAJLIS",
    image: "/assets/majlis3.png",
    mobileImage: "/assets/majlis2.png",
    link: "/projects/1",
  },
  {
    id: 2,
    title: "MATIHA BOUTIQUE",
    image: "/assets/ms4.png",
    link: "/projects/2",
  },
  {
    id: 3,
    title: "BLUSH SPA",
    image: "/assets/bs1.jpg",
    link: "/projects/3",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[100svh] min-h-0 overflow-hidden bg-black text-white md:h-screen md:min-h-[640px]">
      {/* === BACKGROUND IMAGE === */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 md:hidden">
            <OptimizedImage
              src={slides[current].mobileImage || slides[current].image}
              alt=""
              className="h-full w-full object-cover object-center"
              sizes="100vw"
              fill
              priority
            />
          </div>
          <div className="absolute inset-0 hidden md:block">
            <OptimizedImage
              src={slides[current].image}
              alt=""
              className="h-full w-full object-cover object-center"
              sizes="100vw"
              fill
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* === OVERLAY === */}
      <div className="absolute inset-0 z-0 bg-[#1C1918]/35 md:bg-[#1C1918]/60" />

      {/* === CONTENT === */}
      <div
        className="
          relative z-10 flex h-full flex-col justify-center
          px-5 sm:px-8 md:px-[100px]
          max-md:pb-24
        "
      >
        {/* Slide counter */}
        <motion.div
          key={`counter-${slides[current].id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="font-['El_Messiri'] text-2xl md:text-[40px] uppercase mb-2"
        >
          <span>{String(slides[current].id).padStart(2, "0")}</span>
          <span className="text-[0.62em] opacity-90">
            /{String(slides.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Slide title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={slides[current].title}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="
              font-['El_Messiri']
              text-4xl sm:text-5xl md:text-[72px] lg:text-[96px]
              leading-[1.05] tracking-[0.01em]
            "
          >
            {slides[current].title}
          </motion.h1>
        </AnimatePresence>

        {/* Project link */}
        <a
          href={slides[current].link}
          className="mt-6 inline-block font-['El_Messiri'] text-white/80 hover:text-white underline underline-offset-8 text-base md:text-lg transition"
        >
          View project
        </a>
      </div>

      {/* === SOCIAL ICONS === */}
      <div
        className="
          absolute 
          z-10
          flex items-center gap-6 md:gap-8 
          bottom-8 left-6 
          md:bottom-8 md:left-[100px]
          max-md:flex-col max-md:items-center max-md:left-4 max-md:gap-3
        "
      >
        <SocialLinks
          className="contents"
          itemClassName="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
          iconClassName="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-80"
        />
      </div>

      {/* === SLIDE NAVIGATION === */}
      <div className="absolute bottom-8 right-6 md:bottom-[25px] md:right-[100px] flex flex-nowrap gap-5 md:gap-[89px] items-end z-10">
        {slides.map((s, idx) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrent(idx)}
            className={`cursor-pointer transition-all duration-300 ${
              idx === current ? "text-white" : "text-white/60"
            }`}
          >
            <div
              className={`font-['El_Messiri'] text-lg md:text-[22px] uppercase pb-1 ${
                idx === current
                  ? "max-md:border-b-2 max-md:border-white"
                  : "max-md:border-b-2 max-md:border-transparent"
              }`}
            >
              {String(s.id).padStart(2, "0")}
            </div>
            <div className="hidden md:block text-xs md:text-sm tracking-wide">
              {s.title}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
