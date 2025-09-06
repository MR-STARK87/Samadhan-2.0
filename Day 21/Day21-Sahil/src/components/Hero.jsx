import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton.jsx";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const blur = useTransform(scrollYProgress, [0, 1], ["0px", "6px"]);

  return (
    <section ref={ref} className="hero" aria-label="Hero">
      <motion.div
        style={{ y: y1, filter: blur }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
      >
        <div className="hero__eyebrow">Portfolio</div>
        <h1 className="hero__title">
          Building expressive, cinematic interfaces for the web. I’m{" "}
          <span className="accent">Zaid</span>.
        </h1>
        <p className="hero__subtitle">
          Full‑stack developer and UI/UX stylist. I craft dark, modern systems
          with electric blue highlights, fluid motion, and human‑centered flow.
          Let’s make something with presence.
        </p>
        <div className="hero__cta">
          <MagneticButton href="#projects" primary>
            View projects
          </MagneticButton>
          <MagneticButton href="#contact">Get in touch</MagneticButton>
        </div>
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { delay: 0.15, duration: 0.7 },
        }}
        aria-hidden
      >
        <div
          style={{
            height: 180,
            borderRadius: 18,
            background:
              "radial-gradient(120px 60px at 70% 20%, rgba(0,200,255,0.25), transparent), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            border: "1px solid rgba(122,242,255,0.12)",
          }}
        />
      </motion.div>
    </section>
  );
}
