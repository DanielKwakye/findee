import {requireAdmin} from "@/features/auth/server/auth.session";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import ProcurementHeader from "@/features/procurement/components/ui/procurement-header";
import ProcurementTable from "@/features/procurement/components/ui/procurement-table";

export const metadata: Metadata = { title: messages.PageMetadata.titles.procurement };

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
