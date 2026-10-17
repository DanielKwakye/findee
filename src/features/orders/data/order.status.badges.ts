import type { OrderStatus } from "@/generated/client";

export const orderStatusBadgeClasses: Record<OrderStatus, string> = {
    PENDING: "bg-warning/15 text-warning",
    CONFIRMED: "bg-chart-1/20 text-foreground",
    HOLD: "bg-warning/15 text-warning",
    PROCESSING: "bg-primary/15 text-primary",
    SHIPPED: "bg-chart-3/20 text-foreground",
    DELIVERED: "bg-success/15 text-success",
    CANCELLED: "bg-destructive/15 text-destructive",
    RETURNED: "bg-chart-5/20 text-foreground",
};
