"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderShipmentDelete } from "@/features/orders/utils/order.validations";
import type { OrderShipmentDelete } from "@/features/orders/utils/order.types";

/** Removes a shipment record belonging to the selected order. */
export async function deleteOrderShipment(values: OrderShipmentDelete) {
    await requireAdmin();
    validateOrderShipmentDelete(values);
    const result = await db.shipment.deleteMany({ where: { id: values.id, orderId: values.orderId } });
    if (result.count !== 1) throw new Error("Shipment not found");
}
