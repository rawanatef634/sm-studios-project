"use client";
import { motion } from "framer-motion";

export default function Team() {
  const teamMembers = [
    {
      name: "Mohammed Al-Habsi",
      role: "Co-Founder | CFO",
      image: "/assets/Mohammed Al-Habsi.png",
    },
    {
      name: "Muhannad Al-Hinai",
      role: "Managing Partner | CEO",
      image: "/assets/Muhannad Al-Hinai.png",
    },
    {
      name: "Abulbasith",
      role: "Architect",
      image: "/assets/Abdulbasith.jpeg",
    },
    {
      name: "Reemi Mahoudh",
      role: "Interior Designer",
      image: "/assets/Reemi Mahoudh.jpeg",
    },
    {
      name: "Raiyan Eltoqi.jpeq",
      role: "Interior Designer",
      image: "/assets/Raiyan Eltoqi.jpeg",
    },
    {
      name: "Talal Alhabsi",
      role: "Junior Interior Designer",
      image: "/assets/Talal Alhabsi.jpeg",
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
              {/* Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-60 h-60 sm:w-60 sm:h-60 object-cover mx-auto mb-4 shadow-md block"
              />

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
