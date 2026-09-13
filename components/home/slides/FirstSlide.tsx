import type { CSSProperties } from "react";
import { Consumer } from "../Character";

const crowdSpeeds = [1.0, 1.15, 1.3, 1.45, 1.6, 1.75, 1.9, 2.05, 2.2, 2.35];
const crowdRotations = [-7, 5, -4, 7, -6, 4];
const crowdScales = [1.08, 1.16, 1.04, 1.2, 1.1, 1.14];

const crowd = Array.from({ length: 36 }, (_, index) => {
  const row = Math.floor(index / 6);
  const column = index % 6;

  return {
    x: -20 + column * 24 - (row % 2 ? 12 : 0),
    y: -34 + row * 22 + column * 1.1 + (row >= 4 ? 9 : 0),
    scale: crowdScales[(index * 5 + row) % crowdScales.length],
    rotate: crowdRotations[(index + row * 2) % crowdRotations.length],
    layer: row >= 4 ? 18 + row : row + 1,
    foreground: row >= 4,
    speed: crowdSpeeds[(index * 1 + row) % crowdSpeeds.length],
    bounce: 16 + ((index * 9) % 24),
    sway: (index % 2 ? -1 : 1) * (3 + (index % 4)),
  };
});

function CrowdLayer({ foreground }: { foreground: boolean }) {
  return (
    <div className={`crowd ${foreground ? "crowd-front" : "crowd-back"}`} aria-hidden="true">
      {crowd.map((item, index) => item.foreground === foreground && (
        <div
          className={`crowd-person ${foreground ? "is-foreground" : ""}`}
          key={index}
          style={{
            "--x": `${item.x}vw`,
            "--y": `${item.y}vh`,
            "--scale": item.scale,
            "--rotate": `${item.rotate}deg`,
            "--layer": item.layer,
            "--speed": `${item.speed}s`,
            "--bounce": `${item.bounce}px`,
            "--sway": `${item.sway}px`,
            "--delay": `${-((index * 0.37) % item.speed)}s`,
          } as CSSProperties}
        >
          <Consumer eager={!foreground && index < 4} />
        </div>
      ))}
    </div>
  );
}

export function FirstSlide({ active }: { active: boolean }) {
  return (
    <section className={`slide slide-one ${active ? "is-active" : ""}`} aria-hidden={!active}>
      <CrowdLayer foreground={false} />
    </section>
  );
}

export function FirstSlideForeground({ active }: { active: boolean }) {
  return (
    <div className={`slide-one-foreground ${active ? "is-active" : ""}`} aria-hidden="true">
      <CrowdLayer foreground />
    </div>
  );
}
