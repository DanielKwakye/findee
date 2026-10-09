"use client";

import { useForm, useWatch } from "react-hook-form";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { checkoutStepper } from "@/features/checkout/data/checkout.steps";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { distributeCheckoutQuantity } from "@/features/checkout/utils/checkout.allocation";
import { submitCheckout } from "@/features/checkout/server/submit.checkout.action";

/** Manages checkout navigation and the customer's variant selections. */
export function useCheckout() {
    const t = useTranslations("Checkout");
    const router = useRouter();
    const stepper = checkoutStepper.useStepper();
    const form = useForm<CheckoutValues>({ defaultValues: {
        variants: ["Everyday"], plan: "family", allocation: {}, email: "", name: "", phone: "",
        contactByEmail: true, contactByPhone: false, showName: false, shippingAddress: "",
    } });
    const allocationSetup = useRef("");
    const variants = useWatch({ control: form.control, name: "variants" });
    const selectedPlan = useWatch({ control: form.control, name: "plan" });
    const allocation = useWatch({ control: form.control, name: "allocation" });
    const [contactByEmail, contactByPhone] = useWatch({ control: form.control,
        name: ["contactByEmail", "contactByPhone"] });
    const submission = useMutation({
        mutationFn: submitCheckout,
        retry: false,
        /** Opens the order acknowledgement after a valid checkout response. */
        onSuccess(url) {
            const returnedUrl = new URL(url);
            if (returnedUrl.protocol !== "https:") throw new Error("Invalid checkout response");
            router.push("/checkout/order-received");
        },
    });
    const contactMissing = !contactByEmail && !contactByPhone;
    const contactInputs = {
        email: form.register("email", {
            required: t("details.emailRequired"),
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("details.emailInvalid") },
        }),
        name: form.register("name"),
        phone: form.register("phone", {
            /** Requires a reachable phone value when phone contact is enabled. */
            validate: value => !form.getValues("contactByPhone") || value.trim().length > 0 || t("details.phoneRequired"),
        }),
    };
    const shippingInput = form.register("shippingAddress", {
        /** Requires a shipping destination for physical stickers. */
        validate: value => value.trim().length > 0 || t("details.addressRequired"),
    });
    const plansQuery = useQuery({
        queryKey: ["checkout", "plans"],
        queryFn: getCheckoutPlans,
        enabled: stepper.current.id === "plan",
    });
    const plan = plansQuery.data?.find(plan => plan.id === selectedPlan);
    const allocationTotal = variants.reduce((total, variant) => total + Number(allocation[variant] ?? 0), 0);
    const allocationInvalid = variants.some(variant => {
        const quantity = allocation[variant];
        return typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 0;
    });
    const allocationOverLimit = !!plan && allocationTotal > plan.quantity;
    const continueDisabled = (stepper.current.id === "variants" && variants.length === 0)
        || (stepper.current.id === "plan" && (plansQuery.isPending || plansQuery.isError
            || !plan))
        || (stepper.current.id === "allocation" && (!plan || variants.length === 0 || allocationInvalid || allocationOverLimit));
    const skipAllocation = variants.length === 1;
    const steps = checkoutStepper.steps
        .filter(step => !skipAllocation || step.id !== "allocation")
        .map(step => ({ id: step.id, label: t(`steps.${step.id}`) }));
    const currentIndex = steps.findIndex(step => step.id === stepper.current.id);

    /** Advances checkout while preparing allocations for the selected purchase. */
    function onContinue() {
        if (continueDisabled) return;
        if (stepper.current.id === "plan" && plan) {
            const setup = JSON.stringify([plan.id, plan.quantity, variants]);
            if (allocationSetup.current !== setup) {
                form.setValue("allocation", distributeCheckoutQuantity(variants, plan.quantity));
                allocationSetup.current = setup;
            }
            if (skipAllocation) {
                void stepper.goTo("checkout");
                return;
            }
        }
        void stepper.next();
    }

    /** Returns to the previous applicable checkout step. */
    function onBack() {
        if (stepper.current.id === "checkout" && skipAllocation) {
            void stepper.goTo("plan");
            return;
        }
        void stepper.prev();
    }

    /** Validates checkout details before displaying the payment placeholder. */
    async function onPay() {
        if (contactMissing || submission.isPending) return;
        const valid = await form.trigger(["email", "phone", "shippingAddress"], { shouldFocus: true });
        if (valid) submission.mutate(form.getValues());
    }

    return { t, form, stepper, steps, currentIndex, continueDisabled, plansQuery, onContinue, onBack,
        variants, plan, allocationTotal, allocationInvalid, allocationOverLimit,
        contactInputs, shippingInput, contactMissing, submission, onPay };
}
