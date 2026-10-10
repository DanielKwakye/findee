"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderId } from "@/features/orders/utils/order.validations";

/** Retrieves the order data displayed in the administrator's details dialog. */
export async function getOrderDetails(id: string) {
    await requireAdmin();
    validateOrderId(id);
    const order = await db.order.findUnique({
        where: { id },
        select: {
            number: true,
            customer: { select: { name: true, email: true, phone: true } },
            status: true, planDetail: true, defaultReachoutModes: true, showOwnerName: true,
            shippingAddress: true, deliveryInstructions: true, cancelledAt: true, cancellationReason: true,
            completedAt: true, createdAt: true, updatedAt: true,
            products: { select: { id: true, code: true, variant: true } },
            shipments: { select: {
                id: true, carrier: true, trackingNumber: true,
            } },
        },
    });
    if (!order) throw new Error("Order not found");
    return order;
}
