import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ContactSection from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { projects } from "../data/projectsDetails";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
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

export default function SingleProject() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === Number(id));


  if (!project) {
    return (
      <div className="bg-[#161B1E] text-white min-h-screen flex items-center justify-center text-2xl">
        Project not found.
      </div>
    );
  }

  return (
    <>
      {/* HERO SECTION */}
      <HeroSection
        title={project.title}
        breadcrumb={project.breadcrumb}
        backgroundImage={project.heroImage || project.img} // fallback if key is different
      />

      <div className="bg-[#161B1E]">
        {/* MAIN IMAGE */}
        <motion.div
          className="max-w-7xl mx-auto px-6 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.img
            src={project.mainImage || project.img}
            alt={project.title}
            className="w-full max-h-[min(90vh,720px)] min-h-[400px] object-contain object-center bg-[#161B1E] shadow-2xl"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>

        {/* PROJECT INFO ROW */}
        <motion.section
          className="py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerParent}
        >
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-white text-xl md:text-2xl font-light">
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
                <span className="border-t border-gray-500 w-35"></span>
                <span className="font-semibold tracking-wide">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 3-COLUMN IMAGE + TEXT GRID */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
            {/* Left Image */}
            {project.designImages?.[0] && (
              <motion.img
                src={project.designImages[0]}
                alt="design-left"
                className="w-full h-[420px] object-contain object-center bg-[#161B1E] shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              />
            )}

            {/* Center Text Block */}
            <motion.div
              className="flex items-center justify-center p-8 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div>
                <h3 className="font-semibold text-[18px] text-gray-400 text-sm tracking-widest mb-4 uppercase md:text-[22px]">
                  The Design Story
                </h3>
                <p className="font-semibold text-[22px] leading-9 tracking-[0] text-center uppercase text-white md:text-[28px]">
                  {project.story}
                </p>

              </div>
            </motion.div>

            {/* Right Image */}
            {project.designImages?.[1] && (
              <motion.img
                src={project.designImages[1]} // ✅ fixed index (was 2)
                alt="design-right"
                className="w-full h-[420px] object-contain object-center bg-[#161B1E] shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              />
            )}
          </div>
        </section>

        {/* WIDE IMAGE */}
        {project.wideImage && (
          <motion.div
            className="max-w-7xl mx-auto px-6 py-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <img
              src={project.wideImage}
              alt="project-wide"
              className="w-full min-h-[400px] max-h-[720px] object-contain object-center bg-[#161B1E] shadow-2xl md:min-h-[500px]"
            />
          </motion.div>
        )}

        {/* OUR APPROACH */}
        {project.approach && (
          <motion.section
            className="max-w-6xl mx-auto text-center px-6 py-10 text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-[20px] md:text-[24px] text-gray-400 font-semibold mb-6 tracking-wide uppercase">
              Our Approach
            </h2>
            <p className="text-[24px] md:text-[33px] font-light leading-relaxed uppercase">
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
