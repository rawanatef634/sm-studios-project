"use client";
import { motion } from "framer-motion";

export default function Team() {
  /** Order: founders first, then Talal, then team (per brief). Replace image paths when new assets are added. */
  const teamMembers = [
    {
      name: "Muhannad Al-Hinai",
      role: "Managing Partner | CEO",
      image: "/assets/Muhannad Al-Hinai.png",
    },
    {
      name: "Mohammed Al-Habsi",
      role: "Co-Founder | CFO",
      image: "/assets/Mohammed Al-Habsi.png",
    },
    {
      name: "Talal Alhabsi",
      role: "Site Supervisor",
      image: "/assets/Talal Alhabsi.jpeg",
    },
    {
      name: "Hamida",
      role: "Senior Interior Engineer",
      image: "/assets/Reemi Mahoudh.jpeg",
    },
    {
      name: "Basith",
      role: "Senior Interior Engineer",
      image: "/assets/Abdulbasith.jpeg",
    },
    {
      name: "Rayan",
      role: "Graphic Designer",
      image: "/assets/Raiyan Eltoqi.jpeg",
    },
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.p
          className="uppercase tracking-wide text-md text-gray-500 mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          MEET THE OWNERS
        </motion.p>

        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-gray-900 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          The vision of SM Studios comes from the passion and creativity of its
          founders.
        </motion.h2>

        {/* Team grid */}
        <motion.div
          className="flex flex-wrap justify-center gap-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              className="group text-center w-60 sm:w-60 duration-500 delay-150 hover:bg-black"
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Image — tighter crop (closer portrait) */}
              <div className="w-60 h-60 mx-auto mb-4 overflow-hidden shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-[center_18%] scale-110"
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-500 delay-150 group-hover:text-white">
                  {member.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600 transition-colors duration-500 delay-200 group-hover:text-white">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
