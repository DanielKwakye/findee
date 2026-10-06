"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";

/** Applies an inventory action to the administrator's selected products. */
export async function updateProcurementProducts(codes: string[], action: "publish" | "unpublish" | "delete") {
    await requireAdmin();
    if (!Array.isArray(codes) || codes.length === 0 || codes.some(code => typeof code !== "string" || !code || code.length > 255)) {
        throw new Error("Invalid product selection");
    }
    const where = {code: {in: codes}};
    if (action === "delete") return db.product.deleteMany({where});
    if (action !== "publish" && action !== "unpublish") throw new Error("Invalid procurement action");
    return db.product.updateMany({where, data: {published: action === "publish"}});
}
