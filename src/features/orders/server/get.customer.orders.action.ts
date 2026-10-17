"use server";

import { requireCustomer } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderQuery } from "@/features/orders/utils/order.validations";
import type { OrderQuery } from "@/features/orders/utils/order.types";
import type { Prisma } from "@/generated/client";

/** Retrieves purchase summaries belonging to the signed-in customer. */
export async function getCustomerOrders(params: OrderQuery) {
    const user = await requireCustomer();
    const { search, sortBy, direction } = validateOrderQuery(params);
    const where: Prisma.OrderWhereInput = {
        customerId: user.id,
        ...(search ? { number: { contains: search, mode: "insensitive" } } : {}),
    };
    const total = await db.order.count({ where });
    const page = Math.min(params.page, Math.max(1, Math.ceil(total / params.pageSize)));
    const orders = await db.order.findMany({
        where, skip: (page - 1) * params.pageSize, take: params.pageSize,
        orderBy: [{ [sortBy]: direction }, { number: "asc" }],
        select: {
            id: true, number: true, status: true, createdAt: true, cancellable: true,
            planDetail: { select: { quantity: true, price: true, currency: true } },
        },
    });
    return { orders, total, page };
}
