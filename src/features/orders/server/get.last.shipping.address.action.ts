"use server";

import { requireCustomer } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Retrieves the signed-in customer's most recently used shipping destination. */
export async function getLastShippingAddress() {
    const customer = await requireCustomer();
    const order = await db.order.findFirst({
        where: { customerId: customer.id, shippingAddress: { not: null } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: { shippingAddress: true },
    });
    const address = order?.shippingAddress?.trim();
    if (!address) return null;
    const postalCode = address.match(/(?:,\s*|\s+)([A-Z]\d[A-Z])[-\s]?(\d[A-Z]\d)\.?$/i);
    return {
        shippingAddress: postalCode ? address.slice(0, postalCode.index).trim() : address,
        postalCode: postalCode ? `${postalCode[1]}${postalCode[2]}`.toUpperCase() : "",
    };
}
