"use server";

import {db} from "@/lib/db";
import {normalizeProductCode} from "@/features/products/utils/product.code";

/** Retrieves the public owner details and permitted contact modes for a recovery code. */
export async function getRecoveryProduct(incomingCode: string) {
    if (typeof incomingCode !== "string") return null;
    const code = normalizeProductCode(incomingCode);
    if (!code || code.length > 255) return null;
    const product = await db.product.findUnique({
        where: {code, published: true, assignedToId: {not: null}},
        select: {
            published: true,
            reachoutModes: true,
            assignedTo: {select: {name: true, email: true, phone: true}},
        },
    });
    if (!product?.assignedTo) return null;
    return {
        published: product.published,
        reachoutModes: product.reachoutModes,
        assignedTo: {
            name: product.assignedTo.name,
            email: product.reachoutModes?.email ? product.assignedTo.email : null,
            phone: product.reachoutModes?.phone ? product.assignedTo.phone : null,
        },
    };
}
