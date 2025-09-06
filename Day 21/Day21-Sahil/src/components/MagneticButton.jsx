import React, { useRef } from "react";

export default function MagneticButton({
  children,
  href = "#",
  primary = false,
  small = false,
}) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <a
      href={href}
      className={`magnetic ${primary ? "magnetic--primary" : ""}`}
      style={{ padding: small ? "10px 12px" : undefined }}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
    >
      <span className="magnetic__ring" />
      {children}
    </a>
  );
}
