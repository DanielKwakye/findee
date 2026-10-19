import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import { Footer, InnerPageHero, MobileNavbar, WebNavbar } from "@/components/platform";
import TicketForm from "@/features/tickets/components/ui/ticket-form";
import { getCustomerUser } from "@/features/auth/server/auth.session";

export const metadata: Metadata = { title: messages.PageMetadata.titles.contact };

/** Presents the contact page and its shared inner-page header. */
export default async function TicketsPage() {
  const t = await getTranslations("Ticket");
  const user = await getCustomerUser();

  return (
    <>
      <MobileNavbar appearance="solid" />
      <WebNavbar appearance="solid" showGetStarted={false} />
      <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
        <InnerPageHero title={t("title")} titleAccent={t("titleAccent")} subtitle={t("subtitle")} className="pb-6" />
        <div className="container mx-auto px-5 pb-6 sm:px-6 sm:pb-12">
          <TicketForm initialValues={{ name: user?.name ?? "", email: user?.email ?? "", message: "" }} showTrackingLink={!!user} centered showHeader={false} showBorder={false}
            className="py-0 sm:py-6 [&>[data-slot=card-content]]:px-0 sm:[&>[data-slot=card-content]]:px-6" />
        </div>
      </main>
      <Footer />
    </>
  );
}
