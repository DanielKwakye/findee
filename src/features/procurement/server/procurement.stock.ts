import "server-only";

import { db } from "@/lib/db";
import { qrVariants } from "@/features/procurement/utils/procurement.generation";
import type { VariantStock } from "@/features/procurement/utils/procurement.types";

/** Reports published, unassigned inventory below each configured variant minimum. */
export async function getLowVariantStock(): Promise<VariantStock[]> {
    const configured = {
        Everyday: process.env.VARIANT_EVERYDAY_MIN_TRESHOLD,
        Fabric: process.env.VARIANT_FABRIC_MIN_TRESHOLD,
        Tough: process.env.VARIANT_TOUGH_MIN_TRESHOLD,
    };
    const thresholds = qrVariants.flatMap(variant => {
        const value = configured[variant]?.trim();
        if (!value) return [];
        const threshold = Number(value);
        if (!/^\d+$/.test(value) || !Number.isSafeInteger(threshold)) {
            throw new Error(`Invalid minimum stock threshold for ${variant}`);
        }
        return [{ variant, threshold }];
    });
    if (!thresholds.length) return [];
    const stock = await db.product.groupBy({
        by: ["variant"],
        where: {
            published: true,
            variant: { in: thresholds.map(({ variant }) => variant) },
            OR: [{ assignedToId: null }, { assignedToId: { isSet: false } }],
        },
        _count: { _all: true },
    });
    return thresholds.map(({ variant, threshold }) => ({
        variant, threshold, count: stock.find(item => item.variant === variant)?._count._all ?? 0,
    })).filter(item => item.count < item.threshold);
}
