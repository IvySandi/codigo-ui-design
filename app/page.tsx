"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CollectionBlob } from "@/components/home/CollectionBlob";
import { Preloader } from "@/components/home/Preloader";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SocialDock } from "@/components/home/SocialDock";
import { TransitionCharacter } from "@/components/home/TransitionCharacter";
import { FirstSlide, FirstSlideForeground } from "@/components/home/slides/FirstSlide";
import { SecondSlide } from "@/components/home/slides/SecondSlide";
import { ThirdSlide } from "@/components/home/slides/ThirdSlide";

const TOTAL_SLIDES = 3;

export default function Home() {
  const experienceRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const gestureLockRef = useRef(false);
  const gestureTimerRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const [preloaderVisible, setPreloaderVisible] = useState(true);

  const goToSlide = useCallback((index: number, behaviorOverride?: ScrollBehavior) => {
    const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
    const top = experienceRef.current?.offsetTop ?? 0;
    activeRef.current = next;
    setActiveSlide(next);
    window.scrollTo({
      top: top + next * window.innerHeight,
      behavior: behaviorOverride ?? (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"),
    });
  }, []);

  const stepSlide = useCallback((direction: -1 | 1) => {
    if (gestureLockRef.current) return;

    const next = (activeRef.current + direction + TOTAL_SLIDES) % TOTAL_SLIDES;

    gestureLockRef.current = true;
    const wrapsAround = Math.abs(next - activeRef.current) > 1;
    goToSlide(next, wrapsAround ? "auto" : undefined);
    gestureTimerRef.current = window.setTimeout(() => {
      gestureLockRef.current = false;
    }, 950);
  }, [goToSlide]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const readyTimer = window.setTimeout(() => setReady(true), 1250);
    const removeTimer = window.setTimeout(() => setPreloaderVisible(false), 1850);

    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        stepSlide(1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        stepSlide(-1);
      }
      if (event.key === "Home") goToSlide(0);
      if (event.key === "End") goToSlide(TOTAL_SLIDES - 1);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (gestureLockRef.current) {
        wheelDeltaRef.current = 0;
        return;
      }

      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        wheelDeltaRef.current = 0;
        return;
      }

      const deltaMultiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1;

      wheelDeltaRef.current += event.deltaY * deltaMultiplier;

      if (wheelResetTimerRef.current !== null) {
        window.clearTimeout(wheelResetTimerRef.current);
      }
      wheelResetTimerRef.current = window.setTimeout(() => {
        const committedDelta = wheelDeltaRef.current;
        wheelDeltaRef.current = 0;
        if (Math.abs(committedDelta) < 120) return;

        const direction = committedDelta > 0 ? 1 : -1;
        stepSlide(direction);
      }, 180);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.touches[0];
      if (!start || !touch) return;

      const distanceX = touch.clientX - start.x;
      const distanceY = touch.clientY - start.y;
      if (Math.abs(distanceY) > Math.abs(distanceX)) event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.changedTouches[0];
      touchStartRef.current = null;
      if (!start || !touch) return;

      const distanceX = touch.clientX - start.x;
      const distanceY = touch.clientY - start.y;
      const swipeThreshold = Math.min(110, Math.max(64, window.innerHeight * 0.1));
      if (Math.abs(distanceY) < swipeThreshold || Math.abs(distanceY) < Math.abs(distanceX)) return;
      stepSlide(distanceY < 0 ? 1 : -1);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      if (gestureTimerRef.current !== null) window.clearTimeout(gestureTimerRef.current);
      if (wheelResetTimerRef.current !== null) window.clearTimeout(wheelResetTimerRef.current);
    };
  }, [goToSlide, stepSlide]);

  return (
    <main className={`site-shell ${ready ? "is-ready" : ""}`}>
      {preloaderVisible && <Preloader leaving={ready} />}

      <SiteHeader activeSlide={activeSlide} onSelectSlide={goToSlide} />

      <section ref={experienceRef} className="experience" aria-label="Fluffy Hugs story">
        <div className="stage">
          <FirstSlide active={activeSlide === 0} />
          <SecondSlide active={activeSlide === 1} />
          <ThirdSlide active={activeSlide === 2} />
          <TransitionCharacter activeSlide={activeSlide} />
          <FirstSlideForeground active={activeSlide === 0} />
          <SocialDock />
          <CollectionBlob />
        </div>

        {Array.from({ length: TOTAL_SLIDES }, (_, index) => (
          <div className="scroll-stop" key={index} aria-hidden="true" />
        ))}
      </section>
    </main>
  );
}
