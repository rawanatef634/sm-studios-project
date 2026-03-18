import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "MAJLIS",
    image: "/assets/majlis2.png",
    link: "/projects/1",
  },
  {
    id: 2,
    title: "MATIHA BOUTIQUE",
    image: "/assets/ms.png",
    link: "/projects/2",
  },
  {
    id: 3,
    title: "BLUSH SPA",
    image: "/assets/bs2.jpg",
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
    <section className="relative w-full min-h-screen md:h-[547px] bg-black text-white overflow-hidden">
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
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[current].image})`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* === OVERLAY === */}
      <div className="absolute inset-0 bg-[#1C1918]/60 z-0" />

      {/* === CONTENT === */}
      <div
        className="
          relative z-10 flex flex-col 
          justify-start pt-32 sm:pt-40 md:justify-center md:pt-0 
          px-4 sm:px-8 md:px-[100px] 
          h-full
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
          {String(slides[current].id).padStart(2, "0")}/{slides.length}
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
              text-4xl sm:text-5xl md:text-[80px] lg:text-[114px]
              leading-tight md:leading-[1.1]
            "
          >
            {slides[current].title}
          </motion.h1>
        </AnimatePresence>

        {/* Project link */}
        <a
          href={slides[current].link}
          className="mt-6 inline-block text-white/80 hover:text-white underline underline-offset-8 text-base md:text-lg transition"
        >
          View Project
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
          
          /* Mobile: vertical on the left */
          max-md:flex-col max-md:items-center max-md:left-4 max-md:top-1/2 max-md:-translate-y-1 max-md:bottom-auto
        "
      >
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
        >
          <Facebook className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-80" />
        </a>

        <a
          href="https://wa.me/96800000000"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-80" />
        </a>

        <a
          href="https://www.instagram.com/smstudios.om/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
        >
          <Instagram className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-80" />
        </a>

        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-white transition"
        >
          <Youtube className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-80" />
        </a>
      </div>

      {/* === SLIDE NAVIGATION === */}
      <div className="absolute bottom-8 right-6 md:bottom-[25px] md:right-[100px] flex flex-wrap md:flex-nowrap gap-6 md:gap-[89px] items-center z-10">
        {slides.map((s, idx) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrent(idx)}
            className={`cursor-pointer transition-all duration-300 ${
              idx === current ? "text-white" : "text-white/60"
            }`}
          >
            <div className="font-['El_Messiri'] text-lg md:text-[22px] uppercase">
              {String(s.id).padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm tracking-wide">{s.title}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
