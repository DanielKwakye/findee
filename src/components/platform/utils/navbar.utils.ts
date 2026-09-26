/** Subscribes to page scrolling and returns a way to stop listening. */
export function subscribeToScroll(onScroll: () => void) {
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

/** Reports whether the page has scrolled past the navbar's top state. */
export function getScrollState() {
  return window.scrollY > 8;
}

/** Provides the initial scroll state while rendering on the server. */
export function getServerScrollState() {
  return false;
}
