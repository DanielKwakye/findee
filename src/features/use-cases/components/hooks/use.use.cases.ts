"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to the use cases layout breakpoint. */
function subscribe(notify: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

/** Reads the number of cards that fit on a use cases page. */
function getPageSize() {
  return window.matchMedia("(min-width: 1024px)").matches ? 9 : 2;
}

/** Provides the mobile layout during server rendering. */
function getServerPageSize() {
  return 2;
}

/** Manages the responsive layout of the use cases carousel. */
export function useUseCases() {
  return useSyncExternalStore(subscribe, getPageSize, getServerPageSize);
}
