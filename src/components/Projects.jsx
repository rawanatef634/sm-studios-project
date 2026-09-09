import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import OptimizedImage from "../components/OptimizedImage";
import { useProjects } from "../context/ProjectsContext";

const AUTO_MS = 5000;
const EASE = [0.22, 1, 0.36, 1];

const DURATION = 0.9;

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
function ProjectCard({ project, variant }) {
  const isCenter = variant === "center";

  return (
    <motion.div
      layout
      layoutId={`project-${project.id}`}
      className="min-w-0"
      transition={{
        layout: {
          duration: DURATION,
          ease: EASE,
        },
      }}
    >
      <motion.div
        layout
        className={`relative w-full overflow-hidden ${
          isCenter ? "aspect-[6/5]" : "aspect-[7/9]"
        }`}
        transition={{
          layout: {
            duration: DURATION,
            ease: EASE,
          },
        }}
      >
        <Link to={`/projects/${project.id}`} className="absolute inset-0 block">
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: isCenter ? 1 : 0.985,
            }}
            transition={{
              duration: DURATION,
              ease: EASE,
            }}
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
          </motion.div>
        </Link>
      </motion.div>

      {/* Metadata */}
      <motion.div
        layout
        className="mt-2.5 min-h-[3.5rem]"
        transition={{
          layout: {
            duration: DURATION,
            ease: EASE,
          },
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${project.id}-${variant}-meta`}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -6,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
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
      </motion.div>
    </motion.div>
  );
}

function DesktopStage({ projects, index }) {
  const n = projects.length;

  const getOffset = (projectIndex) => {
    const leftIndex = wrapIndex(index - 1, n);
    const centerIndex = wrapIndex(index, n);
    const rightIndex = wrapIndex(index + 1, n);

    if (projectIndex === leftIndex) return -1;
    if (projectIndex === centerIndex) return 0;
    if (projectIndex === rightIndex) return 1;

    let diff = projectIndex - index;

    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;

    return diff < 0 ? -2 : 2;
  };

  const getPosition = (offset) => {
    // LEFT
    if (offset === -1) {
      return {
        left: "0%",
        width: "24%",
        height: "470px",
        opacity: 1,
        scale: 1,
        zIndex: 2,
      };
    }

    // CENTER
    if (offset === 0) {
      return {
        left: "25.5%",
        width: "49%",
        height: "570px",
        opacity: 1,
        scale: 1,
        zIndex: 5,
      };
    }

    // RIGHT
    if (offset === 1) {
      return {
        left: "76%",
        width: "24%",
        height: "470px",
        opacity: 1,
        scale: 1,
        zIndex: 2,
      };
    }

    // HIDDEN LEFT
    if (offset < -1) {
      return {
        left: "-26%",
        width: "24%",
        height: "470px",
        opacity: 0,
        scale: 0.96,
        zIndex: 0,
      };
    }

    // HIDDEN RIGHT
    return {
      left: "102%",
      width: "24%",
      height: "470px",
      opacity: 0,
      scale: 0.96,
      zIndex: 0,
    };
  };

  return (
    <div className="relative hidden h-[650px] w-full overflow-hidden md:block">
      {projects.map((project, projectIndex) => {
        const offset = getOffset(projectIndex);
        const position = getPosition(offset);

        const isLeft = offset === -1;
        const isCenter = offset === 0;
        const isRight = offset === 1;

        return (
          <motion.div
            key={project.id}
            className="absolute top-0"
            initial={false}
            animate={position}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              pointerEvents: isLeft || isCenter || isRight ? "auto" : "none",
            }}
          >
            <Link
              to={`/projects/${project.id}`}
              className="block h-full w-full"
            >
              <div className="relative h-full w-full overflow-hidden">
                <OptimizedImage
                  src={projectImage(project)}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  sizes={isCenter ? "49vw" : "24vw"}
                  fill
                  priority={isCenter}
                />
              </div>
            </Link>

            <AnimatePresence mode="wait">
              {isCenter && (
                <motion.div
                  key={`center-${project.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3 flex items-start justify-between gap-6"
                >
                  <h3 className="font-['El_Messiri'] text-[42px] leading-[0.95] text-white">
                    {project.title}
                  </h3>

                  <p className="max-w-[250px] font-['El_Messiri'] text-[13px] leading-[1.4] text-[#9c9c9c]">
                    {Caption({ project })}
                  </p>
                </motion.div>
              )}

              {isLeft && (
                <motion.p
                  key={`left-${project.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3 font-['El_Messiri'] text-[13px] leading-[1.4] text-[#a1a1a1]"
                >
                  {Caption({ project })}
                </motion.p>
              )}

              {isRight && (
                <motion.h3
                  key={`right-${project.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3 font-['El_Messiri'] text-[38px] leading-none text-white"
                >
                  {project.title}
                </motion.h3>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
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
      }, 950);
    },
    [n],
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
      <div className="w-full pb-12 pt-11 md:pb-16 md:pt-12">
        {" "}
        <div className="mb-10 flex items-start justify-between gap-6 px-4 md:mb-12 md:px-20">
          <div className="max-w-[40rem]">
            <p className="mb-7 font-['El_Messiri'] text-[20px] font-medium uppercase tracking-[0.16em] text-white">
              Our Portfolio
            </p>
            <h2 className="font-['El_Messiri'] text-[50px] font-bold leading-[0.95] tracking-[0.01em] uppercase max-md:text-3xl">
              A Showcase of
              <br />
              Elegance and Detail
            </h2>
            <Link
              to="/projects"
              className="mt-7 inline-flex items-center gap-2 border-b border-white/70 pb-0.5 font-['El_Messiri'] text-[18px] font-medium text-white"
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
          <DesktopStage projects={projects} index={index} />
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
