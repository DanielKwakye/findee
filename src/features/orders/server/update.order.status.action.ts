"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderStatusUpdate } from "@/features/orders/utils/order.validations";
import type { OrderStatusUpdate } from "@/features/orders/utils/order.types";

/** Saves the administrator's selected status for an existing order. */
export async function updateOrderStatus(values: OrderStatusUpdate) {
    await requireAdmin();
    validateOrderStatusUpdate(values);
    const result = await db.order.updateMany({ where: {
        id: values.id,
        ...(values.status === "AWAITING_PAYMENT" ? { paymentAt: null } : { paymentAt: { not: null } }),
    }, data: { status: values.status } });
    if (result.count !== 1) throw new Error("Order status must match its payment state");
}
