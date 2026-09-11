"use client";

import { useEffect, useState } from "react";

const birthday = new Date("2026-09-16T00:00:00+05:45").getTime();
const labels = ["Days", "Hours", "Minutes", "Seconds"];

export default function Countdown() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    function calculate() {
      return Math.max(0, Math.ceil((birthday - Date.now()) / 1000));
    }
    const timer = window.setTimeout(() => {
      setSeconds(calculate());
    }, 0);

    const interval = window.setInterval(() => {
      const remaining = calculate();
      setSeconds(remaining);
      if (remaining === 0) {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  const values = [Math.floor(seconds / 86400), Math.floor(seconds % 86400 / 3600), Math.floor(seconds % 3600 / 60), seconds % 60];
  return (
    <div className="countdown-grid" role="timer" aria-label="Time until 16 September 2026, midnight in Nepal">
      {values.map((value, index) => (
        <div className="countdown-unit" key={labels[index]}>
          <span className="countdown-number">{String(value).padStart(2, "0")}</span>
          <span className="countdown-label">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
