import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import OptimizedImage from "../components/OptimizedImage";
import { useProjects } from "../context/ProjectsContext";

const AUTO_MS = 5000;
const EASE = [0.22, 1, 0.36, 1];
const DURATION = 0.55;

function projectImage(project) {
  return project.img || project.heroImage || project.mainImage;
}

function wrapIndex(i, n) {
  return ((i % n) + n) % n;
}

function Caption({ project }) {
  return (
    project.caption ||
    project.story ||
    "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Quisque Egestas Metus Vitae Ipsum."
  );
}

/**
 * Fixed slots (no layout morph). Images crossfade + scale in place —
 * avoids the glitchy left/width/aspectRatio animation.
 */
function ProjectCard({ project, variant, direction }) {
  const isCenter = variant === "center";
  const enterX = direction >= 0 ? 18 : -18;
  const exitX = direction >= 0 ? -18 : 18;

  return (
    <div className="min-w-0">
      <div
        className={`relative w-full overflow-hidden ${
          isCenter ? "aspect-[6/5]" : "aspect-[7/9]"
        }`}
      >
        <AnimatePresence initial={false} mode="sync" custom={direction}>
          <motion.div
            key={project.id}
            className="absolute inset-0"
            custom={direction}
            initial={{ opacity: 0, scale: 1.06, x: enterX }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: exitX }}
            transition={{ duration: DURATION, ease: EASE }}
          >
            <Link
              to={`/projects/${project.id}`}
              className="absolute inset-0 block"
            >
              <OptimizedImage
                src={projectImage(project)}
                alt={project.title}
                className="h-full w-full object-cover"
                sizes={
                  isCenter
                    ? "(max-width: 1200px) 48vw, 640px"
                    : "(max-width: 1200px) 24vw, 300px"
                }
                fill
                priority={isCenter}
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2.5 min-h-[3.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${project.id}-${variant}-meta`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {variant === "side-left" && (
              <p className="font-['El_Messiri'] text-[13px] leading-[1.35] text-[#a1a1a1]">
                {Caption({ project })}
              </p>
            )}

            {isCenter && (
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-['El_Messiri'] text-[32px] leading-[0.95] text-white md:text-[42px]">
                  {project.title}
                </h3>
                <p className="max-w-[250px] pt-1 font-['El_Messiri'] text-[13px] leading-[1.35] text-[#9c9c9c]">
                  {Caption({ project })}
                </p>
              </div>
            )}

            {variant === "side-right" && (
              <h3 className="font-['El_Messiri'] text-[32px] leading-[0.95] text-white md:text-[44px]">
                {project.title}
              </h3>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DesktopStage({ projects, index, direction }) {
  const n = projects.length;
  const left = projects[wrapIndex(index - 1, n)];
  const center = projects[wrapIndex(index, n)];
  const right = projects[wrapIndex(index + 1, n)];

  return (
    <div className="hidden grid-cols-[minmax(0,0.95fr)_minmax(0,1.85fr)_minmax(0,0.95fr)] items-start gap-6 px-4 md:grid md:px-20">
      <ProjectCard project={left} variant="side-left" direction={direction} />
      <ProjectCard project={center} variant="center" direction={direction} />
      <ProjectCard project={right} variant="side-right" direction={direction} />
    </div>
  );
}

function MobileStage({ projects, index, direction }) {
  const center = projects[wrapIndex(index, projects.length)];
  const enterX = direction >= 0 ? 24 : -24;
  const exitX = direction >= 0 ? -24 : 24;

  return (
    <div className="px-4 md:hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={center.id}
          initial={{ opacity: 0, x: enterX }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: exitX }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Link to={`/projects/${center.id}`} className="block">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <OptimizedImage
                src={projectImage(center)}
                alt={center.title}
                className="h-full w-full object-cover"
                sizes="92vw"
                fill
                priority
              />
            </div>
            <div className="flex items-start justify-between gap-4 pt-3">
              <h3 className="font-['El_Messiri'] text-2xl leading-none text-white">
                {center.title}
              </h3>
              <p className="max-w-[48%] pt-0.5 font-['El_Messiri'] text-[12px] leading-relaxed text-[#a3a3a3]">
                {Caption({ project: center })}
              </p>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function PortfolioCarousel() {
  const { projects, loading } = useProjects();
  const n = projects.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const busyRef = useRef(false);
  const touchX = useRef(null);

  const goTo = useCallback(
    (next, dir) => {
      if (busyRef.current || n < 2) return;
      busyRef.current = true;
      setDirection(dir);
      setIndex(wrapIndex(next, n));
      window.setTimeout(() => {
        busyRef.current = false;
      }, DURATION * 1000 + 50);
    },
    [n]
  );

  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);

  useEffect(() => {
    if (paused || n < 2) return;
    const timer = setTimeout(() => goNext(), AUTO_MS);
    return () => clearTimeout(timer);
  }, [index, paused, n, goNext]);

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

  if (loading || n === 0) return null;

  return (
    <section className="bg-[#161B1E] text-white">
      <div className="mx-auto w-full max-w-8xl pb-12 pt-11 md:pb-16 md:pt-12">
        <div className="mb-10 flex items-start justify-between gap-6 px-4 md:mb-12 md:px-20">
          <div className="max-w-[40rem]">
            <p className="mb-3 font-['El_Messiri'] text-[16px] font-medium uppercase tracking-[0.16em] text-white">
              Our Portfolio
            </p>
            <h2 className="font-['El_Messiri'] text-[45px] font-semibold leading-[0.95] tracking-[0.005em] uppercase max-md:text-3xl">
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

          <div className="flex shrink-0 items-center gap-2 pt-2 md:pt-16">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/10 md:h-12 md:w-12"
            >
              <ArrowLeft size={17} strokeWidth={1} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/10 md:h-12 md:w-12"
            >
              <ArrowRight size={17} strokeWidth={1} />
            </button>
          </div>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <DesktopStage
            projects={projects}
            index={index}
            direction={direction}
          />
          <MobileStage
            projects={projects}
            index={index}
            direction={direction}
          />
        </div>
      </div>
    </section>
  );
}
