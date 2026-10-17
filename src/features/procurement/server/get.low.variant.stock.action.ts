"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { getLowVariantStock } from "@/features/procurement/server/procurement.stock";

/** Retrieves low-stock variant summaries for an authorized inventory view. */
export async function getLowVariantStockForAdmin() {
    await requireAdmin();
    return getLowVariantStock();
}
