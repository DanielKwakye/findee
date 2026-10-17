"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePortalTicketCount } from "@/components/platform/hooks/use.portal.ticket.count";
import { usePortalProcurementCount } from "@/components/platform/hooks/use.portal.procurement.count";

/** Explains the current page's navigation badge using its shared live count. */
export function usePortalBadgeAlert() {
    const pathname = usePathname();
    const t = useTranslations("PortalBadgeAlert");
    const { data: ticketCount = 0 } = usePortalTicketCount();
    const { data: procurementCount = 0 } = usePortalProcurementCount();
    let description: string | null = null;
    if (pathname === "/admin/procurement" && procurementCount > 0) {
        description = t("procurement", { count: procurementCount });
    } else if (pathname === "/admin/tickets" && ticketCount > 0) {
        description = t("tickets", { count: ticketCount });
    }
    return { description };
}
