"use server";

import { requireCustomer } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Closes customer access while preserving records and protecting outstanding orders. */
export async function closeCustomerAccount() {
    const user = await requireCustomer();
    return db.$transaction(async transaction => {
        const outstanding = await transaction.order.count({
            where: { customerId: user.id, status: { notIn: ["DELIVERED", "CANCELLED", "RETURNED"] } },
        });
        if (outstanding) throw new Error("outstandingOrders");
        await transaction.user.update({ where: { id: user.id, role: "CUSTOMER" },
            data: { closedAt: new Date(), otp: null, otpCreatedAt: null, passwordHash: null }, select: { id: true } });
        return { closed: true };
    });
}
