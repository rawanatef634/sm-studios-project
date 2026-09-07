"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-[#161B1E] text-white w-full md:h-[882px] overflow-hidden my-10"
    >
      {/* Brand geometric pattern — small + faded */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "url('/assets/about-pattern.png')",
          backgroundSize: "280px auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "center top",
        }}
        aria-hidden
      />
      {/* Content stays within design frame; background is full-bleed */}
      <div className="relative z-10 w-full md:max-w-[1512px] md:h-full mx-auto">
        {/* Title */}
        <motion.p
          className="relative z-10 block text-left px-6 my-8 md:absolute md:left-[100px] md:top-[92px] md:my-0 md:px-0 uppercase font-['El_Messiri'] font-semibold text-[16px] md:text-[24px] leading-[32px] md:leading-[38px] text-[#919AA0]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          About SM Studios
        </motion.p>

        {/* Container for layout on mobile */}
        <div className="relative z-10 flex flex-col md:block items-start justify-center h-full mt-0">
          {/* Text content */}
          <motion.div
            className="relative md:absolute flex flex-col items-start gap-6 md:gap-[55px] w-[90%] md:w-[645px] h-auto md:h-[516px] left-0 md:left-[100px] mx-auto md:mx-0 md:top-1/2 md:-translate-y-1/2 px-2 md:px-0"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="font-['El_Messiri'] font-semibold text-[28px] leading-[36px] md:text-[40px] md:leading-[60px] uppercase text-left"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
            >
              WE CREATE INTERIORS WITH
              <br />
              PRECISION.
            </motion.h2>

            <motion.p
              className=" text-[16px] text-gray-400  leading-[28px] md:text-[26px] md:leading-[40px] font-['El_Messiri'] font-light text-left"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
              viewport={{ once: true }}
            >
              As a premier Omani establishment headquartered in Muscat, our firm
              specializes in the dynamic realm of interior architecture design.
              Our unwavering commitment is centered around propelling this
              industry towards unparalleled development through the strategic
              integration of cutting-edge technology.
            </motion.p>

            <a href="#team" className="mx-0">
              <motion.button
                className="cursor-pointer px-6 md:px-8 py-3 border md:text-[26px] border-white rounded-none md:rounded-md hover:bg-white hover:text-black transition-colors duration-300 tracking-wide"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
              >
                Meet Our Team
              </motion.button>
            </a>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative md:absolute w-[90%] mx-auto md:mx-0 md:w-[459.9px] h-[420px] md:h-[738.95px] md:left-[952.05px] md:translate-x-0 mt-10 md:mt-0 bottom-0"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/majlis2.png"
              alt="About SM Studios — Majlis exterior"
              className="w-full h-full object-cover object-center border-white border-t-[4px] border-l-[4px] border-r-[4px] rounded-t-[12px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
