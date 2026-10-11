"use client";

import {useImperativeHandle, useState, type Ref} from "react";
import {useIsMutating} from "@tanstack/react-query";
import {useTranslations} from "next-intl";
import type {CreateOrderDialogHandle} from "@/features/orders/utils/order.types";

/** Manages the internal lifecycle of the order creation dialog. */
export function useCreateOrderDialog(ref: Ref<CreateOrderDialogHandle>) {
    const t = useTranslations("orders");
    const [open, setOpen] = useState(false);
    const isSaving = useIsMutating({mutationKey: ["orders", "create"]}) > 0;
    useImperativeHandle(ref, () => ({
        /** Opens the order entry dialog. */
        open() { if (!isSaving) setOpen(true); },
    }));
    /** Keeps order entry open while a submission is being saved. */
    function changeOpen(next: boolean) { if (!isSaving) setOpen(next); }
    /** Dismisses order entry after successful creation. */
    function onCreated() { setOpen(false); }
    return {t, open, isSaving, changeOpen, onCreated};
}
