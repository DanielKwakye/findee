export const orderDetailGroups = [
    { id: "summary", rows: ["number", "shippingAddress", "deliveryInstructions", "status"] },
    { id: "customer", rows: ["customerName", "customerEmail", "customerPhone"] },
    { id: "plan", rows: ["plan", "quantity", "price", "profiles", "allocations"] },
    { id: "preferences", rows: ["reachoutModes", "showOwnerName"] },
    { id: "fulfillment", rows: ["products", "shipments"] },
    { id: "activity", rows: ["cancelledAt", "cancellationReason", "completedAt", "createdAt", "updatedAt"] },
] as const;

export const orderShipmentFields = ["trackingNumber", "carrier"] as const;
