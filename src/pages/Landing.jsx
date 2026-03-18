import Services from "../components/Services";
import About from "../components/About";
import Team from "../components/Team";
import Clients from "../components/Clients";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../Components/Hero";

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

      {/* Clients Section */}
      <Clients />
      
      {/* Projects Showcase */}
      <Projects />

      {/* Contact CTA */}
      <Contact />

      {/* Footer */}
      <Footer />
    </>
  );
}
