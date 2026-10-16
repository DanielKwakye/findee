"use server";

import { requireAdmin, requireCustomer } from "@/features/auth/server/auth.session";
import { validateTicketQuery } from "@/features/tickets/utils/ticket.validation";
import type { TicketQuery } from "@/features/tickets/utils/ticket.types";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/client";

/** Retrieves support ticket summaries owned by the signed-in customer. */
export async function getTickets(params: TicketQuery, audience: "customer" | "admin" = "customer") {
    const user = audience === "admin" ? await requireAdmin() : await requireCustomer();
    const { search, sortBy, direction } = validateTicketQuery(params);
    const where: Prisma.TicketWhereInput = {
        ...(audience === "admin" ? {} : { customerId: user.id }),
        ...(search ? { OR: [
            { code: { contains: search, mode: "insensitive" } },
            { message: { contains: search, mode: "insensitive" } },
            ...(audience === "admin" ? [
                { customerName: { contains: search, mode: "insensitive" as const } },
                { customerEmail: { contains: search, mode: "insensitive" as const } },
            ] : []),
        ] } : {}),
    };
    const total = await db.ticket.count({ where });
    const page = Math.min(params.page, Math.max(1, Math.ceil(total / params.pageSize)));
    const tickets = await db.ticket.findMany({
        where, skip: (page - 1) * params.pageSize, take: params.pageSize,
        orderBy: [{ [sortBy]: direction }, { id: "desc" }],
        select: { id: true, code: true, createdAt: true, message: true, status: true,
            customerName: audience === "admin", customerEmail: audience === "admin" },
    });
    return { tickets, total, page };
}
