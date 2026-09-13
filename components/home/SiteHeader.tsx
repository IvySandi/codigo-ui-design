type SiteHeaderProps = {
  activeSlide: number;
  onSelectSlide: (index: number) => void;
};

export function SiteHeader({ activeSlide, onSelectSlide }: SiteHeaderProps) {
  return (
    <header className={`site-header ${activeSlide === 1 ? "is-title-slide" : ""}`}>
      <button className="wordmark">
        Fluffy HÜGS
      </button>
    </header>
  );
}
