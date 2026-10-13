import { useTranslations } from "next-intl";
import { Footer, InnerPageHero, MobileNavbar, WebNavbar } from "@/components/platform";
import UseCases from "@/features/use-cases/components/ui/use-cases";

/** Presents the use cases page and its shared inner-page header. */
export default function UseCasesPage() {
  const t = useTranslations("UseCases");

  return (
    <>
      <MobileNavbar appearance="solid" />
      <WebNavbar appearance="solid" showGetStarted={false} />
      <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
        <InnerPageHero title={t("title")} titleAccent={t("titleAccent")} subtitle={t("subtitle")} />
        <UseCases />
      </main>
      <Footer />
    </>
  );
}
