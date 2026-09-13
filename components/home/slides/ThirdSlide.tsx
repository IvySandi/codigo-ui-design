import type { CSSProperties } from "react";
import { DriftingShapes } from "../DriftingShapes";

const copyLines = [
  "Lorem Ipsum is simply dummy text of the printing",
  "and typesetting industry. Lorem Ipsum has been the",
  "industry's standard dummy text ever since 1966,",
];

let characterOffset = 0;
const typedLines = copyLines.map((text) => {
  const start = characterOffset;
  characterOffset += text.length + 5;
  return { start, text };
});

export function ThirdSlide({ active }: { active: boolean }) {
  return (
    <section className={`slide slide-three ${active ? "is-active" : ""}`} aria-hidden={!active}>
      <DriftingShapes active={active} />
      <div className="editorial-copy copy-three">
        {typedLines.map(({ start, text }, lineIndex) => (
          <p
            className="type-line"
            key={text}
            aria-label={text}
            style={{ "--line": lineIndex } as CSSProperties}
          >
            {Array.from(text).map((character, characterIndex) => (
              <span
                aria-hidden="true"
                className="type-character"
                key={`${characterIndex}-${character}`}
                style={{
                  "--type-delay": `${0.22 + (start + characterIndex) * 0.021}s`,
                  "--float-delay": `${-((characterIndex % 7) * 0.11)}s`,
                } as CSSProperties}
              >
                {character === " " ? "\u00a0" : character}
              </span>
            ))}
          </p>
        ))}
      </div>
      <div className="soft-corner" aria-hidden="true" />
    </section>
  );
}
