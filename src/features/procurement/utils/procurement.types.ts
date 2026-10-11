import type {ProductVariantFilterValue} from "@/features/products/utils/product.types";
import type {ProcurementStatus} from "@/generated/client";

export type ProcurementProduct = { code: string; variant: string; published: boolean; procurementStatus: ProcurementStatus; assignedTo: {name: string | null; email: string} | null; createdAt: Date };

export type ProcurementQuery = {
    page: number;
    pageSize: number;
    search: string;
    sortBy: "code" | "variant" | "published" | "procurementStatus" | "createdAt";
    direction: "asc" | "desc";
    variant: ProductVariantFilterValue;
};

export type GenerateQrValues = { Everyday: number; Fabric: number; Tough: number };
export type GenerateQrDialogHandle = { open: () => void };

export const procurementStatuses = ["inactive", "requested", "received"] as const;
export type ProcurementStatusValues = {status: ProcurementStatus};
export type ProcurementMutation = {codes: string[]} & (
    {action: "publish" | "unpublish" | "delete"} | {action: "status"; status: ProcurementStatus}
);
