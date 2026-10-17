/* Platform folder is designed for LAYOUT components (e.g. navbar, footer, sidebar)
 and hooks shared by all the features */
export { default as MobileNavbar } from "@/components/platform/ui/mobile/navbar";
export { Stepper } from "@/components/platform/ui/shared/stepper";
export { default as WebNavbar } from "@/components/platform/ui/web/navbar";
export { default as AppIcon } from "@/components/platform/ui/shared/app-icon";
export {useUserDateTime} from "@/components/platform/hooks/use.user.datetime";
export { default as MobileHero } from "@/components/platform/ui/mobile/hero";
export { default as WebHero } from "@/components/platform/ui/web/hero";
export { default as InnerPageHero } from "@/components/platform/ui/shared/inner-page-hero";
export { default as LegalPageContent } from "@/components/platform/ui/shared/legal-page-content";
export { default as CookieNotice } from "@/components/platform/ui/shared/cookie-notice";
export { default as HowItWorks } from "@/components/platform/ui/shared/how-it-works";
export { default as FAQ } from "@/components/platform/ui/shared/faq";
export { default as Testimonials } from "@/components/platform/ui/shared/testimonials";
export { default as Footer } from "@/components/platform/ui/shared/footer";
export { PortalSidebar } from "@/components/platform/ui/shared/portal-sidebar";
export { PortalBreadcrumb } from "@/components/platform/ui/shared/portal-breadcrumb";
export { PortalBadgeAlert } from "@/components/platform/ui/shared/portal-badge-alert";
export { PortalConfirmDialog } from "@/components/platform/ui/shared/portal-confirm-dialog";
export type { PortalConfirmDialogHandle } from "@/components/platform/utils/portal.confirm.dialog.types";
export { default as PortalTable } from "@/components/platform/ui/shared/portal-table";
export {usePortalTableSearch} from "@/components/platform/hooks/use.portal.table.search";
export type { PortalTableColumnDef, PortalTablePaginationState, PortalTableRowSelection } from "@/components/platform/utils/portal.table.types";
