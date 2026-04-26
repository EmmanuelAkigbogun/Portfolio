import React from "react";
import InteractiveBackground from "./InteractiveBackground"; // Adjust path if needed
import "./css/Hero.css";

const Hero = () => {
  return (
    <section
      className="hero"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Our new canvas component */}
      <InteractiveBackground />

      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">Digital Artisan & Developer</span>
          <h1 className="hero-title">
            Artistry & Code <br />
            <span className="lens-text">Built with Intention.</span>
          </h1>
          <p className="hero-subtitle">
            Merging high-end development with digital artistry and a love for
            creatures. No fluff. Just bold, beautiful digital infrastructure.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary">Start a Project &gt;</button>
            <button className="btn-hero-secondary">View My Work</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
