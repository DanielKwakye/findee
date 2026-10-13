"use client";

import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/core/ui/accordion";
import { Badge } from "@/components/core/ui/badge";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH2 from "@/components/core/ui/typography-h2";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { faqItems } from "@/components/platform/data/faq";
import { useFaq } from "@/components/platform/hooks/use.faq";

/** Presents answers to common questions about Findmus. */
export default function FAQ() {
  const t = useTranslations("FAQ");
  const { isMobile, defaultValue } = useFaq();

  return (
    <section id="faq" aria-label={t("eyebrow")} className="scroll-mt-24 py-12 text-primary-foreground sm:py-16 xl:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <Badge className="h-auto border-chart-1/25 bg-chart-1/10 px-5 py-2 text-chart-1">
            <TypographyBody className="text-xs font-semibold uppercase">{t("eyebrow")}</TypographyBody>
          </Badge>
          <TypographyH2 className="mt-5 font-heading text-2xl tracking-tight sm:text-3xl xl:text-4xl">{t("title")}</TypographyH2>
          <TypographyParagraph className="mt-3 text-sm text-primary-foreground/70 sm:text-base">{t("subtitle")}</TypographyParagraph>
        </div>
        <Accordion
          key={isMobile ? "mobile" : "desktop"}
          defaultValue={defaultValue}
          multiple
          className="mt-8 rounded-none border-0 md:mt-12 md:grid md:grid-flow-col md:grid-cols-2 md:grid-rows-3 md:gap-x-12 xl:gap-x-16"
        >
          {faqItems.map(({ key, icon: Icon }) => (
            <AccordionItem key={key} value={key} className="border-b border-primary-foreground/20 py-3 data-open:bg-transparent sm:py-5">
              <AccordionTrigger className="items-center gap-4 px-4 text-primary-foreground **:data-[slot=accordion-trigger-icon]:text-primary-foreground/70">
                <Icon aria-hidden="true" className="size-7 shrink-0 text-chart-1" strokeWidth={1.75} />
                <TypographyBody className="flex-1 text-sm font-semibold sm:text-base">{t(`questions.${key}.question`)}</TypographyBody>
              </AccordionTrigger>
              <AccordionContent>
                <TypographyParagraph className="pl-11 text-sm leading-6 text-primary-foreground/70 sm:text-base sm:leading-7">{t(`questions.${key}.answer`)}</TypographyParagraph>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
