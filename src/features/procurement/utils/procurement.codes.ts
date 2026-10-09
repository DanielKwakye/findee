import {randomInt} from "node:crypto";
import {qrVariants} from "@/features/procurement/utils/procurement.generation";
import type {GenerateQrValues} from "@/features/procurement/utils/procurement.types";
import {normalizeProductCode} from "@/features/products/utils/product.code";

/** Generates a human-readable identifier for a Findee QR sticker. */
function generateProductCode() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return normalizeProductCode(Array.from({length: 3}, () => Array.from({length: 3}, () => alphabet[randomInt(alphabet.length)]).join("")).join("-"));
}

/** Prepares unique sticker inventory records for the requested variant quantities. */
export function buildProcurementProducts(values: GenerateQrValues, excludedCodes: Iterable<string> = []) {
    const codes = new Set(Array.from(excludedCodes, normalizeProductCode));
    return qrVariants.flatMap(variant => Array.from({length: values[variant]}, () => {
        let code = generateProductCode();
        while (codes.has(code)) code = generateProductCode();
        codes.add(code);
        return {code, variant, reachoutModes: {phone: false, email: false, chat: false}};
    }));
}
