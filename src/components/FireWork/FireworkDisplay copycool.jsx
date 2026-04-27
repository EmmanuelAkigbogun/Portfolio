import React, { useEffect, useRef } from "react";

const FireworkDisplay = ({ trigger }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let rockets = [];
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    class Rocket {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.targetY =
          Math.random() * (window.innerHeight * 0.5) + window.innerHeight * 0.1;
        this.speed = Math.random() * 3 + 8;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.dead = false;
      }
      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.dead = true;
          createBurst(this.x, this.y, this.color);
        }
      }
      draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.12;
        this.friction = 0.96;
        this.opacity = 1;
        this.decay = Math.random() * 0.015 + 0.01;
      }
      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.decay;
      }
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        // Optimization: Avoid heavy shadowBlur for every particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createBurst = (x, y, color) => {
      const count = 80; // Optimized particle count
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    const launchSequence = () => {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          rockets.push(new Rocket());
        }, Math.random() * 2000);
      }
    };

    const animate = () => {
      // High-performance trail effect: Instead of clearing, draw a faint overlay
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.globalCompositeOperation = "lighter"; // Makes overlapping colors "glow"
      ctx.globalAlpha = 1;

      rockets = rockets.filter((r) => !r.dead);
      rockets.forEach((r) => {
        r.update();
        r.draw();
      });

      particles = particles.filter((p) => p.opacity > 0);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    if (trigger > 0) launchSequence();

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
};

export default FireworkDisplay;
