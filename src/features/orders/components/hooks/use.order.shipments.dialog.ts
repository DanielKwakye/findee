"use client";

import { useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "@/components/core/ui/toast";
import type { PortalConfirmDialogHandle } from "@/components/platform";
import { getOrderShipments } from "@/features/orders/server/get.order.shipments.action";
import { deleteOrderShipment } from "@/features/orders/server/delete.order.shipment.action";
import { getOrderShipmentGroups } from "@/features/orders/utils/order.shipments";
import type { AddOrderShipmentDialogHandle, OrderShipmentsDialogHandle, OrderStatusDialogRecord } from "@/features/orders/utils/order.types";

/** Manages the shipment list dialog and confirmed record deletion. */
export function useOrderShipmentsDialog(ref: Ref<OrderShipmentsDialogHandle>) {
    const t = useTranslations("orders");
    const queryClient = useQueryClient();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const updateRef = useRef<AddOrderShipmentDialogHandle>(null);
    const [order, setOrder] = useState<OrderStatusDialogRecord | null>(null);
    const query = useQuery({ queryKey: ["orders", "shipments", order?.id], queryFn: () => getOrderShipments(order!.id), enabled: !!order });
    const mutation = useMutation({ mutationFn: deleteOrderShipment, retry: false,
        /** Refreshes order and shipment views after record deletion. */
        async onSuccess() {
            toast.add({ title: t("shipments.deleteSuccess"), type: "success" });
            await queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => { toast.add({ title: t("shipments.deleteError"), type: "error" }); },
    });
    useImperativeHandle(ref, () => ({
        /** Opens shipment records for the selected order. */
        open(record) { if (!mutation.isPending) setOrder(record); },
    }));

    /** Dismisses the shipment list while no deletion is in progress. */
    function changeOpen(open: boolean) { if (!open && !mutation.isPending) setOrder(null); }

    /** Opens tracking editing after dismissing the shipment list. */
    function requestUpdate(id: string) {
        const shipment = query.data?.find(record => record.id === id);
        if (!order || !shipment || mutation.isPending) return;
        setOrder(null);
        updateRef.current?.open(order, shipment);
    }

    /** Requests confirmation before removing an order's shipment record. */
    function requestDelete(id: string) {
        if (!order || mutation.isPending) return;
        const orderId = order.id;
        confirmRef.current?.open({
            title: t("shipments.deleteTitle"), description: t("shipments.deleteDescription"),
            errorMessage: t("shipments.deleteError"), confirmLabel: t("shipments.delete"), destructive: true,
            onConfirm: () => mutation.mutateAsync({ orderId, id }),
        });
    }

    const groups = query.data ? getOrderShipmentGroups(query.data, t) : [];
    return { t, order, query, mutation, groups, confirmRef, updateRef, changeOpen, requestDelete, requestUpdate };
}
