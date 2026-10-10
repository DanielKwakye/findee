"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/core/ui/toast";
import { updateOrderDetails } from "@/features/orders/server/update.order.details.action";
import { getOrderEditValues } from "@/features/orders/utils/order.edit";
import { useOrderForm } from "@/features/orders/components/hooks/use.order.form";
import type { OrderDetails } from "@/features/orders/utils/order.types";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

/** Manages prefilling, validating, and saving changes to an existing order. */
export function useUpdateOrderForm(id: string, order: OrderDetails, onUpdated?: (number: string) => void) {
    const state = useOrderForm(getOrderEditValues(order), order.planDetail);
    const { t, form, validateAllocation } = state;
    const queryClient = useQueryClient();
    const mutation = useMutation({ mutationKey: ["orders", "edit", id],
        mutationFn: (current: CheckoutValues) => updateOrderDetails(id, current), retry: false,
        /** Refreshes order views and reports the completed update. */
        async onSuccess(number) {
            toast.add({ title: t("updateSuccess", { number }), type: "success" });
            await queryClient.invalidateQueries({ queryKey: ["orders"] });
            onUpdated?.(number);
        },
        onError: () => { toast.add({ title: t("updateError"), type: "error" }); },
    });
    /** Submits validated changes for the current order. */
    const submit = form.handleSubmit(current => {
        if (mutation.isPending || !validateAllocation()) return;
        mutation.mutate(current);
    });
    return { ...state, mutation, submit };
}
