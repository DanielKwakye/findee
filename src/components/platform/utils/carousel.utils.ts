export const heroCarouselOptions = {
  align: "center",
  containScroll: "keepSnaps",
  loop: true,
  startIndex: 1,
} as const;

export const webHeroCarouselOptions = {
  ...heroCarouselOptions,
  watchDrag: false,
} as const;

export const heroCarouselAutoplayOptions = {
  delay: 5000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
  /** Uses the carousel wrapper for hover and focus interactions. */
  rootNode: (emblaRoot: HTMLElement) => emblaRoot.parentElement,
} as const;
