"use client";

import {useMemo, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useTranslations} from "next-intl";
import {toast} from "@/components/core/ui/toast";
import {useUserDateTime} from "@/components/platform";
import type {SortingState} from "@tanstack/react-table";
import type {PortalConfirmDialogHandle, PortalTablePaginationState, PortalTableRowSelection} from "@/components/platform";
import {getProcurementProducts} from "@/features/procurement/server/get.procurement.products.action";
import {updateProcurementProducts} from "@/features/procurement/server/update.procurement.products.action";
import {updateProcurementStatus} from "@/features/procurement/server/update.procurement.status.action";
import type {ProcurementMutation, ProcurementStatusValues} from "@/features/procurement/utils/procurement.types";
import {getProcurementColumns} from "@/features/procurement/utils/procurement.columns";
import {downloadProcurementCsv} from "@/features/procurement/utils/procurement.csv";
import {getProcurementRecoveryUrls} from "@/features/procurement/server/get.procurement.recovery.urls.action";
import type {ProductVariantFilterValue} from "@/features/products/utils/product.types";

/** Manages procurement inventory requests, table controls, and selected products. */
export function useProcurementTable() {
    const t = useTranslations("procurement");
    const formatDateTime = useUserDateTime();
    const queryClient = useQueryClient();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const statusForm = useForm<ProcurementStatusValues>({defaultValues: {status: "inactive"}});
    const [rowSelection, setRowSelection] = useState<PortalTableRowSelection>({});
    const [pagination, setPagination] = useState<PortalTablePaginationState>({page: 1, pageSize: 10});
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [variant, setVariant] = useState<ProductVariantFilterValue>("all");
    const query = useQuery({
        queryKey: ["procurement", pagination, search, sorting, variant],
        queryFn: () => getProcurementProducts({
            ...pagination, search, variant,
            sortBy: sorting[0] ? (sorting[0].id === "published" || sorting[0].id === "createdAt" || sorting[0].id === "procurementStatus" ? sorting[0].id : "code") : "createdAt",
            direction: !sorting[0] || sorting[0].desc ? "desc" : "asc",
        }),
        placeholderData: keepPreviousData,
    });
    /** Starts a fresh selection and result page when filtering inventory by variant. */
    function changeVariant(next: ProductVariantFilterValue) {
        setVariant(next);
        setPagination(current => ({...current, page: 1}));
        setRowSelection({});
    }
    const selectedCodes = Object.keys(rowSelection).filter(code => rowSelection[code]);
    const mutation = useMutation({
        mutationFn: (values: ProcurementMutation) => values.action === "status"
            ? updateProcurementStatus(values.codes, values.status)
            : updateProcurementProducts(values.codes, values.action),
        retry: false,
        /** Synchronizes inventory and selection after a successful bulk action. */
        async onSuccess(_data, values) {
            toast.add({title: t(`actionSuccess.${values.action}`), type: "success"});
            setRowSelection({});
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["procurement"]}),
                queryClient.invalidateQueries({queryKey: ["products"]}),
            ]);
        },
        onError: () => { toast.add({title: t("actionError"), type: "error"}); },
    });
    const columns = useMemo(() => getProcurementColumns({code: t("code"),
            published: t("published"),
            procurementStatus: t("procurementStatus"),
            inactive: t("inactive"),
            requested: t("requested"),
            received: t("received"),
            createdAt: t("createdAt"),
            yes: t("yes"),
            no: t("no")
        }, formatDateTime), [t, formatDateTime]);

    const downloadMutation = useMutation({
        mutationFn: getProcurementRecoveryUrls,
        retry: false,
        onSuccess: urls => {
            downloadProcurementCsv(urls, t("csvHeading"), t("csvFilename"));
            toast.add({title: t("downloadSuccess"), type: "success"});
        },
        onError: () => { toast.add({title: t("downloadError"), type: "error"}); },
    });

    /** Exports selected recovery links across inventory pages. */
    function downloadSelected() {
        if (!selectedCodes.length || downloadMutation.isPending) return;
        downloadMutation.mutate([...selectedCodes]);
    }

    /** Applies the chosen procurement status to the current selection. */
    function updateSelectedStatus(values: ProcurementStatusValues) {
        if (!selectedCodes.length || mutation.isPending) return;
        mutation.mutate({action: "status", codes: [...selectedCodes], status: values.status});
    }

    /** Applies selection actions after obtaining confirmation for deletion. */
    function updateSelected(action: "publish" | "unpublish" | "delete") {
        const codes = [...selectedCodes];
        if (action !== "delete") {
            mutation.mutate({action, codes});
            return;
        }
        confirmRef.current?.open({
            title: t("deleteConfirmTitle"), description: t("deleteConfirmDescription", {count: codes.length}),
            errorMessage: t("actionError"), confirmLabel: t("deleteSelected"), destructive: true,
            onConfirm: () => mutation.mutateAsync({action, codes}),
        });
    }
    return {t, query, mutation, columns, rowSelection, setRowSelection, selectedCount: selectedCodes.length,
        pagination: {...pagination, page: query.isPlaceholderData ? pagination.page : query.data?.page ?? pagination.page, total: query.data?.total ?? 0},
        setPagination, search, setSearch, setSorting, downloadSelected, updateSelected, confirmRef, variant, changeVariant,
        statusForm, updateSelectedStatus, downloadMutation};
}
