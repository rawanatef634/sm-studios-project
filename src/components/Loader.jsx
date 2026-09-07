import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function removeInitialLoader() {
  document.getElementById("initial-loader")?.remove();
}

function waitForReady(timeoutMs = 900) {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const timer = setTimeout(done, timeoutMs);

    const fontsReady =
      document.fonts?.ready?.catch?.(() => {}) ?? Promise.resolve();

    const heroReady = new Promise((res) => {
      const img = new Image();
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      img.src = isMobile
        ? "/assets/majlis2-800.webp"
        : "/assets/majlis3-1200.webp";
      if (img.complete) res();
      else {
        img.onload = () => res();
        img.onerror = () => res();
      }
    });

    Promise.all([fontsReady, heroReady]).then(() => {
      clearTimeout(timer);
      requestAnimationFrame(() => requestAnimationFrame(done));
    });
  });
}

/**
 * Shows on full page load only (component state). Not tied to route changes.
 */
export default function PageLoader({ enabled }) {
  const [visible, setVisible] = useState(!!enabled);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!enabled || !visible) {
      removeInitialLoader();
      return;
    }

    // Keep HTML splash until this overlay has painted (same green look)
    requestAnimationFrame(() => removeInitialLoader());
    document.body.style.overflow = "hidden";

    let cancelled = false;
    const minHold = new Promise((r) => setTimeout(r, 450));

    (async () => {
      await Promise.all([minHold, waitForReady(900)]);
      if (cancelled) return;
      setExiting(true);
    })();

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, [enabled, visible]);

  const finish = () => {
    document.body.style.overflow = "";
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence onExitComplete={finish}>
      {!exiting && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute h-32 w-32 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src="/assets/sm-logo.png"
              alt=""
              width={160}
              height={160}
              className="relative z-10 h-auto w-36 md:w-40"
              decoding="async"
              animate={{
                y: [0, -8, 0],
                filter: [
                  "drop-shadow(0 0 14px rgba(34, 197, 94, 0.35))",
                  "drop-shadow(0 0 22px rgba(34, 197, 94, 0.55))",
                  "drop-shadow(0 0 14px rgba(34, 197, 94, 0.35))",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="absolute bottom-32 left-1/2 h-0.5 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #10b981, #34d399, #059669)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <p className="absolute bottom-20 text-sm font-light tracking-[0.2em] text-white/60">
            LOADING EXPERIENCE
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
