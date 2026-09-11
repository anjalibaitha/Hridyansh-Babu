"use client";

import { useEffect, useRef, useState, useCallback, type PointerEvent } from "react";

interface ScratchCanvasProps {
  onReveal?: () => void;
  onActivity?: () => void;
  onProgress?: (percent: number) => void;
  brushRadius?: number;
  threshold?: number; // default 50%
  coverTitle?: string;
  coverSubtitle?: string;
  className?: string;
  disabled?: boolean;
}

export default function ScratchCanvas({
  onReveal,
  onActivity,
  onProgress,
  brushRadius = 26,
  threshold = 50,
  coverTitle = "SCRATCH TO REVEAL",
  coverSubtitle = "कार्ड पर उंगली चलाकर देखें",
  className = "",
  disabled = false,
}: ScratchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratching = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const lastCheckTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const revealPending = useRef(false);

  // Paint the celebratory foil on canvas
  const drawCover = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";

      // 1. Shimmering celebratory gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#9bd2ee");     // baby blue
      grad.addColorStop(0.35, "#c5e6f8");  // soft sky
      grad.addColorStop(0.55, "#fde68a");  // warm celebratory gold
      grad.addColorStop(0.80, "#fef3c7");  // soft cream
      grad.addColorStop(1, "#7ebcdb");     // royal pastel blue
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Delicate golden sparkles & starry dust
      const seed = Math.floor(width + height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      for (let i = 0; i < 35; i++) {
        const x = ((i * 73 + seed) % width);
        const y = ((i * 97 + seed * 3) % height);
        const r = (i % 3) + 1.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw little golden stars ✦
      ctx.fillStyle = "rgba(163, 125, 42, 0.45)";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const starPositions = [
        [width * 0.15, height * 0.2],
        [width * 0.85, height * 0.2],
        [width * 0.2, height * 0.8],
        [width * 0.8, height * 0.8],
        [width * 0.5, height * 0.18],
      ];
      starPositions.forEach(([sx, sy]) => {
        ctx.fillText("✦", sx, sy);
      });

      // 3. Subtle decorative border inside foil
      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // 4. Center instructional badges
      const centerY = height / 2;
      const centerX = width / 2;

      // Icon: gift / sparkle
      ctx.fillStyle = "#8a6624";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("✨ 🎁 ✨", centerX, centerY - 28);

      // English title
      ctx.fillStyle = "#4a3b15";
      ctx.font = "bold 13px Manrope, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.letterSpacing = "0.08em";
      ctx.fillText(coverTitle, centerX, centerY - 4);

      // Nepali subtitle
      ctx.fillStyle = "#7c5c1d";
      ctx.font = "600 13px 'Noto Sans Devanagari', sans-serif";
      ctx.fillText(coverSubtitle, centerX, centerY + 20);

      // Subtle hint
      ctx.fillStyle = "rgba(110, 85, 30, 0.85)";
      ctx.font = "11px Manrope, sans-serif";
      ctx.fillText("Finger scratch to reveal", centerX, centerY + 40);

      ctx.restore();
    },
    [coverTitle, coverSubtitle]
  );

  // Initialize canvas with proper DPR
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(bounds.width * dpr);
    canvas.height = Math.round(bounds.height * dpr);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    drawCover(canvas, ctx, bounds.width, bounds.height);
  }, [drawCover]);

  useEffect(() => {
    initCanvas();
    revealPending.current = false;

    const handleResize = () => {
      // If already revealed, do not re-draw
      if (!isRevealed) {
        initCanvas();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas, isRevealed]);

  // Calculate percentage of transparent pixels
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed || revealPending.current) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      const { width, height } = canvas;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const len = data.length;

      // Sample every 16th pixel for superfast 60fps performance
      const stride = 16;
      let totalSampled = 0;
      let clearedSampled = 0;

      for (let i = 3; i < len; i += 4 * stride) {
        totalSampled++;
        if (data[i] < 64) {
          clearedSampled++;
        }
      }

      const percent = totalSampled > 0 ? (clearedSampled / totalSampled) * 100 : 0;
      onProgress?.(percent);

      // Auto-reveal if threshold (50%) is reached!
      if (percent >= threshold) {
        revealPending.current = true;
        setIsFadingOut(true);
        setTimeout(() => {
          setIsRevealed(true);
          onReveal?.();
        }, 450);
      }
    } catch {
      // Fallback
    }
  }, [isRevealed, onProgress, onReveal, threshold]);

  // Erase stroke
  const eraseStroke = useCallback(
    (fromX: number, fromY: number, toX: number, toY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushRadius * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.restore();
    },
    [brushRadius]
  );

  const erasePoint = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    [brushRadius]
  );

  const getCanvasCoords = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed || disabled) return;
    onActivity?.();

    // Capture pointer so dragging outside canvas still tracks
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    isScratching.current = true;
    const { x, y } = getCanvasCoords(e);
    lastPoint.current = { x, y };
    erasePoint(x, y);

    const now = Date.now();
    if (now - lastCheckTime.current > 200) {
      lastCheckTime.current = now;
      checkScratchPercentage();
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching.current || isRevealed || disabled) return;
    onActivity?.();

    const { x, y } = getCanvasCoords(e);
    if (lastPoint.current) {
      eraseStroke(lastPoint.current.x, lastPoint.current.y, x, y);
    } else {
      erasePoint(x, y);
    }
    lastPoint.current = { x, y };

    // Throttle calculation
    const now = Date.now();
    if (now - lastCheckTime.current > 160) {
      lastCheckTime.current = now;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = requestAnimationFrame(checkScratchPercentage);
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore browsers that release capture automatically.
    }
    if (!isScratching.current) return;
    isScratching.current = false;
    lastPoint.current = null;
    checkScratchPercentage();
  };

  const handlePointerCancel = (e: PointerEvent<HTMLCanvasElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore browsers that release capture automatically.
    }
    isScratching.current = false;
    lastPoint.current = null;
  };

  if (isRevealed) {
    return null;
  }

  return (
    <div
      className={`scratch-canvas-container ${className} ${isFadingOut ? "scratch-fade-out" : ""}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        touchAction: "pan-y",
        pointerEvents: isFadingOut ? "none" : "auto",
        transition: "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isFadingOut ? 0 : 1,
      }}
    >
      <canvas
        ref={canvasRef}
        className="scratch-layer-canvas"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          touchAction: "pan-y",
          cursor: "crosshair",
          borderRadius: "inherit",
          background: "transparent",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={(e) => e.stopPropagation()}
        aria-label="Interactive scratch card: move finger to reveal hidden content"
      />
    </div>
  );
}
