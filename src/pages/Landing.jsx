import { lazy, Suspense, useEffect, useState } from "react";
import HeroSection from "../components/Hero";

const Services = lazy(() => import("../components/Services"));
const About = lazy(() => import("../components/About"));
const Team = lazy(() => import("../components/Team"));
const Clients = lazy(() => import("../components/Clients"));
const Projects = lazy(() => import("../components/Projects"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));

/** Mount below-fold sections after first paint so hero can win the network. */
function BelowFold({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId;
    const raf = requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => setReady(true), {
          timeout: 600,
        });
      } else {
        idleId = window.setTimeout(() => setReady(true), 80);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, []);

  if (!ready) return null;
  return children;
}

export default function Home() {
  return (
    <>
      <HeroSection />

      <BelowFold>
        <Suspense fallback={null}>
          <Services />
          <About />
          <Team />
          <Clients />
          <Projects />
          <Contact />
          <Footer />
        </Suspense>
      </BelowFold>
    </>
  );
}
