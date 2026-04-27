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

    const getShapePoints = (type) => {
      const points = [];
      // Increased particle count for "fuller" screen coverage
      const count = type === "firework" || type === "tiny-stars" ? 180 : 140;

      for (let i = 0; i < count; i++) {
        let vx = 0,
          vy = 0;
        const t = (i / count) * Math.PI * 2;

        switch (type) {
          case "love":
            vx = 16 * Math.pow(Math.sin(t), 3);
            vy = -(
              13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t)
            );
            vx *= 0.8;
            vy *= 0.8;
            break;

          case "sin":
            vx = t;
            vy = Math.tan((1 / 2) * t);
            vx *= 0.8;
            vy *= 0.8;
            break;
          case "classic":
            // THE "NORMAL" FIREWORK (From the code you just pasted)
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 5; // Exact speed from your class Particle
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
          case "bird":
            // 1. Map particles from -1 to 1 (left wing to right wing)
            const xRatio = (i / count) * 2 - 1;

            // 2. The Horizontal Span (Width)
            vx = xRatio * 25;

            // 3. The Vertical Curve (Height)
            // We use Math.abs(xRatio) to create symmetry
            const wingShape = Math.pow(Math.abs(xRatio), 0.5); // Creates the lift in the wings
            const bodyDip = Math.cos(xRatio * Math.PI); // Creates the "M" dip in the center

            // 4. Combine and scale
            // Adjust 0.1 to make the wings "flap" if you have a time variable
            vy = wingShape * 5 + bodyDip * 3;

            // Optional: If you want it to flap, use your global 't' variable:
            // vy += Math.sin(t * 5 + Math.abs(xRatio) * 10) * 2;

            // Scale for visibility
            vx *= 0.5;
            vy *= 0.5;
            break;
          case "flower":
            const ka = 5; // Number of petals
            const angleVal = (i / count) * Math.PI * 2;
            const ra = 15 * Math.cos(ka * angleVal);
            vx = ra * Math.cos(angleVal);
            vy = ra * Math.sin(angleVal);
            break;
          case "butterfly":
            const angel = (i / count) * Math.PI * 12; // 6 full rotations for detail

            // The "Fay's Butterfly" formula
            const e = Math.E;
            const rat =
              Math.pow(e, Math.sin(angel)) -
              2 * Math.cos(4 * angel) +
              Math.pow(Math.sin((2 * angel - Math.PI) / 24), 5);

            // Scale it up (the formula usually results in a small radius)
            const scale = 5;
            vx = rat * Math.sin(angel) * scale;
            vy = -rat * Math.cos(angel) * scale; // Negative to keep it upright
            break;

          case "spiral":
            const ang = 0.15 * i;
            vx = (1 + ang) * Math.cos(ang) * 0.7;
            vy = (1 + ang) * Math.sin(ang) * 0.7;
            break;
          case "tiny-stars":
            const sT = Math.random() * 18 + 4; // Wider spread
            vx = Math.cos(t) * sT;
            vy = Math.sin(t) * sT;
            break;
          case "fractals":
            // 1. Create a "seed" (Change this number for a totally different shape!)
            const seed = 42;
            const rand = (n) => Math.sin(n * 43758.5453 + seed) % 1;

            // 2. Starting coordinates for this specific particle
            let xx = (i / count) * 2 - 1;
            let yy = rand(i);

            // 3. Mutation Loop
            // We use random-looking constants to "mutate" the position
            for (let j = 0; j < 5; j++) {
              const prevX = xx;
              // These 'magic numbers' can be randomized to change the fractal type
              xx = Math.sin(prevX * 1.2 + yy * 0.5 + t * 0.1);
              yy = Math.cos(prevX * 0.8 - yy * 1.5 + t * 0.05);
            }

            // 4. Scale and position
            vx = xx * 20;
            vy = yy * 20;
            break;

          case "fractal":
            // 1. Get a normalized coordinate (-1 to 1)
            let nx = (i / count) * 2 - 1;
            let ny = Math.sin(i + t) * 2 - 1; // Uses time to shift the 'seed'

            let x = nx;
            let y = ny;

            // 2. Iteration: This is what creates the "fractal" complexity
            // We run the math on the same point multiple times
            for (let iter = 0; iter < 4; iter++) {
              const nextX = x * x - y * y + nx;
              const nextY = 2 * x * y + ny;
              x = nextX;
              y = nextY;
            }

            // 3. Scale the result so it stays on screen
            vx = x * 10;
            vy = y * 10;
            break;

          case "star":
            const points = 5;
            const numVertices = points * 2; // 10 total points (5 peaks, 5 valleys)
            const innerRadius = 7;
            const outerRadius = 15;

            // 1. Find the progress around the circle (0 to 1)
            const progress = i / count;
            const ta = progress * Math.PI * 2;

            // 2. Figure out which "section" of the star we are in (0 to 9)
            const section = progress * numVertices;

            // 3. Get the remainder (0 to 1) to transition between radii
            const segmentProgress = section % 1;

            // 4. Determine if the current segment starts at a peak or valley
            const isEven = Math.floor(section) % 2 === 0;

            // 5. Smoothly interpolate the radius
            let r;
            if (isEven) {
              // Transition from outer to inner
              r = outerRadius + (innerRadius - outerRadius) * segmentProgress;
            } else {
              // Transition from inner to outer
              r = innerRadius + (outerRadius - innerRadius) * segmentProgress;
            }

            vx = r * Math.cos(ta) * 0.7;
            vy = r * Math.sin(ta) * 0.7;
            break;

          default: // Normal Firework
            const sN = Math.random() * 12 + 6; // Faster burst
            vx = Math.cos(t) * sN;
            vy = Math.sin(t) * sN;
        }
        points.push({ vx: vx * 0.45, vy: vy * 0.45 });
      }
      return points;
    };

    class Rocket {
      constructor() {
        // Broadened margin to allow rockets to fill the whole horizontal view
        const margin = 50;
        this.x = margin + Math.random() * (window.innerWidth - margin * 2);
        this.y = window.innerHeight;
        // Varied target heights to fill the entire vertical sky
        this.targetY = 50 + Math.random() * (window.innerHeight * 0.6);
        this.speed = Math.random() * 4 + 7;
        this.hue = Math.random() * 360;
        this.history = [];
        this.dead = false;
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 12) this.history.shift();
        this.y -= this.speed;
        this.x += Math.sin(this.y / 20) * 1.5; // More dynamic "snake" path
        if (this.y <= this.targetY) {
          this.dead = true;
          const styles = [
            "sin",
            "love",
            "spiral",
            "firework",
            "tiny-stars",
            "rocket",
            "classic",
            "star",
            "bird",
            "flower",
            "butterfly",
            "fractal",
            "fractals",
          ];
          createBurst(
            this.x,
            this.y,
            `hsl(${this.hue}, 100%, 75%)`,
            styles[Math.floor(Math.random() * styles.length)],
          );
        }
      }
      draw() {
        this.history.forEach((pos, i) => {
          ctx.globalAlpha = i / this.history.length;
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, (i / 12) * 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    class Particle {
      constructor(x, y, color, vx, vy, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.gravity = type === "tiny-stars" ? 0.03 : 0.08;
        this.friction = 0.97; // Lower friction means particles travel further
        this.opacity = 1;
        this.decay =
          Math.random() * 0.008 + (type === "tiny-stars" ? 0.025 : 0.012); // Slower decay
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
        if (this.type === "tiny-stars" && Math.random() > 0.8) return;
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
          this.x,
          this.y,
          this.type === "tiny-stars" ? 0.9 : 1.6,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }

    const createBurst = (x, y, color, type) => {
      const points = getShapePoints(type);
      points.forEach((p) =>
        particles.push(new Particle(x, y, color, p.vx, p.vy, type)),
      );
    };

    const animate = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)"; // Slightly lighter for longer-lasting trails
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

if (trigger > 0) {
  // 1. Calculate rocket count based on screen width
  // Base of ~40 rockets for 1600px, scales down to ~10 for mobile (400px)
  const responsiveCount = Math.max(10, Math.floor(window.innerWidth / 40));
  console.log(window.innerWidth);
  

  for (let i = 0; i < responsiveCount; i++) {
    // 2. Spread them out slightly more on smaller screens
    const delay = i * (window.innerWidth < 600 ? 250 : 180);

    setTimeout(() => rockets.push(new Rocket()), delay + Math.random() * 300);
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
