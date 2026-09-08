import { motion } from "framer-motion";

import ContactSection from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import OptimizedImage from "../components/OptimizedImage";

/** @typedef {import("../types/project").Project} Project */

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerParent = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

/**
 * @param {{ project: Project }} props
 */
export default function ProjectTemplate({ project }) {
  return (
    <>
      {/* HERO SECTION */}
      <HeroSection
        title={project.title}
        breadcrumb={project.breadcrumb}
        backgroundImage={project.heroImage || project.img}
      />

      <div className="bg-[#161B1E]">
        {/* MAIN IMAGE */}
        <motion.div
          className="w-full px-4 py-8 md:px-8 md:py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.div
            className="w-full overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            <OptimizedImage
              src={project.mainImage || project.img}
              alt={project.title}
              className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-[650px] xl:h-[750px]"
              sizes="100vw"
              priority
            />
          </motion.div>
        </motion.div>

        {/* PROJECT INFO ROW */}
        <motion.section
          className="w-full py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerParent}
        >
          <div className="flex w-full flex-col items-start gap-4 px-6 text-base font-light text-white md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-10 md:px-8 md:text-2xl">
            {[
              { label: "State", value: project.state },
              { label: "Town", value: project.town },
              { label: "Area", value: project.area },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                variants={fadeUp}
              >
                <span className="text-gray-400">{item.label}</span>

                <span className="w-35 border-t border-gray-500" />

                <span className="font-semibold tracking-wide">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 3-COLUMN IMAGE + TEXT GRID */}
        <section className="w-full py-16">
          <div className="grid w-full grid-cols-1 gap-6 px-6 md:grid-cols-3 md:px-8">
            {/* Left Image */}
            {project.designImages?.[0] && (
              <motion.div
                className="overflow-hidden shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <OptimizedImage
                  src={project.designImages[0]}
                  alt="design-left"
                  className="h-[240px] w-full object-cover md:h-[500px] xl:h-[620px]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
            )}

            {/* Center Text Block */}
            <motion.div
              className="flex items-center justify-center p-8 text-center md:px-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div>
                <h3 className="mb-4 font-semibold uppercase tracking-widest text-gray-400 text-[18px] md:text-[22px]">
                  The Design Story
                </h3>

                <p className="text-center font-semibold uppercase leading-9 tracking-[0] text-white text-[22px] md:text-[28px] xl:text-[32px] xl:leading-[1.4]">
                  {project.story}
                </p>
              </div>
            </motion.div>

            {/* Right Image */}
            {project.designImages?.[1] && (
              <motion.div
                className="overflow-hidden shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <OptimizedImage
                  src={project.designImages[1]}
                  alt="design-right"
                  className="h-[240px] w-full object-cover md:h-[500px] xl:h-[620px]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* WIDE IMAGE */}
        {project.wideImage && (
          <motion.div
            className="w-full px-6 py-10 md:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <OptimizedImage
              src={project.wideImage}
              alt="project-wide"
              className="h-[220px] w-full object-cover shadow-2xl md:h-[650px] xl:h-[800px]"
              sizes="100vw"
            />
          </motion.div>
        )}

        {/* OUR APPROACH */}
        {project.approach && (
          <motion.section
            className="w-full px-6 py-14 text-center text-white md:px-16 md:py-20 lg:px-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="mb-6 text-[20px] font-semibold uppercase tracking-wide text-gray-400 md:text-[24px]">
              Our Approach
            </h2>

            <p className="mx-auto max-w-[1500px] text-[24px] font-light uppercase leading-relaxed md:text-[33px] xl:text-[38px]">
              “{project.approach}”
            </p>
          </motion.section>
        )}
      </div>

      {/* CONTACT + FOOTER */}
      <ContactSection />
      <Footer />
    </>
  );
}
