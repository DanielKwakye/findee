"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderId } from "@/features/orders/utils/order.validations";

/** Retrieves shipment records belonging to an administrator-selected order. */
export async function getOrderShipments(orderId: string) {
    await requireAdmin();
    validateOrderId(orderId);
    return db.shipment.findMany({
        where: { orderId }, orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: {
            id: true, carrier: true, trackingNumber: true,
        },
    });
}
