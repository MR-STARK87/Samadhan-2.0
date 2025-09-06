import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import Lenis from "@studio-freight/lenis";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Smooth scroll
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, smoothTouch: false });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
