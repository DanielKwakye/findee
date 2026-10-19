import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import { Footer, InnerPageHero, MobileNavbar, WebNavbar } from "@/components/platform";
import PricingPlans from "@/features/pricing/components/ui/pricing-plans";

export const metadata: Metadata = { title: messages.PageMetadata.titles.pricing };

/** Presents the pricing page and its shared inner-page header. */
export default function PricingPage() {
  const t = useTranslations("Pricing");

  return (
    <>
      <MobileNavbar appearance="solid" />
      <WebNavbar appearance="solid" showGetStarted={false} />
      <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
        <InnerPageHero title={t("title")} titleAccent={t("titleAccent")} subtitle={t("subtitle")} />
        <PricingPlans />
      </main>
      <Footer />
    </>
  );
}
