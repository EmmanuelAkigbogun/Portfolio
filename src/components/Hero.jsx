import React from "react";
import InteractiveBackground from "./InteractiveBackground"; // Adjust path if needed
import "./css/Hero.css";
import HeroChild from "./HeroChild";

const Hero = () => {
  return (
    <section
      className="hero"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Our new canvas component */}
      <InteractiveBackground
        defaultFrequency={8}
        defaultParticles={150}
        planetCount={2}
        ringedPlanetCount={5}
      />
      <HeroChild />
    </section>
  );
};

export default Hero;
