"use client";

import { useUpdateOrderForm } from "@/features/orders/components/hooks/use.update.order.form";
import OrderFormFields from "@/features/orders/components/ui/order-form-fields";
import type { OrderDetails } from "@/features/orders/utils/order.types";

/** Presents the prefilled form for updating an existing order. */
export default function UpdateOrderForm({ id, order, onUpdated }: {
    id: string; order: OrderDetails; onUpdated?: (number: string) => void;
}) {
    const state = useUpdateOrderForm(id, order, onUpdated);
    return <OrderFormFields state={state} mutation={state.mutation} submit={state.submit} readOnlyEmail
        submitLabel={state.t("updateSubmit")} errorMessage={state.t("updateError")} />;
}
