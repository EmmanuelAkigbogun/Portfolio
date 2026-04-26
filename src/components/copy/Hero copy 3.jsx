import React, { useEffect, useRef } from "react";
import "./css/Hero.css";

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let asteroids = [];
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

    class Core {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 60;
        this.glowSize = 160; 
      }

      update() {
        if (mouse.x && mouse.y) {
          this.x += (mouse.x - this.x) * 0.05;
          this.y += (mouse.y - this.y) * 0.05;
        }
      }

      draw() {
        // Viral Lens Effect
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowSize);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const core = new Core();

    class Particle {
      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        let dx = core.x - this.x;
        let dy = core.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < core.glowSize) {
          // Virus Trap: Struggle to get out
          this.x += dx * 0.03;
          this.y += dy * 0.03;
          this.speedX *= 0.95; // Friction inside
          this.speedY *= 0.95;
        } else {
          this.x += this.speedX;
          this.y += this.speedY;
        }

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Asteroid {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
      }

      update() {
        let dx = core.x - this.x;
        let dy = core.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Flee Logic: Run away from the core
        if (distance < 250) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
      }
    }

    const init = () => {
      particles = [];
      asteroids = [];
      // Dense starfield
      for (let i = 0; i < 400; i++) particles.push(new Particle());
      // Fleeing asteroids
      for (let i = 0; i < 30; i++) asteroids.push(new Asteroid());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      core.update();
      core.draw();
      particles.forEach((p) => { p.update(); p.draw(); });
      asteroids.forEach((a) => { a.update(); a.draw(); });
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
