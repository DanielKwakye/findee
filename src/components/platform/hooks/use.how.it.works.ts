"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Manages the How It Works section's URL anchor behavior. */
export function useHowItWorks() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let hasBeenVisible = false;

    /** Clears the section anchor after the section leaves the viewport. */
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        hasBeenVisible = true;
      } else if (hasBeenVisible && window.location.hash === "#how-it-works") {
        router.replace(window.location.pathname + window.location.search, { scroll: false });
      }
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, [router]);

  return sectionRef;
}
