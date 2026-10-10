import type { useTranslations } from "next-intl";
import { orderShipmentFields } from "@/features/orders/data/order.details";
import type { OrderShipmentRow } from "@/features/orders/utils/order.types";

/** Formats shipment records into localized groups of display fields. */
export function getOrderShipmentGroups(shipments: OrderShipmentRow[], t: ReturnType<typeof useTranslations>) {
    return shipments.map((shipment, index) => ({
        id: shipment.id,
        heading: t("details.shipmentHeading", { number: index + 1 }),
        rows: orderShipmentFields.map(field => {
            const value = shipment[field];
            return {
                id: `shipment-${shipment.id}-${field}`,
                label: t(`details.shipmentFields.${field}`),
                value: value || t("unset"),
            };
        }),
    }));
}
