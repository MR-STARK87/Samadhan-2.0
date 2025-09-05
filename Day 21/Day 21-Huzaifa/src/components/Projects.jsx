import React from "react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard.jsx";
import MagneticButton from "./MagneticButton.jsx";

const projects = [
  {
    title: "Cinematic Chat UI",
    desc: "Glassy interface, presence-aware avatars, and natural TTS integration.",
    tags: ["React", "Framer Motion", "TTS"],
    live: "#",
    code: "#",
  },
  {
    title: "Modern Storefront",
    desc: "Dark theme, electric blue accents, elevated cards, and reveal-on-hover.",
    tags: ["React", "Stripe", "Design"],
    live: "#",
    code: "#",
  },
  {
    title: "Trello-like Boards",
    desc: "MERN stack, drag-and-drop, and persistent storage with cinematic UX.",
    tags: ["MERN", "DND", "UX"],
    live: "#",
    code: "#",
  },
  {
    title: "Real-time Chat",
    desc: "Socket.IO, modern glassy UI, animated status, and message presence.",
    tags: ["Socket.IO", "WebSockets", "UI"],
    live: "#",
    code: "#",
  },
];

export default function Projects() {
  return (
    <div className="grid">
      {projects.map((p, i) => (
        <motion.div
          key={p.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          style={{ gridColumn: "span 6" }}
        >
          <TiltCard>
            <div className="card__title">{p.title}</div>
            <div className="card__desc">{p.desc}</div>
            <div className="card__tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="card__actions">
              <MagneticButton href={p.live} small>
                Live
              </MagneticButton>
              <MagneticButton href={p.code} small>
                Code
              </MagneticButton>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}
