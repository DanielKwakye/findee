import ProductsTable from "@/features/products/components/ui/products-table";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import {requireAdmin} from "@/features/auth/server/auth.session";

export const metadata: Metadata = { title: messages.PageMetadata.titles.products };

/** Renders the portal's existing product management page. */
export default async function ProductsPage() {
    await requireAdmin();
    return <ProductsTable />;
}
