import {generateReferenceCode} from "@/components/platform/utils/reference.code.utils";
import {qrVariants} from "@/features/procurement/utils/procurement.generation";
import type {GenerateQrValues} from "@/features/procurement/utils/procurement.types";
import {normalizeProductCode} from "@/features/products/utils/product.code";

/** Prepares unique sticker inventory records for the requested variant quantities. */
export function buildProcurementProducts(values: GenerateQrValues, excludedCodes: Iterable<string> = []) {
    const codes = new Set(Array.from(excludedCodes, normalizeProductCode));
    return qrVariants.flatMap(variant => Array.from({length: values[variant]}, () => {
        let code = generateReferenceCode();
        while (codes.has(code)) code = generateReferenceCode();
        codes.add(code);
        return {code, variant, reachoutModes: {phone: false, email: false, chat: false}};
    }));
}
