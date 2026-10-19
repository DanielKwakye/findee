import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import Image from "next/image";
import { Footer, InnerPageHero, MobileNavbar, WebNavbar } from "@/components/platform";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { ImageConstants } from "@/lib/image.constants";

export const metadata: Metadata = { title: messages.PageMetadata.titles.about };

/** Presents the about page and its shared inner-page header. */
export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <>
      <MobileNavbar appearance="solid" />
      <WebNavbar appearance="solid" showGetStarted={false} />
      <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
        <InnerPageHero title={t("title")} titleAccent={t("titleAccent")} subtitle={t("subtitle")} />
        <section aria-labelledby="about-purpose" className="container mx-auto grid max-w-6xl items-center gap-8 px-5 pt-6 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-5">
            <TypographyBody className="text-xs font-semibold tracking-widest text-primary uppercase">{t("purpose.eyebrow")}</TypographyBody>
            <h2 id="about-purpose"><TypographyBody className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">{t("purpose.title")}</TypographyBody></h2>
            <TypographyParagraph className="text-muted-foreground">{t("purpose.introduction")}</TypographyParagraph>
            <TypographyParagraph className="text-muted-foreground">{t("purpose.description")}</TypographyParagraph>
            <div className="border-s-2 border-primary ps-4">
              <TypographyParagraph className="font-medium text-foreground">{t("purpose.promise")}</TypographyParagraph>
            </div>
          </div>
          <figure className="space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
              <Image src={ImageConstants.ScanQRCode} alt={t("purpose.imageAlt")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <figcaption><TypographyBody className="text-xs leading-5 text-muted-foreground">{t("purpose.caption")}</TypographyBody></figcaption>
          </figure>
        </section>
      </main>
      <Footer />
    </>
  );
}
