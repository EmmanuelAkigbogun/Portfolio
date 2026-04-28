import React, { useEffect, useRef } from "react";

const CinematicFireworks = ({ trigger }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Performance: opaque background
    let rockets = [];
    let particles = [];
    let animationFrameId;

    // Pre-render a single particle glow to a small off-screen canvas
    // This is significantly more efficient than using ctx.shadowBlur
    const sparkCanvas = document.createElement("canvas");
    sparkCanvas.width = 6;
    sparkCanvas.height = 6;
    const sCtx = sparkCanvas.getContext("2d");
    const gradient = sCtx.createRadialGradient(3, 3, 0, 3, 3, 3);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 6, 6);

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    class Rocket {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.targetY = Math.random() * (window.innerHeight * 0.5) + 50;
        this.hue = Math.random() * 360;
        this.speed = Math.random() * 2 + 5;
        this.history = []; // For the rising trail
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 15) this.history.shift();
        this.y -= this.speed;
        this.x += Math.sin(this.y / 20) * 0.5; // Slight wobble as it rises
        if (this.y <= this.targetY) return true;
        return false;
      }
      draw() {
        ctx.beginPath();
        this.history.forEach((pos, i) => {
          ctx.globalAlpha = i / this.history.length;
          ctx.drawImage(sparkCanvas, pos.x - 1.5, pos.y - 1.5, 3, 3);
        });
      }
    }

    class Particle {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 8 + 2;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
        this.friction = 0.93;
        this.gravity = 0.15;
        this.opacity = 1;
        this.color = `hsl(${hue}, 100%, 70%)`;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.008;
      }
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        // Optimization: use simple rects or small arcs without shadow
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    const animate = () => {
      // Cinematic black background with slow fade
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.globalCompositeOperation = "lighter"; // Bright additive blending

      rockets = rockets.filter((r) => {
        if (r.update()) {
          for (let i = 0; i < 120; i++)
            particles.push(new Particle(r.x, r.y, r.hue));
          return false;
        }
        r.draw();
        return true;
      });

      particles = particles.filter((p) => {
        p.update();
        if (p.opacity <= 0) return false;
        p.draw();
        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    if (trigger > 0) {
      for (let i = 0; i < 15; i++) {
        setTimeout(
          () => rockets.push(new Rocket()),
          i * 200 + Math.random() * 500,
        );
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
        background: "#050508",
      }}
    />
  );
};

export default CinematicFireworks;
