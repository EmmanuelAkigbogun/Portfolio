import React, { useEffect, useRef } from "react";

const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    let particles = [];
    let shapes = [];
    let animationFrameId;

    const mouse = { x: null, y: null, visible: false };

    const handleMouseMove = (event) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.visible = true;
    };

    const handleMouseLeave = () => {
      mouse.visible = false;
    };

    const resize = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    class Core {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 60;
        this.glowSize = 160;
      }
      update() {
        if (mouse.x && mouse.y) {
          this.x += (mouse.x - this.x) * 0.05;
          this.y += (mouse.y - this.y) * 0.05;
        }
      }
      draw() {
        if (!mouse.visible) return;
        let gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.glowSize,
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const core = new Core();

    class Particle {
      constructor() {
        this.init();
      }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.2;
        this.vx = Math.random() * 0.6 - 0.3;
        this.vy = Math.random() * 0.6 - 0.3;
      }
      update() {
        let dx = core.x - this.x;
        let dy = core.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (mouse.visible && distance < core.glowSize) {
          this.x += dx * 0.03;
          this.y += dy * 0.03;
        } else {
          this.x += this.vx;
          this.y += this.vy;
        }

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class SpecialShape extends Particle {
      constructor(type) {
        super();
        this.type = type; // 'box', 'star', 'hexagon'
        this.size = Math.random() * 4 + 3;
        this.rotation = 0;
        this.spin = Math.random() * 0.02;
      }
      draw() {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.rotation += this.spin;

        if (this.type === "box") {
          ctx.strokeRect(
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2,
          );
        } else if (this.type === "hexagon") {
          for (let i = 0; i < 6; i++) {
            let angle = this.rotation + (i * Math.PI) / 3;
            let x = this.x + this.size * Math.cos(angle);
            let y = this.y + this.size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (this.type === "star") {
          for (let i = 0; i < 10; i++) {
            let angle = this.rotation + (i * Math.PI) / 5;
            let r = i % 2 === 0 ? this.size : this.size / 2;
            let x = this.x + r * Math.cos(angle);
            let y = this.y + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    const init = () => {
      particles = [];
      shapes = [];
      for (let i = 0; i < 400; i++) particles.push(new Particle());
      for (let i = 0; i < 10; i++) shapes.push(new SpecialShape("box"));
      for (let i = 0; i < 10; i++) shapes.push(new SpecialShape("star"));
      for (let i = 0; i < 10; i++) shapes.push(new SpecialShape("hexagon"));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      core.update();
      core.draw();
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

    window.addEventListener("resize", resize);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("touchstart", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.addEventListener("touchstart", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
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
