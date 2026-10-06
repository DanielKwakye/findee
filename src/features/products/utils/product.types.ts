import type {getProducts} from "@/features/products/server/get.products.action";

export type ProductRow = Awaited<ReturnType<typeof getProducts>>["products"][number];
export type ProductVariantFilterValue = "all" | "Everyday" | "Fabric" | "Tough";
export type ProductQuery = {page: number; pageSize: number; search: string; sortBy: string; direction: "asc" | "desc"; variant: ProductVariantFilterValue};
export const productSortFields = ["code", "variant", "published", "reservedAt", "assignedAt", "createdAt"] as const;
