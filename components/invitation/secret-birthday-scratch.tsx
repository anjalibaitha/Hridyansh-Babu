"use client";

import { useState } from "react";
import { Heart, Crown, RotateCcw, PartyPopper } from "lucide-react";
import ScratchCanvas from "./scratch-canvas";

export default function SecretBirthdayScratch() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [key, setKey] = useState(0); // To allow resetting

  const handleReveal = () => {
    setIsRevealed(true);
    setScratchProgress(100);
  };

  const handleReset = () => {
    setIsRevealed(false);
    setScratchProgress(0);
    setKey((prev) => prev + 1);
  };

  return (
    <section className="secret-scratch-section" id="secret-wish" aria-labelledby="secret-wish-title">
      <div className="section-inner scratch-section-inner">
        <div className="scratch-header">
          <p className="section-label">गोप्य शुभकामना · Interactive Surprise</p>
          <h2 className="section-title" id="secret-wish-title">
            Scratch to Reveal the Birthday Blessing
            <span lang="ne"> · कार्ड कोरेर शुभकामना हेर्नुहोस्</span>
          </h2>
          <p className="scratch-instructions">
            Touch and scratch the golden cover below with your finger. Once you scratch over 50%, the secret blessing will fully reveal!
          </p>
        </div>

        <div className="scratch-card-wrapper">
          <div className="scratch-card-frame">
            {/* Corner flourishes */}
            <div className="card-corner corner-tl" aria-hidden="true">✦</div>
            <div className="card-corner corner-tr" aria-hidden="true">✦</div>
            <div className="card-corner corner-bl" aria-hidden="true">✦</div>
            <div className="card-corner corner-br" aria-hidden="true">✦</div>

            {/* Hidden Birthday Content underneath */}
            <div className="secret-message-underneath" aria-live="polite">
              <div className="secret-badge">
                <Crown size={28} className="crown-icon" />
                <span className="badge-text">FIRST BIRTHDAY BLESSING</span>
              </div>

              <h3 className="secret-baby-name">
                Hridyansh <span>Babu</span>
              </h3>

              <div className="secret-stars">
                <span>✦</span>
                <Heart size={16} fill="currentColor" />
                <span>✦</span>
              </div>

              <p className="secret-quote-nepali" lang="ne">
                हाम्रो सानो राजकुमार हृद्यांशलाई पहिलो जन्मदिनको असिम माया र शुभकामना!
                तिम्रो जीवन सधैं सुख, सुस्वास्थ्य, सफलता र न्यानो मुस्कानले भरिपूर्ण रहोस्।
              </p>

              <p className="secret-quote-english">
                May every tiny step you take lead to giant wonders. May your laughter always brighten our world, and may you be blessed with a lifetime of love and good health.
              </p>

              <div className="secret-sanskrit-box">
                <p className="secret-sanskrit" lang="sa">
                  ॐ जीवेम शरदः शतम् ।
                </p>
                <span className="secret-sanskrit-sub">
                  May you live a hundred joyful years! · सय वर्ष स्वस्थ र सुखी जीवन रहोस्।
                </span>
              </div>

              <div className="secret-family-sign">
                <span>With all our love & warm hugs,</span>
                <strong>Mummy, Papa & Entire Family ❤️</strong>
              </div>

              {isRevealed && (
                <div className="revealed-banner" aria-hidden="true">
                  <PartyPopper size={18} />
                  <span>Blessing Revealed! · शुभकामना प्रकट भयो!</span>
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
                coverTitle="SCRATCH FOR A SURPRISE"
                coverSubtitle="यहाँ औंलाले कोर्नुहोस्"
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
                <strong>{scratchProgress}% {scratchProgress >= 50 ? "(Auto-Revealed!)" : "(50% to auto-reveal)"}</strong>
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
                <span>Scratch Again · फेरि कोर्नुहोस्</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
