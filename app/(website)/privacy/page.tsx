import { useTranslations } from "next-intl";
import { Footer, InnerPageHero, MobileNavbar, WebNavbar } from "@/components/platform";

/** Presents the privacy page and its shared inner-page header. */
export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  return (
    <>
      <MobileNavbar appearance="solid" />
      <WebNavbar appearance="solid" showGetStarted={false} />
      <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
        <InnerPageHero title={t("title")} titleAccent={t("titleAccent")} subtitle={t("subtitle")} />
      </main>
      <Footer />
    </>
  );
}
