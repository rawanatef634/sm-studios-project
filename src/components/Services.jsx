"use client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "../data/services";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

export default function Services() {
  const { t } = useSiteSettings();

  return (
    <section className="relative w-full max-w-[1512px] mx-auto overflow-hidden bg-white">
      {/* Header section */}
      <div
        className="flex flex-col justify-center items-start gap-[20px] w-[90%] md:w-[1312px] 
      mx-auto text-left mt-8 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-[92px]"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <span className="uppercase tracking-normal font-['El_Messiri'] font-semibold text-[#505050] text-lg md:text-[28px]">
              {t("home.services.label")}
            </span>
            <h2 className="font-['El_Messiri'] text-2xl md:text-5xl font-semibold mt-2 text-[#111111] max-md:uppercase max-md:leading-tight">
              {t("home.services.title")}
            </h2>
          </div>
          <Link
            to="/services"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-base md:text-2xl font-['El_Messiri'] font-semibold text-gray-900 border-b border-gray-900 pb-0.5 w-fit justify-start"
          >
            {t("home.services.link")}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex flex-col md:flex-row justify-center items-stretch md:items-start gap-2 md:gap-[20px] w-[90%] md:w-[1312px] mx-auto mt-8 md:mt-[210px] mb-8 md:mb-0">
        {services.map((service, idx) => {
          const title = t(`service.${service.slug}.title`) || service.title;
          const text = t(`service.${service.slug}.text`) || service.text;
          return (
          <motion.div
            key={service.id}
            className={`
              relative overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 group
              w-full md:flex-1 md:basis-[276px] md:hover:basis-[424px] h-[260px] md:h-[654px]
            `}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <img
              src={service.img}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Base gradient so titles stay readable (Figma-style legibility) */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-black/85 via-black/45 to-black/25"
              aria-hidden
            />
            {/* Stronger overlay on hover */}
            <div className="absolute inset-0 z-[1] bg-black/20 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

            {/* Title (resting state) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-center z-[2]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="px-4 text-white text-2xl font-['El_Messiri'] font-semibold tracking-wide transition-opacity duration-500 md:group-hover:opacity-0">
                {title.toUpperCase()}
              </h3>
            </motion.div>

            {/* Hover content — number, title, text and button share one column */}
            <div className="absolute inset-0 z-[2] hidden md:flex flex-col items-center justify-center gap-4 px-8 text-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:delay-200">
              <span className="font-['El_Messiri'] text-lg font-light leading-none tracking-[0.2em]">
                {service.id}
              </span>
              <h3 className="font-['El_Messiri'] text-3xl font-semibold leading-tight tracking-wide">
                {title.toUpperCase()}
              </h3>
              <p className="max-w-[340px] text-sm leading-relaxed whitespace-pre-line">
                {text}
              </p>
              <Link
                to={`/services/${service.slug}`}
                className="mt-2 px-5 py-2 bg-white text-gray-900 font-['El_Messiri'] hover:bg-gray-200 transition"
              >
                Learn more
              </Link>
            </div>
            <Link
              to={`/services/${service.slug}`}
              className="absolute inset-0 z-[3] md:hidden"
              aria-label={title}
            />
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}
