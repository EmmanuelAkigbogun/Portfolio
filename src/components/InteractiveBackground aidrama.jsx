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

    const defs = document.createElementNS(svgNS, "defs");

    const grad = document.createElementNS(svgNS, "radialGradient");
    const bgColor = "rgba(0,0,0,0)";
    grad.setAttribute("id", "ib-core-grad");
    grad.setAttribute("cx", "50%");
    grad.setAttribute("cy", "50%");
    grad.setAttribute("r", "50%");
    const stop0 = document.createElementNS(svgNS, "stop");
    stop0.setAttribute("offset", "0%");
    stop0.setAttribute("stop-color", bgColor);
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "100%");
    stop1.setAttribute("stop-color", bgColor);
    grad.appendChild(stop0);
    grad.appendChild(stop1);
    defs.appendChild(grad);

    const sphereGrad = document.createElementNS(svgNS, "radialGradient");
    sphereGrad.setAttribute("id", "ib-sphere-grad");
    sphereGrad.setAttribute("cx", "50%");
    sphereGrad.setAttribute("cy", "50%");
    sphereGrad.setAttribute("r", "50%");
    const sg0 = document.createElementNS(svgNS, "stop");
    sg0.setAttribute("offset", "0%");
    sg0.setAttribute("stop-color", "rgba(255,255,255,0.2)");
    const sg1 = document.createElementNS(svgNS, "stop");
    sg1.setAttribute("offset", "100%");
    sg1.setAttribute("stop-color", bgColor);
    sphereGrad.appendChild(sg0);
    sphereGrad.appendChild(sg1);
    defs.appendChild(sphereGrad);

    svg.appendChild(defs);

    const coreGlow = document.createElementNS(svgNS, "circle");
    coreGlow.setAttribute("fill", "url(#ib-core-grad)");
    coreGlow.setAttribute("opacity", "0");
    svg.appendChild(coreGlow);

    const sphereBody = document.createElementNS(svgNS, "circle");
    sphereBody.setAttribute("fill", "url(#ib-sphere-grad)");
    sphereBody.setAttribute("r", "80");
    sphereBody.setAttribute("opacity", "0");
    svg.appendChild(sphereBody);

    const coreRing = document.createElementNS(svgNS, "circle");
    coreRing.setAttribute("fill", "none");
    coreRing.setAttribute("stroke", "rgba(255,255,255,0.4)");
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
    let isHolding = false;
    const core = { x: 0, y: 0, size: 60, glowSize: 160 };
    let particles = [],
      shapes = [];
    let animationFrameId;

    const rnd = (a, b) => Math.random() * (b - a) + a;
    const rndInt = (a, b) => Math.floor(Math.random() * (b - a) + a);
    const rndColor = (alpha) =>
      `rgba(${rndInt(0, 256)},${rndInt(0, 256)},${rndInt(0, 256)},${alpha})`;

    const resize = () => {
      W = parent.offsetWidth;
      H = parent.offsetHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", W);
      svg.setAttribute("height", H);
      core.x = W / 2;
      core.y = H / 2;
    };

    class Particle {
      constructor() {
        this.el = document.createElementNS(svgNS, "circle");
        this.el.setAttribute("r", rnd(0.2, 1.4));
        particlesG.appendChild(this.el);
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = rnd(-0.3, 0.3);
        this.vy = rnd(-0.3, 0.3);
      }
      update() {
        const dx = core.x - this.x,
          dy = core.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (isHolding && mouse.x !== null && dist < core.glowSize) {
          this.x += dx * 0.015;
          this.y += dy * 0.015;
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
        this.el.setAttribute("fill", rndColor(0.8));
      }
    }

    class SpecialShape {
      constructor(type) {
        this.type = type;
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = rnd(3, 7);
        this.vx = rnd(-0.3, 0.3);
        this.vy = rnd(-0.3, 0.3);
        this.rotation = 0;
        this.spin = rnd(0, 0.02);
        this.el = document.createElementNS(svgNS, "path");
        this.el.setAttribute("fill", "none");
        this.el.setAttribute("stroke-width", "1");
        shapesG.appendChild(this.el);
      }
      update() {
        const dx = core.x - this.x,
          dy = core.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (isHolding && mouse.x !== null && dist < core.glowSize) {
          this.x += dx * 0.015;
          this.y += dy * 0.015;
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
        this.el.setAttribute("stroke", rndColor(0.7));
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
                  (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2),
              )
              .join("") + "Z";
        } else if (type === "hexagon") {
          for (let i = 0; i < 6; i++) {
            const a = rotation + (i * Math.PI) / 3;
            d +=
              (i ? "L" : "M") +
              (x + size * Math.cos(a)).toFixed(2) +
              " " +
              (y + size * Math.sin(a)).toFixed(2);
          }
          d += "Z";
        } else {
          for (let i = 0; i < 10; i++) {
            const a = rotation + (i * Math.PI) / 5;
            const r = i % 2 === 0 ? size : size / 2;
            d +=
              (i ? "L" : "M") +
              (x + r * Math.cos(a)).toFixed(2) +
              " " +
              (y + r * Math.sin(a)).toFixed(2);
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
      if (particlesBool) {
        for (let i = 0; i < 400; i++) particles.push(new Particle());
        for (let i = 0; i < 10; i++) shapes.push(new SpecialShape("box"));
        for (let i = 0; i < 10; i++) shapes.push(new SpecialShape("star"));
        for (let i = 0; i < 10; i++) shapes.push(new SpecialShape("hexagon"));
      } else {
        for (let i = 0; i < 150; i++) particles.push(new Particle());
        for (let i = 0; i < 5; i++) shapes.push(new SpecialShape("box"));
        for (let i = 0; i < 5; i++) shapes.push(new SpecialShape("star"));
        for (let i = 0; i < 5; i++) shapes.push(new SpecialShape("hexagon"));
      }
    };

    const animate = () => {
      if (isHolding && mouse.x !== null && mouse.y !== null) {
        core.x += (mouse.x - core.x) * 0.05;
        core.y += (mouse.y - core.y) * 0.05;
      }

      if (isHolding && mouse.x !== null && mouse.y !== null) {
        coreGlow.setAttribute("cx", core.x);
        coreGlow.setAttribute("cy", core.y);
        coreGlow.setAttribute("r", core.glowSize);
        coreGlow.setAttribute("opacity", "1");

        sphereBody.setAttribute("cx", core.x);
        sphereBody.setAttribute("cy", core.y);
        sphereBody.setAttribute("opacity", "1");

        coreRing.setAttribute("cx", core.x);
        coreRing.setAttribute("cy", core.y);
        coreRing.setAttribute("opacity", "1");
      } else if (mouse.visible && mouse.x !== null && mouse.y !== null) {
        coreGlow.setAttribute("cx", core.x);
        coreGlow.setAttribute("cy", core.y);
        coreGlow.setAttribute("r", core.glowSize);
        coreGlow.setAttribute("opacity", "1");

        sphereBody.setAttribute("cx", core.x);
        sphereBody.setAttribute("cy", core.y);
        sphereBody.setAttribute("opacity", "1");

        coreRing.setAttribute("cx", core.x);
        coreRing.setAttribute("cy", core.y);
        coreRing.setAttribute("opacity", "1");
      } else {
        coreGlow.setAttribute("opacity", "0");
        coreRing.setAttribute("opacity", "0");
        sphereBody.setAttribute("opacity", "0");
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

    let isTouchDevice = false;

    const handleMouseMove = (e) => {
      console.log(e.type, e);

      if (e.type === "pointermove") {
        isTouchDevice = false;
        isHolding = true;
        // ignore synthetic mouse events on mobile
        const rect = parent.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.visible = true;
      }
    };

    const handleMouseLeave = (e) => {
      if (e.type.includes("mouse")) {
        console.log(e, 99);

        isTouchDevice = false;
        isHolding = false;
        mouse.visible = false;
        mouse.x = null;
        mouse.y = null;
      }
    };

    const handleTouchStart = (e) => {
      isTouchDevice = true;
      isHolding = true;
      const rect = parent.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
      mouse.visible = true;
    };

    // const handleTouchMove = (e) => {
    //   if (!isHolding) return;
    //   const rect = parent.getBoundingClientRect();
    //   const t = e.touches[0];
    //   mouse.x = t.clientX - rect.left;
    //   mouse.y = t.clientY - rect.top;
    // };

    const handleTouchEnd = () => {
      isHolding = false;
      mouse.visible = false;
      mouse.x = null;
      mouse.y = null;
    };

    if (booleanConst) {
      window.addEventListener("resize", resize);
      parent.addEventListener("pointermove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
      parent.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      // parent.addEventListener("touchmove", handleTouchMove, {
      //   passive: true,
      // });
      parent.addEventListener("touchend", handleTouchEnd);
      parent.addEventListener("touchcancel", handleTouchEnd);
    }

    resize();
    init();
    animate();

    return () => {
      if (booleanConst) {
        window.removeEventListener("resize", resize);
        parent.removeEventListener("pointermove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
        parent.removeEventListener("touchstart", handleTouchStart);
        // parent.removeEventListener("touchmove", handleTouchMove);
        parent.removeEventListener("touchend", handleTouchEnd);
        parent.removeEventListener("touchcancel", handleTouchEnd);
      }
      cancelAnimationFrame(animationFrameId);
      svg.innerHTML = "";
    };
  }, []);

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
      xmlns="http://www.w3.org/2000/svg"
    />
  );
};

export default InteractiveBackground;
