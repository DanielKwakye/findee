/** Normalizes sticker codes for storage and exact indexed lookups. */
export function normalizeProductCode(code: string) {
    return code.trim().toUpperCase();
}
