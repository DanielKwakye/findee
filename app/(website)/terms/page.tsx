import { useTranslations } from "next-intl";
import { Footer, InnerPageHero, LegalPageContent, MobileNavbar, WebNavbar } from "@/components/platform";

/** Presents the terms page and its shared inner-page header. */
export default function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <>
      <MobileNavbar appearance="solid" />
      <WebNavbar appearance="solid" showGetStarted={false} />
      <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
        <InnerPageHero title={t("title")} titleAccent={t("titleAccent")} subtitle={t("subtitle")} />
        <LegalPageContent namespace="Terms" />
      </main>
      <Footer />
    </>
  );
}
