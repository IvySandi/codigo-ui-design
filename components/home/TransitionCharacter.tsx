import { Character } from "./Character";

export function TransitionCharacter({ activeSlide }: { activeSlide: number }) {
  const position = activeSlide === 0
    ? "is-home"
    : activeSlide === 1
      ? "is-horizontal"
      : "is-walking";

  return (
    <div
      className={`transition-character ${position}`}
      aria-hidden="true"
    >
      <div className="transition-character-motion">
        <Character eager={activeSlide < 2} />
      </div>
    </div>
  );
}
