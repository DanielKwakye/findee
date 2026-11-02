"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { validateOrderId } from "@/features/orders/utils/order.validations";
import { sendOrderInvoice } from "@/features/orders/server/order.invoice";
import { db } from "@/lib/db";

/** Resends payment instructions for an unpaid order on an administrator's request. */
export async function resendOrderInvoice(id: string) {
    await requireAdmin();
    validateOrderId(id);
    const order = await db.order.findFirst({
        where: { id, status: "AWAITING_PAYMENT", paymentAt: null }, select: { number: true },
    });
    if (!order) throw new Error("Order is not awaiting payment");
    await sendOrderInvoice(order.number, true);
}
