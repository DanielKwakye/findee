import ProductsTable from "@/features/products/components/ui/products-table";
import {requireAdmin} from "@/features/auth/server/auth.session";

/** Renders the portal's existing product management page. */
export default async function ProductsPage() {
    await requireAdmin();
    return <ProductsTable />;
}
