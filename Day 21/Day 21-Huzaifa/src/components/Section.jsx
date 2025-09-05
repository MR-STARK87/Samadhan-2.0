import React from "react";
import { motion } from "framer-motion";

export default function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow && <div className="section__eyebrow">{eyebrow}</div>}
        {title && <h2 className="section__title">{title}</h2>}
        {children}
      </motion.div>
    </section>
  );
}
