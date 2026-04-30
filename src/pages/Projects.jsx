import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ContactSection from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { useState } from "react";
import { useProjects } from "../context/ProjectsContext";

export default function ProjectsPage() {
  const { projects } = useProjects();
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
      ? projects
      : projects.filter((proj) => proj.category === selectedCategory);

  return (
    <>
      {/* Hero section */}
      <HeroSection
        title="OUR PROJECTS"
        breadcrumb="HOME / PROJECTS"
        backgroundImage="/assets/contact.jpg"
      />

      {/* LATEST PROJECTS */}
      <section className="bg-[#161B1E] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-4xl font-semibold mb-10 text-center text-white">
            Latest Projects
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pb-2 text-sm md:text-base tracking-wide border-b-2 transition 
                  ${
                    selectedCategory === cat
                      ? "text-white border-white"
                      : "text-gray-400 border-transparent hover:text-white hover:border-white/60"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProjects.map((proj, i) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: Math.min(i * 0.06, 0.36),
                }}
              >
              <Link
                to={`/projects/${proj.id}`}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <ContactSection />

      {/* FOOTER */}
      <Footer />
    </>
  );
}
 