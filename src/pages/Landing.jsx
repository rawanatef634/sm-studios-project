import Services from "../components/Services";
import About from "../components/About";
import Team from "../components/Team";
import Clients from "../components/Clients";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <Services />

      {/* About Section */}
      <About />

      {/* Team Section */}
      <Team />

      {/* Projects Showcase (before partners per layout brief) */}
      <Projects />

      {/* Clients Section */}
      <Clients />

      {/* Contact CTA */}
      <Contact />

      {/* Footer */}
      <Footer />
    </>
  );
}
