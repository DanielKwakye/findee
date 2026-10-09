/* Platform folder is designed for LAYOUT components (e.g. navbar, footer, sidebar)
 and hooks shared by all the features */
export { default as MobileNavbar } from "@/components/platform/ui/mobile/navbar";
export { default as WebNavbar } from "@/components/platform/ui/web/navbar";
export { default as AppIcon } from "@/components/platform/ui/shared/app-icon";
export {useUserDateTime} from "@/components/platform/hooks/use.user.datetime";
export { default as MobileHero } from "@/components/platform/ui/mobile/hero";
export { default as WebHero } from "@/components/platform/ui/web/hero";
export { PortalSidebar } from "@/components/platform/ui/shared/portal-sidebar";
export { PortalBreadcrumb } from "@/components/platform/ui/shared/portal-breadcrumb";
export { PortalConfirmDialog } from "@/components/platform/ui/shared/portal-confirm-dialog";
export type { PortalConfirmDialogHandle } from "@/components/platform/utils/portal.confirm.dialog.types";
export { default as PortalTable } from "@/components/platform/ui/shared/portal-table";
export type { PortalTableColumnDef, PortalTablePaginationState, PortalTableRowSelection } from "@/components/platform/utils/portal.table.types";
