import {requireAdmin} from "@/features/auth/server/auth.session";
import ProcurementHeader from "@/features/procurement/components/ui/procurement-header";
import ProcurementTable from "@/features/procurement/components/ui/procurement-table";

/** Presents the administrator's procurement workspace. */
export default async function ProcurementPage() {
    await requireAdmin();
    return (
        <div className="flex min-w-0 flex-col gap-4">
            <ProcurementHeader />
            <ProcurementTable />
        </div>
    )
}
