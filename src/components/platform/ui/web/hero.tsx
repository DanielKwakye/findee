import { useTranslations } from "next-intl";
import Link from "next/link";
import { CirclePlay } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { webHeroTrustedItems } from "@/components/platform/data/web.hero.trustedItems";
import HeroTrustCues from "@/components/platform/ui/shared/hero-trust-cues";
import glowStyles from "@/components/platform/ui/shared/hero-carousel-glow.module.css";
import WebHeroCarousel from "@/components/platform/ui/web/hero-carousel";
import { cn } from "@/lib/utils";

/** Renders the desktop hero copy, carousel, and trust details. */
export default function WebHero() {
  const t = useTranslations("Hero");
  const tCategory = useTranslations("Hero.categories");

  return (
    <div className="container relative mx-auto hidden px-6 pt-32 pb-20 xl:block">
      <div className="flex min-h-128 items-center gap-8">
        {/* Hero text and actions. */}
        <div className="flex-2">
          <TypographyBody className="inline-flex rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-chart-1 uppercase">
            {t("eyebrow")}
          </TypographyBody>
          <TypographyH1 className="mt-5 font-heading text-[clamp(3.5rem,4.3vw,5rem)] leading-[1.05] tracking-tight text-primary-foreground">
            <span className="block whitespace-nowrap">{t("titleFirstLine")}</span>
            <span className="block whitespace-nowrap text-chart-1">{t("titleSecondLine")}</span>
          </TypographyH1>
          <TypographyParagraph className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/75">
            {t("desktopSubtitle")}
          </TypographyParagraph>
          <div className="mt-7 flex flex-wrap gap-4">
            <Button render={<Link href="/checkout" />} nativeButton={false} className="h-12 min-w-48 bg-destructive px-7 text-primary-foreground hover:bg-destructive/90">
              <TypographyBody className="text-sm font-semibold">{t("getYourStickers")}</TypographyBody>
            </Button>
            <Button type="button" variant="outline" className="h-12 gap-2 border-primary-foreground/60 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <CirclePlay aria-hidden="true" className="size-5" />
              <TypographyBody className="text-sm font-semibold">{t("howItWorks")}</TypographyBody>
            </Button>
          </div>
          <HeroTrustCues className="mt-8" />
        </div>
        {/* Carousel. */}
        <div className={cn("min-w-0 flex-4", glowStyles.glow)}>
          <WebHeroCarousel />
        </div>
      </div>
      {/* Trusted by people everywhere bar. */}
      <div className="mt-8 flex min-h-14 items-center gap-8 border-t border-primary-foreground/10 pt-3 text-primary-foreground/75">
        <TypographyBody className="shrink-0 text-xs font-semibold tracking-[0.2em] uppercase">
          {t("trustedByPeopleEverywhere")}
        </TypographyBody>
        <span aria-hidden="true" className="h-8 w-px shrink-0 bg-primary-foreground/35" />
        <div className="flex flex-1 items-center justify-between gap-3">
          {webHeroTrustedItems.map(({ labelKey, icon: Icon }) => (
            <div key={labelKey} className="flex items-center gap-2 whitespace-nowrap">
              <Icon aria-hidden="true" className="size-6 shrink-0" strokeWidth={1.5} />
              <TypographyBody className="text-sm">{tCategory(labelKey)}</TypographyBody>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
