"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mail, Sparkles } from "lucide-react";
import BirthdayAudio from "./birthday-audio";
import CinematicOpening from "./cinematic-opening";
import InteractiveTouchEffects from "./interactive-touch-effects";

export default function InvitationShell({ children, decoration }: { children: ReactNode; decoration: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [cinematicActive, setCinematicActive] = useState(false);
  const [audioTrigger, setAudioTrigger] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (opened) {
      window.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [opened]);

  const handleOpenInvitation = () => {
    // Keep playback inside the trusted button gesture for mobile browsers.
    const audio = document.getElementById("birthday-song") as HTMLAudioElement | null;
    if (audio) {
      audio.muted = false;
      audio.volume = 0.05;
      void audio.play().catch(() => undefined);
    }
    setAudioTrigger(true);
    setCinematicActive(true);
  };

  const handleCinematicComplete = () => {
    setCinematicActive(false);
    setOpened(true);
  };

  return (
    <>
      <InteractiveTouchEffects />
      <BirthdayAudio autoPlayTrigger={audioTrigger} />

      {/* Cinematic Opening Sequence */}
      <CinematicOpening isOpen={cinematicActive} onComplete={handleCinematicComplete} />

      {/* Entry Gate with Animated Royal Curtains & Lights */}
      <section
        className={`entry-gate ${opened || cinematicActive ? "entry-gate-open" : ""}`}
        aria-label="Open birthday invitation"
        aria-hidden={opened || cinematicActive}
        inert={opened || cinematicActive}
      >
        <div className="entry-frame" aria-hidden="true" />
        {decoration}
        <div className="entry-content">
          <div className="entry-sparkle" aria-hidden="true">
            <Mail size={28} strokeWidth={1.2} />
            <span>✦</span>
          </div>
          <p className="eyebrow">A little celebration from Nepal</p>
          <p className="entry-kicker" lang="hi">
            आप सादर आमन्त्रित हैं
          </p>
          <h2 className="entry-name">
            Hridyansh <span>Babu</span>
          </h2>
          <p className="entry-date">
            16 September 2026 · <span lang="hi">31 भाद्र 2083</span>
          </p>
          <button className="open-button royal-pulse-btn" type="button" onClick={handleOpenInvitation}>
            <Sparkles size={18} aria-hidden="true" />
            <span>Open Invitation</span>
            <span className="open-hindi" lang="hi">
              आमंत्रण खोलें
            </span>
          </button>
          <p className="tap-note">
            Tap for cinematic celebration · <span lang="hi">स्पर्श करके उत्सव शुरू करें</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main
        ref={mainRef}
        tabIndex={-1}
        id="invitation-content"
        className={`invitation ${opened ? "invitation-visible" : ""}`}
        inert={!opened}
        aria-hidden={!opened}
      >
        {children}
      </main>
    </>
  );
}
