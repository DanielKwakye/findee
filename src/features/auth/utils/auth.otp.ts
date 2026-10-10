import "server-only";
import { randomInt } from "node:crypto";

/** Generates a random four-digit code for customer verification. */
export function generateOtpCode() {
    return randomInt(0, 10000).toString().padStart(4, "0");
}
