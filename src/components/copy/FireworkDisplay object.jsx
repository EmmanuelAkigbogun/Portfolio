import React, { useEffect, useRef } from "react";

const FireworkDisplay = ({ trigger }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let rockets = [],
      particles = [],
      animationFrameId;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    // Shape Coordinate Generator
    const getShapePoints = (type, x, y) => {
      const points = [];
      const count = 80;
      for (let i = 0; i < count; i++) {
        let tx = 0,
          ty = 0;
        const t = (i / count) * Math.PI * 2;

        if (type === "heart") {
          tx = 16 * Math.pow(Math.sin(t), 3);
          ty = -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
          );
          tx *= 0.8;
          ty *= 0.8;
        } else if (type === "fish") {
          tx = Math.cos(t) - Math.pow(Math.sin(t), 2) / Math.sqrt(2);
          ty = Math.cos(t) * Math.sin(t);
          tx *= 15;
          ty *= 15;
        } else if (type === "bird") {
          tx = Math.cos(t) * (1 + Math.sin(t));
          ty = -Math.sin(t) * (1 + Math.sin(t));
          tx *= 12;
          ty *= 12;
        } else {
          // Default Bow & Arrow (Simple Pointy Shape)
          tx = Math.cos(t) * (i % 2 === 0 ? 20 : 5);
          ty = Math.sin(t) * (i % 2 === 0 ? 5 : 20);
        }
        points.push({ vx: tx * 0.4, vy: ty * 0.4 });
      }
      return points;
    };

    class Rocket {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.targetY = Math.random() * (window.innerHeight * 0.4) + 100;
        this.speed = Math.random() * 3 + 7;
        this.hue = Math.random() * 360;
        this.history = [];
        this.dead = false;
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 10) this.history.shift();
        this.y -= this.speed;
        this.x += Math.sin(this.y / 25) * 1.2;
        if (this.y <= this.targetY) {
          this.dead = true;
          const types = ["heart", "fish", "bird", "bow"];
          createBurst(
            this.x,
            this.y,
            `hsl(${this.hue}, 100%, 70%)`,
            types[Math.floor(Math.random() * types.length)],
          );
        }
      }
      draw() {
        this.history.forEach((pos, i) => {
          ctx.globalAlpha = i / this.history.length;
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, (i / 10) * 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    class Particle {
      constructor(x, y, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.gravity = 0.05;
        this.friction = 0.96;
        this.opacity = 1;
        this.decay = Math.random() * 0.01 + 0.015;
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
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createBurst = (x, y, color, type) => {
      const points = getShapePoints(type, x, y);
      points.forEach((p) =>
        particles.push(new Particle(x, y, color, p.vx, p.vy)),
      );
    };

    const animate = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

      if (rockets.length === 0 && particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
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
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    if (trigger > 0)
      for (let i = 0; i < 10; i++)
        setTimeout(() => rockets.push(new Rocket()), i * 500);

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
