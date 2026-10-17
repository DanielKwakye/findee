"use client";

import { createElement, useCallback, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getUsers } from "@/features/auth/server/get.users.action";
import { getCustomerColumns } from "@/features/auth/utils/customer.columns";
import { useUserDateTime } from "@/components/platform";
import type { PortalConfirmDialogHandle, PortalTableColumnDef } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import type { CustomerRow } from "@/features/auth/utils/auth.types";
import { setCustomerDeactivation } from "@/features/auth/server/set.customer.deactivation.action";

/** Manages customer records and the customer management table's behavior. */
export function useCustomersTable() {
    const t = useTranslations("Customers");
    const formatDate = useUserDateTime();
    const queryClient = useQueryClient();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const mutation = useMutation({
        mutationFn: setCustomerDeactivation,
        retry: false,
        /** Refreshes customer access status after an administrator changes it. */
        onSuccess() { return queryClient.invalidateQueries({ queryKey: ["customers"] }); },
    });
    const { mutateAsync } = mutation;
    /** Confirms a temporary suspension or restoration of the selected customer's access. */
    const changeAccess = useCallback((customer: CustomerRow) => {
        const deactivated = !customer.deactivatedAt;
        confirmRef.current?.open({
            title: t(deactivated ? "deactivate" : "reactivate"),
            description: t(deactivated ? "deactivateDescription" : "reactivateDescription", { email: customer.email }),
            confirmLabel: t(deactivated ? "deactivate" : "reactivate"),
            errorMessage: t("accessError"), destructive: deactivated,
            onConfirm: () => mutateAsync({ id: customer.id, deactivated }),
        });
    }, [t, mutateAsync]);
    const query = useQuery({ queryKey: ["customers"], queryFn: () => getUsers("CUSTOMER") });
    const columns = useMemo<PortalTableColumnDef<CustomerRow>[]>(() => [...getCustomerColumns({
        name: t("name"), email: t("email"), phone: t("phone"), status: t("status"),
        active: t("active"), closed: t("closed"), noName: t("noName"),
        createdAt: t("createdAt"),
        lastVisited: t("lastVisited"), notRecorded: t("notRecorded"),
        deactivated: t("deactivated"),
    }, formatDate), {
        id: "actions", header: t("actions"), enableSorting: false, enableHiding: false,
        cell: ({ row }) => row.original.closedAt ? null : createElement(Button, {
            type: "button", variant: "outline", size: "sm", disabled: mutation.isPending,
            className: row.original.deactivatedAt
                ? "border-success/20 bg-success/10 text-success hover:bg-success/20 hover:text-success"
                : "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive",
            onClick: () => changeAccess(row.original),
        }, createElement(TypographyBody, null, t(row.original.deactivatedAt ? "reactivate" : "deactivate"))),
    }], [t, formatDate, changeAccess, mutation.isPending]);
    return { t, query, columns, confirmRef };
}
