import { orderStatuses } from "@/features/orders/data/order.statuses";
import { orderSortFields } from "@/features/orders/utils/order.types";
import type { OrderQuery, OrderStatusUpdate, OrderShipmentDelete, OrderShipmentCreate } from "@/features/orders/utils/order.types";

/** Validates and prepares shipment creation values for persistence. */
export function validateOrderShipmentCreate(values: OrderShipmentCreate) {
    if (!values || typeof values.carrier !== "string" || typeof values.trackingNumber !== "string") throw new Error("Invalid shipment information");
    validateOrderId(values.orderId);
    return {
        orderId: values.orderId, carrier: values.carrier.trim() || null,
        trackingNumber: values.trackingNumber.trim() || null,
    };
}

/** Validates the order and shipment identifiers supplied for deletion. */
export function validateOrderShipmentDelete(values: OrderShipmentDelete) {
    if (!values || typeof values.id !== "string" || !/^[a-f\d]{24}$/i.test(values.id)) throw new Error("Invalid shipment ID");
    validateOrderId(values.orderId);
}

/** Validates the order and status supplied for an administrator update. */
export function validateOrderStatusUpdate(values: OrderStatusUpdate) {
    if (!values || !orderStatuses.some(status => status === values.status)) throw new Error("Invalid order status");
    validateOrderId(values.id);
}

/** Validates an order identifier at the server boundary. */
export function validateOrderId(id: string) {
    if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) throw new Error("Invalid order ID");
}

/** Validates and normalizes pagination, filters, and sorting for order queries. */
export function validateOrderQuery(params: OrderQuery) {
    if (!params || !Number.isSafeInteger(params.page) || params.page < 1
        || !Number.isSafeInteger(params.pageSize) || params.pageSize < 1 || params.pageSize > 100
        || typeof params.search !== "string"
        || (params.status !== "all" && !orderStatuses.some(status => status === params.status))) throw new Error("Invalid order query");
    return {
        search: params.search.trim().slice(0, 255),
        sortBy: orderSortFields.find(field => field === params.sortBy) ?? "createdAt",
        direction: params.direction === "asc" ? "asc" as const : "desc" as const,
    };
}
