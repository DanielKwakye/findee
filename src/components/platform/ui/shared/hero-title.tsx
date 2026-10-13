"use client";

import { useTranslations } from "next-intl";
import TypographyH1 from "@/components/core/ui/typography-h1";
import { useHeroTitle } from "@/components/platform/hooks/use.hero.title";
import { cn } from "@/lib/utils";

/** Renders the shared hero heading with an isolated typing effect. */
export default function HeroTitle({ className }: { className?: string }) {
  const t = useTranslations("Hero");
  const firstLine = t("titleFirstLine");
  const secondLine = t("titleSecondLine");
  const { sourceRef, animatedRef } = useHeroTitle(firstLine, secondLine);

  return (
    <TypographyH1 className={cn("min-h-[2.1em] font-heading text-primary-foreground", className)}>
      <span ref={sourceRef} className="sr-only">
        <span className="block xl:whitespace-nowrap">{firstLine}</span>
        <span className="block text-chart-1 xl:whitespace-nowrap">{secondLine}</span>
      </span>
      <span ref={animatedRef} aria-hidden="true" className="block">
        <span className="block xl:whitespace-nowrap">{firstLine}</span>
        <span className="block text-chart-1 xl:whitespace-nowrap">{secondLine}</span>
      </span>
    </TypographyH1>
  );
}
