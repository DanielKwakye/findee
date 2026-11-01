"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { getCheckoutAllocationError } from "@/features/checkout/utils/checkout.validations";
import { distributeCheckoutQuantity } from "@/features/checkout/utils/checkout.allocation";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import type { OrderDetails } from "@/features/orders/utils/order.types";
import { getCheckoutPlanPrice } from "@/features/checkout/utils/checkout.pricing";

/** Manages shared order fields, purchase options, and form validation. */
export function useOrderForm(initialValues: CheckoutValues, planDetail?: OrderDetails["planDetail"]) {
    const t = useTranslations("orders.create");
    const checkout = useTranslations("Checkout");
    const form = useForm<CheckoutValues>({ defaultValues: initialValues });
    const values = useWatch({ control: form.control });
    const plansQuery = useQuery({ queryKey: ["checkout", "plans"], queryFn: getCheckoutPlans });
    const plans = (plansQuery.data ?? []).map(option => getCheckoutPlanPrice(
        planDetail && option.id === initialValues.plan ? { ...option, ...planDetail } : option,
        values.customQuantity,
        Object.fromEntries((values.variants ?? []).map(variant => [variant, values.allocation?.[variant]])),
    ));
    const plan = plans.find(option => option.id === values.plan);
    const quantity = plan?.quantity;
    const allocationSetup = useRef(JSON.stringify([initialValues.plan, initialValues.customQuantity, initialValues.variants]));
    const setup = JSON.stringify([values.plan, quantity, values.variants ?? []]);
    const {setValue, clearErrors, getValues} = form;

    useEffect(() => {
        if (quantity === undefined || allocationSetup.current === setup) return;
        allocationSetup.current = setup;
        setValue("allocation", distributeCheckoutQuantity(getValues("variants"), quantity));
        clearErrors("root.allocation");
    }, [setup, quantity, setValue, clearErrors, getValues]);
    const inputs = {
        variants: { validate: (value: CheckoutValues["variants"]) => value.length > 0 || t("variantsRequired") },
        recoveryContact: {
            /** Requires at least one channel through which finders can contact the customer. */
            validate: () => form.getValues("contactByEmail") || form.getValues("contactByPhone") || checkout("details.contactRequired"),
        },
        email: form.register("email", { required: checkout("details.emailRequired"),
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: checkout("details.emailInvalid") } }),
        name: form.register("name"),
        phone: form.register("phone", {
            /** Requires a phone value when phone contact is enabled. */
            validate: value => !form.getValues("contactByPhone") || !!value.trim() || checkout("details.phoneRequired"),
        }),
        shippingAddress: form.register("shippingAddress", {
            /** Requires a destination for sticker delivery. */
            validate: value => !!value.trim() || checkout("details.addressRequired"),
        }),
    };

    /** Checks allocation totals without modifying any entered quantities. */
    function validateAllocation() {
        form.clearErrors("root.allocation");
        const current = form.getValues();
        if (plan?.minimumQuantity !== undefined && (typeof current.customQuantity !== "number"
            || !Number.isSafeInteger(current.customQuantity) || current.customQuantity < plan.minimumQuantity)) {
            form.setError("customQuantity", { message: checkout("plans.customQuantityInvalid", { minimum: plan.minimumQuantity }) });
            return false;
        }
        if (!plan || !current.variants.length) {
            form.setError("root.allocation", { message: t("purchaseRequired") });
            return false;
        }
        const error = getCheckoutAllocationError(current, plan);
        if (!error) return true;
        const total = current.variants.reduce((sum, variant) => sum + Number(current.allocation[variant] ?? 0), 0);
        form.setError("root.allocation", { message: checkout(`allocation.${error}`, {
            limit: plan.quantity, remaining: Math.max(0, plan.quantity - total), excess: Math.max(0, total - plan.quantity),
        }) });
        return false;
    }

    const variants = values.variants ?? [];
    const total = variants.reduce((sum, variant) => sum + Number(values.allocation?.[variant] ?? 0), 0);
    return { t, checkout, form, inputs, plansQuery, plans, plan, variants, total, validateAllocation };
}
