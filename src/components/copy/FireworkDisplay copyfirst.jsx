import React, { useEffect, useRef } from "react";

const FireworkDisplay = ({ trigger }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rockets = [];
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Rocket {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY =
          Math.random() * (canvas.height * 0.7) + canvas.height * 0.1;
        this.speed = Math.random() * 4 + 7;
        this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
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
        ctx.fillStyle = "rgb(255, 255 , 255)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.15;
        this.friction = 0.94;
        this.opacity = 1;
      }
      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.012; // Controls how fast they fade out
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createBurst = (x, y, color) => {
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    const launchSequence = () => {
      // MASSIVE: 25 rockets launched from across the whole screen
      for (let i = 0; i < 25; i++) {
        setTimeout(() => {
          rockets.push(new Rocket());
        }, Math.random() * 1500);
      }
    };

    if (trigger > 0) launchSequence();

    const animate = () => {
      const backgroundCl = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-main")
        .trim(); //"rgb(0, 0, 0)";
      // 1. Draw solid black background first to prevent ghosting
      ctx.fillStyle = backgroundCl;
      ctx.globalCompositeOperation = "source-over";

      // 2. Use a trail effect for the sparks
      ctx.fillStyle = backgroundCl + "33"; //"rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      // 3. Completely clear canvas if nothing is happening to save performance
      if (rockets.length === 0 && particles.length === 0 && trigger > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

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
      }}
    />
  );
};

export default FireworkDisplay;
