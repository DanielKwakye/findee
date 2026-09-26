"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/core/ui/carousel";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { heroCarouselItems } from "@/components/platform/data/hero.carousel.items";
import { useHeroCarousel } from "@/components/platform/hooks/use.hero.carousel";
import HeroCarouselIndicators from "@/components/platform/ui/shared/hero-carousel-indicators";
import { heroCarouselOptions } from "@/components/platform/utils/carousel.utils";
import { cn } from "@/lib/utils";
import styles from "./hero-carousel.module.css";

/** Shows the navigable hero image cards in the mobile layout. */
export default function MobileHeroCarousel() {
  const t = useTranslations("Hero.carousel");
  const { setApi, plugins, selectedIndex, canScrollPrevious, canScrollNext, scrollPrevious, scrollNext, getSlidePosition } = useHeroCarousel();

  return (
    <>
    <Carousel aria-label={t("regionLabel")} className="w-full" opts={heroCarouselOptions} plugins={plugins} setApi={setApi}>
      <CarouselContent className="-ml-3 items-center">
        {heroCarouselItems.map((item, index) => {
          const position = getSlidePosition(index, heroCarouselItems.length);
          const isCurrent = position === "current";

          return (
            <CarouselItem
              key={item.titleKey}
              aria-label={t("slideLabel", {
                title: t(item.titleKey),
                number: index + 1,
                total: heroCarouselItems.length,
              })}
              className="basis-2/3 pl-3 xl:basis-[54%]"
            >
              <div className="relative aspect-[0.95]">
                <article
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-3xl border transition-[transform,opacity,border-color] duration-500",
                    isCurrent
                      ? "inset-x-0 border-chart-2 opacity-100"
                      : "inset-x-0 border-primary-foreground/15 opacity-75",
                    position === "previous" && styles.previousMobile,
                    position === "next" && styles.nextMobile,
                    position === "other" && "pointer-events-none opacity-0",
                  )}
                >
                  <Image
                    src={item.image}
                    alt={t(item.altKey)}
                    fill
                    preload={index === 1}
                    sizes="65vw"
                    className="object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/95 via-foreground/45 to-transparent px-4 pt-20 pb-5 text-primary-foreground sm:px-5">
                    <TypographyBody className="block text-base font-bold leading-tight sm:text-lg xl:text-xl">
                      {t(item.titleKey)}
                    </TypographyBody>
                    <TypographyParagraph className="mt-1 text-xs leading-4 text-primary-foreground/85 sm:text-sm sm:leading-5">
                      {t(item.descriptionKey)}
                    </TypographyParagraph>
                  </div>
                </article>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={t("previous")}
        disabled={!canScrollPrevious}
        onClick={scrollPrevious}
        className="absolute top-1/2 left-2 z-20 size-10 -translate-y-1/2 border-transparent bg-background text-foreground shadow-md hover:bg-background/90 disabled:opacity-50 sm:left-4 xl:left-8"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={t("next")}
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="absolute top-1/2 right-2 z-20 size-10 -translate-y-1/2 border-transparent bg-background text-foreground shadow-md hover:bg-background/90 disabled:opacity-50 sm:right-4 xl:right-8"
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </Button>
    </Carousel>
    <HeroCarouselIndicators selectedIndex={selectedIndex} />
    </>
  );
}
