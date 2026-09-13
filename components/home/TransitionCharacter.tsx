import { Character } from "./Character";
import { ThreeWalkCharacter } from "./ThreeWalkCharacter";

export function TransitionCharacter({ activeSlide }: { activeSlide: number }) {
  const position = activeSlide === 0
    ? "is-home"
    : activeSlide === 1
      ? "is-horizontal"
      : "is-walking";
  const motion = activeSlide === 0 ? "idle" : activeSlide === 1 ? "float" : "walk";

  return (
    <div
      className={`transition-character ${position}`}
      aria-hidden="true"
    >
      {activeSlide === 0 ? (
        <div className="transition-character-motion">
          <Character eager />
        </div>
      ) : (
        <ThreeWalkCharacter active motion={motion} className="transition-character-motion" />
      )}
    </div>
  );
}
