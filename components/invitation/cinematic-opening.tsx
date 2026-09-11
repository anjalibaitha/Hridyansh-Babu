"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Crown, ChevronRight } from "lucide-react";

interface CinematicOpeningProps {
  isOpen: boolean;
  onComplete: () => void;
}

const sampleBabyPhotos = [
  {
    src: "/WhatsApp%20Image%202026-09-10%20at%2022.51.13%20(1).jpeg",
    caption: "Our Prince Turns One",
    hindi: "पहला जन्मदिन",
  },
  {
    src: "/WhatsApp%20Image%202026-09-10%20at%2014.48.56%20(1).jpeg",
    caption: "Tiny Steps, Endless Joy",
    hindi: "प्यारी मुस्कान",
  },
  {
    src: "/WhatsApp%20Image%202026-09-10%20at%2014.49.00%20(1).jpeg",
    caption: "Pure Love & Blessings",
    hindi: "अनंत आशीर्वाद",
  },
];

export default function CinematicOpening({ isOpen, onComplete }: CinematicOpeningProps) {
  const [phase, setPhase] = useState<"closed" | "opening" | "celebrating" | "fading">("closed");
  const [candleLit, setCandleLit] = useState(true);
  const [candlePuff, setCandlePuff] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<number[]>([]);
  const confettiCleanupRef = useRef<(() => void) | null>(null);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(window.clearTimeout);
    timerRef.current = [];
  }, []);

  // Fire celebratory canvas confetti crackers
  const triggerConfetti = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    confettiCleanupRef.current?.();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#fde047", "#60a5fa", "#f472b6", "#fb923c", "#34d399", "#a78bfa", "#ffffff"];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      tilt: number;
      tiltSpeed: number;
      alpha: number;
      decay: number;
    }> = [];

    // Left cannon
    for (let i = 0; i < 65; i++) {
      particles.push({
        x: 0,
        y: window.innerHeight * 0.75,
        vx: (Math.random() * 12 + 6) * Math.cos((-Math.random() * 45 - 20) * (Math.PI / 180)),
        vy: (Math.random() * 14 + 8) * Math.sin((-Math.random() * 45 - 20) * (Math.PI / 180)),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 9 + 4,
        tilt: Math.random() * 10,
        tiltSpeed: Math.random() * 0.15 + 0.05,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
      });
    }

    // Right cannon
    for (let i = 0; i < 65; i++) {
      particles.push({
        x: window.innerWidth,
        y: window.innerHeight * 0.75,
        vx: -(Math.random() * 12 + 6) * Math.cos((-Math.random() * 45 - 20) * (Math.PI / 180)),
        vy: (Math.random() * 14 + 8) * Math.sin((-Math.random() * 45 - 20) * (Math.PI / 180)),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 9 + 4,
        tilt: Math.random() * 10,
        tiltSpeed: Math.random() * 0.15 + 0.05,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;

      particles.forEach((p) => {
        if (p.alpha <= 0.02) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.32; // gravity
        p.vx *= 0.985;
        p.alpha = Math.max(0, p.alpha - p.decay);
        p.tilt += p.tiltSpeed;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);
    const cleanup = () => cancelAnimationFrame(animationId);
    confettiCleanupRef.current = cleanup;
    return cleanup;
  }, []);

  // When isOpen triggers, orchestrate the cinematic sequence
  useEffect(() => {
    if (!isOpen) return;

    let revealFrame = 0;
    const openingFrame = window.requestAnimationFrame(() => {
      setPhase("closed");
      setCandleLit(true);
      setCandlePuff(false);
      revealFrame = window.requestAnimationFrame(() => setPhase("opening"));
    });

    const t1 = window.setTimeout(() => {
      setPhase("celebrating");
      triggerConfetti();
    }, 1050);

    const t2 = window.setTimeout(() => {
      triggerConfetti();
    }, 2200);

    const t3 = window.setTimeout(() => {
      setPhase("fading");
    }, 4700);

    const t4 = window.setTimeout(() => {
      onComplete();
    }, 5250);

    timerRef.current.push(t1, t2, t3, t4);

    return () => {
      window.cancelAnimationFrame(openingFrame);
      if (revealFrame) window.cancelAnimationFrame(revealFrame);
      clearTimers();
      confettiCleanupRef.current?.();
      confettiCleanupRef.current = null;
    };
  }, [isOpen, clearTimers, onComplete, triggerConfetti]);

  const handleBlowCandle = () => {
    if (!candleLit) return;
    setCandleLit(false);
    setCandlePuff(true);
    triggerConfetti();
    setTimeout(() => setCandlePuff(false), 1200);
  };

  const handleSkip = () => {
    clearTimers();
    confettiCleanupRef.current?.();
    setPhase("fading");
    setTimeout(onComplete, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`cinematic-overlay cinematic-${phase} ${phase === "fading" ? "cinematic-fade-out" : ""}`}
      aria-label="Cinematic birthday opening celebration"
      role="dialog"
      aria-modal="true"
    >
      {/* Canvas for dynamic confetti fireworks */}
      <canvas ref={confettiCanvasRef} className="cinematic-confetti-canvas" />

      {/* Royal Curtains (Left & Right) */}
      <div className="curtain curtain-left curtain-part-left">
        <div className="curtain-folds" />
        <div className="curtain-tassel left-tassel" />
        <div className="curtain-gold-trim" />
      </div>
      <div className="curtain curtain-right curtain-part-right">
        <div className="curtain-folds" />
        <div className="curtain-tassel right-tassel" />
        <div className="curtain-gold-trim" />
      </div>

      {/* Central Radiance: Golden Light Sunburst */}
      <div className="golden-sunburst-beam" aria-hidden="true" />
      <div className="golden-light-halo" aria-hidden="true" />

      {/* Floating Balloons & Petals Layer */}
      <div className="floating-celebration-props" aria-hidden="true">
        <div className="cinematic-balloon balloon-gold-1">🎈</div>
        <div className="cinematic-balloon balloon-blue-1">🎈</div>
        <div className="cinematic-balloon balloon-yellow-1">🎈</div>
        <div className="cinematic-balloon balloon-blue-2">🎈</div>
        <div className="cinematic-petal petal-1">🌸</div>
        <div className="cinematic-petal petal-2">🌼</div>
        <div className="cinematic-petal petal-3">🌸</div>
        <div className="cinematic-petal petal-4">🌼</div>
        <div className="cinematic-sparkle-star star-c1">✦</div>
        <div className="cinematic-sparkle-star star-c2">✨</div>
        <div className="cinematic-sparkle-star star-c3">✦</div>
      </div>

      {/* Center Cinematic Showcase */}
      <div className="cinematic-stage-content">
        {/* Top Celebration Kicker */}
        <div className="cinematic-kicker-wrap animate-rise">
          <Crown size={24} className="kicker-crown" />
          <span className="cinematic-kicker-tag">HAPPY 1ST BIRTHDAY</span>
          <Crown size={24} className="kicker-crown" />
        </div>

        <h1 className="cinematic-prince-title animate-rise delay-1">
          Hridyansh <span>Babu</span>
        </h1>
        <p className="cinematic-invitation-line animate-rise delay-2" lang="en">
          Please join us to celebrate Hridyansh Babu’s first birthday.
        </p>

        {/* The 3-Tier Birthday Cake with Candle */}
        <div
          className="cinematic-cake-wrap animate-scale-up"
          onClick={handleBlowCandle}
          title={candleLit ? "Tap to blow out candle!" : "Candle blown!"}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleBlowCandle();
          }}
          aria-label={candleLit ? "Birthday cake with lit candle. Tap to blow out." : "Birthday cake with blown candle."}
        >
          {/* Candle on top tier */}
          <div className="cake-candle-holder">
            <div className="cake-candle-stick">
              <span className="candle-stripe" />
            </div>
            {candleLit ? (
              <div className="candle-flame">
                <span className="flame-core" />
                <span className="flame-glow" />
              </div>
            ) : (
              <div className="candle-smoke">
                <span className="smoke-drift" />
              </div>
            )}
            {candlePuff && (
              <div className="candle-puff-sparkles" aria-hidden="true">
                <span>✨</span>
                <span>✦</span>
                <span>⭐</span>
              </div>
            )}
          </div>

          {/* 3-Tier Illustrated Cake Body */}
          <div className="cake-tier tier-top">
            <div className="tier-frosting" />
            <div className="tier-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="cake-tier tier-mid">
            <div className="tier-frosting" />
            <div className="tier-ribbon">
              <span>★ 1 YEAR OF LOVE ★</span>
            </div>
          </div>
          <div className="cake-tier tier-bottom">
            <div className="tier-frosting" />
            <div className="tier-decorations">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>
          <div className="cake-platter" />

          <p className="cake-tap-prompt">
            {candleLit ? "Tap cake candle to make a wish! 🎂" : "Wish granted! ✨"}
          </p>
        </div>

        {/* Baby Photo Cards Float-in Montage */}
        <div className="cinematic-photos-montage animate-float-cards">
          {sampleBabyPhotos.map((photo, i) => (
            <div key={photo.src} className={`montage-card montage-card-${i + 1}`}>
              <div className="montage-photo-inner">
                <Image
                  src={photo.src}
                  alt={`Hridyansh Babu memory ${i + 1}`}
                  width={140}
                  height={175}
                  className="montage-img"
                  priority
                />
              </div>
              <span className="montage-caption">
                {photo.caption}
                <small lang="hi">{photo.hindi}</small>
              </span>
            </div>
          ))}
        </div>

        {/* Skip / Enter button */}
        <button
          type="button"
          className="cinematic-enter-btn"
          onClick={handleSkip}
          aria-label="Enter invitation"
        >
          <span>Enter Invitation</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
