import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageLoader({ pathname }) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Reset states when pathname changes
    setVisible(true);
    setLoading(true);

    const fadeOutTimer = setTimeout(() => setLoading(false), 1500);
    const unmountTimer = setTimeout(() => setVisible(false), 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, [pathname]); 

  if (!visible) return null;

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key={pathname}
          className="fixed inset-0 bg-gradient-to-br from-[#000000] via-[#000000] to-[#1a1a24] flex items-center justify-center z-[9999] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {/* Animated background grid */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Radial glow effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.18) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />

          {/* Orbiting particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/45 rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                x: [
                  0,
                  Math.cos((i / 8) * Math.PI * 2) * 120,
                  Math.cos((i / 8) * Math.PI * 2 + Math.PI) * 120,
                  0,
                ],
                y: [
                  0,
                  Math.sin((i / 8) * Math.PI * 2) * 120,
                  Math.sin((i / 8) * Math.PI * 2 + Math.PI) * 120,
                  0,
                ],
                opacity: [0, 0.8, 0.8, 0],
                scale: [1, 1.5, 1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Logo container with glow */}
          <motion.div
            className="relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Pulsing glow behind logo */}
            <motion.div
              className="absolute inset-0 blur-3xl bg-emerald-500/35 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main logo */}
            <motion.img
              src="/assets/sm-logo.png"
              alt="SM Studios Logo"
              className="w-40 h-auto relative z-10 drop-shadow-2xl"
              animate={{
                y: [0, -8, 0],
                filter: [
                  "brightness(1) drop-shadow(0 0 20px rgba(34, 197, 94, 0.45))",
                  "brightness(1.2) drop-shadow(0 0 30px rgba(34, 197, 94, 0.75))",
                  "brightness(1) drop-shadow(0 0 20px rgba(34, 197, 94, 0.45))",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-32 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 192 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.p
            className="absolute bottom-20 text-white/60 text-sm tracking-widest font-light"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            LOADING EXPERIENCE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}