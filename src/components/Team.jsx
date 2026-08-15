"use client";
import { motion } from "framer-motion";

export default function Team() {
  /** Order: founders first, then Talal, then team (per brief). Replace image paths when new assets are added. */
  const teamMembers = [
    {
      name: "Muhannad Al-Hinai",
      role: "Managing Partner | CEO",
      image: "/assets/Muhannad Al-Hinai.png",
      objectPosition: "center 18%",
      scale: 1.1,
    },
    {
      name: "Mohammed Al-Habsi",
      role: "Co-Founder | CFO",
      image: "/assets/Mohammed Al-Habsi.png",
      objectPosition: "center 18%",
      scale: 1.1,
    },
    {
      name: "Talal Alhabsi",
      role: "Site Supervisor",
      image: "/assets/Talal Alhabsi.jpeg",
      objectPosition: "center 18%",
      scale: 1.85,
    },
    {
      name: "Hamida",
      role: "Senior Interior Engineer",
      image: "/assets/Reemi Mahoudh.jpeg",
      objectPosition: "center 14%",
      scale: 1.95,
    },
    {
      name: "Basith",
      role: "Senior Interior Engineer",
      image: "/assets/Abdulbasith.jpeg",
      objectPosition: "center 12%",
      scale: 2.05,
    },
    {
      name: "Rayan",
      role: "Graphic Designer",
      image: "/assets/Raiyan Eltoqi.jpeg",
      objectPosition: "center 14%",
      scale: 1.95,
    },
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.p
          className="uppercase tracking-[0.16em] text-sm font-['El_Messiri'] text-[#8b9199] mb-2 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          MEET THE OWNERS
        </motion.p>

        <motion.h2
          className="font-['El_Messiri'] text-2xl md:text-4xl font-semibold text-gray-900 mb-12 max-w-3xl text-center md:text-left mx-auto md:mx-0"
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
          className="grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:flex-wrap md:justify-center md:gap-20"
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
              className="group text-center w-full md:w-60"
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Image — tighter crop (closer portrait) */}
              <div className="w-full aspect-square md:w-60 md:h-60 mx-auto mb-3 md:mb-6 overflow-hidden rounded-t-[12px]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: member.objectPosition,
                    transform: `scale(${member.scale})`,
                    transformOrigin: member.objectPosition,
                  }}
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-sm md:text-lg font-['El_Messiri'] text-gray-900">
                  <span className="font-bold">{member.name.split(" ")[0]}</span>
                  {member.name.split(" ").length > 1 && (
                    <span className="font-normal">
                      {" "}
                      {member.name.split(" ").slice(1).join(" ")}
                    </span>
                  )}
                </h3>
                <p className="mb-4 mt-1 text-xs md:text-sm font-['El_Messiri'] text-gray-500">
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
