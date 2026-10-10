"use client";

import { useCreateOrderForm } from "@/features/orders/components/hooks/use.create.order.form";
import OrderFormFields from "@/features/orders/components/ui/order-form-fields";

/** Presents a standalone staff order form for page or dialog containers. */
export default function CreateOrderForm({ onCreated }: { onCreated?: (number: string) => void }) {
    const state = useCreateOrderForm(onCreated);
    return <OrderFormFields state={state} mutation={state.mutation} submit={state.submit}
        submitLabel={state.t("submit")} errorMessage={state.t("error")} />;
}
