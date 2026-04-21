"use client";
import { useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import OptimizedImage from "../components/OptimizedImage";

export default function PortfolioCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  const centerProject = projects[currentIndex];
  const leftProject = projects[prevIndex];
  const rightProject = projects[nextIndex];

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? projects.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i === projects.length - 1 ? 0 : i + 1));
  }, []);

  return (
    <section className="bg-[linear-gradient(90deg,#1a242b_0%,#131a1f_40%,#101418_100%)]  text-white">
      <div className="mx-auto w-full max-w-8xl pb-12 pt-11 md:pb-16 md:pt-12">
        <div className="mb-10 px-4 md:px-20 flex items-start justify-between gap-6 md:mb-12">
          <div className="max-w-[40rem] ">
            <p className="mb-3 text-[16px] font-bold uppercase tracking-[0.16em] text-white">
              Our Portfolio
            </p>
            <h2 className="font-semibold text-[45px] leading-[0.95] tracking-[0.005em] uppercase max-md:text-3xl">
              A Showcase of
              <br />
              Elegance and Detail
            </h2>
            <Link
              to="/projects"
              className="mt-5 inline-flex items-center gap-2 border-b border-white/70 pb-0.5 text-[18px] font-bold text-white"
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

        {/* Desktop replica: 3-card composition */}
        <div className="hidden grid-cols-[0.95fr_1.85fr_0.95fr] items-start gap-6 md:grid">
          <Link to={`/projects/${leftProject.id}`} className="block">
            <div className="h-[360px] overflow-hidden">
              <OptimizedImage
                src={
                  leftProject.img ||
                  leftProject.heroImage ||
                  leftProject.mainImage
                }
                alt={leftProject.title}
                className="h-full w-full object-cover"
                sizes="(max-width: 1200px) 26vw, 280px"
              />
            </div>
            <p className="pt-2 text-[11px] leading-[1.25] text-[#a1a1a1]">
              {leftProject.caption ||
                "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Quisque Egestas Metus Vitae Ipsum."}
            </p>
          </Link>

          <Link to={`/projects/${centerProject.id}`} className="block">
            <div className="h-[470px] overflow-hidden">
              <OptimizedImage
                src={
                  centerProject.img ||
                  centerProject.heroImage ||
                  centerProject.mainImage
                }
                alt={centerProject.title}
                className="h-full w-full object-cover"
                sizes="(max-width: 1200px) 48vw, 560px"
              />
            </div>
            <div className="flex items-start justify-between gap-4 pt-2.5">
              <h3 className=" text-[42px] leading-[0.95] text-white">
                {centerProject.title}
              </h3>
              <p className="max-w-[230px] pt-2 text-[11px] leading-[1.25] text-[#9c9c9c]">
                {centerProject.caption ||
                  "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Quisque Egestas Metus Vitae Ipsum."}
              </p>
            </div>
          </Link>

          <Link to={`/projects/${rightProject.id}`} className="block">
            <div className="h-[360px] overflow-hidden">
              <OptimizedImage
                src={
                  rightProject.img ||
                  rightProject.heroImage ||
                  rightProject.mainImage
                }
                alt={rightProject.title}
                className="h-full w-full object-cover"
                sizes="(max-width: 1200px) 26vw, 280px"
              />
            </div>
            <h3 className="pt-2 text-[44px] leading-[0.95] text-white">
              {rightProject.title}
            </h3>
          </Link>
        </div>

        {/* Mobile fallback */}
        <Link to={`/projects/${centerProject.id}`} className="block md:hidden">
          <div className="h-[320px] overflow-hidden">
            <OptimizedImage
              src={
                centerProject.img ||
                centerProject.heroImage ||
                centerProject.mainImage
              }
              alt={centerProject.title}
              className="h-full w-full object-cover"
              sizes="92vw"
            />
          </div>
          <h3 className=" pt-3 text-4xl leading-none text-white">
            {centerProject.title}
          </h3>
          <p className="pt-2 text-xs leading-relaxed text-[#a3a3a3]">
            {centerProject.caption}
          </p>
        </Link>
      </div>
    </section>
  );
}
