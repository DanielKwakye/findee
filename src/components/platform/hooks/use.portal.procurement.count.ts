"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnpublishedProductCount } from "@/features/procurement/server/get.unpublished.product.count.action";

/** Manages the unpublished product count displayed in administrator navigation. */
export function usePortalProcurementCount() {
    return useQuery({
        queryKey: ["procurement", "unpublished-count"],
        queryFn: getUnpublishedProductCount,
    });
}
