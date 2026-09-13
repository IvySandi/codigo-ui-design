import type { CSSProperties } from "react";
import { ThreeWalkCharacter } from "./ThreeWalkCharacter";

type PreloaderProps = {
  leaving: boolean;
};

export function Preloader({ leaving }: PreloaderProps) {
  return (
    <div className={`preloader ${leaving ? "is-leaving" : ""}`} role="status" aria-label="Loading the Fluffy Hugs experience">
      <ThreeWalkCharacter active={!leaving} className="preloader-figure" />
      <p className="loading-word" aria-hidden="true">
        {Array.from("LOADING...").map((letter, index) => (
          <span key={`${letter}-${index}`} style={{ "--letter": index } as CSSProperties}>{letter}</span>
        ))}
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
