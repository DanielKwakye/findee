"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/core/ui/carousel";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { heroCarouselItems, heroCarouselOptions } from "@/components/platform/data/hero.carousel.items";
import { useHeroCarousel } from "@/components/platform/hooks/use.hero.carousel";
import HeroCarouselIndicators from "@/components/platform/ui/shared/hero-carousel-indicators";
import { cn } from "@/lib/utils";
import styles from "./hero-carousel.module.css";

/** Shows the navigable hero image cards in the web layout. */
export default function WebHeroCarousel() {
  const t = useTranslations("Hero.carousel");
  const { setApi, selectedIndex, getSlidePosition } = useHeroCarousel();

  return (
    <Carousel aria-label={t("regionLabel")} className="w-full" opts={heroCarouselOptions} setApi={setApi}>
      <CarouselContent className="ml-0 items-center">
        {heroCarouselItems.map((item, index) => {
          const position = getSlidePosition(index, heroCarouselItems.length, true);
          const isCurrent = position === "current";

          return (
            <CarouselItem
              key={item.titleKey}
              aria-label={t("slideLabel", {
                title: t(item.titleKey),
                number: index + 1,
                total: heroCarouselItems.length,
              })}
              className={cn("relative aspect-[0.95] basis-1/2 pl-0", isCurrent && "z-10")}
            >
              <article className={cn(styles.card, styles[position])}>
                <Image
                  src={item.image}
                  alt={t(item.altKey)}
                  fill
                  preload={index === 1}
                  sizes="(min-width: 1280px) 26vw, 50vw"
                  className="object-cover"
                  draggable={false}
                />
                <div className={cn(
                  "absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/95 via-foreground/45 to-transparent pt-20 text-primary-foreground",
                  isCurrent ? "px-5 pb-5" : "px-2 pb-3",
                )}>
                  <TypographyBody className={cn("block font-bold leading-tight", isCurrent ? "text-lg" : "text-xs")}>
                    {t(item.titleKey)}
                  </TypographyBody>
                  <TypographyParagraph className={cn("mt-1 text-primary-foreground/85", isCurrent ? "text-xs leading-4" : "text-[10px] leading-3")}>
                    {t(item.descriptionKey)}
                  </TypographyParagraph>
                </div>
              </article>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious aria-label={t("previous")} className="left-20 z-20 size-10 border-transparent bg-background text-foreground shadow-md hover:bg-background/90 2xl:left-24" />
      <CarouselNext aria-label={t("next")} className="right-20 z-20 size-10 border-transparent bg-background text-foreground shadow-md hover:bg-background/90 2xl:right-24" />
      <HeroCarouselIndicators selectedIndex={selectedIndex} />
    </Carousel>
  );
}
