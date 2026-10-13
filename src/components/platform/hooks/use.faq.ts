"use client";

import { useIsMobile } from "@/components/core/hooks/use-mobile";
import { faqItems } from "@/components/platform/data/faq";

/** Manages the FAQ accordion's responsive behavior. */
export function useFaq() {
  const isMobile = useIsMobile();

  return {
    isMobile,
    defaultValue: isMobile ? [faqItems[0].key] : faqItems.map(item => item.key),
  };
}
