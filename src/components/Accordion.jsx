import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Accordion({ items }) {
  const [open, setOpen] = useState("");

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <motion.div key={item.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div
            onClick={() => setOpen(open === item.key ? "" : item.key)}
            className="flex justify-between items-center px-6 py-4 cursor-pointer"
          >
            <span className="font-semibold md:text-[36px]">{item.title}</span>
            <span>{open === item.key ? "−" : "+"}</span>
          </div>
          <AnimatePresence>
            {open === item.key && (
              <motion.div
                key="content"
                className="px-6 text-gray-400 md:text-[24px] overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {item.content}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
