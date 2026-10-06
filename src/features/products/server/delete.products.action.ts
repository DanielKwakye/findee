"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";

/** Deletes selected unpublished products while protecting published inventory. */
export async function deleteProducts(codes: string[]) {
    await requireAdmin();
    if (!Array.isArray(codes) || !codes.length || codes.some(code => typeof code !== "string" || !code || code.length > 255)) throw new Error("Invalid product selection");
    const result = await db.product.deleteMany({where: {code: {in: codes}, published: false}});
    if (!result.count) throw new Error("Product is published or no longer exists");
    return result;
}
