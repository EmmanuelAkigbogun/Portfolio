import React, { useEffect, useRef } from "react";
import "./css/Hero.css";

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    const mouse = { x: null, y: null };

    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // THE LARGE INTERACTIVE CORE
    class Core {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 50; // The physical radius
        this.glowSize = 120; // The magnetic pull radius
      }

      update() {
        if (mouse.x && mouse.y) {
          // Smoothly follow mouse with easing (0.05)
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          this.x += dx * 0.05;
          this.y += dy * 0.05;
        }
      }

      draw() {
        // Draw the magnetic field (Glow)
        let gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.glowSize,
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw the core ring
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const core = new Core();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        // Natural drift speeds
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
      }

      update() {
        // 1. Natural Drift
        this.x += this.speedX;
        this.y += this.speedY;

        // 2. Interaction with Core (Gravity)
        let dx = core.x - this.x;
        let dy = core.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < core.glowSize) {
          // Gently pull toward the center of the core
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }

        // 3. Screen Wrap-around
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      core.update();
      core.draw();
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    resize();
    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas"></canvas>

      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">Digital Artisan & Developer</span>
          <h1 className="hero-title">
            Artistry & Code <br />
            <span>Built with Intention.</span>
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
