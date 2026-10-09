import "dotenv/config";
import {PrismaClient} from "@/generated/client";
import {normalizeProductCode} from "@/features/products/utils/product.code";

/** Audits existing sticker codes and optionally normalizes them without merging conflicting products. */
async function normalizeExistingProductCodes() {
    const db = new PrismaClient();
    try {
        const products = await db.product.findMany({select: {id: true, code: true}});
        const codes = new Set<string>();
        for (const product of products) {
            const code = normalizeProductCode(product.code);
            if (!code || codes.has(code)) throw new Error("Existing codes contain an empty value or a case-insensitive duplicate. Resolve these before normalization.");
            codes.add(code);
        }
        const changes = products.filter(product => product.code !== normalizeProductCode(product.code));
        const shipments = await db.shipment.findMany({select: {id: true, productCodes: true}});
        const shipmentChanges = shipments.filter(shipment => shipment.productCodes.some(code => code !== normalizeProductCode(code)));
        if (!process.argv.includes("--apply")) {
            console.log(`${changes.length} product codes and ${shipmentChanges.length} shipment code lists need normalization. Run with --apply during a maintenance window to update them.`);
            return;
        }
        for (let offset = 0; offset < shipmentChanges.length; offset += 150) {
            await db.$transaction(shipmentChanges.slice(offset, offset + 150).map(shipment => db.shipment.update({
                where: {id: shipment.id}, data: {productCodes: shipment.productCodes.map(normalizeProductCode)},
            })));
        }
        for (let offset = 0; offset < changes.length; offset += 150) {
            await db.$transaction(changes.slice(offset, offset + 150).map(product => db.product.update({
                where: {id: product.id}, data: {code: normalizeProductCode(product.code)},
            })));
        }
        console.log(`Normalized ${changes.length} product codes.`);
    } finally {
        await db.$disconnect();
    }
}

normalizeExistingProductCodes().catch(() => {
    console.error("Code normalization failed. Check connectivity and resolve empty or duplicate codes before retrying.");
    process.exitCode = 1;
});
