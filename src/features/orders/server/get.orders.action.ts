"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderQuery } from "@/features/orders/utils/order.validations";
import type { OrderQuery } from "@/features/orders/utils/order.types";
import type { Prisma } from "@/generated/client";

/** Retrieves paginated orders and their customer and fulfillment summaries. */
export async function getOrders(params: OrderQuery) {
    await requireAdmin();
    const { search, sortBy, direction } = validateOrderQuery(params);
    const where: Prisma.OrderWhereInput = {
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
        },
    });
    return { orders, total, page };
}
