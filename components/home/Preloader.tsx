import type { CSSProperties } from "react";
import { Character } from "./Character";

type PreloaderProps = {
  leaving: boolean;
};

export function Preloader({ leaving }: PreloaderProps) {
  return (
    <div className={`preloader ${leaving ? "is-leaving" : ""}`} role="status" aria-label="Loading the Fluffy Hugs experience">
      <div className="preloader-figure" aria-hidden="true"><Character eager /></div>
      <p className="loading-word" aria-hidden="true">
        {Array.from("LOADING...").map((letter, index) => (
          <span key={`${letter}-${index}`} style={{ "--letter": index } as CSSProperties}>{letter}</span>
        ))}
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
