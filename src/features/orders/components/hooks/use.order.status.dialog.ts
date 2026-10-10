"use client";

import { useImperativeHandle, useState } from "react";
import type { Ref } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "@/components/core/ui/toast";
import { updateOrderStatus } from "@/features/orders/server/update.order.status.action";
import type { OrderStatusDialogHandle, OrderStatusDialogRecord, OrderStatusValues } from "@/features/orders/utils/order.types";

/** Manages status editing, saving, and the order dialog's internal lifecycle. */
export function useOrderStatusDialog(ref: Ref<OrderStatusDialogHandle>) {
    const t = useTranslations("orders");
    const queryClient = useQueryClient();
    const [order, setOrder] = useState<OrderStatusDialogRecord | null>(null);
    const form = useForm<OrderStatusValues>({ defaultValues: { status: "PENDING" } });
    const mutation = useMutation({ mutationFn: updateOrderStatus, retry: false,
        /** Refreshes order views after saving a status change. */
        async onSuccess() {
            toast.add({ title: t("statusDialog.saveSuccess"), type: "success" });
            await queryClient.invalidateQueries({ queryKey: ["orders"] });
            setOrder(null);
        },
        onError: () => { toast.add({ title: t("statusDialog.saveError"), type: "error" }); },
    });
    useImperativeHandle(ref, () => ({
        /** Opens status editing for the selected order. */
        open(record) {
            if (mutation.isPending) return;
            mutation.reset();
            form.reset({ status: record.status });
            setOrder(record);
        },
    }));

    /** Dismisses the status form while no save is in progress. */
    function changeOpen(open: boolean) {
        if (!open && !mutation.isPending) setOrder(null);
    }

    /** Submits the selected status for the current order. */
    const submit = form.handleSubmit(values => {
        if (!order || mutation.isPending) return;
        mutation.mutate({ id: order.id, status: values.status });
    });

    return { t, order, form, mutation, changeOpen, submit };
}
