"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-[#0f1113] text-white w-full md:max-w-[2205px] md:h-[982px] mx-auto overflow-hidden my-10"
    >
      {/* Subtle grid pattern (Figma-style background) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      {/* Title */}
      <motion.p
        className="relative z-10 block text-center my-10 md:absolute left-6 md:left-[100px] top-[60px] md:top-[92px] uppercase font-['El_Messiri'] font-semibold text-[20px] md:text-[24px] leading-[32px] md:leading-[38px] text-[#919AA0]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        viewport={{ once: true }}
      >
        About SM Studios
      </motion.p>

      {/* Container for layout on mobile */}
      <div className="relative z-10 flex flex-col md:block items-center md:items-start justify-center h-full mt-24 md:mt-0">
        {/* Text content */}
        <motion.div
          className="relative md:absolute flex flex-col items-start gap-[40px] md:gap-[55px] w-[90%] md:w-[645px] h-auto md:h-[516px] left-0 md:left-[100px] mx-auto md:mx-0 md:top-1/2 md:-translate-y-1/2 px-4 md:px-0"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="font-semibold text-[28px] leading-[36px] md:text-[40px] md:leading-[60px] font-['El_Messiri'] uppercase text-center md:text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
            viewport={{ once: true }}
          >
            WE CREATE INTERIORS <br /> WITH PRECISION.
          </motion.h2>

          <motion.p
            className=" text-[16px] text-gray-400  leading-[28px] md:text-[26px] md:leading-[40px] font-light text-center md:text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            viewport={{ once: true }}
          >
           As a premier Omani establishment headquartered in Muscat, 
           our firm specializes in the dynamic realm of interior architecture design. 
           Our unwavering commitment is centered around propelling this industry towards 
           unparalleled development through the strategic integration of cutting-edge technology.
          </motion.p>

          <a href="#team" className="mx-auto md:mx-0">
            <motion.button
              className="cursor-pointer px-6 md:px-8 py-3 border md:text-[26px] border-white rounded-md hover:bg-white hover:text-black transition-colors duration-300 tracking-wide"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.button>
          </a>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative md:absolute w-[250px] md:w-[459.9px] h-[400px] md:h-[838.95px] md:left-[952.05px] md:translate-x-0 mt-10 md:mt-0 bottom-0"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          viewport={{ once: true }}
        >
          <img
            src="/assets/majlis2.png"
            alt="About SM Studios — Majlis exterior"
            className="w-full h-full object-cover object-center border-white border-t-[4px] border-l-[4px] border-r-[4px] rounded-t-[12px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
