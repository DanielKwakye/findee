import { Badge } from "@/components/core/ui/badge";
import TypographyBody from "@/components/core/ui/typography-body";
import { orderStatusBadgeClasses } from "@/features/orders/data/order.status.badges";
import type { OrderStatus } from "@/generated/client";

/** Presents an order status using its shared semantic badge styling. */
export default function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
    return <Badge variant="secondary" className={orderStatusBadgeClasses[status]}><TypographyBody className="text-xs">{label}</TypographyBody></Badge>;
}
