"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import OptimizedImage from "../components/OptimizedImage";

/**
 * Smooth, simple carousel
 *
 * - Uses a single transition duration constant (TRANSITION_MS).
 * - Autoplays with pause on hover/focus.
 * - Keyboard and arrow-button navigation.
 * - Drag (swipe) support on the centered slide.
 * - Uses OptimizedImage for crisp responsive images.
 */

const TRANSITION_MS = 800; // ms for slide animation (match in timeout)
const AUTOPLAY_MS = 3500; // ms between auto slides

export default function PortfolioCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  // cleanup mounted ref
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearInterval(intervalRef.current);
    };
  }, []);

  // helpers
  const prevIndex = useCallback(
    (i = currentIndex) => (i === 0 ? projects.length - 1 : i - 1),
    [currentIndex]
  );
  const nextIndex = useCallback(
    (i = currentIndex) => (i === projects.length - 1 ? 0 : i + 1),
    [currentIndex]
  );

  // transition lock helper
  const withTransitionLock = useCallback((action) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    action();
    setTimeout(() => {
      if (mountedRef.current) setIsTransitioning(false);
    }, TRANSITION_MS + 50); // a hair over the animation
  }, [isTransitioning]);

  // manual navigation
  const goPrev = useCallback(() => {
    withTransitionLock(() => setCurrentIndex((i) => prevIndex(i)));
  }, [withTransitionLock, prevIndex]);

  const goNext = useCallback(() => {
    withTransitionLock(() => setCurrentIndex((i) => nextIndex(i)));
  }, [withTransitionLock, nextIndex]);

  const goToSlide = useCallback((index) => {
    if (index === currentIndex) return;
    withTransitionLock(() => setCurrentIndex(index));
  }, [withTransitionLock, currentIndex]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // autoplay
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!paused) {
      intervalRef.current = setInterval(() => {
        // don't force transition lock if currently locked
        if (!isTransitioning) {
          withTransitionLock(() => setCurrentIndex((i) => (i + 1) % projects.length));
        }
      }, AUTOPLAY_MS);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, isTransitioning, withTransitionLock]);

  // get slot position for index
  const getPosition = (index) => {
    const total = projects.length;
    if (index === currentIndex) return "center";
    if (index === (currentIndex - 1 + total) % total) return "left";
    if (index === (currentIndex + 1) % total) return "right";
    return "hidden";
  };

  // drag behavior: on center slide only
  const handleDragEnd = (event, info) => {
    const threshold = 100; // px
    if (info.offset.x > threshold) {
      goPrev();
    } else if (info.offset.x < -threshold) {
      goNext();
    }
  };

  // motion values for the three visible slots
  const slotProps = {
    center: {
      x: 0,
      scale: 1.05,
      opacity: 1,
      zIndex: 30,
    },
    left: {
      x: "-58%",
      scale: 0.9,
      opacity: 0.6,
      zIndex: 10,
    },
    right: {
      x: "58%",
      scale: 0.9,
      opacity: 0.6,
      zIndex: 10,
    },
  };

  const transition = {
    duration: TRANSITION_MS / 1000,
    ease: [0.6, 0.05, 0.01, 0.9],
  };

  return (
    <section
      className="bg-[#0f1113] text-white py-10 overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="max-w-[2000px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <p className="uppercase text-sm sm:text-lg tracking-widest text-gray-400 mb-2">
              Our Portfolio
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-[54px] leading-tight uppercase">
              A Showcase of
              <br className="hidden md:block" />
              Elegance and Detail
            </h2>

            <Link
              to="/projects"
              className="flex items-center gap-2 text-sm sm:text-base hover:gap-3 transition-all duration-300 mt-3"
            >
              Explore Our Projects
              <ArrowUpRight size={18} className="transition-transform" />
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={goPrev}
              disabled={isTransitioning}
              aria-label="Previous"
              className="w-10 h-10 md:w-12 md:h-12 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white/10 transition disabled:opacity-50"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={goNext}
              disabled={isTransitioning}
              aria-label="Next"
              className="w-10 h-10 md:w-12 md:h-12 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white/10 transition disabled:opacity-50"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center h-[650px] overflow-visible">
          {projects.map((project, idx) => {
            const pos = getPosition(idx);
            if (pos === "hidden") return null;

            const { x, scale, opacity, zIndex } = slotProps[pos];

            const isCenter = pos === "center";

            return (
              <motion.div
                key={`${project.id}-${idx}`}
                className="absolute w-[70%] md:w-[50%] h-[500px] rounded overflow-hidden shadow-xl cursor-pointer"
                animate={{ x, scale, opacity, zIndex }}
                initial={false}
                transition={transition}
                style={{ pointerEvents: isCenter ? "auto" : "none" }}
              >
                <Link to={`/projects/${project.id}`}>
                  <motion.div
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={isCenter ? handleDragEnd : undefined}
                    whileTap={isCenter ? { scale: 0.99 } : undefined}
                    className="w-full h-full"
                  >
                    <OptimizedImage
                      src={project.img || project.heroImage || project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-[1.08] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 50vw"
                    />
                  </motion.div>
                </Link>

                <h3 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-xl font-medium tracking-wide">
                  {project.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center items-center gap-3 mt-6">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => goToSlide(idx)}
              disabled={isTransitioning}
              aria-label={`Go to project ${idx + 1}`}
              className="group relative"
            >
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === currentIndex
                    ? "w-16 bg-white"
                    : "w-8 bg-gray-600 group-hover:bg-gray-400 group-hover:w-12"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-6 text-sm text-gray-400">
          <span className="text-white font-medium">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          {" / "}
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
