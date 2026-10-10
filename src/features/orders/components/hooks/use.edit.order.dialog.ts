"use client";

import { useImperativeHandle, useState, type Ref } from "react";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getOrderDetails } from "@/features/orders/server/get.order.details.action";
import type { EditOrderDialogHandle } from "@/features/orders/utils/order.types";

/** Manages loading and the internal lifecycle of the order editing dialog. */
export function useEditOrderDialog(ref: Ref<EditOrderDialogHandle>) {
    const t = useTranslations("orders");
    const [id, setId] = useState<string | null>(null);
    const isSaving = useIsMutating({ mutationKey: ["orders", "edit", id] }) > 0;
    const query = useQuery({ queryKey: ["orders", "editDetails", id], queryFn: () => getOrderDetails(id!), enabled: !!id });
    useImperativeHandle(ref, () => ({
        /** Opens the editor for a selected order. */
        open(orderId) { if (!isSaving) setId(orderId); },
    }));
    /** Keeps the editor open while order changes are being saved. */
    function changeOpen(open: boolean) { if (!open && !isSaving) setId(null); }
    /** Dismisses the editor after the form saves successfully. */
    function onSaved() { setId(null); }
    return { t, id, isSaving, query, changeOpen, onSaved };
}
