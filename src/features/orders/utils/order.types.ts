import type { OrderStatus } from "@/generated/client";
import type { getOrders } from "@/features/orders/server/get.orders.action";
import type { getOrderDetails } from "@/features/orders/server/get.order.details.action";
import type { getOrderShipments } from "@/features/orders/server/get.order.shipments.action";

export type OrderRow = Awaited<ReturnType<typeof getOrders>>["orders"][number];
export type OrderDetails = Awaited<ReturnType<typeof getOrderDetails>>;
export type OrderDetailsDialogHandle = { open: (id: string) => void };
export type EditOrderDialogHandle = { open: (id: string) => void };
export type OrderStatusValues = { status: OrderStatus };
export type OrderStatusUpdate = OrderStatusValues & { id: string };
export type OrderStatusDialogRecord = Pick<OrderRow, "id" | "number" | "status">;
export type OrderStatusDialogHandle = { open: (order: OrderStatusDialogRecord) => void };
export type OrderShipmentRow = Awaited<ReturnType<typeof getOrderShipments>>[number];
export type OrderShipmentsDialogHandle = { open: (order: OrderStatusDialogRecord) => void };
export type OrderShipmentDelete = { orderId: string; id: string };
export type OrderShipmentValues = {
    carrier: string; trackingNumber: string;
};
export type OrderShipmentCreate = OrderShipmentValues & { orderId: string };
export type AddOrderShipmentDialogHandle = { open: (order: OrderStatusDialogRecord, shipment?: OrderShipmentRow) => void };
export type OrderStatusFilter = "all" | OrderStatus;
export type OrderQuery = { page: number; pageSize: number; search: string; status: OrderStatusFilter; sortBy: string; direction: "asc" | "desc" };
export const orderSortFields = ["id", "number", "customerId", "status", "showOwnerName", "shippingAddress", "deliveryInstructions", "cancelledAt", "cancellationReason", "completedAt", "createdAt", "updatedAt"] as const;
