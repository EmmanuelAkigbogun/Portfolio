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
    };

    class Rocket {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        // Randomize target height for variety
        this.targetY =
          Math.random() * (window.innerHeight * 0.4) + window.innerHeight * 0.1;
        this.speed = Math.random() * 2 + 8;
        this.hue = Math.random() * 360;
        this.color = `hsl(${this.hue}, 100%, 75%)`;
        this.dead = false;
      }
      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.dead = true;
          this.explode();
        }
      }
      explode() {
        const styles = ["circular", "ring", "willow", "shimmer"];
        const chosenStyle = styles[Math.floor(Math.random() * styles.length)];

        const count = chosenStyle === "willow" ? 60 : 100;
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.hue, chosenStyle));
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
      constructor(x, y, hue, style) {
        this.x = x;
        this.y = y;
        this.style = style;
        this.opacity = 1;
        this.friction = 0.95;
        this.gravity = 0.12;

        const angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 6 + 2;

        // Custom style physics
        if (style === "ring") speed = 5 + (Math.random() > 0.5 ? 2 : 0);
        if (style === "willow") {
          this.friction = 0.98;
          this.gravity = 0.05;
          speed = Math.random() * 3 + 1;
        }

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = `hsl(${hue}, 100%, 70%)`;
        this.decay = Math.random() * 0.015 + 0.008;
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
        // Special "shimmer" effect
        if (this.style === "shimmer" && Math.random() > 0.8) return;

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
          this.x,
          this.y,
          this.style === "willow" ? 1 : 1.5,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }

    const animate = () => {
      // High-efficiency clearing with trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.globalCompositeOperation = "lighter";

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

    if (trigger > 0) {
      // Burst of 15-20 rockets across a timeline
      for (let i = 0; i < 18; i++) {
        setTimeout(() => rockets.push(new Rocket()), Math.random() * 2000);
      }
    }

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
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default FireworkDisplay;
