"use client";
import { motion } from "framer-motion";

export default function Clients() {
  const Clients = [
    { id: 1, image: "/assets/logos-01.svg" },
    { id: 2, image: "/assets/logos-02.svg" },
    { id: 3, image: "/assets/logos-03.svg" },
    { id: 4, image: "/assets/logos-04.svg" },
    { id: 5, image: "/assets/logos-05.svg" },
    { id: 6, image: "/assets/logos-06.svg" },
    { id: 7, image: "/assets/logos-07.svg" },
    { id: 8, image: "/assets/logos-08.svg" },
    { id: 9, image: "/assets/logos-09.svg" },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.p
          className="uppercase tracking-wide text-md text-gray-500 mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          OUR PARTNERS
        </motion.p>

        <motion.h2
          className="text-3xl md:text-[44px] font-semibold text-gray-900 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          Proud to collaborate with leading brands that share our vision for
          excellence.
        </motion.h2>

        {/* Logos grid */}
        <motion.div
          className="flex flex-wrap justify-center gap-12"
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
          {Clients.map((client) => (
            <motion.div
              key={client.id}
              className="text-center w-55 sm:w-66"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={client.image}
                alt={`Client ${client.id}`}
                className="w-44 h-44 sm:w-77 sm:h-55 object-contain "
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
