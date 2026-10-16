"use server";

import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/features/auth/server/auth.session";
import type { CustomerProfileValues } from "@/features/auth/utils/auth.types";
import { db } from "@/lib/db";

/** Updates the signed-in customer's editable account details. */
export async function updateCustomerProfile(values: CustomerProfileValues) {
    const user = await requireCustomer();
    if (!values || typeof values.name !== "string" || typeof values.phone !== "string"
        || values.name.trim().length > 100 || values.phone.trim().length > 50) {
        throw new Error("invalidProfile");
    }
    const profile = await db.user.update({
        where: { id: user.id, role: "CUSTOMER" },
        data: { name: values.name.trim() || null, phone: values.phone.trim() || null },
        select: { name: true, phone: true },
    });
    revalidatePath("/customer", "layout");
    return { name: profile.name ?? "", phone: profile.phone ?? "" };
}
