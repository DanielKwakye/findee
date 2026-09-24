import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import MobileHeroCarousel from "@/components/platform/ui/mobile/hero-carousel";
import HeroTrustCues from "@/components/platform/ui/shared/hero-trust-cues";
import glowStyles from "@/components/platform/ui/shared/hero-carousel-glow.module.css";
import { cn } from "@/lib/utils";
import styles from "./hero.module.css";

/** Renders the mobile hero copy, carousel, and trust cues. */
export default function MobileHero() {
  const t = useTranslations("Hero");

  return (
    <div className={cn("relative flex flex-col px-5 pt-24 pb-28 sm:px-8 lg:px-10 xl:hidden", styles.topGlow)}>
      {/* Hero text and primary action. */}
      <div className="mx-auto min-h-56 w-full max-w-lg text-center">
        <TypographyH1 className="font-heading text-[clamp(2.25rem,9vw,3rem)] leading-[1.04] tracking-tight text-primary-foreground">
          <span className="block">{t("titleFirstLine")}</span>
          <span className="block text-chart-1">{t("titleSecondLine")}</span>
        </TypographyH1>
        <TypographyParagraph className="mx-auto mt-5 max-w-sm text-base leading-7 text-primary-foreground/75">
          {t("mobileSubtitle")}
        </TypographyParagraph>
        <Button
          type="button"
          className="mt-8 h-12 w-full max-w-72 gap-3 bg-destructive text-primary-foreground hover:bg-destructive/90"
        >
          <TypographyBody className="text-sm font-semibold">{t("getYourStickers")}</TypographyBody>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
      {/* Full-width carousel. */}
      <div className={cn("-mx-5 mt-8 sm:-mx-8 lg:-mx-10", glowStyles.glow)}>
        <MobileHeroCarousel />
      </div>
      {/* Security and trust cues. */}
      <HeroTrustCues className="mt-8" />
    </div>
  );
}
