import Image from "next/image";

const socialItems = [
  ["Discord", "/assets/social/discord.svg"],
  ["OpenSea", "/assets/social/opensea.svg"],
  ["Twitter", "/assets/social/twitter.svg"],
] as const;

export function SocialDock() {
  return (
    <nav className="social-dock" aria-label="Social links">
      {socialItems.map(([label, src]) => (
        <button key={label} type="button" aria-label={label}>
          <Image src={src} alt="" width={42} height={42} unoptimized />
        </button>
      ))}
    </nav>
  );
}
