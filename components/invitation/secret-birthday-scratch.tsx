"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Crown, RotateCcw, PartyPopper } from "lucide-react";
import ScratchCanvas from "./scratch-canvas";

export default function SecretBirthdayScratch() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [key, setKey] = useState(0);
  const [candleLit, setCandleLit] = useState(true);
  const [wishPopped, setWishPopped] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    setScratchProgress(100);
  };

  const handleReset = () => {
    setIsRevealed(false);
    setScratchProgress(0);
    setCandleLit(true);
    setWishPopped(false);
    setKey((prev) => prev + 1);
  };

  const handleBlowCandle = () => {
    if (!candleLit) return;
    setCandleLit(false);
    setWishPopped(true);
    setTimeout(() => setWishPopped(false), 2000);
  };

  return (
    <section className="secret-scratch-section" id="secret-wish" aria-labelledby="secret-wish-title">
      <div className="section-inner scratch-section-inner">
        <div className="scratch-header">
          <p className="section-label">गुप्त शुभकामना · Cinematic Interactive Scratch Card</p>
          <h2 className="section-title" id="secret-wish-title">
            Scratch to Reveal the Birthday Surprise
            <span lang="hi"> · कार्ड पर उंगली चलाकर शुभकामना और केक देखें</span>
          </h2>
          <p className="scratch-instructions">
            Touch and scratch the shimmering golden foil with your finger to reveal Hridyansh Babu’s photo, birthday cake, and heartfelt blessings. Auto-reveals at 50%!
          </p>
        </div>

        <div className="scratch-card-wrapper">
          <div className="scratch-card-frame">
            {/* Corner golden flourishes */}
            <div className="card-corner corner-tl" aria-hidden="true">✦</div>
            <div className="card-corner corner-tr" aria-hidden="true">✦</div>
            <div className="card-corner corner-bl" aria-hidden="true">✦</div>
            <div className="card-corner corner-br" aria-hidden="true">✦</div>

            {/* Hidden Birthday Surprise (Cake + Baby Photo + Sacred Blessing) */}
            <div className={`secret-message-underneath ${isRevealed ? "revealed-glow" : ""}`} aria-live="polite">
              <div className="secret-badge">
                <Crown size={22} className="crown-icon" />
                <span className="badge-text">FIRST BIRTHDAY SURPRISE</span>
              </div>

              {/* Baby Photo & Birthday Cake Showcase */}
              <div className="secret-visual-duo">
                {/* Baby Photo in Royal Gold Frame */}
                <div className="secret-photo-pod">
                  <div className="secret-photo-ring" />
                  <Image
                    src="/WhatsApp%20Image%202026-09-10%20at%2022.51.13%20(1).jpeg"
                    alt="Hridyansh Babu smiling in his first year"
                    width={130}
                    height={165}
                    className="secret-baby-img"
                    priority
                  />
                  <span className="secret-photo-tag">Prince Hridyansh</span>
                </div>

                {/* Animated Birthday Cake with Candle */}
                <div
                  className="secret-cake-pod"
                  onClick={handleBlowCandle}
                  role="button"
                  tabIndex={0}
                  title={candleLit ? "Tap candle to blow out!" : "Candle blown!"}
                  aria-label={candleLit ? "Birthday cake with lit candle. Tap to make a wish!" : "Birthday cake wish granted"}
                >
                  <div className="mini-cake-candle">
                    {candleLit ? (
                      <div className="mini-candle-flame">
                        <span className="flame-flicker" />
                      </div>
                    ) : (
                      <div className="mini-candle-smoke">
                        <span>~</span>
                      </div>
                    )}
                    <div className="mini-candle-stick" />
                  </div>

                  <div className="mini-cake-tier tier-1">
                    <span className="frosting-drop" />
                  </div>
                  <div className="mini-cake-tier tier-2">
                    <span className="mini-cake-star">★ 1 ★</span>
                  </div>
                  <div className="mini-cake-tier tier-3">
                    <span className="mini-cake-scallops" />
                  </div>
                  <div className="mini-cake-base" />

                  <span className="mini-cake-caption">
                    {candleLit ? "Tap to blow candle! 🎂" : "Wish Made! ✨"}
                  </span>
                  {wishPopped && (
                    <div className="wish-sparkles-burst" aria-hidden="true">
                      <span>✨</span>
                      <span>⭐</span>
                      <span>✦</span>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="secret-baby-name">
                Hridyansh <span>Babu</span>
              </h3>

              <div className="secret-stars">
                <span>✦</span>
                <Heart size={16} fill="currentColor" />
                <span>✦</span>
              </div>

              <p className="secret-quote-english">
                May your first year be the beginning of a life filled with giggles, health, bright sunshine, and boundless wonder. Happy 1st Birthday!
              </p>

              <div className="secret-sanskrit-box">
                <p className="secret-sanskrit" lang="sa">
                  ॐ जीवेम शरदः शतम्।
                </p>
                <span className="secret-sanskrit-sub">
                  May you live a hundred joyful years! · सौ वर्ष स्वस्थ और सुखी जीवन जिएँ।
                </span>
              </div>

              <div className="secret-family-sign">
                <span>With all our love & warm hugs,</span>
                <strong>Mummy, Papa & Entire Family ❤️</strong>
              </div>

              {isRevealed && (
                <div className="revealed-banner" aria-hidden="true">
                  <PartyPopper size={18} />
                  <span>Blessing & Cake Revealed! · शुभकामना प्रकट हुई!</span>
                  <PartyPopper size={18} />
                </div>
              )}
            </div>

            {/* Scratch canvas layer on top */}
            {!isRevealed && (
              <ScratchCanvas
                key={key}
                brushRadius={32}
                threshold={50}
                coverTitle="SCRATCH FOR CAKE & WISH"
                coverSubtitle="उंगली से कार्ड पर रगड़ें"
                onReveal={handleReveal}
                onProgress={(p) => setScratchProgress(Math.min(100, Math.round(p)))}
              />
            )}
          </div>

          {/* Controls & Progress bar below card */}
          <div className="scratch-controls">
            <div className="scratch-meter">
              <div className="meter-label">
                <span>Scratch Progress:</span>
                <strong>
                  {scratchProgress}% {scratchProgress >= 50 ? "(Cinematic Reveal!)" : "(50% to auto-reveal)"}
                </strong>
              </div>
              <div className="meter-bar-track">
                <div
                  className="meter-bar-fill"
                  style={{ width: `${Math.min(100, scratchProgress)}%` }}
                />
              </div>
            </div>

            {isRevealed && (
              <button
                type="button"
                className="scratch-replay-btn"
                onClick={handleReset}
                aria-label="Scratch card again"
              >
                <RotateCcw size={15} />
                <span>Scratch Again · फिर से कोरें</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
