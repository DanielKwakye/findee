"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderQuery } from "@/features/orders/utils/order.validations";
import type { OrderQuery } from "@/features/orders/utils/order.types";
import type { Prisma } from "@/generated/client";
import { getEstimatedDeliveryDate } from "@/features/orders/utils/order.delivery";

/** Retrieves paginated orders and their customer and fulfillment summaries. */
export async function getOrders(params: OrderQuery, pendingPayments = false) {
    await requireAdmin();
    if (typeof pendingPayments !== "boolean") throw new Error("Invalid payment filter");
    const { search, sortBy, direction } = validateOrderQuery(params);
    const where: Prisma.OrderWhereInput = {
        ...(pendingPayments ? { status: "AWAITING_PAYMENT" } : {}),
        ...(params.status === "all" ? {} : { status: params.status }),
        ...(search ? { OR: [
            { number: { contains: search, mode: "insensitive" } },
            { customer: { is: { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } } },
            { shippingAddress: { contains: search, mode: "insensitive" } },
        ] } : {}),
    };
    const total = await db.order.count({ where });
    const page = Math.min(params.page, Math.max(1, Math.ceil(total / params.pageSize)));
    const orders = await db.order.findMany({
        where, skip: (page - 1) * params.pageSize, take: params.pageSize,
        orderBy: [{ [sortBy]: direction }, { number: "asc" }],
        select: {
            id: true, number: true, customer: { select: { name: true, email: true } }, status: true,
            createdAt: true, shippingAddress: true, planDetail: { select: { price: true, currency: true } },
        },
    });
    return { orders: orders.map(order => ({
        id: order.id, number: order.number, customer: order.customer, status: order.status,
        price: order.planDetail.price, currency: order.planDetail.currency, createdAt: order.createdAt,
        estimatedDeliveryDate: getEstimatedDeliveryDate({ orderedAt: order.createdAt, shippingAddress: order.shippingAddress }),
        expectedPostingDate: getEstimatedDeliveryDate({ orderedAt: order.createdAt, dateType: "posting" }),
    })), total, page };
}
