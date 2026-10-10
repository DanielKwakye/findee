"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderStatusUpdate } from "@/features/orders/utils/order.validations";
import type { OrderStatusUpdate } from "@/features/orders/utils/order.types";

/** Saves the administrator's selected status for an existing order. */
export async function updateOrderStatus(values: OrderStatusUpdate) {
    await requireAdmin();
    validateOrderStatusUpdate(values);
    await db.order.update({ where: { id: values.id }, data: { status: values.status }, select: { id: true } });
}
