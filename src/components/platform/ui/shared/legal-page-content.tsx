import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent } from "@/components/core/ui/card";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { formatUserDateTime } from "@/lib/datetime";

type LegalSection = { title: string; paragraphs: string[] };

/** Presents translated legal notices with a summary, contents navigation, and numbered sections. */
export default function LegalPageContent({ namespace }: { namespace: "Privacy" | "Terms" }) {
  const t = useTranslations(namespace);
  const formatter = useFormatter();
  const sections = t.raw("sections") as LegalSection[];
  const summary = t.raw("summary.points") as string[];
  const prefix = namespace.toLowerCase();

  return (
        <section aria-label={t("contentLabel")} className="container mx-auto max-w-6xl px-5 pt-6 pb-12 sm:px-6 sm:pb-16">
          <TypographyParagraph className="mb-6 text-sm text-muted-foreground">
            {t("lastUpdated", { date: formatUserDateTime(new Date(t("updatedAt")), formatter, "UTC") })}
          </TypographyParagraph>
          <Card className="mb-10 border border-border bg-muted/30 ring-0">
            <CardContent className="space-y-4">
              <h2><TypographyBody className="font-heading text-lg font-semibold text-foreground">{t("summary.title")}</TypographyBody></h2>
              <ul className="list-disc space-y-3 ps-5 text-muted-foreground">
                {summary.map((_, index) => <li key={index}><TypographyParagraph className="text-sm leading-6">{t(`summary.points.${index}`)}</TypographyParagraph></li>)}
              </ul>
            </CardContent>
          </Card>
          <div className="grid min-w-0 gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
            <aside>
              <nav aria-label={t("contents")} className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pe-3">
                <TypographyBody className="text-sm font-semibold text-foreground">{t("contents")}</TypographyBody>
                <ol className="space-y-2">
                  {sections.map((_, index) => (
                    <li key={index}>
                      <Link href={`#${prefix}-section-${index + 1}`} className="block rounded-md py-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring">
                        <TypographyBody className="text-sm leading-6">{t("sectionHeading", { number: index + 1, title: t(`sections.${index}.title`) })}</TypographyBody>
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
            <article className="min-w-0 space-y-10">
              {sections.map((section, index) => (
                <section key={index} id={`${prefix}-section-${index + 1}`} aria-labelledby={`${prefix}-heading-${index + 1}`} className="scroll-mt-24 space-y-4 border-b border-border pb-10 last:border-0 last:pb-0">
                  <h2 id={`${prefix}-heading-${index + 1}`}><TypographyBody className="font-heading text-xl font-semibold text-foreground sm:text-2xl">{t("sectionHeading", { number: index + 1, title: t(`sections.${index}.title`) })}</TypographyBody></h2>
                  {section.paragraphs.map((_, paragraphIndex) => (
                    <TypographyParagraph key={paragraphIndex} className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                      {t.rich(`sections.${index}.paragraphs.${paragraphIndex}`, {
                        contact: chunks => <Link href="/tickets" className="font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{chunks}</Link>,
                        privacy: chunks => <Link href="/privacy" className="font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{chunks}</Link>,
                        orders: chunks => <Link href="/customer/orders" className="font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{chunks}</Link>,
                        profile: chunks => <Link href="/customer/profile" className="font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{chunks}</Link>,
                      })}
                    </TypographyParagraph>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </section>
  );
}
