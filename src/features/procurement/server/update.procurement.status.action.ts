"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";
import type {ProcurementStatus} from "@/generated/client";

/** Updates the procurement status of selected inventory records. */
export async function updateProcurementStatus(codes: string[], status: ProcurementStatus) {
    await requireAdmin();
    if (!Array.isArray(codes) || !codes.length || codes.some(code => typeof code !== "string" || !code || code.length > 255)) throw new Error("Invalid product selection");
    if (status !== "inactive" && status !== "requested" && status !== "received") throw new Error("Invalid procurement status");
    return db.product.updateMany({where: {code: {in: codes}}, data: {procurementStatus: status}});
}
