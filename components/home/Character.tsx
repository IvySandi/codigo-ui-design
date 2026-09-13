import Image from "next/image";

type CharacterProps = {
  className?: string;
  eager?: boolean;
};

export function Character({ className = "", eager = false }: CharacterProps) {
  return (
    <Image
      src="/assets/transhumans/Chillin.svg"
      alt=""
      width={1080}
      height={1080}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      draggable={false}
      className={className}
    />
  );
}

export function Consumer({ eager = false }: Pick<CharacterProps, "eager">) {
  return (
    <Image
      src="/assets/transhumans/Consumer.svg"
      alt=""
      width={1080}
      height={1080}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      draggable={false}
      sizes="(max-width: 600px) 58vw, (max-width: 900px) 42vw, 29vw"
    />
  );
}
