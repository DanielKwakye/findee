"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/core/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/core/ui/carousel";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useUseCases } from "@/features/use-cases/components/hooks/use.use.cases";
import { useCases } from "@/features/use-cases/data/use.cases";

/** Presents everyday and family use cases in a paged card carousel. */
export default function UseCases() {
  const t = useTranslations("UseCases");
  const pageSize = useUseCases();
  const pageCount = Math.ceil(useCases.length / pageSize);

  return (
    <section aria-label={t("regionLabel")} className="container mx-auto px-4 py-8 sm:px-6 lg:py-12">
      <Carousel key={pageSize} opts={{ align: "start" }} aria-label={t("regionLabel")}>
        <CarouselContent>
          {Array.from({ length: pageCount }, (_, page) => (
            <CarouselItem key={page} aria-label={t("pageLabel", { number: page + 1, total: pageCount })}>
              <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-3 lg:gap-6">
                {useCases.slice(page * pageSize, (page + 1) * pageSize).map(({ key, image, variant }) => (
                  <Link key={key} href={`/checkout?variant=${variant}`} className="group rounded-2xl outline-none transition-[scale] duration-300 ease-in-out hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none motion-reduce:scale-100 motion-reduce:transition-none">
                  <Card className="h-full gap-0 border border-border pt-0 pb-0 ring-0 transition-shadow group-hover:shadow-[0_0_12px_2px_var(--tw-shadow-color)] group-hover:shadow-chart-2/10 group-focus-visible:shadow-[0_0_12px_2px_var(--tw-shadow-color)] group-focus-visible:shadow-chart-2/10">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      <Image src={image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                    </div>
                    <CardContent className="flex h-48 flex-col gap-2 p-3 sm:h-40 sm:p-5">
                      <TypographyBody className="text-sm font-semibold sm:text-lg">{t(`items.${key}.title`)}</TypographyBody>
                      <TypographyParagraph className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{t(`items.${key}.description`)}</TypographyParagraph>
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex justify-center gap-4">
          <CarouselPrevious aria-label={t("previous")} className="static size-10" />
          <CarouselNext aria-label={t("next")} className="static size-10" />
        </div>
      </Carousel>
    </section>
  );
}
