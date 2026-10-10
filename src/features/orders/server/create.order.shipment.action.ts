"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderShipmentCreate } from "@/features/orders/utils/order.validations";
import type { OrderShipmentCreate } from "@/features/orders/utils/order.types";

/** Creates a shipment record for the selected customer order. */
export async function createOrderShipment(values: OrderShipmentCreate) {
    await requireAdmin();
    const data = validateOrderShipmentCreate(values);
    const order = await db.order.findUnique({ where: { id: data.orderId }, select: { id: true } });
    if (!order) throw new Error("Order not found");
    await db.shipment.create({ data, select: { id: true } });
}
