"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/core/ui/badge";
import { Card } from "@/components/core/ui/card";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH2 from "@/components/core/ui/typography-h2";
import TypographyH3 from "@/components/core/ui/typography-h3";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { howItWorksSteps, howItWorksTrustCues } from "@/components/platform/data/how.it.works";
import { useHowItWorks } from "@/components/platform/hooks/use.how.it.works";
import { cn } from "@/lib/utils";

/** Explains the Findee sticker recovery process. */
export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const sectionRef = useHowItWorks();

  return (
    <section ref={sectionRef} id="how-it-works" aria-label={t("eyebrow")} className="scroll-mt-24 bg-background py-12 text-foreground sm:py-16 xl:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <Badge className="h-auto bg-chart-1/20 px-5 py-2 text-primary">
            <TypographyBody className="text-[10px] font-semibold uppercase sm:text-xs">{t("eyebrow")}</TypographyBody>
          </Badge>
          <TypographyH2 className="mt-5 font-heading text-xl tracking-tight sm:text-2xl xl:text-3xl">
            {t("title")}
          </TypographyH2>
          <TypographyParagraph className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">{t("subtitle")}</TypographyParagraph>
        </div>
        <ol className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-10 xl:mt-10 xl:gap-14">
          {howItWorksSteps.map((step, index) => (
            <li key={step.key} className="relative min-w-0">
              <Card className={cn("h-full gap-0 rounded-3xl py-0 ring-0", step.cardClassName)}>
                <div className="flex items-start gap-4 px-5 py-3 sm:px-6 sm:py-4">
                  <TypographyBody className={cn("flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold sm:size-16 sm:text-xl", step.numberClassName)}>
                    {t("stepNumber", { number: index + 1 })}
                  </TypographyBody>
                  <div className="min-w-0 pt-1">
                    <TypographyH3 className="font-heading text-sm tracking-tight xl:text-base">{t(`steps.${step.key}.title`)}</TypographyH3>
                    <TypographyParagraph className="mt-1 text-xs leading-5 text-muted-foreground">{t(`steps.${step.key}.description`)}</TypographyParagraph>
                  </div>
                </div>
                <div className="relative mt-auto aspect-[2/1] overflow-hidden">
                  <div aria-hidden="true" className={cn("absolute top-0 left-[20%] aspect-square w-[115%] rounded-full", step.domeClassName)} />
                  <Image src={step.image} alt={t(`steps.${step.key}.alt`)} fill sizes="(min-width: 1024px) 33vw, 100vw" className={cn("object-contain", step.imageClassName)} />
                </div>
              </Card>
              {index < howItWorksSteps.length - 1 && (
                <ArrowRight aria-hidden="true" className="absolute top-1/2 -right-9 hidden size-7 -translate-y-1/2 text-muted-foreground lg:block xl:-right-11 xl:size-8" />
              )}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-muted-foreground sm:mt-10">
          {howItWorksTrustCues.map(({ key, icon: Icon }, index) => (
            <div key={key} className={cn("flex items-center gap-2", index > 0 && "border-l border-border pl-5")}>
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <TypographyBody className="text-[10px] font-medium sm:text-xs">{t(key)}</TypographyBody>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
