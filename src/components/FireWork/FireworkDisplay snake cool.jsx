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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    class Rocket {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.targetY =
          Math.random() * (window.innerHeight * 0.5) + window.innerHeight * 0.1;
        this.speed = Math.random() * 3 + 7;
        this.hue = Math.random() * 360;
        this.color = `hsl(${this.hue}, 100%, 70%)`;
        this.history = [];
        this.dead = false;
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 12) this.history.shift();
        this.y -= this.speed;
        this.x += Math.sin(this.y / 30) * 0.8;
        if (this.y <= this.targetY) {
          this.dead = true;
          createBurst(this.x, this.y, this.color);
        }
      }
      draw() {
        this.history.forEach((pos, i) => {
          const opacity = i / this.history.length;
          const size = (i / this.history.length) * 2;
          ctx.globalAlpha = opacity;
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.15;
        this.friction = 0.94;
        this.opacity = 1;
        this.decay = Math.random() * 0.015 + 0.02;
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

    const createBurst = (x, y, color) => {
      for (let i = 0; i < 70; i++) {
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
      // Create the fade trail effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.globalCompositeOperation = "lighter";

      // If nothing is active, the trail above will eventually dim the pixels.
      // We perform a hard clear ONLY when arrays are empty to stop the "infinite" math.
      if (rockets.length === 0 && particles.length === 0) {
        // This ensures that last 1% of visibility actually goes to 0
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
