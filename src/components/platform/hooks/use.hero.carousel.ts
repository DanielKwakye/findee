"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/core/ui/carousel";
import { heroCarouselAutoplayOptions } from "@/components/platform/utils/carousel.utils";

/** Manages slide selection and navigation for the hero carousels. */
export function useHeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [plugins] = useState(() => [Autoplay(heroCarouselAutoplayOptions)]);

  /** Subscribes to changes in the carousel's selected slide. */
  const subscribeToSelection = useCallback((notify: () => void) => {
    if (!api) return () => {};

    api.on("select", notify);
    api.on("reInit", notify);
    return () => {
      api.off("select", notify);
      api.off("reInit", notify);
    };
  }, [api]);

  /** Reads the carousel's current slide, including its initial selection. */
  const getSelectedIndex = useCallback(() => api?.selectedScrollSnap() ?? 1, [api]);
  const selectedIndex = useSyncExternalStore(subscribeToSelection, getSelectedIndex, getSelectedIndex);

  /** Moves the carousel to the previous slide. */
  const scrollPrevious = useCallback(() => api?.scrollPrev(), [api]);

  /** Moves the carousel to the next slide. */
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  /** Identifies neighboring slides, including outer positions when needed. */
  const getSlidePosition = useCallback(
    (index: number, count: number, includeOuter = false) => {
      const offset = (index - selectedIndex + count) % count;
      if (offset === 0) return "current";
      if (offset === 1) return "next";
      if (includeOuter && offset === 2) return "afterNext";
      if (includeOuter && offset === count - 2) return "beforePrevious";
      return offset === count - 1 ? "previous" : "other";
    },
    [selectedIndex],
  );

  return {
    setApi,
    plugins,
    selectedIndex,
    canScrollPrevious: api?.canScrollPrev() ?? false,
    canScrollNext: api?.canScrollNext() ?? false,
    scrollPrevious,
    scrollNext,
    getSlidePosition,
  };
}
