"use client";

import { useImperativeHandle, useState } from "react";
import type { Ref } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { createOrderShipment } from "@/features/orders/server/create.order.shipment.action";
import { updateOrderShipment } from "@/features/orders/server/update.order.shipment.action";
import { toast } from "@/components/core/ui/toast";
import type { AddOrderShipmentDialogHandle, OrderShipmentValues, OrderStatusDialogRecord } from "@/features/orders/utils/order.types";

/** Manages shipment form validation, creation, and the dialog lifecycle. */
export function useAddOrderShipmentDialog(ref: Ref<AddOrderShipmentDialogHandle>) {
    const t = useTranslations("orders.shipments.addForm");
    const queryClient = useQueryClient();
    const [order, setOrder] = useState<OrderStatusDialogRecord | null>(null);
    const [shipmentId, setShipmentId] = useState<string | null>(null);
    const form = useForm<OrderShipmentValues>({ defaultValues: {
        carrier: "", trackingNumber: "",
    } });
    const mutation = useMutation({ mutationFn: (values: OrderShipmentValues & { orderId: string }) => shipmentId
        ? updateOrderShipment({ ...values, id: shipmentId }) : createOrderShipment(values), retry: false,
        /** Refreshes shipment and order details after a new record is saved. */
        async onSuccess() {
            toast.add({ title: t(shipmentId ? "updateSuccess" : "saveSuccess"), type: "success" });
            await queryClient.invalidateQueries({ queryKey: ["orders"] });
            setOrder(null);
        },
        onError: () => { toast.add({ title: t(shipmentId ? "updateError" : "saveError"), type: "error" }); },
    });
    useImperativeHandle(ref, () => ({
        /** Opens an empty shipment form for the selected order. */
        open(record, shipment) {
            if (mutation.isPending) return;
            mutation.reset();
            setShipmentId(shipment?.id ?? null);
            form.reset({ carrier: shipment?.carrier ?? "", trackingNumber: shipment?.trackingNumber ?? "" });
            setOrder(record);
        },
    }));
    const inputs = {
        carrier: form.register("carrier"), trackingNumber: form.register("trackingNumber"),
    };

    /** Dismisses the creation dialog while no save is in progress. */
    function changeOpen(open: boolean) { if (!open && !mutation.isPending) setOrder(null); }

    /** Saves shipment information for the selected order. */
    const submit = form.handleSubmit(values => {
        if (!order || mutation.isPending) return;
        mutation.mutate({ ...values, orderId: order.id });
    });
    return { t, order, form, mutation, inputs, changeOpen, submit, isUpdating: !!shipmentId };
}
