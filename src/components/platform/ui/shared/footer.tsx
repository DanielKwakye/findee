import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { footerLinkGroups, footerSocialLinks } from "@/components/platform/data/footer";
import { howItWorksTrustCues } from "@/components/platform/data/how.it.works";
import AppIcon from "@/components/platform/ui/shared/app-icon";
import { cn } from "@/lib/utils";

/** Presents the website's brand, navigation, and social links. */
export default function Footer() {
  const t = useTranslations("Footer");
  const tTrust = useTranslations("HowItWorks");

  return (
    <footer className="px-6 pt-10 pb-28 text-primary-foreground sm:pt-14 xl:pt-16 xl:pb-8" style={{ backgroundColor: "color-mix(in oklch, var(--chart-5) 22%, var(--foreground))" }}>
      <div className="container mx-auto">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1.2fr_1.5fr] xl:gap-x-12">
          <div className="sm:col-span-2 xl:col-span-1">
            <Link href="/" aria-label={t("home")}><AppIcon brightness="light" /></Link>
            <TypographyParagraph className="mt-3 text-sm text-primary-foreground/70">{t("tagline")}</TypographyParagraph>
            <TypographyParagraph className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/70">{t("description")}</TypographyParagraph>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-primary-foreground/70">
              {howItWorksTrustCues.map(({ key, icon: Icon }, index) => (
                <div key={key} className={cn("flex items-center gap-2", index > 0 && "border-l border-primary-foreground/20 pl-3")}>
                  <Icon aria-hidden="true" className="size-5 shrink-0 text-chart-1" />
                  <TypographyBody className="text-xs">{tTrust(key)}</TypographyBody>
                </div>
              ))}
            </div>
          </div>
          {footerLinkGroups.map(group => (
            <nav key={group.key} aria-label={t(group.key)}>
              <TypographyBody className="text-sm font-semibold">{t(group.key)}</TypographyBody>
              <ul className="mt-4 space-y-3">
                {group.links.map(({ key, href }) => (
                  <li key={key}>
                    <Link href={href} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                      <TypographyBody className="text-sm">{t(`links.${key}`)}</TypographyBody>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <TypographyBody className="text-sm font-semibold">{t("followUs")}</TypographyBody>
            <div className="mt-4 flex items-center gap-5">
              {footerSocialLinks.map(({ key, href, path }) => (
                <Link key={key} href={href} aria-label={t(`social.${key}`)} className="flex size-7 items-center justify-center text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <path d={path} />
                  </svg>
                </Link>
              ))}
            </div>
            <TypographyParagraph className="mt-6 border-l border-primary-foreground/20 pl-4 text-sm leading-6 text-primary-foreground/70">{t("stayUpdated")}</TypographyParagraph>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-primary-foreground/20 pt-5 text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between xl:mt-14">
          <TypographyBody className="text-xs">{t("copyright", { year: new Date().getFullYear() })}</TypographyBody>
          <div className="flex items-center gap-2">
            <TypographyBody className="text-xs">{t("closing")}</TypographyBody>
            <Heart aria-hidden="true" className="size-4 fill-current text-chart-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}
