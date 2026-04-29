import React, { useEffect, useRef } from "react";
const FireworkDisplay = ({
  trigger = 0,
  texts = ["Δαρk"], //["Δαρk", "WELCOME", "Zephyr Δ"],
  shapes = ["heart", "star"],
  images = [],
  navHeightVal = 50,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let rockets = [],
      particles = [],
      animationFrameId;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth,
        h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    // ── sample filled pixels from offscreen canvas ──
    const samplePixels = (offCtx, size, count) => {
      const imgData = offCtx.getImageData(0, 0, size, size).data;
      const filled = [];
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          if (imgData[i + 3] > 128) filled.push([x, y]);
        }
      }
      const result = [];
      for (let i = 0; i < count; i++) {
        if (!filled.length) break;
        const [px, py] = filled[Math.floor(Math.random() * filled.length)];
        result.push({ ox: (px - size / 2) * 0.28, oy: (py - size / 2) * 0.28 });
      }
      return result;
    };

    // ── draw shape onto offscreen canvas ──
    const drawShape = (offCtx, size, shape) => {
      offCtx.clearRect(0, 0, size, size);
      offCtx.fillStyle = "#fff";
      switch (shape) {
        case "heart": {
          offCtx.beginPath();
          for (let i = 0; i < 300; i++) {
            const t = (i / 300) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(
              13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t)
            );
            const px = size / 2 + x * 7;
            const py = size / 2 + y * 7;
            i === 0 ? offCtx.moveTo(px, py) : offCtx.lineTo(px, py);
          }
          offCtx.closePath();
          offCtx.fill();
          break;
        }
        case "rectangle": {
          offCtx.fillRect(30, 60, 140, 80);
          break;
        }
        case "star": {
          offCtx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? 90 : 40;
            const px = size / 2 + Math.cos(angle) * r;
            const py = size / 2 + Math.sin(angle) * r;
            i === 0 ? offCtx.moveTo(px, py) : offCtx.lineTo(px, py);
          }
          offCtx.closePath();
          offCtx.fill();
          break;
        }
        case "circle": {
          offCtx.beginPath();
          offCtx.arc(size / 2, size / 2, 80, 0, Math.PI * 2);
          offCtx.fill();
          break;
        }
        case "diamond": {
          offCtx.beginPath();
          offCtx.moveTo(size / 2, 20);
          offCtx.lineTo(size - 20, size / 2);
          offCtx.lineTo(size / 2, size - 20);
          offCtx.lineTo(20, size / 2);
          offCtx.closePath();
          offCtx.fill();
          break;
        }
        default:
          break;
      }
    };

    // ── draw text onto offscreen canvas ──
    const drawText = (offCtx, size, text) => {
      offCtx.clearRect(0, 0, size, size);
      offCtx.fillStyle = "#fff";
      // offCtx.font = "bold 70px sans-serif";
      const fontSize = Math.floor(size / (text.length * 0.6));
      offCtx.font = `bold ${fontSize}px sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, size / 2, size / 2);
    };

    // ── load image and sample pixels (async) ──
    const loadImage = (src) =>
      new Promise((resolve) => {
        const size = 200;
        const off = document.createElement("canvas");
        off.width = off.height = size;
        const offCtx = off.getContext("2d");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const scale = Math.min(size / img.width, size / img.height) * 0.9;
          const sw = img.width * scale,
            sh = img.height * scale;
          offCtx.clearRect(0, 0, size, size);
          offCtx.drawImage(img, (size - sw) / 2, (size - sh) / 2, sw, sh);
          resolve({ type: "image", src, pts: samplePixels(offCtx, size, 240) });
        };
        img.onerror = () => resolve(null);
        img.src = src;
      });

    // ── get points for shape or text (sync) ──
    const getPixelPoints = (type, value) => {
      const size = 200;
      const off = document.createElement("canvas");
      off.width = off.height = size;
      const offCtx = off.getContext("2d");
      if (type === "shape") drawShape(offCtx, size, value);
      if (type === "text") drawText(offCtx, size, value);
      return samplePixels(offCtx, size, 240);
    };

    // ── normal math-based firework points ──

    const getMathPoints = (type) => {
      const count = type === "tiny-stars" ? 180 : 140;
      ///// multipleguys only phoenxis
      const a = Math.floor(Math.random() * 6) + 2;
      const b = Math.floor(Math.random() * 4) + 1;
      const twist = Math.random() * 3 + 1;
      const mode = Math.floor(Math.random() * 5);
      const family = Math.floor(Math.random() * 8);
      const s1 = Math.random() * 10 + 3;
      const s2 = Math.random() * 10 + 3;
      const s3 = Math.random() * 5 + 1;
      const s4 = Math.random() * Math.PI * 2;

      ///////////////////////
      const points = [];
      for (let i = 0; i < count; i++) {
        let vx = 0,
          vy = 0;
        const t = (i / count) * Math.PI * 2;
        switch (type) {
          case "love": {
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
          }
          case "firsfire": {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
          }
          case "sin": {
            vx = t;
            vy = Math.tan(0.5 * t);
            vx *= 0.8;
            vy *= 0.8;
            break;
          }
          case "classic": {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 5;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
          }
          case "bird": {
            const xRatio = (i / count) * 2 - 1;
            vx = xRatio * 25;
            vy = -(
              Math.pow(Math.abs(xRatio), 0.5) * 5 +
              Math.cos(xRatio * Math.PI) * 3
            );
            vx *= 0.5;
            vy *= 0.5;
            break;
          }
          case "flower": {
            const angleVal = (i / count) * Math.PI * 2;
            const ra = 15 * Math.cos(5 * angleVal);
            vx = ra * Math.cos(angleVal);
            vy = ra * Math.sin(angleVal);
            break;
          }
          case "butterfly": {
            const angel = (i / count) * Math.PI * 12;
            const rat =
              Math.pow(Math.E, Math.sin(angel)) -
              2 * Math.cos(4 * angel) +
              Math.pow(Math.sin((2 * angel - Math.PI) / 24), 5);
            vx = rat * Math.sin(angel) * 5;
            vy = -rat * Math.cos(angel) * 5;
            break;
          }
          case "spiral": {
            const ang = 0.15 * i;
            vx = (1 + ang) * Math.cos(ang) * 0.7;
            vy = (1 + ang) * Math.sin(ang) * 0.7;
            break;
          }
          case "tiny-stars": {
            const sT = Math.random() * 18 + 4;
            vx = Math.cos(t) * sT;
            vy = Math.sin(t) * sT;
            break;
          }
          case "star": {
            const numVertices = 10;
            const progress = i / count;
            const ta = progress * Math.PI * 2;
            const section = progress * numVertices;
            const isEven = Math.floor(section) % 2 === 0;
            const r = isEven
              ? 15 + (7 - 15) * (section % 1)
              : 7 + (15 - 7) * (section % 1);
            vx = r * Math.cos(ta) * 0.7;
            vy = r * Math.sin(ta) * 0.7;
            break;
          }
          case "waves": {
            if (family === 0) {
              vx = s1 * Math.sin(s3 * t + s4);
              vy = s2 * Math.sin(t);
            } else if (family === 1) {
              vx = (s1 + s2) * Math.cos(t) - s2 * Math.cos((s1 / s2 + 1) * t);
              vy = (s1 + s2) * Math.sin(t) - s2 * Math.sin((s1 / s2 + 1) * t);
            } else if (family === 2) {
              vx = (s1 - s2) * Math.cos(t) + s3 * Math.cos((s1 / s2 - 1) * t);
              vy = (s1 - s2) * Math.sin(t) - s3 * Math.sin((s1 / s2 - 1) * t);
            } else if (family === 3) {
              const sign = (v) => (v >= 0 ? 1 : -1);
              const n = Math.random() * 3 + 0.3;
              vx = s1 * sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), n);
              vy = s2 * sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), n);
            } else if (family === 4) {
              vx =
                s1 * Math.cos(t) + s2 * Math.cos(2 * t) + s3 * Math.cos(3 * t);
              vy =
                s1 * Math.sin(t) -
                s2 * Math.sin(2 * t) +
                s3 * Math.sin(3 * t + s4);
            } else if (family === 5) {
              const ratio =
                (Math.floor(Math.random() * 6) + 2) /
                (Math.floor(Math.random() * 5) + 1);
              vx = (s1 - s2) * Math.cos(t) + s3 * Math.cos(ratio * t + s4);
              vy = (s1 - s2) * Math.sin(t) - s3 * Math.sin(ratio * t);
            } else if (family === 6) {
              vx = s1 * Math.sin(t + Math.sin(s3 * t + s4));
              vy = s2 * Math.cos(t + Math.cos(s3 * t));
            } else {
              const arms = Math.floor(Math.random() * 7) + 3;
              const arm = Math.floor((t / (Math.PI * 2)) * arms);
              const localT = (t / (Math.PI * 2)) * arms - arm;
              vx = s1 * Math.cos((arm * (Math.PI * 2)) / arms) * localT;
              vy = s1 * Math.sin((arm * (Math.PI * 2)) / arms) * localT;
            }
            vx *= 0.45;
            vy *= 0.45;
            break;
          }
          case "phoenix": {
            const wave = Math.sin(t * 3) * 0.5 + 0.5;
            const flutter = Math.cos(t * 7) * 0.3;
            const r = (8 + wave * 12) * (1 + flutter);
            const sweep = t * 2.5;
            vx = r * Math.cos(sweep) * (1 + Math.sin(t * 5) * 0.4);
            vy =
              -(r * Math.sin(sweep) * (1 + Math.cos(t * 4) * 0.4)) -
              Math.abs(Math.sin(t * 6)) * 8;
            const chaos = Math.random() * 0.6;
            vx += Math.cos(t * 11) * chaos * 3;
            vy += Math.sin(t * 13) * chaos * 3;
            vx *= 0.45;
            vy *= 0.45;
            break;
          }
          case "phoenixs": {
            const r = (8 + 4) * Math.cos(mode * t);
            switch (mode) {
              case 0: {
                // rose curve
                vx = r * Math.cos(t) * 0.8;
                vy = r * Math.sin(t) * 0.8;
                break;
              }
              case 1: {
                // lissajous
                vx = 14 * Math.sin(a * t + Math.PI / b);
                vy = 14 * Math.sin(b * t);
                break;
              }
              case 2: {
                // epitrochoid
                vx = (8 + 4) * Math.cos(t) - 4 * Math.cos(twist * t);
                vy = (8 + 4) * Math.sin(t) - 4 * Math.sin(twist * t);
                break;
              }
              case 3: {
                // hypotrochoid
                vx = (10 - 3) * Math.cos(t) + 5 * Math.cos(((10 - 3) / 3) * t);
                vy = (10 - 3) * Math.sin(t) - 5 * Math.sin(((10 - 3) / 3) * t);
                break;
              }
              case 4: {
                // superellipse
                const sign = (v) => (v >= 0 ? 1 : -1);
                vx =
                  13 *
                  sign(Math.cos(t)) *
                  Math.pow(Math.abs(Math.cos(t)), 2 / a);
                vy =
                  13 *
                  sign(Math.sin(t)) *
                  Math.pow(Math.abs(Math.sin(t)), 2 / b);
                break;
              }
            }
            vx *= 0.45;
            vy *= 0.45;
            break;
          }
          case "fractals": {
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
          }

          case "fractal": {
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
          }

          case "starfish": {
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
          }
          default: {
            vx = Math.cos(t) * (Math.random() * 12 + 6);
            vy = Math.sin(t) * (Math.random() * 12 + 6);
          }
        }
        points.push({ vx: vx * 0.45, vy: vy * 0.45 });
      }
      return points;
    };

    // ── ShapeParticle — forms picture then explodes ──
    class ShapeParticle {
      constructor(cx, cy, color, ox, oy) {
        this.tx = cx + ox;
        this.ty = cy + oy;
        this.x = cx + (Math.random() - 0.5) * 320;
        this.y = cy + (Math.random() - 0.5) * 320;
        this.color = color;
        this.phase = "form";
        this.formT = 0;
        this.holdT = 0;
        this.vx = 0;
        this.vy = 0;
        this.opacity = 0;
        this.dead = false;
      }
      update() {
        if (this.phase === "form") {
          this.x += (this.tx - this.x) * 0.08;
          this.y += (this.ty - this.y) * 0.08;
          this.formT += 0.045;
          this.opacity = Math.min(1, this.formT * 1.5);
          if (this.formT >= 1) {
            this.x = this.tx;
            this.y = this.ty;
            this.phase = "hold";
          }
        } else if (this.phase === "hold") {
          this.holdT++;
          if (this.holdT > 45) {
            this.phase = "explode";
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 8 + 3;
            this.vx = Math.cos(angle) * spd;
            this.vy = Math.sin(angle) * spd;
          }
        } else {
          this.vx *= 0.95;
          this.vy *= 0.95;
          this.vy += 0.1;
          this.x += this.vx;
          this.y += this.vy;
          this.opacity -= 0.018;
          if (this.opacity <= 0) this.dead = true;
        }
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 2, 2);
      }
    }

    // ── Normal Particle ──
    class Particle {
      constructor(x, y, color, vx, vy, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.gravity = type === "tiny-stars" ? 0.03 : 0.08;
        this.friction = 0.96;
        this.opacity = 1;
        this.decay =
          Math.random() * 0.01 + (type === "tiny-stars" ? 0.03 : 0.015);
        this.dead = false;
      }
      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.decay;
        if (this.opacity <= 0) this.dead = true;
      }
      draw() {
        if (this.type === "tiny-stars" && Math.random() > 0.5) return;
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.fillRect(
          this.x,
          this.y,
          this.type === "tiny-stars" ? 1 : 2,
          this.type === "tiny-stars" ? 1 : 2,
        );
      }
    }

    // ── unified createBurst — handles everything ──
    const createBurst = (x, y, color, entry) => {
      if (particles.length > 2000) return;
      if (entry.kind === "math") {
        const pts = getMathPoints(entry.value);
        pts.forEach((p) =>
          particles.push(new Particle(x, y, color, p.vx, p.vy, entry.value)),
        );
      } else {
        // shape, text, image — all go through ShapeParticle
        entry.pts.forEach((p) =>
          particles.push(new ShapeParticle(x, y, color, p.ox, p.oy)),
        );
      }
    };

    // ── Rocket ──
    class Rocket {
      constructor(entry) {
        this.entry = entry; // { kind, value, pts }
        const margin = 50;
        this.x = margin + Math.random() * (window.innerWidth - margin * 2);
        this.y = window.innerHeight;
        // explode in range
        this.targetY =
          navHeightVal + Math.random() * (window.innerHeight * 0.6);
        this.speed = Math.random() * 4 + 7;
        //explosion color
        this.r = Math.floor(Math.random() * 256);
        this.g = Math.floor(Math.random() * 256);
        this.b = Math.floor(Math.random() * 256);
        this.history = [];
        this.dead = false;
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 12) this.history.shift();
        this.y -= this.speed;
        this.x += Math.sin(this.y / 20) * 1.5;
        if (this.y <= this.targetY) {
          this.dead = true;
          createBurst(
            this.x,
            this.y,
            `rgba(${this.r}, ${this.g}, ${this.b}, ${1})`,
            this.entry,
          );
        }
      }
      draw() {
        this.history.forEach((pos, i) => {
          ctx.globalAlpha = i / this.history.length;
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, (i / 12) * 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    // ── animate ──
    const animate = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      if (rockets.length > 0 || particles.length > 0) {
        rockets = rockets.filter((r) => !r.dead);
        rockets.forEach((r) => {
          r.update();
          r.draw();
        });
        particles = particles.filter((p) => !p.dead);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // ── build the unified pool then launch ──
    const buildPoolAndLaunch = async () => {
      const pool = [];

      // math shapes — always in the pool
      const mathTypes = [
        "fractal",
        "butterfly",
        "tiny-stars",
        "spiral",
        "classic",
        "waves",
        "starfish",
        // "flower",
        // "love",
        // "sin",
        "firstfire",
        "bird",
        "waves",
        "fractals",
        "phoenix",
        "waves",
        "phoenixs",
      ];
      mathTypes.forEach((v) => pool.push({ kind: "math", value: v }));

      // shapes from prop
      shapes.forEach((v) => {
        if (v.endsWith("$")) {
          const base = v.slice(0, -1);
          const mathPts = getMathPoints(base);
          if (!mathPts.length) return;
          const pts = mathPts.map((p) => ({ ox: p.vx * 18, oy: p.vy * 18 }));
          pool.push({ kind: "shape", value: base, pts });
        } else {
          const pts = getPixelPoints("shape", v);
          pool.push({ kind: "shape", value: v, pts });
        }
      });

      texts.forEach((v) => {
        if (v.endsWith("$")) {
          const base = v.slice(0, -1);
          const mathPts = getMathPoints(base);
          if (!mathPts.length) return;
          const pts = mathPts.map((p) => ({ ox: p.vx * 18, oy: p.vy * 18 }));
          pool.push({ kind: "text", value: base, pts });
        } else {
          const pts = getPixelPoints("text", v);
          pool.push({ kind: "text", value: v, pts });
        }
      });
      // images from prop — async, preload all first
      const imageResults = await Promise.all(
        images.map((src) => loadImage(src)),
      );
      imageResults.forEach((result) => {
        if (result)
          pool.push({ kind: "image", value: result.src, pts: result.pts });
      });

      // launch rockets — each picks randomly from the full pool
      //fire work ammount
      const w = window.innerWidth;
      let count = Math.floor(((w - 400) / 1200) * 20 + 10);
      count = Math.min(Math.max(count, 20), 70);

      for (let i = 0; i < count; i++) {
        const delay = i * (w < 600 ? 350 : 200) + Math.random() * 300;
        setTimeout(() => {
          const entry = pool[Math.floor(Math.random() * pool.length)];
          rockets.push(new Rocket(entry));
        }, delay);
      }
    };

    resize();
    animate();
    buildPoolAndLaunch();
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
        zIndex: 100,
      }}
    />
  );
};

export default FireworkDisplay;
