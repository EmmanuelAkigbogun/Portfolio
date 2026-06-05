import React, { useState } from "react";
import "./css/EmbeddedSitesShowcase.css";
import { Images } from "../assets/images";
import InteractiveBackground from "./InteractiveBackground";
const embedProjects = [
  {
    id: 1,
    title: "Neural Dreamscape",
    desc: "AI-powered generative art experience with real-time mood adaptation.",
    url: "https://akigbogun.vercel.app/", // Replace with real links
    // preview: "https://picsum.photos/id/1015/800/600", // Replace with real screenshots
    preview: Images.draw4p,
    tech: "Three.js • TensorFlow.js • WebGL",
  },
  {
    id: 2,
    title: "Flooring Studio",
    desc: "Immersive 3D e-commerce platform with spatial product exploration.",
    url: "https://flooring-nu.vercel.app",
    // preview: "https://picsum.photos/id/201/800/600",
    preview: Images.draw5p,
    tech: "React Three Fiber • Stripe • Framer Motion",
  },
  {
    id: 3,
    title: "Aether Commerce",
    desc: "Immersive 3D e-commerce platform with spatial product exploration.",
    //url: "https://luxerous-hairs.vercel.app/Account",
    url: "https://luxerous-hairs.vercel.app/Shop%20Our%20Bundles/Recent%20Products/Product%20Name_Page/1@@Static@This%20is%20the%20name%20of%20the%20product%202",
    // preview: "https://picsum.photos/id/201/800/600",
    preview: Images.draw6p,
    tech: "React Three Fiber • Stripe • Framer Motion",
  },
  {
    id: 4,
    title: "Charts in Motion",
    desc: "Dark web-style portfolio & experimental digital garden.",
    url: "https://chart-lilac.vercel.app",
    // preview: "https://picsum.photos/id/237/800/600",
    preview: Images.draw7p,
    tech: "Next.js • GSAP • Shader Art",
  },
  {
    id: 5,
    title: "Solar Fireworks",
    desc: "Dark web-style portfolio & experimental digital garden.",
    url: "https://background-eta.vercel.app/",
    // preview: "https://picsum.photos/id/237/800/600",
    preview: Images.draw4p,
    tech: "Next.js • GSAP • Shader Art",
  },
  {
    id: 6,
    title: "Packing Panic",
    desc: "Dark web-style portfolio & experimental digital garden.",
    url: "https://emmanuelakigbogun.github.io/packingpanic",
    // preview: "https://picsum.photos/id/237/800/600",
    preview: Images.drawj,
    tech: "Next.js • GSAP • Shader Art",
  },
];

const EmbeddedSitesShowcase = ({ isAdmin = false }) => {
  const [selectedEmbed, setSelectedEmbed] = useState(null);

  return (
    <section className="embeds-section">
      <div className="embeds-container">
        <div className="embeds-header">
          <span className="section-badge">LIVE EXPERIMENTS</span>
          <h2 className="embeds-title">Digital Realms</h2>
          <p className="embeds-subtitle">
            Interactive websites and experimental digital spaces I've brought to
            life.
          </p>
        </div>

        <div className="embeds-grid">
          {embedProjects.map((project) => (
            <div
              key={project.id}
              className="embed-card"
              onClick={() => setSelectedEmbed(project)}
            >
              <div className="embed-preview-frame">
                <img
                  src={project.preview}
                  alt={project.title}
                  className="embed-preview"
                />
                <div className="embed-overlay">
                  <span className="view-live-btn">VIEW LIVE →</span>
                </div>
              </div>

              <div className="embed-content">
                <h3 className="embed-card-title">{project.title}</h3>
                <p className="embed-card-desc">{project.desc}</p>
                <div className="embed-tech">{project.tech}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Full Embed */}
      {selectedEmbed && (
        <div className="embed-modal" onClick={() => setSelectedEmbed(null)}>
          <div
            className="embed-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedEmbed(null)}
            >
              ✕
            </button>
            <h2>{selectedEmbed.title}</h2>
            <iframe
              src={selectedEmbed.url}
              title={selectedEmbed.title}
              className="live-iframe"
              allowFullScreen
            />
          </div>
        </div>
      )}
      <InteractiveBackground
        defaultFrequency={8}
        defaultParticles={150}
        planetCount={2}
        ringedPlanetCount={10}
      />
    </section>
  );
};

export default EmbeddedSitesShowcase;
