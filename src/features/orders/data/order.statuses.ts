import type { OrderStatus } from "@/generated/client";

export const orderStatuses = ["AWAITING_PAYMENT", "PENDING", "CONFIRMED", "HOLD", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] as const satisfies readonly OrderStatus[];
