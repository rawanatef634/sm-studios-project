"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="relative my-10 w-full overflow-hidden bg-[#161B1E] text-white md:h-[882px]"
    >
      {/* Pattern — one large pattern on right */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-[2] hidden h-full w-[220px] overflow-hidden md:block"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/2 h-[1500px] w-[1500px]
           -translate-x-[45%] -translate-y-1/2 rotate-90"
          style={{
            backgroundColor: "#101719",

            WebkitMaskImage: "url('/assets/pattern.png')",
            maskImage: "url('/assets/pattern.png')",

            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",

            WebkitMaskSize: "contain",
            maskSize: "contain",

            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </div>

      {/* CONTENT FRAME */}
      <div className="relative mx-auto w-full md:h-full md:max-w-[1512px]">
        {/* ABOUT LABEL */}
        <motion.p
          className="
            relative
            z-20
            my-8
            block
            px-6
            text-left
            font-['El_Messiri']
            text-[16px]
            font-semibold
            uppercase
            leading-[32px]
            text-[#919AA0]

            md:absolute
            md:left-[100px]
            md:top-[92px]
            md:my-0
            md:px-0
            md:text-[24px]
            md:leading-[38px]
          "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 0.2,
          }}
          viewport={{ once: true }}
        >
          About SM Studios
        </motion.p>

        {/* TEXT */}
        <motion.div
          className="
            relative
            z-20
            mx-auto
            flex
            h-auto
            w-[90%]
            flex-col
            items-start
            gap-6
            px-2

            md:absolute
            md:left-[100px]
            md:top-1/2
            md:mx-0
            md:h-[516px]
            md:w-[645px]
            md:-translate-y-1/2
            md:gap-[55px]
            md:px-0
          "
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="
              text-left
              font-['El_Messiri']
              text-[28px]
              font-semibold
              uppercase
              leading-[36px]
              md:text-[40px]
              md:leading-[60px]
            "
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.3,
            }}
            viewport={{ once: true }}
          >
            WE CREATE INTERIORS WITH
            <br />
            PRECISION.
          </motion.h2>

          <motion.p
            className="
              text-left
              font-['El_Messiri']
              text-[16px]
              font-light
              leading-[28px]
              text-gray-400
              md:text-[26px]
              md:leading-[40px]
            "
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.4,
            }}
            viewport={{ once: true }}
          >
            As a premier Omani establishment headquartered in Muscat, our firm
            specializes in the dynamic realm of interior architecture design.
            Our unwavering commitment is centered around propelling this
            industry towards unparalleled development through the strategic
            integration of cutting-edge technology.
          </motion.p>

          <a href="#team">
            <motion.button
              type="button"
              className="
                cursor-pointer
                rounded-none
                border
                border-white
                px-6
                py-3
                tracking-wide
                transition-colors
                duration-300
                hover:bg-white
                hover:text-black
                md:px-8
                md:text-[26px]
              "
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: 0.5,
              }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.button>
          </a>
        </motion.div>

        {/* MAJLIS IMAGE */}
        <motion.div
          className="
            relative
            z-10
            bottom-0
            mx-auto
            mt-10
            h-[420px]
            w-[90%]

            md:absolute
            md:left-[952.05px]
            md:mt-0
            md:h-[738.95px]
            md:w-[459.9px]
          "
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.6,
          }}
          viewport={{ once: true }}
        >
          <img
            src="/assets/majlis2.png"
            alt="About SM Studios — Majlis exterior"
            className="
              h-full
              w-full
              rounded-t-[12px]
              border-l-[4px]
              border-r-[4px]
              border-t-[4px]
              border-white
              object-cover
              object-center
            "
          />
        </motion.div>
      </div>
    </section>
  );
}
