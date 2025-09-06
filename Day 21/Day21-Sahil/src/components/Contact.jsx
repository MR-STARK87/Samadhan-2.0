import React, { useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton.jsx";

export default function Contact() {
  const [state, setState] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const canSubmit =
    state.name && isValidEmail(state.email) && state.message.length > 4;

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    try {
      setSubmitting(true);
      // Formspree-ready: replace with your endpoint
      // const res = await fetch("https://formspree.io/f/yourid", { method: "POST", body: JSON.stringify(state), headers: { "Content-Type": "application/json" }});
      await new Promise((r) => setTimeout(r, 900));
      setDone(true);
      setState({ name: "", email: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p className="helper">
          Tell me about your product, constraints, and what “impact” looks like.
          I’ll reply with a concise plan and a first visual pass.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              value={state.name}
              onChange={(e) =>
                setState((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Syed Zaid Ali"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={state.email}
              onChange={(e) =>
                setState((s) => ({ ...s, email: e.target.value }))
              }
              placeholder="hello@zaid.dev"
            />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="6"
              value={state.message}
              onChange={(e) =>
                setState((s) => ({ ...s, message: e.target.value }))
              }
              placeholder="A few lines about your idea..."
            />
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <MagneticButton href="#" primary>
              <button
                type="submit"
                style={{
                  all: "unset",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? "Sending..." : "Send message"}
              </button>
            </MagneticButton>
            {done && (
              <span className="helper">
                Thanks — I’ll get back to you today.
              </span>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="form">
          <div className="field">
            <label>Direct</label>
            <div className="helper">Email: hello@zaid.dev</div>
          </div>
          <div className="field">
            <label>Social</label>
            <div className="helper">
              <a href="#" className="nav__link">
                Twitter/X
              </a>{" "}
              •{" "}
              <a href="#" className="nav__link">
                GitHub
              </a>{" "}
              •{" "}
              <a href="#" className="nav__link">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
