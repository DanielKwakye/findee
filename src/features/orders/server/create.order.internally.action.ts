"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { normalizeEmail } from "@/features/auth/utils/auth.validation";
import { validateCheckoutValues } from "@/features/checkout/utils/checkout.validations";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { createOrder } from "@/features/orders/server/order.creation";
import { db } from "@/lib/db";

/** Creates an order for a customer on behalf of authorized staff. */
export async function createOrderInternally(values: CheckoutValues): Promise<string> {
    await requireAdmin();
    validateCheckoutValues(values);
    const email = normalizeEmail(values.email);
    const customer = await db.user.findUnique({ where: { email }, select: { id: true, role: true } });
    if (!customer || customer.role !== "CUSTOMER") throw new Error("Customer account not found");
    return createOrder(customer.id, { ...values, email });
}
