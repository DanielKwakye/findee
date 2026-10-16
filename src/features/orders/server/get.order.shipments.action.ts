"use server";

import { requireAdmin, requireCustomer } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderId } from "@/features/orders/utils/order.validations";

/** Retrieves shipment records belonging to an administrator-selected order. */
export async function getOrderShipments(orderId: string, audience: "admin" | "customer" = "admin") {
    const user = audience === "customer" ? await requireCustomer() : await requireAdmin();
    validateOrderId(orderId);
    return db.shipment.findMany({
        ...(audience === "customer" ? { take: 1 } : {}),
        where: { orderId, ...(audience === "customer" ? { order: { customerId: user.id } } : {}) }, orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: {
            id: true, carrier: true, trackingNumber: true,
        },
    });
}
