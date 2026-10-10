"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { checkoutStepper } from "@/features/checkout/data/checkout.steps";
import type { CheckoutCustomer, CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { distributeCheckoutQuantity } from "@/features/checkout/utils/checkout.allocation";
import { submitCheckout } from "@/features/checkout/server/submit.checkout.action";
import { getCheckoutAllocationError } from "@/features/checkout/utils/checkout.validations";

/** Manages checkout navigation and the customer's variant selections. */
export function useCheckout(customer: CheckoutCustomer | null) {
    const t = useTranslations("Checkout");
    const router = useRouter();
    const queryClient = useQueryClient();
    const stepper = checkoutStepper.useStepper();
    const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
    const authenticatedEmail = customer?.email ?? verifiedEmail;
    const form = useForm<CheckoutValues>({ defaultValues: {
        variants: ["Everyday"], plan: "family", allocation: {}, email: customer?.email ?? "", name: customer?.name ?? "", phone: customer?.phone ?? "",
        contactByEmail: true, contactByPhone: false, showName: false, shippingAddress: "", deliveryInstructions: "",
    } });
    useEffect(() => {
        if (!customer) return;
        form.setValue("email", customer.email);
        if (!form.getFieldState("name").isDirty) form.setValue("name", customer.name ?? "");
        if (!form.getFieldState("phone").isDirty) form.setValue("phone", customer.phone ?? "");
    }, [customer, form]);
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
        onSuccess() {
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
    const continueDisabled = (stepper.current.id === "variants" && variants.length === 0)
        || (stepper.current.id === "plan" && (plansQuery.isPending || plansQuery.isError
            || !plan))
        || (stepper.current.id === "allocation" && (!plan || variants.length === 0))
        || stepper.current.id === "verification";
    const skipAllocation = variants.length === 1;
    const steps = checkoutStepper.steps
        .filter(step => !skipAllocation || step.id !== "allocation")
        .filter(step => !authenticatedEmail || step.id !== "verification")
        .map(step => ({ id: step.id, label: t(`steps.${step.id}`) }));
    const currentIndex = steps.findIndex(step => step.id === stepper.current.id);

    /** Validates the entered sticker allocation and updates its form notice. */
    function onAllocationKeyUp() {
        form.clearErrors("root.allocation");
        if (!plan) return false;
        const values = form.getValues();
        const error = getCheckoutAllocationError(values, plan);
        if (!error) return true;
        const total = values.variants.reduce((sum, variant) => sum + Number(values.allocation[variant] ?? 0), 0);
        form.setError("root.allocation", { type: "manual", message: t(`allocation.${error}`, {
            limit: plan.quantity, remaining: Math.max(0, plan.quantity - total),
            excess: Math.max(0, total - plan.quantity),
        }) });
        return false;
    }

    /** Advances checkout while preparing allocations for the selected purchase. */
    function onContinue() {
        if (continueDisabled) return;
        if (stepper.current.id === "allocation" && !onAllocationKeyUp()) return;
        form.clearErrors("root.allocation");
        if (stepper.current.id === "plan" && plan) {
            const setup = JSON.stringify([plan.id, plan.quantity, variants]);
            if (allocationSetup.current !== setup) {
                form.setValue("allocation", distributeCheckoutQuantity(variants, plan.quantity));
                allocationSetup.current = setup;
            }
            if (skipAllocation) {
                void stepper.goTo(authenticatedEmail ? "checkout" : "verification");
                return;
            }
        }
        const nextStep = steps[currentIndex + 1];
        if (nextStep) void stepper.goTo(nextStep.id);
    }

    /** Returns to the previous applicable checkout step. */
    function onBack() {
        form.clearErrors("root.allocation");
        const previousStep = steps[currentIndex - 1];
        if (previousStep) void stepper.goTo(previousStep.id);
    }

    /** Continues checkout with the authenticated customer identity. */
    function onVerified(email: string) {
        setVerifiedEmail(email);
        form.setValue("email", email);
        void stepper.goTo("checkout");
        void queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
        router.refresh();
    }

    /** Validates checkout details before displaying the payment placeholder. */
    async function onPay() {
        if (contactMissing || submission.isPending) return;
        const valid = await form.trigger(["email", "phone", "shippingAddress"], { shouldFocus: true });
        if (valid) submission.mutate(form.getValues());
    }

    return { t, form, stepper, steps, currentIndex, continueDisabled, plansQuery, onContinue, onBack,
        variants, plan, allocationTotal, allocationError: form.formState.errors.root?.allocation?.message, onAllocationKeyUp,
        contactInputs, shippingInput, contactMissing, submission, onPay, onVerified };
}
