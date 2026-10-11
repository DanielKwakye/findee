"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";

/** Deletes selected unpublished products while protecting published inventory. */
export async function deleteProducts(codes: string[], includePublished = false) {
    await requireAdmin();
    if (!Array.isArray(codes) || !codes.length || codes.some(code => typeof code !== "string" || !code || code.length > 255)) throw new Error("Invalid product selection");
    return db.$transaction(async transaction => {
        const products = await transaction.product.findMany({
            where: {code: {in: codes}},
            select: {code: true, assignedToId: true, assignedTo: {select: {name: true, email: true}}},
        });
        const assignedCodes = new Set(products.filter(product => product.assignedToId).map(product => product.code));
        const assignedCode = codes.find(code => assignedCodes.has(code));
        if (assignedCode) {
            const product = products.find(product => product.code === assignedCode);
            return {assignedCode, assignedUser: product?.assignedTo?.name || product?.assignedTo?.email || product?.assignedToId || ""};
        }
        const result = await transaction.product.deleteMany({where: {code: {in: codes}, ...(includePublished ? {} : {published: false})}});
        if (!result.count) throw new Error("Product is published or no longer exists");
        return result;
    });
}
