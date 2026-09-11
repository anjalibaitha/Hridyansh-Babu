import type { CSSProperties } from "react";

const starPositions = [
  { left: 7, top: 13, size: 4, delay: 0.2 },
  { left: 18, top: 30, size: 3, delay: 1.4 },
  { left: 31, top: 9, size: 3, delay: 0.8 },
  { left: 43, top: 21, size: 5, delay: 2.2 },
  { left: 57, top: 12, size: 3, delay: 1.1 },
  { left: 69, top: 27, size: 4, delay: 0.4 },
  { left: 82, top: 10, size: 3, delay: 1.8 },
  { left: 92, top: 35, size: 4, delay: 0.7 },
  { left: 11, top: 67, size: 3, delay: 2.7 },
  { left: 25, top: 84, size: 4, delay: 0.9 },
  { left: 76, top: 73, size: 3, delay: 2.5 },
  { left: 90, top: 85, size: 4, delay: 1.6 },
];

export default function SkyDecor() {
  return (
    <div className="sky-decor" aria-hidden="true">
      <div className="moon-glow" />
      {starPositions.map((star) => (
        <span
          className="tiny-star"
          key={`${star.left}-${star.top}`}
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      <span className="shooting-star shooting-star-one" />
      <span className="shooting-star shooting-star-two" />
      <span className="confetti confetti-one" />
      <span className="confetti confetti-two" />
      <span className="confetti confetti-three" />
      <span className="confetti confetti-four" />
      <span className="cloud cloud-one" />
      <span className="cloud cloud-two" />
      <span className="balloon balloon-blue balloon-one" />
      <span className="balloon balloon-yellow balloon-two" />
      <span className="balloon balloon-blue balloon-three" />
    </div>
  );
}
