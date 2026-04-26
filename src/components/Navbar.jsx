import React, { useState } from "react";
import "../components/css/Navbar.css";
import InteractiveBackground from "./InteractiveBackground";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">Zephyr Δ</div>

        {/* MOBILE SIDEBAR OVERLAY */}
        <div
          className={`nav-menu-overlay ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(false)}
        >
          <ul className="nav-links-mobile" onClick={(e) => e.stopPropagation()}>
            <InteractiveBackground />
            <li>Products</li>
            <li>Solutions</li>
            <li>Developers</li>
            <li>Pricing</li>
            <hr />
            <li>
              <button className="btn-text">Sign in</button>
            </li>
            <li>
              <button className="btn-primary">Hire me &gt;</button>
            </li>
          </ul>
        </div>

        {/* DESKTOP LINKS (Centered) */}
        <ul className="nav-links-desktop">
          <li>Products</li>
          <li>Solutions</li>
          <li>Developers</li>
          <li>Pricing</li>
        </ul>

        {/* ACTIONS (Right) */}
        <div className="nav-actions">
          <button className="btn-text desktop-only">Sign in</button>
          <button className="btn-primary desktop-only">Hire me &gt;</button>

          <div
            className={`hamburger ${isOpen ? "toggle" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
