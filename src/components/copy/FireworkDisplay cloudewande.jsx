import React, { useEffect, useRef } from "react";
import { Images } from "../../assets/images.js";
// ─────────────────────────────────────────────────────────────────────────────
// FireworkDisplay
//
// Props:
//   trigger   {number}  – increment to launch a new volley of rockets
//   imageSrc  {string}  – (optional) URL/path to an image; when set, one of
//                         the rockets will form the image silhouette before
//                         exploding.  Leave undefined for pure fireworks.
//   imageShape {string} – built-in shape to use when no imageSrc is given.
//                         Options: "heart" | "rectangle" | "star" | "text"
//                         Default: "heart"
//   imageText  {string} – text to render when imageShape === "text"
//                         Default: "HI!"
// ─────────────────────────────────────────────────────────────────────────────
const FireworkDisplay = ({
  trigger=10,
  imageSrc = Images.hero, // e.g. "/my-photo.png"  or  "https://…/logo.png"
  imageShape = "heart",
  imageText = "HI!",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let rockets = [],
      particles = [],
      animationFrameId;

    // ── resize ────────────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    // ── sample pixels from an offscreen canvas ────────────────────────────────
    // Returns an array of {ox, oy} offsets (centered on 0,0) for ~`count` pts.
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
        if (filled.length === 0) break;
        const idx = Math.floor(Math.random() * filled.length);
        const [px, py] = filled[idx];
        result.push({
          ox: (px - size / 2) * 0.28,
          oy: (py - size / 2) * 0.28,
        });
      }
      return result;
    };

    // ── draw a built-in shape onto an offscreen canvas ────────────────────────
    const drawBuiltinShape = (offCtx, size, shape) => {
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

        case "text":
        default: {
          offCtx.font = "bold 70px sans-serif";
          offCtx.textAlign = "center";
          offCtx.textBaseline = "middle";
          offCtx.fillText(imageText, size / 2, size / 2);
          break;
        }
      }
    };

    // ── load image and return sampled pixel offsets (Promise) ─────────────────
    const loadImagePoints = (src, count) =>
      new Promise((resolve) => {
        const size = 200;
        const off = document.createElement("canvas");
        off.width = off.height = size;
        const offCtx = off.getContext("2d");

        const img = new Image();
        img.crossOrigin = "anonymous"; // needed for external URLs
        img.onload = () => {
          // Draw image centered + fitted inside the offscreen canvas
          const scale = Math.min(size / img.width, size / img.height) * 0.9;
          const sw = img.width * scale;
          const sh = img.height * scale;
          offCtx.clearRect(0, 0, size, size);
          offCtx.drawImage(img, (size - sw) / 2, (size - sh) / 2, sw, sh);
          resolve(samplePixels(offCtx, size, count));
        };
        img.onerror = () => {
          // Fall back to built-in heart if image fails to load
          drawBuiltinShape(offCtx, size, "heart");
          resolve(samplePixels(offCtx, size, count));
        };
        img.src = src;
      });

    // ── get points for built-in shape (sync) ──────────────────────────────────
    const getBuiltinShapePoints = (shape, count) => {
      const size = 200;
      const off = document.createElement("canvas");
      off.width = off.height = size;
      const offCtx = off.getContext("2d");
      drawBuiltinShape(offCtx, size, shape);
      return samplePixels(offCtx, size, count);
    };

    // ── normal firework shape points ──────────────────────────────────────────
    const getShapePoints = (type) => {
      const points = [];
      const count = type === "firework" || type === "tiny-stars" ? 180 : 140;

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
          case "sin": {
            vx = t;
            vy = Math.tan((1 / 2) * t);
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
            const wingShape = Math.pow(Math.abs(xRatio), 0.5);
            const bodyDip = Math.cos(xRatio * Math.PI);
            vy = wingShape * 5 + bodyDip * 3;
            vx *= 0.5;
            vy *= 0.5;
            break;
          }
          case "flower": {
            const ka = 5;
            const angleVal = (i / count) * Math.PI * 2;
            const ra = 15 * Math.cos(ka * angleVal);
            vx = ra * Math.cos(angleVal);
            vy = ra * Math.sin(angleVal);
            break;
          }
          case "butterfly": {
            const angel = (i / count) * Math.PI * 12;
            const e = Math.E;
            const rat =
              Math.pow(e, Math.sin(angel)) -
              2 * Math.cos(4 * angel) +
              Math.pow(Math.sin((2 * angel - Math.PI) / 24), 5);
            const scale = 5;
            vx = rat * Math.sin(angel) * scale;
            vy = -rat * Math.cos(angel) * scale;
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
            const points2 = 5;
            const numVertices = points2 * 2;
            const innerRadius = 7;
            const outerRadius = 15;
            const progress = i / count;
            const ta = progress * Math.PI * 2;
            const section = progress * numVertices;
            const segmentProgress = section % 1;
            const isEven = Math.floor(section) % 2 === 0;
            let r;
            if (isEven)
              r = outerRadius + (innerRadius - outerRadius) * segmentProgress;
            else
              r = innerRadius + (outerRadius - innerRadius) * segmentProgress;
            vx = r * Math.cos(ta) * 0.7;
            vy = r * Math.sin(ta) * 0.7;
            break;
          }
          default: {
            const sN = Math.random() * 12 + 6;
            vx = Math.cos(t) * sN;
            vy = Math.sin(t) * sN;
          }
        }
        points.push({ vx: vx * 0.45, vy: vy * 0.45 });
      }
      return points;
    };

    // ── ShapeParticle — forms a picture then explodes ─────────────────────────
    class ShapeParticle {
      constructor(cx, cy, color, ox, oy) {
        this.cx = cx;
        this.cy = cy;
        this.tx = cx + ox; // target X (shape position)
        this.ty = cy + oy; // target Y
        this.x = cx + (Math.random() - 0.5) * 320; // start scattered
        this.y = cy + (Math.random() - 0.5) * 320;
        this.color = color;
        this.phase = "form"; // "form" | "hold" | "explode"
        this.formT = 0;
        this.holdT = 0;
        this.vx = 0;
        this.vy = 0;
        this.opacity = 0;
        this.size = 2;
        this.dead = false;
      }

      update() {
        if (this.phase === "form") {
          this.formT += 0.045;
          const t = Math.min(this.formT, 1);
          const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
          this.x =
            this.x +
            (this.tx - this.x) * ease * 0.15 +
            (this.tx - this.x) * ease * 0.85 * (this.formT >= 1 ? 1 : 0);
          // Simpler lerp approach:
          this.x = lerp(this.x, this.tx, 0.08);
          this.y = lerp(this.y, this.ty, 0.08);
          this.opacity = Math.min(1, this.formT * 1.5);
          if (this.formT >= 1) {
            this.x = this.tx;
            this.y = this.ty;
            this.phase = "hold";
            this.holdT = 0;
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
          // explode
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
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    const lerp = (a, b, t) => a + (b - a) * t;

    // ── Normal Particle ───────────────────────────────────────────────────────
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
        this.size = type === "tiny-stars" ? 1 : 2;
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
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    // ── createBurst — normal firework burst ───────────────────────────────────
    const createBurst = (x, y, color, type) => {
      if (particles.length > 2000) return;
      const points = getShapePoints(type);
      points.forEach((p) =>
        particles.push(new Particle(x, y, color, p.vx, p.vy, type)),
      );
    };

    // ── createShapeBurst — picture-then-explode ───────────────────────────────
    const createShapeBurst = (x, y, color, pts) => {
      pts.forEach((p) =>
        particles.push(new ShapeParticle(x, y, color, p.ox, p.oy)),
      );
    };

    // ── Rocket ────────────────────────────────────────────────────────────────
    class Rocket {
      constructor(shapePts) {
        // shapePts: array of {ox, oy} OR null for a normal burst
        this.shapePts = shapePts || null;
        const margin = 50;
        this.x = margin + Math.random() * (window.innerWidth - margin * 2);
        this.y = window.innerHeight;
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
        this.x += Math.sin(this.y / 20) * 1.5;

        if (this.y <= this.targetY) {
          this.dead = true;
          const color = `hsl(${this.hue}, 100%, 75%)`;

          if (this.shapePts) {
            // ── PICTURE BURST ─────────────────────────────────────
            createShapeBurst(this.x, this.y, color, this.shapePts);
          } else {
            // ── NORMAL BURST ──────────────────────────────────────
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
              color,
              styles[Math.floor(Math.random() * styles.length)],
            );
          }
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

    // ── animate loop ──────────────────────────────────────────────────────────
    const animate = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
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

    // ── launch rockets on trigger ─────────────────────────────────────────────
    if (trigger > 0) {
      const width = window.innerWidth;
      let responsiveCount = Math.floor(((width - 400) / 1200) * 20 + 10);
      responsiveCount = Math.min(Math.max(responsiveCount, 8), 35);

      // Decide which rocket (index 0) gets the shape/image burst
      // The rest are normal fireworks.
      const prepareAndLaunch = (shapePts) => {
        for (let i = 0; i < responsiveCount; i++) {
          const delay = i * (width < 600 ? 350 : 200) + Math.random() * 300;
          setTimeout(() => {
            // First rocket carries the shape; the rest are normal
            rockets.push(new Rocket(i === 0 ? shapePts : null));
          }, delay);
        }
      };

      if (imageSrc) {
        // ── Load external / local image then sample pixels ─────────────────
        loadImagePoints(imageSrc, 260).then((pts) => {
          prepareAndLaunch(pts);
        });
      } else {
        // ── Use built-in shape ─────────────────────────────────────────────
        const pts = getBuiltinShapePoints(imageShape, 240);
        prepareAndLaunch(pts);
      }
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger, imageSrc, imageShape, imageText]);

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
