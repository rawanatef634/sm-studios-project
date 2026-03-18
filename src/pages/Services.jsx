"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import ContactSection from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { services } from "../data/services";
import { projects } from "../data/projectsDetails";
import { fadeInUp, fadeInLeft, fadeInRight } from "../utils/motionVariants";

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Interior Design",
    "Architecture Design",
    "3D Visualization",
    "Interior Fit-Outs",
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projects.slice(0, 3)
      : projects
          .filter((proj) => proj.category === selectedCategory)
          .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <HeroSection
        title="OUR SERVICES"
        breadcrumb="HOME / SERVICES"
        backgroundImage="/assets/interior-design.jpg"
      />

      {/* Services Section */}
      <section className="bg-[#161B1E] text-white py-28 md:py-32 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto px-3 md:px-12 space-y-32">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              className={`flex flex-col md:flex-row ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-center justify-between gap-10 md:gap-16 w-full overflow-hidden`}
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Image */}
              <motion.div
                className="flex-shrink-0 w-full md:w-[837px] max-w-full"
                variants={idx % 2 === 1 ? fadeInRight : fadeInLeft}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Link to={`/services/${service.slug}`}>
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-[422px] object-cover shadow-md hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>
              </motion.div>

              {/* Description */}
              <motion.div
                className="relative w-full md:w-[450px] flex flex-col justify-center"
                variants={idx % 2 === 1 ? fadeInLeft : fadeInRight}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <span className="absolute top-0 left-0 text-7xl md:text-8xl font-bold text-white/5 select-none">
                  {service.id}
                </span>
                <h2 className="text-[28px] md:text-[40px] font-semibold mb-5 relative z-10">
                  {service.title}
                </h2>
                <p className="text-gray-400 leading-relaxed text-[16px] md:text-[18px] mb-8 relative z-10">
                  {service.text}
                </p>
                <Link
                  to={`/services/${service.slug}`}
                  className="px-0 py-2 border-b border-white w-[120px] text-[18px] hover:text-black hover:bg-white transition-all duration-300 relative z-10 inline-block"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

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

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm md:text-base transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "bg-transparent text-gray-400 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <Link
                to={`/projects/${proj.id}`}
                key={proj.id}
                className="group block overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
              >
                <div className="relative">
                  <img
                    src={proj.img || proj.heroImage || proj.mainImage}
                    alt={`${proj.title} preview`}
                    loading="lazy"
                    className="w-full h-[350px] object-cover transform group-hover:scale-110 transition duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition duration-300" />
                  <h3 className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-xl font-medium tracking-wide opacity-0 group-hover:opacity-100 transition duration-300">
                    {proj.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results Message */}
          {filteredProjects.length === 0 && (
            <motion.p
              className="text-gray-400 text-lg mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No projects found in this category.
            </motion.p>
          )}
        </div>
      </section>

      {/* CTA + Footer */}
      <ContactSection />
      <Footer />
    </>
  );
}