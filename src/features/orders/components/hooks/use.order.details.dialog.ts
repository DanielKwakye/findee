"use client";

import { useImperativeHandle, useState } from "react";
import type { Ref } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useUserDateTime } from "@/components/platform";
import { getOrderDetails } from "@/features/orders/server/get.order.details.action";
import { getOrderDetailGroups } from "@/features/orders/utils/order.details";
import type { OrderDetailsDialogHandle } from "@/features/orders/utils/order.types";

/** Manages the order details dialog and its on-demand data request. */
export function useOrderDetailsDialog(ref: Ref<OrderDetailsDialogHandle>) {
    const t = useTranslations("orders");
    const formatter = useFormatter();
    const formatDate = useUserDateTime();
    const [id, setId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        /** Opens details for the requested order. */
        open(orderId) { setId(orderId); setOpen(true); },
    }));
    const query = useQuery({
        queryKey: ["orders", "details", id],
        queryFn: () => getOrderDetails(id!),
        enabled: open && !!id,
    });
    const groups = query.data ? getOrderDetailGroups(query.data, t, formatDate,
        (price, currency) => formatter.number(price, { style: "currency", currency })) : [];
    return { t, open, changeOpen: setOpen, query, groups };
}
