import React from "react";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#" className="brand" aria-label="Home">
          <span className="brand__dot" />
          <span>
            Syed <span style={{ color: "var(--accent)" }}>Zaid</span> Ali
          </span>
        </a>
        <nav className="links" aria-label="Primary">
          <a className="nav__link" href="#projects">
            Projects
          </a>
          <a className="nav__link" href="#contact">
            Contact
          </a>
          <a className="nav__link" href="mailto:hello@zaid.dev">
            Email
          </a>
        </nav>
      </div>
    </header>
  );
}
