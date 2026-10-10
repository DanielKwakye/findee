import type { useTranslations } from "next-intl";
import { createElement } from "react";
import type { ReactNode } from "react";
import OrderStatusBadge from "@/features/orders/components/ui/order-status-badge";
import type { OrderDetails } from "@/features/orders/utils/order.types";
import { orderDetailGroups } from "@/features/orders/data/order.details";
import { getOrderShipmentGroups } from "@/features/orders/utils/order.shipments";

/** Formats order fields and related records as localized label-and-value rows. */
export function getOrderDetailGroups(order: OrderDetails, t: ReturnType<typeof useTranslations>, formatDate: (date: Date) => string, formatPrice: (price: number, currency: string) => string) {
    const detail = order.planDetail;
    const unset = t("unset");
    const modes = order.defaultReachoutModes;
    const rows: { id: string; label: string; value: ReactNode }[] = [
        { id: "number", label: t("columns.number"), value: order.number },
        { id: "shippingAddress", label: t("columns.shippingAddress"), value: order.shippingAddress || unset },
        { id: "customerName", label: t("details.customerName"), value: order.customer.name || unset },
        { id: "customerEmail", label: t("email"), value: order.customer.email },
        { id: "customerPhone", label: t("phone"), value: order.customer.phone || unset },
        { id: "status", label: t("columns.status"), value: createElement(OrderStatusBadge, { status: order.status, label: t(`statuses.${order.status}`) }) },
        { id: "plan", label: t("details.plan"), value: t(`plans.${detail.plan}`) },
        { id: "quantity", label: t("details.quantity"), value: String(detail.quantity) },
        { id: "price", label: t("details.price"), value: formatPrice(detail.price, detail.currency) },
        { id: "profiles", label: t("details.maxRecoveryProfiles"), value: detail.maxRecoveryProfiles === null ? t("unlimitedProfiles") : String(detail.maxRecoveryProfiles) },
        { id: "allocations", label: t("details.allocations"), value: detail.allocations.map(allocation => `${t(`variants.${allocation.variant}`)}: ${allocation.quantity}`).join("\n") || t("none") },
        { id: "reachoutModes", label: t("columns.defaultReachoutModes"), value: [
            `${t("email")}: ${t(modes.email ? "yes" : "no")}`,
            `${t("phone")}: ${t(modes.phone ? "yes" : "no")}`,
            `${t("chat")}: ${t(modes.chat ? "yes" : "no")}`,
        ].join("\n") },
        { id: "showOwnerName", label: t("columns.showOwnerName"), value: t(order.showOwnerName ? "yes" : "no") },
        { id: "deliveryInstructions", label: t("columns.deliveryInstructions"), value: order.deliveryInstructions || unset },
        { id: "products", label: t("columns.products"), value: order.products.map(product => t("details.productSummary", { code: product.code, variant: t(`variants.${product.variant}`), id: product.id })).join("\n") || t("none") },
        { id: "shipments", label: t("columns.shipments"), value: String(order.shipments.length) },
        { id: "cancelledAt", label: t("columns.cancelledAt"), value: order.cancelledAt ? formatDate(order.cancelledAt) : unset },
        { id: "cancellationReason", label: t("columns.cancellationReason"), value: order.cancellationReason || unset },
        { id: "completedAt", label: t("columns.completedAt"), value: order.completedAt ? formatDate(order.completedAt) : unset },
        { id: "createdAt", label: t("columns.createdAt"), value: formatDate(order.createdAt) },
        { id: "updatedAt", label: t("columns.updatedAt"), value: formatDate(order.updatedAt) },
    ];
    const groups = orderDetailGroups.map(group => ({
        id: group.id as string,
        heading: t(`details.groups.${group.id}`),
        rows: group.rows.map(id => rows.find(row => row.id === id)).filter(row => row !== undefined),
    }));
    groups.push(...getOrderShipmentGroups(order.shipments, t));
    return groups;
}
