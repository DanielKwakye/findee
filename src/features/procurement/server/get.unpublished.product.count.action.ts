"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Counts inventory products that have not been published. */
export async function getUnpublishedProductCount() {
    await requireAdmin();
    return db.product.count({ where: { published: false } });
}
