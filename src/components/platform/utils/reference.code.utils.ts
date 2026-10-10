import { randomInt } from "node:crypto";

/** Generates a human-readable identifier for a Findee QR sticker. */
/** Generates reference codes shared by stickers and orders. */
export function generateReferenceCode() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => alphabet[randomInt(alphabet.length)]).join("")).join("-");
}
