import React, { useEffect, useRef } from "react";

const InteractiveBackground = ({
  booleanConst = true,
  particlesBool = true,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const parent = svg.parentElement;
    const svgNS = "http://www.w3.org/2000/svg";

    // 1. Setup Definitions with Root Variables
    const defs = document.createElementNS(svgNS, "defs");

    // The Large Magnetic Glow (uses accent color)
    const sphereGrad = document.createElementNS(svgNS, "radialGradient");
    sphereGrad.setAttribute("id", "ib-sphere-grad");
    sphereGrad.setAttribute("cx", "50%");
    sphereGrad.setAttribute("cy", "50%");
    sphereGrad.setAttribute("r", "50%");

    const sg0 = document.createElementNS(svgNS, "stop");
    sg0.setAttribute("offset", "0%");
    sg0.setAttribute("stop-color", "var(--accent-color)"); // FROM ROOT
    sg0.setAttribute("stop-opacity", "0.2");

    const sg1 = document.createElementNS(svgNS, "stop");
    sg1.setAttribute("offset", "100%");
    sg1.setAttribute("stop-color", "var(--bg-main)"); // FROM ROOT
    sg1.setAttribute("stop-opacity", "0");

    sphereGrad.appendChild(sg0);
    sphereGrad.appendChild(sg1);
    defs.appendChild(sphereGrad);
    svg.appendChild(defs);

    // 2. Setup Core UI Elements
    const sphereBody = document.createElementNS(svgNS, "circle");
    sphereBody.setAttribute("fill", "url(#ib-sphere-grad)");
    sphereBody.setAttribute("r", "120");
    sphereBody.setAttribute("opacity", "0");
    svg.appendChild(sphereBody);

    const coreRing = document.createElementNS(svgNS, "circle");
    coreRing.setAttribute("fill", "none");
    coreRing.setAttribute("stroke", "var(--text-main)"); // FROM ROOT
    coreRing.setAttribute("stroke-opacity", "0.3");
    coreRing.setAttribute("stroke-width", "1");
    coreRing.setAttribute("r", "60");
    coreRing.setAttribute("opacity", "0");
    svg.appendChild(coreRing);

    const particlesG = document.createElementNS(svgNS, "g");
    const shapesG = document.createElementNS(svgNS, "g");
    svg.appendChild(particlesG);
    svg.appendChild(shapesG);

    let W, H;
    const mouse = { x: null, y: null, visible: false };
    const core = { x: 0, y: 0, size: 60, glowSize: 160 };
    let particles = [],
      shapes = [];
    let animationFrameId;

    const rnd = (a, b) => Math.random() * (b - a) + a;

    const resize = () => {
      W = parent.offsetWidth;
      H = parent.offsetHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", W);
      svg.setAttribute("height", H);
    };

    class Particle {
      constructor() {
        this.el = document.createElementNS(svgNS, "circle");
        this.el.setAttribute("r", rnd(0.5, 1.5));
        this.el.setAttribute("fill", "var(--text-main)"); // FROM ROOT
        this.el.setAttribute("fill-opacity", rnd(0.3, 0.7));
        particlesG.appendChild(this.el);
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = rnd(-0.4, 0.4);
        this.vy = rnd(-0.4, 0.4);
      }
      update() {
        const dx = core.x - this.x,
          dy = core.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (mouse.visible && dist < core.glowSize) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        } else {
          this.x += this.vx;
          this.y += this.vy;
        }
        if (this.x > W) this.x = 0;
        if (this.x < 0) this.x = W;
        if (this.y > H) this.y = 0;
        if (this.y < 0) this.y = H;
      }
      draw() {
        this.el.setAttribute("cx", this.x);
        this.el.setAttribute("cy", this.y);
      }
    }

    class SpecialShape {
      constructor(type) {
        this.type = type;
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = rnd(4, 8);
        this.vx = rnd(-0.3, 0.3);
        this.vy = rnd(-0.3, 0.3);
        this.rotation = 0;
        this.spin = rnd(0.005, 0.02);
        this.el = document.createElementNS(svgNS, "path");
        this.el.setAttribute("fill", "none");
        this.el.setAttribute("stroke", "var(--accent-color)"); // FROM ROOT
        this.el.setAttribute("stroke-opacity", "0.5");
        this.el.setAttribute("stroke-width", "1");
        shapesG.appendChild(this.el);
      }
      update() {
        const dx = core.x - this.x,
          dy = core.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (mouse.visible && dist < core.glowSize) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        } else {
          this.x += this.vx;
          this.y += this.vy;
        }
        if (this.x > W) this.x = 0;
        if (this.x < 0) this.x = W;
        if (this.y > H) this.y = 0;
        if (this.y < 0) this.y = H;
        this.rotation += this.spin;
      }
      draw() {
        const { x, y, size, rotation, type } = this;
        let d = "";
        if (type === "box") {
          const cos = Math.cos(rotation),
            sin = Math.sin(rotation);
          const corners = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ].map(([cx, cy]) => [
            x + (cx * size * cos - cy * size * sin),
            y + (cx * size * sin + cy * size * cos),
          ]);
          d =
            corners
              .map(
                (p, i) =>
                  (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1),
              )
              .join("") + "Z";
        } else if (type === "hexagon") {
          for (let i = 0; i < 6; i++) {
            const a = rotation + (i * Math.PI) / 3;
            d +=
              (i ? "L" : "M") +
              (x + size * Math.cos(a)).toFixed(1) +
              " " +
              (y + size * Math.sin(a)).toFixed(1);
          }
          d += "Z";
        } else {
          for (let i = 0; i < 10; i++) {
            const a = rotation + (i * Math.PI) / 5;
            const r = i % 2 === 0 ? size : size / 2;
            d +=
              (i ? "L" : "M") +
              (x + r * Math.cos(a)).toFixed(1) +
              " " +
              (y + r * Math.sin(a)).toFixed(1);
          }
          d += "Z";
        }
        this.el.setAttribute("d", d);
      }
    }

    const init = () => {
      particlesG.innerHTML = "";
      shapesG.innerHTML = "";
      particles = [];
      shapes = [];
      const count = particlesBool ? 300 : 100;
      for (let i = 0; i < count; i++) particles.push(new Particle());
      for (let i = 0; i < 8; i++) shapes.push(new SpecialShape("box"));
      for (let i = 0; i < 8; i++) shapes.push(new SpecialShape("star"));
      for (let i = 0; i < 8; i++) shapes.push(new SpecialShape("hexagon"));
    };

    const animate = () => {
      if (mouse.x != null && mouse.y != null) {
        core.x += (mouse.x - core.x) * 0.1;
        core.y += (mouse.y - core.y) * 0.1;
      }

      if (mouse.visible) {
        sphereBody.setAttribute("cx", core.x);
        sphereBody.setAttribute("cy", core.y);
        sphereBody.setAttribute("opacity", "1");
        coreRing.setAttribute("cx", core.x);
        coreRing.setAttribute("cy", core.y);
        coreRing.setAttribute("opacity", "1");
      } else {
        sphereBody.setAttribute("opacity", "0");
        coreRing.setAttribute("opacity", "0");
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      shapes.forEach((s) => {
        s.update();
        s.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.visible = true;
    };

    const handleMouseLeave = () => {
      mouse.visible = false;
    };

    if (booleanConst) {
      window.addEventListener("resize", resize);
      parent.addEventListener("pointermove", handleMouseMove);
      parent.addEventListener("pointerleave", handleMouseLeave);
    }

    resize();
    init();
    animate();

    return () => {
      if (booleanConst) {
        window.removeEventListener("resize", resize);
        parent.removeEventListener("pointermove", handleMouseMove);
        parent.removeEventListener("pointerleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [particlesBool, booleanConst]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
};

export default InteractiveBackground;
