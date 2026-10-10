"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderShipmentCreate, validateOrderShipmentDelete } from "@/features/orders/utils/order.validations";
import type { OrderShipmentCreate, OrderShipmentDelete } from "@/features/orders/utils/order.types";

/** Updates tracking information for a shipment belonging to the selected order. */
export async function updateOrderShipment(values: OrderShipmentCreate & OrderShipmentDelete) {
    await requireAdmin();
    validateOrderShipmentDelete(values);
    const { orderId, ...data } = validateOrderShipmentCreate(values);
    const result = await db.shipment.updateMany({ where: { id: values.id, orderId }, data });
    if (result.count !== 1) throw new Error("Shipment not found");
}
