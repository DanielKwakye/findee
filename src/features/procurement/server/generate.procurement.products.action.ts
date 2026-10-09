"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";
import {db} from "@/lib/db";
import {getQrGenerationError} from "@/features/procurement/utils/procurement.generation";
import {buildProcurementProducts} from "@/features/procurement/utils/procurement.codes";
import type {GenerateQrValues} from "@/features/procurement/utils/procurement.types";
import {Prisma} from "@/generated/client";

/** Creates unpublished QR sticker inventory for an authorized administrator. */
export async function generateProcurementProducts(values: GenerateQrValues) {
    await requireAdmin();
    const error = getQrGenerationError(values);
    if (error) throw new Error(error);
    const excludedCodes = new Set<string>();
    for (let attempt = 0; attempt < 5; attempt++) {
        let products = buildProcurementProducts(values, excludedCodes);
        for (let check = 0; check < 5; check++) {
            const existing = await db.product.findMany({
                where: {code: {in: products.map(product => product.code)}},
                select: {code: true},
            });
            if (!existing.length) break;
            existing.forEach(product => excludedCodes.add(product.code));
            const replacements = buildProcurementProducts(values, [...excludedCodes, ...products.map(product => product.code)]);
            const collisions = new Set(existing.map(product => product.code));
            products = products.map((product, index) => collisions.has(product.code) ? {...product, code: replacements[index].code} : product);
        }
        try {
            return await db.$transaction(transaction => transaction.product.createMany({data: products}));
        } catch (error) {
            if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
            products.forEach(product => excludedCodes.add(product.code));
        }
    }
    throw new Error("Unable to generate unique product codes. Please try again.");
}
