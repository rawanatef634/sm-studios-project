import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ContactSection from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import OptimizedImage from "../components/OptimizedImage";
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
      <HeroSection
        title="OUR PROJECTS"
        breadcrumb="HOME / PROJECTS"
        backgroundImage="/assets/contact.jpg"
      />

      <section className="bg-[#161B1E] py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {/* Category filters — no "Latest Projects" subheader */}
          <div className="mb-12 flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-['El_Messiri'] text-sm tracking-wide transition md:px-5 md:text-base ${
                    active
                      ? "bg-white text-black"
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
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
                  className="group block overflow-hidden shadow-lg transition duration-500 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <OptimizedImage
                      src={proj.img || proj.heroImage || proj.mainImage}
                      alt={`${proj.title} preview`}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition duration-300" />
                    <h3 className="absolute bottom-5 left-1/2 w-[90%] -translate-x-1/2 text-center font-['El_Messiri'] text-lg font-medium tracking-wide text-white md:text-xl">
                      {proj.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </>
  );
}
