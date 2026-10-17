"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { PortalConfirmDialogHandle } from "@/components/platform";
import { closeCustomerAccount } from "@/features/auth/server/close.customer.account.action";
import { logout } from "@/features/auth/utils/auth.client";

/** Manages customer account closure, confirmation, and session cleanup. */
export function useCloseCustomerAccount() {
    const t = useTranslations("Auth.closeAccount");
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const queryClient = useQueryClient();
    const router = useRouter();
    const mutation = useMutation({ mutationFn: closeCustomerAccount, retry: false,
        /** Clears private cached data and leaves the closed account. */
        async onSuccess() {
            queryClient.clear();
            try { await logout(); } catch { router.replace("/"); router.refresh(); }
        },
    });

    /** Opens the account closure explanation and asks for an explicit confirmation. */
    function requestClosure() {
        confirmRef.current?.open({
            title: t("confirmTitle"), description: t("confirmation"), confirmLabel: t("confirm"),
            errorMessage: t("error"), destructive: true,
            confirmationText: "delete", confirmationLabel: t("confirmationLabel"),
            getErrorMessage: error => t(error instanceof Error && error.message === "outstandingOrders" ? "outstandingOrders" : "error"),
            onConfirm: () => mutation.mutateAsync(),
        });
    }

    return { t, confirmRef, mutation, requestClosure };
}
