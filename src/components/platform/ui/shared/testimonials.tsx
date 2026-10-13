"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Badge } from "@/components/core/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/core/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/core/ui/carousel";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH2 from "@/components/core/ui/typography-h2";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { testimonialKeys } from "@/components/platform/data/testimonials";
import { useHeroCarousel } from "@/components/platform/hooks/use.hero.carousel";
import HeroCarouselIndicators from "@/components/platform/ui/shared/hero-carousel-indicators";
import { testimonialCarouselOptions } from "@/components/platform/utils/carousel.utils";

/** Presents testimonial cards with responsive carousel navigation. */
export default function Testimonials() {
  const t = useTranslations("Testimonials");
  const { setApi, selectedIndex, snapCount } = useHeroCarousel({ autoplay: false, startIndex: 0 });

  return (
    <section id="testimonials" aria-label={t("eyebrow")} className="bg-background py-8 text-foreground sm:py-10 xl:py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <Badge className="h-auto bg-chart-1/20 px-5 py-2 text-primary">
            <TypographyBody className="text-xs font-semibold uppercase">{t("eyebrow")}</TypographyBody>
          </Badge>
          <TypographyH2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl xl:text-4xl">
            {t("title")} <span className="text-chart-2">{t("titleAccent")}</span>
          </TypographyH2>
          <TypographyParagraph className="mt-2 text-sm text-muted-foreground sm:text-base">{t("subtitle")}</TypographyParagraph>
        </div>
        <Carousel aria-label={t("regionLabel")} opts={testimonialCarouselOptions} setApi={setApi} className="mt-5 sm:mt-6">
          <CarouselContent className="-ml-6 items-stretch">
            {testimonialKeys.map((key, index) => (
              <CarouselItem key={key} aria-label={t("slideLabel", { number: index + 1, total: testimonialKeys.length })} className="flex pl-6 md:basis-1/2 xl:basis-1/3">
                <Card className="w-full gap-3 border border-border py-4 ring-0">
                  <CardHeader className="flex items-center justify-start">
                    <Quote aria-hidden="true" className="size-6 fill-current text-chart-1/30" />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <blockquote>
                      <TypographyParagraph className="text-sm leading-6 sm:text-base sm:leading-7">{t(`stories.${key}.quote`)}</TypographyParagraph>
                    </blockquote>
                  </CardContent>
                  <CardFooter className="mx-6 flex-col items-start gap-0 border-t border-border px-0 [.border-t]:pt-2">
                    <TypographyBody className="text-sm leading-tight font-bold sm:text-base">{t(`stories.${key}.name`)}</TypographyBody>
                    <TypographyBody className="text-xs leading-tight text-muted-foreground sm:text-sm">{t(`stories.${key}.location`)}</TypographyBody>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-5 flex items-center justify-center gap-8 sm:mt-6">
            <CarouselPrevious aria-label={t("previous")} className="static size-10 border-0 bg-muted text-foreground" />
            <HeroCarouselIndicators selectedIndex={selectedIndex} count={snapCount} className="mt-0 gap-3" inactiveClassName="bg-muted" />
            <CarouselNext aria-label={t("next")} className="static size-10 border-0 bg-muted text-foreground" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
