import { useTranslations } from "next-intl";
import { Badge } from "@/components/core/ui/badge";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";

type InnerPageHeroProps = {
  title: string;
  titleAccent: string;
  subtitle: string;
};

/** Presents the shared patterned heading for public inner pages. */
export default function InnerPageHero({ title, titleAccent, subtitle }: InnerPageHeroProps) {
  const t = useTranslations("Hero");

  return (
    <section className="relative isolate overflow-hidden bg-background px-5 pt-8 pb-16 text-center text-foreground sm:px-6 sm:py-20 xl:pt-20 xl:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, var(--foreground) 65%, transparent)",
        }}
      />
      <div className="container mx-auto">
        <Badge variant="outline" className="h-auto max-w-full border-primary/20 bg-primary/5 px-3 py-1.5 whitespace-normal text-primary sm:px-4">
          <TypographyBody className="text-[8px] font-semibold tracking-[0.12em] uppercase sm:text-[10px] sm:tracking-[0.18em]">{t("eyebrow")}</TypographyBody>
        </Badge>
        <TypographyH1 className="mt-6 font-heading text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {title} <span className="text-chart-2">{titleAccent}</span>
        </TypographyH1>
        <TypographyParagraph className="mx-auto mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 xl:text-xl">
          {subtitle}
        </TypographyParagraph>
      </div>
    </section>
  );
}
