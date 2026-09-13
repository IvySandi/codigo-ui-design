import type { CSSProperties } from "react";

const risingShapes = [
  { left: "-4%", width: "clamp(90px, 12vw, 170px)", height: "clamp(150px, 22vw, 300px)", color: "#f6a4ad", radius: "72% 48% 66% 52% / 58% 64% 54% 70%", duration: 12.5, delay: -2.2, drift: 42, turn: 14 },
  { left: "11%", width: "clamp(120px, 17vw, 240px)", height: "clamp(100px, 13vw, 180px)", color: "#ffc0a9", radius: "62% 70% 50% 68% / 76% 52% 72% 48%", duration: 15.7, delay: -10.4, drift: -35, turn: -11 },
  { left: "29%", width: "clamp(85px, 10vw, 145px)", height: "clamp(130px, 18vw, 245px)", color: "#f6a4ad", radius: "64% 48% 72% 54% / 56% 68% 50% 72%", duration: 13.8, delay: -6.8, drift: 28, turn: 9 },
  { left: "43%", width: "clamp(140px, 20vw, 290px)", height: "clamp(105px, 14vw, 195px)", color: "#cbd4fa", radius: "70% 52% 64% 48% / 52% 76% 48% 70%", duration: 17.2, delay: -13.1, drift: -48, turn: -15 },
  { left: "58%", width: "clamp(85px, 11vw, 155px)", height: "clamp(145px, 20vw, 270px)", color: "#ffb7aa", radius: "78% 46% 60% 52% / 58% 70% 50% 76%", duration: 14.6, delay: -4.5, drift: 38, turn: 12 },
  { left: "72%", width: "clamp(130px, 18vw, 260px)", height: "clamp(100px, 13vw, 185px)", color: "#f5a5b6", radius: "58% 72% 46% 66% / 68% 52% 72% 48%", duration: 18.4, delay: -15.8, drift: -31, turn: -8 },
  { left: "88%", width: "clamp(95px, 13vw, 185px)", height: "clamp(155px, 21vw, 285px)", color: "#cbd4fa", radius: "66% 44% 73% 51% / 61% 75% 49% 68%", duration: 16.1, delay: -8.7, drift: 44, turn: 16 },
  { left: "21%", width: "clamp(105px, 15vw, 215px)", height: "clamp(85px, 11vw, 160px)", color: "#ffd0bd", radius: "55% 75% 58% 69% / 73% 57% 68% 47%", duration: 19.3, delay: -17.2, drift: -26, turn: -13 },
];

export function SecondSlide({ active }: { active: boolean }) {
  return (
    <section className={`slide slide-two ${active ? "is-active" : ""}`} aria-hidden={!active}>
      <div className="rising-shapes" aria-hidden="true">
        {risingShapes.map((shape, index) => (
          <span
            className="rising-shape"
            key={index}
            style={{
              left: shape.left,
              width: shape.width,
              height: shape.height,
              background: shape.color,
              borderRadius: shape.radius,
              "--shape-duration": `${shape.duration}s`,
              "--shape-delay": `${shape.delay}s`,
              "--shape-drift": `${shape.drift}px`,
              "--shape-turn": `${shape.turn}deg`,
            } as CSSProperties}
          />
        ))}
      </div>
      <h1 className="slide-two-title">Fluffy HÜGS</h1>
    </section>
  );
}
