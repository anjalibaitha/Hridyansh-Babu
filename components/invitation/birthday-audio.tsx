"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

interface BirthdayAudioProps {
  autoPlayTrigger?: boolean;
}

export default function BirthdayAudio({ autoPlayTrigger }: BirthdayAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const fadeIntervalRef = useRef<number | null>(null);

  // Smooth fade-in helper
  const fadeInVolume = useCallback((audio: HTMLAudioElement, targetVolume = 0.75, duration = 1200) => {
    if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
    audio.volume = 0.05;
    const stepTime = 50;
    const steps = duration / stepTime;
    const stepIncrement = targetVolume / steps;

    fadeIntervalRef.current = window.setInterval(() => {
      if (!audio) return;
      if (audio.volume + stepIncrement >= targetVolume) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
      } else {
        audio.volume = Math.min(targetVolume, audio.volume + stepIncrement);
      }
    }, stepTime);
  }, []);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);
    audio.muted = false;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        fadeInVolume(audio);
      })
      .catch((err) => {
        console.log("Audio play deferred awaiting direct tap:", err?.message);
        setIsPlaying(false);
      });
  }, [fadeInVolume]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, pauseAudio, playAudio]);

  // When autoPlayTrigger turns true (i.e. user taps "Open Invitation" gate), start audio!
  useEffect(() => {
    if (autoPlayTrigger && !hasInteracted) {
      playAudio();
    }
  }, [autoPlayTrigger, hasInteracted, playAudio]);

  // Cleanup on unmount
  useEffect(() => {
    const audioElement = audioRef.current;
    return () => {
      if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        id="birthday-song"
        loop
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src="/birthday-song.m4a" type="audio/mp4" />
        <source src="/birthday-song.wav" type="audio/wav" />
      </audio>

      <div className="audio-controller-wrap" aria-label="Birthday music controls">
        <button
          type="button"
          className={`audio-toggle-btn ${isPlaying ? "playing" : "paused"}`}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause soft birthday music" : "Play soft birthday music"}
          title={isPlaying ? "Pause music" : "Play music"}
        >
          <div className="audio-icon-stack">
            {isPlaying ? (
              <>
                <Volume2 size={18} className="audio-vol-icon" />
                <span className="equalizer-waves" aria-hidden="true">
                  <span className="eq-bar bar-1" />
                  <span className="eq-bar bar-2" />
                  <span className="eq-bar bar-3" />
                </span>
              </>
            ) : (
              <>
                <VolumeX size={18} className="audio-vol-icon" />
                <Play size={12} className="audio-play-badge" />
              </>
            )}
          </div>

          <span className="audio-label">
            <span className="audio-title">Birthday Song</span>
            <span className="audio-status">{isPlaying ? "Playing ♪" : "Tap to Play"}</span>
          </span>
        </button>
      </div>
    </>
  );
}
