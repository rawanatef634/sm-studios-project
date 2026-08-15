"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import OptimizedImage from "../components/OptimizedImage";

const AUTO_MS = 4500;
const SLIDE_EASE = [0.22, 1, 0.36, 1];
const SLIDE_MS = 0.7;

function projectImage(project) {
  return project.img || project.heroImage || project.mainImage;
}

function tripleAt(list, i) {
  const n = list.length;
  return {
    left: list[(i - 1 + n) % n],
    center: list[i],
    right: list[(i + 1) % n],
  };
}

function buildSlides(list) {
  if (!list.length) return [];
  const n = list.length;
  return [
    { key: "clone-last", ...tripleAt(list, n - 1) },
    ...list.map((project, i) => ({
      key: `slide-${project.id}`,
      ...tripleAt(list, i),
    })),
    { key: "clone-first", ...tripleAt(list, 0) },
  ];
}

function Caption({ project, fallback = true }) {
  const text =
    project.caption ||
    (fallback
      ? "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Quisque Egestas Metus Vitae Ipsum."
      : "");
  return text;
}

function DesktopSlide({ left, center, right }) {
  return (
    <div className="hidden grid-cols-[0.95fr_1.85fr_0.95fr] items-start gap-6 md:grid">
      <Link to={`/projects/${left.id}`} className="block">
        <div className="h-[360px] overflow-hidden">
          <OptimizedImage
            src={projectImage(left)}
            alt={left.title}
            className="h-full w-full object-cover"
            sizes="(max-width: 1200px) 26vw, 280px"
            fill
          />
        </div>
        <p className="pt-2 font-['El_Messiri'] text-[11px] leading-[1.25] text-[#a1a1a1]">
          {Caption({ project: left })}
        </p>
      </Link>

      <Link to={`/projects/${center.id}`} className="block">
        <div className="h-[470px] overflow-hidden">
          <OptimizedImage
            src={projectImage(center)}
            alt={center.title}
            className="h-full w-full object-cover"
            sizes="(max-width: 1200px) 48vw, 560px"
            fill
          />
        </div>
        <div className="flex items-start justify-between gap-4 pt-2.5">
          <h3 className="font-['El_Messiri'] text-[42px] leading-[0.95] text-white">
            {center.title}
          </h3>
          <p className="max-w-[230px] pt-2 font-['El_Messiri'] text-[11px] leading-[1.25] text-[#9c9c9c]">
            {Caption({ project: center })}
          </p>
        </div>
      </Link>

      <Link to={`/projects/${right.id}`} className="block">
        <div className="h-[360px] overflow-hidden">
          <OptimizedImage
            src={projectImage(right)}
            alt={right.title}
            className="h-full w-full object-cover"
            sizes="(max-width: 1200px) 26vw, 280px"
            fill
          />
        </div>
        <h3 className="pt-2 font-['El_Messiri'] text-[44px] leading-[0.95] text-white">
          {right.title}
        </h3>
      </Link>
    </div>
  );
}

function MobileSlide({ center }) {
  return (
    <Link to={`/projects/${center.id}`} className="block md:hidden">
      <div className="h-[320px] overflow-hidden">
        <OptimizedImage
          src={projectImage(center)}
          alt={center.title}
          className="h-full w-full object-cover"
          sizes="92vw"
          fill
        />
      </div>
      <h3 className="font-['El_Messiri'] pt-3 text-4xl leading-none text-white">{center.title}</h3>
      <p className="pt-2 font-['El_Messiri'] text-xs leading-relaxed text-[#a3a3a3]">
        {center.caption}
      </p>
    </Link>
  );
}

export default function PortfolioCarousel() {
  const n = projects.length;
  const slides = buildSlides(projects);
  const realStart = 1;
  const realEnd = n;
  const cloneFirstIndex = n + 1;
  const cloneLastIndex = 0;

  const [index, setIndex] = useState(realStart);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const busyRef = useRef(false);
  const touchX = useRef(null);

  const goTo = useCallback((next) => {
    if (busyRef.current || n < 2) return;
    busyRef.current = true;
    setIndex(next);
  }, [n]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const handleAnimationComplete = useCallback(() => {
    if (index === cloneFirstIndex) {
      setInstant(true);
      setIndex(realStart);
      return;
    }
    if (index === cloneLastIndex) {
      setInstant(true);
      setIndex(realEnd);
      return;
    }
    busyRef.current = false;
  }, [index, cloneFirstIndex, cloneLastIndex, realStart, realEnd]);

  useEffect(() => {
    if (!instant) return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        setInstant(false);
        busyRef.current = false;
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [instant]);

  useEffect(() => {
    if (paused || n < 2 || instant) return;
    if (index === cloneFirstIndex || index === cloneLastIndex) return;
    const timer = setTimeout(() => {
      goNext();
    }, AUTO_MS);
    return () => clearTimeout(timer);
  }, [index, paused, n, goNext, instant, cloneFirstIndex, cloneLastIndex]);

  const onTouchStart = (event) => {
    touchX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchX.current == null) return;
    const dx = event.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <section className="bg-[#111111]  text-white">
      <div className="mx-auto w-full max-w-8xl pb-12 pt-11 md:pb-16 md:pt-12">
        <div className="mb-10 px-4 md:px-20 flex items-start justify-between gap-6 md:mb-12">
          <div className="max-w-[40rem] ">
            <p className="mb-3 font-['El_Messiri'] text-[16px] font-medium uppercase tracking-[0.16em] text-white">
              Our Portfolio
            </p>
            <h2 className="font-['El_Messiri'] font-semibold text-[45px] leading-[0.95] tracking-[0.005em] uppercase max-md:text-3xl">
              A Showcase of
              <br />
              Elegance and Detail
            </h2>
            <Link
              to="/projects"
              className="mt-5 inline-flex items-center gap-2 border-b border-white/70 pb-0.5 font-['El_Messiri'] text-[18px] font-medium text-white"
            >
              Explore more Projects
              <ArrowUpRight size={16} strokeWidth={1.1} className="shrink-0" />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 pt-16">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous project"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/10"
            >
              <ArrowLeft size={17} strokeWidth={1} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next project"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/10"
            >
              <ArrowRight size={17} strokeWidth={1} />
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            className="flex will-change-transform"
            initial={false}
            animate={{ x: `${-index * 100}%` }}
            transition={
              instant
                ? { duration: 0 }
                : { duration: SLIDE_MS, ease: SLIDE_EASE }
            }
            onAnimationComplete={handleAnimationComplete}
          >
            {slides.map((slide) => (
              <div key={slide.key} className="min-w-full shrink-0 grow-0 basis-full">
                <DesktopSlide
                  left={slide.left}
                  center={slide.center}
                  right={slide.right}
                />
                <MobileSlide center={slide.center} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
