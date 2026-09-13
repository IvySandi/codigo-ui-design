import { useState } from "react";
import type { CSSProperties } from "react";

type DriftingShape = {
  type: "circle" | "uneven";
  top: string;
  size: string;
  height?: string;
  color: string;
  duration: number;
  delay: number;
  driftY: number;
  turn: number;
  floatDuration?: number;
};

const driftingShapes: DriftingShape[] = [
  { type: "circle", top: "9%", size: "clamp(74px, 9vw, 128px)", color: "linear-gradient(145deg, #ffd7bf, #f6a4ad)", duration: 18, delay: -2, driftY: 44, turn: 26 },
  { type: "uneven", top: "21%", size: "clamp(115px, 15vw, 220px)", height: "clamp(72px, 9vw, 132px)", color: "linear-gradient(150deg, #c7eeff, #cbd4fa 58%, #e2d0ff)", duration: 24, delay: -15, driftY: -68, turn: -34, floatDuration: 6.8 },
  { type: "circle", top: "42%", size: "clamp(90px, 11vw, 156px)", color: "linear-gradient(135deg, #fbd8a6, #ffb2ae)", duration: 21, delay: -12, driftY: -36, turn: -22 },
  { type: "uneven", top: "66%", size: "clamp(130px, 18vw, 260px)", height: "clamp(82px, 11vw, 158px)", color: "linear-gradient(150deg, #ffcfbd, #f4a4b7)", duration: 27, delay: -5, driftY: 52, turn: 38, floatDuration: 8.2 },
  { type: "circle", top: "75%", size: "clamp(64px, 8vw, 112px)", color: "linear-gradient(145deg, #dce8ff, #c7cdf9)", duration: 17, delay: -10, driftY: -24, turn: 18 },
  { type: "uneven", top: "4%", size: "clamp(100px, 13vw, 190px)", height: "clamp(135px, 17vw, 245px)", color: "linear-gradient(145deg, #ffd8c8, #ffafbd)", duration: 22, delay: -8, driftY: 76, turn: -29, floatDuration: 7.4 },
  { type: "circle", top: "29%", size: "clamp(58px, 7vw, 102px)", color: "linear-gradient(145deg, #bfefff, #d7d1ff)", duration: 19, delay: -17, driftY: 30, turn: 20 },
  { type: "uneven", top: "52%", size: "clamp(90px, 12vw, 176px)", height: "clamp(60px, 7vw, 108px)", color: "linear-gradient(145deg, #ffe4bc, #ffb7aa)", duration: 25, delay: -20, driftY: -55, turn: 32, floatDuration: 7.8 },
];

export function DriftingShapes({ active }: { active: boolean }) {
  const [wobblingShape, setWobblingShape] = useState<number | null>(null);

  return (
    <div className={`drifting-shapes ${active ? "is-moving" : ""}`} aria-hidden="true">
      {driftingShapes.map((shape, index) => (
        <span
          className="drifting-shape-track"
          key={`${shape.type}-${index}`}
          style={{
            top: shape.top,
            width: shape.size,
            height: shape.height ?? shape.size,
            "--drift-duration": `${shape.duration}s`,
            "--drift-delay": `${shape.delay}s`,
            "--drift-y": `${shape.driftY}px`,
            "--drift-turn": `${shape.turn}deg`,
          } as CSSProperties}
        >
          <span
            className={`drifting-shape drifting-shape--${shape.type}${wobblingShape === index ? " is-click-wobbling" : ""}`}
            onClick={shape.type === "circle" ? () => setWobblingShape(index) : undefined}
            onAnimationEnd={shape.type === "circle" ? (event) => {
              if (event.animationName === "circle-wobble") {
                setWobblingShape((current) => current === index ? null : current);
              }
            } : undefined}
            style={{
              background: shape.color,
              "--float-duration": `${shape.floatDuration ?? 7}s`,
              "--float-delay": `${shape.delay * 0.13}s`,
            } as CSSProperties}
          />
        </span>
      ))}
    </div>
  );
}
