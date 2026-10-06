import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/core/ui/sidebar";
import {Separator} from "@/components/core/ui/separator";
import {PortalSidebar, PortalBreadcrumb} from "@/components/platform";
import {ReactNode} from "react";
import {requireAdmin} from "@/features/auth/server/auth.session";

/** Provides the authorized administrator's portal layout. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await requireAdmin();
    return (
        <SidebarProvider>
            <PortalSidebar user={user} />
            <SidebarInset className="min-w-0">
                <header className="sticky top-0 z-20 bg-background flex min-h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-12">
                    <div className="flex min-w-0 items-center gap-2 px-4 py-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-vertical:h-4 data-vertical:self-center"
                        />
                        <PortalBreadcrumb />
                    </div>
                </header>
                <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0">
                    { children }
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
