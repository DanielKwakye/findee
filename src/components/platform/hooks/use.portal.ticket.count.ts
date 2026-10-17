"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnresolvedTicketCount } from "@/features/tickets/server/get.unresolved.ticket.count.action";

/** Manages the unresolved support ticket count displayed in administrator navigation. */
export function usePortalTicketCount() {
    return useQuery({
        queryKey: ["admin-tickets", "unresolved-count"],
        queryFn: getUnresolvedTicketCount,
    });
}
