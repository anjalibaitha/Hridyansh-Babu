"use client";

import { useEffect, useRef } from "react";

export default function InteractiveTouchEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      char?: string;
      spin: number;
      spinSpeed: number;
    };

    const particles: Particle[] = [];
    const colors = ["#fde047", "#fef08a", "#93c5fd", "#f472b6", "#fed7aa", "#ffffff"];
    const sparkles = ["✦", "✨", "★", "•"];

    const addSparkle = (x: number, y: number, count = 3) => {
      for (let i = 0; i < count; i++) {
        if (particles.length > 80) break; // keep memory capped
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2 + 0.5;
        particles.push({
          x: x + (Math.random() * 12 - 6),
          y: y + (Math.random() * 12 - 6),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6, // float gently up
          size: Math.random() * 12 + 8,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          char: Math.random() > 0.4 ? sparkles[Math.floor(Math.random() * sparkles.length)] : undefined,
          spin: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 0.1,
        });
      }
    };

    let animId: number | null = null;
    let isRunning = false;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // soft gravity
        p.vx *= 0.98;
        p.alpha -= 0.024;
        p.spin += p.spinSpeed;

        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.char) {
          ctx.font = `${p.size}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin);
          ctx.fillText(p.char, 0, 0);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(loop);
      } else {
        isRunning = false;
      }
    };

    const startLoopIfNeeded = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };

    let lastMoveTime = 0;
    const handleScroll = () => {
      // A tiny scroll-linked shift gives long pages a responsive, alive feeling
      // without forcing React to re-render on every frame.
      document.documentElement.style.setProperty("--scroll-shift", `${window.scrollY * -0.04}px`);
    };

    handleScroll();
    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      // Mouse/pointer parallax update
      const normX = (e.clientX / width - 0.5) * 2;
      const normY = (e.clientY / height - 0.5) * 2;
      document.documentElement.style.setProperty("--mouse-x", normX.toFixed(3));
      document.documentElement.style.setProperty("--mouse-y", normY.toFixed(3));
      document.documentElement.style.setProperty("--mouse-shift-x", `${normX * 8}px`);
      document.documentElement.style.setProperty("--mouse-shift-y", `${normY * 8}px`);

      // Emitting touch sparkles on move (throttled to 45ms for buttery performance)
      if (now - lastMoveTime > 45) {
        lastMoveTime = now;
        addSparkle(e.clientX, e.clientY, e.pointerType === "touch" ? 2 : 1);
        startLoopIfNeeded();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      addSparkle(e.clientX, e.clientY, 6);
      startLoopIfNeeded();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.removeProperty("--scroll-shift");
      document.documentElement.style.removeProperty("--mouse-shift-x");
      document.documentElement.style.removeProperty("--mouse-shift-y");
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-touch-sparkles-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
