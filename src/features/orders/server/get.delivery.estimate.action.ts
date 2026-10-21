"use server";

import { requireCustomer } from "@/features/auth/server/auth.session";
import { getEstimatedDeliveryDate } from "@/features/orders/utils/order.delivery";

/** Retrieves the estimated arrival date for an order placed at the current server time. */
export async function getDeliveryEstimate(postalCode?: string): Promise<string> {
    await requireCustomer();
    return getEstimatedDeliveryDate({ postalCode });
}
