"use client";

import {useMemo, useRef, useState} from "react";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useFormatter, useTranslations} from "next-intl";
import type {SortingState} from "@tanstack/react-table";
import type {PortalConfirmDialogHandle, PortalTablePaginationState, PortalTableRowSelection} from "@/components/platform";
import {getProducts} from "@/features/products/server/get.products.action";
import {deleteProducts} from "@/features/products/server/delete.products.action";
import {getProductColumns} from "@/features/products/utils/product.columns";
import type {ProductVariantFilterValue} from "@/features/products/utils/product.types";

/** Manages product inventory queries, table controls, and unpublished product deletion. */
export function useProductsTable() {
    const t = useTranslations("products");
    const variants = useTranslations("procurement.generation");
    const format = useFormatter();
    const queryClient = useQueryClient();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const [rowSelection, setRowSelection] = useState<PortalTableRowSelection>({});
    const [pagination, setPagination] = useState<PortalTablePaginationState>({page: 1, pageSize: 10});
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [variant, setVariant] = useState<ProductVariantFilterValue>("all");
    const query = useQuery({
        queryKey: ["products", pagination, search, sorting, variant],
        queryFn: () => getProducts({...pagination, search, variant, sortBy: sorting[0]?.id ?? "code", direction: sorting[0]?.desc ? "desc" : "asc"}),
        placeholderData: keepPreviousData,
    });
    const mutation = useMutation({
        mutationFn: deleteProducts,
        retry: false,
        /** Refreshes both product views after deleting inventory. */
        async onSuccess() {
            setRowSelection({});
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["products"]}),
                queryClient.invalidateQueries({queryKey: ["procurement"]}),
            ]);
        },
    });
    /** Starts a fresh selection and result page when filtering inventory by variant. */
    function changeVariant(next: ProductVariantFilterValue) {
        setVariant(next);
        setPagination(current => ({...current, page: 1}));
        setRowSelection({});
    }
    const selectedCodes = Object.keys(rowSelection).filter(code => rowSelection[code]);
    /** Requests confirmation for the selected unpublished inventory. */
    function requestDelete() {
        const codes = [...selectedCodes];
        confirmRef.current?.open({
            title: t("bulkDeleteConfirmTitle"), description: t("bulkDeleteConfirmDescription", {count: codes.length}),
            errorMessage: t("deleteError"), confirmLabel: t("deleteSelected"), destructive: true,
            onConfirm: () => mutation.mutateAsync(codes),
        });
    }
    const columns = useMemo(() => getProductColumns({
        code: t("code"), variant: t("variant"), published: t("published"), reachoutModes: t("reachoutModes"),
        reservedBy: t("reservedBy"), reservedAt: t("reservedAt"), assignedTo: t("assignedTo"), assignedAt: t("assignedAt"),
        order: t("order"), createdAt: t("createdAt"), yes: t("yes"), no: t("no"), unset: t("unset"), none: t("none"),
        phone: t("phone"), email: t("email"), chat: t("chat"),
    }, date => format.dateTime(date, {year: "numeric", month: "short", day: "numeric"}),
    {Everyday: variants("Everyday"), Fabric: variants("Fabric"), Tough: variants("Tough")}), [t, variants, format]);
    return {t, query, mutation, columns, search, setSearch, setSorting, setPagination, confirmRef, requestDelete,
        rowSelection, setRowSelection, selectedCount: selectedCodes.length, variant, changeVariant,
        pagination: {...pagination, page: query.isPlaceholderData ? pagination.page : query.data?.page ?? pagination.page, total: query.data?.total ?? 0}};
}
