import { motion } from "framer-motion";

export default function ProcessGrid({ steps }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 relative">
      {steps.map((item, i) => (
        <div key={i} className="relative">
          <motion.div
            className="border-t border-gray-700 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-1 uppercase md:text-[28px]">{item.title}</h3>
            <p className="text-gray-400 md:text-[16px]">{item.desc}</p>
          </motion.div>

          {/* Arrows between steps */}
          {i < steps.length - 1 && (
            <>
              {/* Desktop arrow (horizontal) - hide on last item of each row */}
              <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                {(i + 1) !== 0 && (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>

              {/* Tablet arrow (horizontal) - hide on last item of each row */}
              <div className="hidden sm:block md:hidden absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                {(i + 1) % 2 !== 0 && (
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>

              {/* Mobile arrow (vertical) */}
              <div className="sm:hidden flex justify-center my-4">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}