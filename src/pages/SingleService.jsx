import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ContactSection from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Accordion from "../components/Accordion";
import ProcessGrid from "../components/ProcessGrid";
import { projects } from "../data/projects";
import { Link } from "react-router-dom";
import { fadeInUp } from "../utils/motionVariants";

// Centralized data
import { servicesDetails, processSteps } from "../data/servicesDetails";

export default function SingleService() {
  const { slug } = useParams();
  const service = servicesDetails[slug];

  if (!service) {
    return (
      <div className="bg-[#161B1E] text-white min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Service Not Found</h1>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <HeroSection
        title={service.title}
        breadcrumb={service.breadcrumb}
        backgroundImage={service.backgroundImage}
      />

      <div className="bg-[#161B1E] text-white">
        {/* About */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-[24px] text-gray-400 font-semibold mb-4 uppercase">
              About This Service
              <div className="border-b mt-5 border-gray-700 w-70"></div>
            </h2>
            <p className=" leading-relaxed md:text-[24px]">{service.about}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-[350px] object-cover"
            />
          </motion.div>
        </section>

        {/* Process */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.h2
            className="text-2xl md:text-3xl font-semibold mb-10 text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            OUR PROCESS
          </motion.h2>
          <ProcessGrid steps={processSteps} />
        </section>

        {/* Sub Services Accordion */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.h2
            className="text-2xl md:text-[24px] font-semibold mb-10 text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            SUB SERVICES
            <div className="border-b mt-5 border-gray-700 w-70"></div>

          </motion.h2>
          <Accordion items={service.subServices} />
        </section>
      </div>
          {/* Latest Projects */}
             <section className="bg-[#161B1E] py-24 text-white overflow-x-hidden">
                <div className="max-w-[1512px] mx-auto px-6 md:px-12 text-center">
                  <motion.h2
                    className="text-3xl md:text-4xl font-semibold mb-6"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    Latest Projects
                  </motion.h2>
        
                  <motion.div
                    className="w-20 h-[2px] bg-gray-600 mx-auto mb-12"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true }}
                  />
        
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.slice(0, 3).map((proj, idx) => (
                      <motion.div
                        key={proj.id}
                        className="relative group overflow-hidden shadow-md"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="show"
                        transition={{ delay: idx * 0.2 }}
                        viewport={{ once: true }}
                      >
                        <Link to={`/projects/${proj.id}`}>
                          <img
                            src={proj.img}
                            alt={proj.title}
                            className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500">
                            <p className="text-lg md:text-xl font-semibold">
                              {proj.title}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
      {/* CTA */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
