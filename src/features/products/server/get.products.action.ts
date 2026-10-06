"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";
import {productSortFields} from "@/features/products/utils/product.types";
import type {ProductQuery} from "@/features/products/utils/product.types";

/** Retrieves a page of product records and their displayable user and order references. */
export async function getProducts(params: ProductQuery) {
    await requireAdmin();
    if (!params || !Number.isSafeInteger(params.page) || params.page < 1 || !Number.isSafeInteger(params.pageSize) || params.pageSize < 1 || params.pageSize > 100 || typeof params.search !== "string") {
        throw new Error("Invalid product query");
    }
    const search = params.search.slice(0, 255);
    if (!["all", "Everyday", "Fabric", "Tough"].includes(params.variant)) throw new Error("Invalid product variant");
    const where = {
        published: true,
        ...(params.variant === "all" ? {} : {variant: params.variant}),
        ...(search ? {OR: [
        {code: {contains: search, mode: "insensitive" as const}},
        {variant: {contains: search, mode: "insensitive" as const}},
        {reservedBy: {is: {OR: [{name: {contains: search, mode: "insensitive" as const}}, {email: {contains: search, mode: "insensitive" as const}}]}}},
        {assignedTo: {is: {OR: [{name: {contains: search, mode: "insensitive" as const}}, {email: {contains: search, mode: "insensitive" as const}}]}}},
        {order: {is: {number: {contains: search, mode: "insensitive" as const}}}},
        ]} : {}),
    };
    const sortBy = productSortFields.find(field => field === params.sortBy) ?? "code";
    const direction = params.direction === "desc" ? "desc" as const : "asc" as const;
    const total = await db.product.count({where});
    const page = Math.min(params.page, Math.max(1, Math.ceil(total / params.pageSize)));
    const products = await db.product.findMany({
        where, skip: (page - 1) * params.pageSize, take: params.pageSize,
        orderBy: [{[sortBy]: direction}, {code: "asc"}],
        select: {
            code: true, variant: true, published: true, reachoutModes: true,
            reservedBy: {select: {name: true, email: true}}, reservedAt: true,
            assignedTo: {select: {name: true, email: true}}, assignedAt: true,
            order: {select: {number: true}}, createdAt: true,
        },
    });
    return {products, total, page};
}
