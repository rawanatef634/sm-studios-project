"use client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "../data/services";
import { Link } from "react-router-dom";

export default function Services() {
  return (
    <section className="relative w-full md:w-[1512px] mx-auto overflow-hidden">
      {/* Header section */}
      <div className="flex flex-col justify-center items-center gap-[20px] w-[90%] md:w-[1312px] 
      mx-auto text-center md:text-left mt-5 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-[92px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <span className="uppercase tracking-wider font-semibold text-gray-600 text-2xl">
              Our Expertise
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">
              From concept to completion
            </h2>
          </div>
          <Link
            to="/services"
            className="mt-4 md:mt-0 flex items-center gap-2 text-2xl font-bold text-gray-900 hover:underline justify-center"
          >
            Explore Our Services
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-[20px] w-[90%] md:w-[1312px] mx-auto mt-12 md:mt-[210px]">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            className={`
              relative overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 group
              w-full md:flex-1 md:basis-[276px] md:hover:basis-[424px] h-[400px] md:h-[654px]
            `}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <img
              src={service.img}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Title */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-center z-10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white text-2xl font-semibold transform transition-all duration-700 group-hover:-translate-y-24 group-hover:scale-125">
                {service.title.toUpperCase()}
              </h3>
            </motion.div>

            {/* Hover Text */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pt-5 text-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:delay-300">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-lg font-light tracking-wider mb-2"
              >
                {service.id}
              </motion.span>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                className="text-sm leading-relaxed mb-6"
              >
                {service.text}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="px-5 py-2 bg-white text-gray-900 rounded hover:bg-gray-200 transition"
                >
                  Learn more
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
