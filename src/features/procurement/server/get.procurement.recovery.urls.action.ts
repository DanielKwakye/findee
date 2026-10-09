"use server";

import {requireAdmin} from "@/features/auth/server/auth.session";

/** Builds public recovery URLs for selected sticker codes using the server configuration. */
export async function getProcurementRecoveryUrls(codes: string[]) {
    await requireAdmin();
    if (!Array.isArray(codes) || !codes.length || codes.some(code => typeof code !== "string" || !code || code.length > 255)) {
        throw new Error("Invalid product selection");
    }
    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("APP_URL is not configured");
    const baseUrl = new URL(appUrl);
    if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") throw new Error("Invalid APP_URL");
    return codes.map(code => `${baseUrl.href.replace(/\/+$/, "")}/recovery/${encodeURIComponent(code)}`);
}
