"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";
import type {ProcurementQuery} from "@/features/procurement/utils/procurement.types";

/** Retrieves product inventory for the authorized procurement workspace. */
export async function getProcurementProducts(params: ProcurementQuery) {
    await requireAdmin();
    if (!params || !Number.isSafeInteger(params.page) || params.page < 1 || !Number.isSafeInteger(params.pageSize) || params.pageSize < 1 || params.pageSize > 100 || typeof params.search !== "string") {
        throw new Error("Invalid procurement query");
    }
    const search = params.search.slice(0, 255);
    if (!["all", "Everyday", "Fabric", "Tough"].includes(params.variant)) throw new Error("Invalid product variant");
    const where = {
        ...(params.variant === "all" ? {} : {variant: params.variant}),
        ...(search ? {code: {contains: search, mode: "insensitive" as const}} : {}),
    };
    const sortBy = params.sortBy === "code" || params.sortBy === "published" || params.sortBy === "createdAt" || params.sortBy === "procurementStatus" ? params.sortBy : "createdAt";
    const direction = params.direction === "asc" ? "asc" as const : "desc" as const;
    const total = await db.product.count({where});
    const page = Math.min(params.page, Math.max(1, Math.ceil(total / params.pageSize)));
    const products = await db.product.findMany({
        where, select: {code: true, published: true, procurementStatus: true, createdAt: true},
        skip: (page - 1) * params.pageSize, take: params.pageSize,
        orderBy: [{[sortBy]: direction}, {code: "asc"}],
    });
    return {products, total, page};
}
