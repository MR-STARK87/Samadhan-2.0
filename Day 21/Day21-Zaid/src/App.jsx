import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Section from "./components/Section.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        }}
        exit={{ opacity: 0 }}
        className="app"
      >
        <div className="bg-noise" aria-hidden />
        <Navbar />
        <main>
          <Hero />
          <Section id="projects" title="Selected work" eyebrow="Showcase">
            <Projects />
          </Section>
          <Section
            id="contact"
            title="Let’s build something bold"
            eyebrow="Contact"
          >
            <Contact />
          </Section>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}
