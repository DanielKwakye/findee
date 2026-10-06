"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";
import {getQrGenerationError} from "@/features/procurement/utils/procurement.generation";
import {buildProcurementProducts} from "@/features/procurement/utils/procurement.codes";
import type {GenerateQrValues} from "@/features/procurement/utils/procurement.types";

/** Creates unpublished QR sticker inventory for an authorized administrator. */
export async function generateProcurementProducts(values: GenerateQrValues) {
    await requireAdmin();
    const error = getQrGenerationError(values);
    if (error) throw new Error(error);
    return db.product.createMany({data: buildProcurementProducts(values)});
}
