"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

/** Manages the hero title's typing animation without React state updates. */
export function useHeroTitle(firstLine: string, secondLine: string) {
  const sourceRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const source = sourceRef.current;
    const target = animatedRef.current;
    if (!source || !target) return;

    const markup = source.innerHTML;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let typed: Typed | undefined;

    /** Applies the user's motion preference to the title animation. */
    const updateAnimation = () => {
      typed?.destroy();
      typed = undefined;
      target.innerHTML = markup;
      if (motionPreference.matches) return;

      target.innerHTML = "";
      typed = new Typed(target, {
        strings: [markup],
        typeSpeed: 65,
        backSpeed: 35,
        startDelay: 400,
        backDelay: 2200,
        loop: true,
        loopCount: 1,
        showCursor: false,
        smartBackspace: false,
      });
    };

    updateAnimation();
    motionPreference.addEventListener("change", updateAnimation);

    return () => {
      motionPreference.removeEventListener("change", updateAnimation);
      typed?.destroy();
      target.innerHTML = markup;
    };
  }, [firstLine, secondLine]);

  return { sourceRef, animatedRef };
}
