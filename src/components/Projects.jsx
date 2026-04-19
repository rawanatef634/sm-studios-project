"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import OptimizedImage from "../components/OptimizedImage";

/** Motion tuned to Figma: ~0.65s ease [0.25, 0.1, 0.25, 1] */
const TRANSITION_MS = 650;
const EASE = [0.25, 0.1, 0.25, 1];

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const update = () => setMatches(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export default function PortfolioCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mountedRef = useRef(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const prevIndex = useCallback(
    (i = currentIndex) => (i === 0 ? projects.length - 1 : i - 1),
    [currentIndex],
  );
  const nextIndex = useCallback(
    (i = currentIndex) => (i === projects.length - 1 ? 0 : i + 1),
    [currentIndex],
  );

  const withTransitionLock = useCallback(
    (action) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      action();
      setTimeout(() => {
        if (mountedRef.current) setIsTransitioning(false);
      }, TRANSITION_MS + 50);
    },
    [isTransitioning],
  );

  const goPrev = useCallback(() => {
    withTransitionLock(() => setCurrentIndex((i) => prevIndex(i)));
  }, [withTransitionLock, prevIndex]);

  const goNext = useCallback(() => {
    withTransitionLock(() => setCurrentIndex((i) => nextIndex(i)));
  }, [withTransitionLock, nextIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const getPosition = (index) => {
    if (!isDesktop) {
      return index === currentIndex ? "center" : "hidden";
    }
    const total = projects.length;
    if (index === currentIndex) return "center";
    if (index === (currentIndex - 1 + total) % total) return "left";
    if (index === (currentIndex + 1) % total) return "right";
    return "hidden";
  };

  const handleDragEnd = (_event, info) => {
    const threshold = 80;
    if (info.offset.x > threshold) goPrev();
    else if (info.offset.x < -threshold) goNext();
  };

  /**
   * Pixel-perfect carousel: cards anchored at viewport center (left:50%; top:50%),
   * translate uses % of card width for centering, then fixed shift for side slots.
   */
  const transition = {
    duration: TRANSITION_MS / 1000,
    ease: EASE,
  };

  const renderSlideChrome = (project, pos) => {
    const caption = project.caption ?? "";
    const title = project.title;

    if (pos === "center") {
      return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 bg-gradient-to-t from-[#111111] from-25% via-[#111111]/90 to-transparent px-5 pb-6 pt-20 md:flex-row md:items-end md:justify-between md:gap-10 md:px-8 md:pb-8 md:pt-28">
          <h3 className="font-portfolio-serif max-w-[min(100%,28rem)] text-left text-[1.375rem] font-medium uppercase leading-[1.15] tracking-[0.14em] text-white md:text-[2.125rem] lg:text-[2.375rem]">
            {title}
          </h3>
          <p className="font-portfolio-sans max-w-[min(100%,20rem)] text-left text-[13px] font-light leading-[1.65] text-[#bbbbbb] md:max-w-[min(340px,38%)] md:text-right md:text-[15px] md:leading-relaxed">
            {caption}
          </p>
        </div>
      );
    }
    if (pos === "left") {
      return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#111111] from-20% to-transparent px-5 pb-6 pt-16 md:px-6 md:pb-7 md:pt-24">
          <p className="font-portfolio-sans max-w-md text-left text-[13px] font-light leading-relaxed text-[#bbbbbb] md:text-[15px]">
            {caption}
          </p>
        </div>
      );
    }
    if (pos === "right") {
      return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#111111] from-20% to-transparent px-5 pb-6 pt-16 md:px-6 md:pb-7 md:pt-24">
          <h3 className="font-portfolio-serif text-left text-[1.125rem] font-medium uppercase tracking-[0.12em] text-white md:text-[1.625rem]">
            {title}
          </h3>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="relative bg-[#161B1E] font-portfolio-sans text-white">
      {/* Match Hero horizontal rhythm: md:px-[100px] */}
      <div className="mx-auto w-full max-w-[2000px] px-4 pb-16 pt-14 sm:px-6 md:px-[100px] md:pb-24 md:pt-20">
        {/* Header row — label / headline / CTA left; nav right; aligns with Figma */}
        <div className="mb-12 flex flex-col gap-10 md:mb-16 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="max-w-[42rem]">
            <p className="font-portfolio-sans mb-4 text-[13px] font-normal uppercase leading-none tracking-[0.28em] text-white md:text-sm md:tracking-[0.32em]">
              Our Portfolio
            </p>
            <h2 className="font-portfolio-serif text-[1.75rem] font-medium uppercase leading-[1.12] tracking-[0.07em] text-white sm:text-[2rem] md:text-[2.75rem] lg:text-[3.375rem]">
              A Showcase of
              <br />
              Elegance and Detail
            </h2>
            <Link
              to="/projects"
              className="font-portfolio-sans mt-8 inline-flex items-center gap-2 border-b border-white pb-[2px] text-[15px] font-normal tracking-[0.02em] text-white transition hover:opacity-90 md:mt-10 md:text-base"
            >
              Explore more Projects
              <ArrowUpRight
                size={17}
                strokeWidth={1.2}
                className="shrink-0 opacity-95"
              />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-[14px] md:pt-[6px]">
            <button
              type="button"
              onClick={goPrev}
              disabled={isTransitioning}
              aria-label="Previous project"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-transparent text-white transition hover:bg-white/10 disabled:opacity-35"
            >
              <ArrowLeft size={19} strokeWidth={1.15} />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={isTransitioning}
              aria-label="Next project"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-transparent text-white transition hover:bg-white/10 disabled:opacity-35"
            >
              <ArrowRight size={19} strokeWidth={1.15} />
            </button>
          </div>
        </div>

        {/* Carousel track — fixed height matches Figma frame proportion */}
        <div className="relative mx-auto h-[min(72vh,520px)] w-full md:h-[560px]">
          {projects.map((project, idx) => {
            const pos = getPosition(idx);
            if (pos === "hidden") return null;

            const isCenter = pos === "center";
            /** Distance between viewport center and side card center; extra px = visible gap between slides */
            const sideShift = "min(360px, max(260px, 24vw))";
            const slideGapPx = 28;

            const x =
              pos === "center"
                ? "-50%"
                : pos === "left"
                  ? `calc(-50% - ${sideShift} - ${slideGapPx}px)`
                  : `calc(-50% + ${sideShift} + ${slideGapPx}px)`;

            const scale = isCenter ? 1 : 0.88;
            const opacity = isCenter ? 1 : 0.52;
            const zIndex = isCenter ? 30 : 10;

            return (
              <motion.div
                key={`${project.id}-${idx}`}
                className={`absolute top-1/2 overflow-hidden bg-[#1a1a1a] shadow-[0_24px_64px_rgba(0,0,0,0.45)] ${
                  isDesktop
                    ? "h-[560px] w-[min(640px,calc(100vw-120px))] max-w-[640px]"
                    : "h-[min(58vh,480px)] w-[min(90vw,400px)]"
                } `}
                style={{
                  left: "50%",
                  zIndex,
                }}
                animate={{
                  x,
                  y: "-50%",
                  scale,
                  opacity,
                }}
                initial={false}
                transition={transition}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="relative block h-full w-full"
                  aria-label={`View ${project.title}`}
                >
                  <motion.div
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={isCenter ? handleDragEnd : undefined}
                    whileTap={isCenter ? { scale: 0.998 } : undefined}
                    className="relative h-full w-full"
                  >
                    <OptimizedImage
                      src={
                        project.img || project.heroImage || project.mainImage
                      }
                      alt={project.title}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 90vw, 640px"
                    />
                    {renderSlideChrome(project, pos)}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
