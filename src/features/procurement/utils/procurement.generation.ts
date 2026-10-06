import type {GenerateQrValues} from "@/features/procurement/utils/procurement.types";

export const qrVariants = ["Everyday", "Fabric", "Tough"] as const;
export const initialQrQuantities: GenerateQrValues = {Everyday: 0, Fabric: 0, Tough: 0};
export const maxQrVariantQuantity = 50;
export const maxQrGenerationQuantity = 150;

/** Checks that a variant quantity is within the permitted whole-number range. */
export function isValidQrQuantity(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= maxQrVariantQuantity;
}

/** Validates the quantities requested for a QR inventory batch. */
export function getQrGenerationError(values: GenerateQrValues) {
    if (!values || typeof values !== "object" || qrVariants.some(variant => !isValidQrQuantity(values[variant]))) return "quantityInvalid";
    const total = qrVariants.reduce((sum, variant) => sum + values[variant], 0);
    if (total === 0) return "quantityRequired";
    if (total > maxQrGenerationQuantity) return "quantityLimit";
    return null;
}
