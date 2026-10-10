import type { OrderStatus } from "@/generated/client";

export const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] as const satisfies readonly OrderStatus[];
