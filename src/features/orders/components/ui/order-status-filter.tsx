"use client";

import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/core/ui/select";
import TypographyBody from "@/components/core/ui/typography-body";
import { orderStatuses } from "@/features/orders/data/order.statuses";
import type { OrderStatusFilter } from "@/features/orders/utils/order.types";

/** Presents the order status selector for the current table view. */
export default function OrderStatusFilter({ value, onChange, disabled, includeAll = true, id }: {
    value: OrderStatusFilter; onChange: (status: OrderStatusFilter) => void; disabled: boolean; includeAll?: boolean; id?: string;
}) {
    const t = useTranslations("orders");
    return (
        <Select<OrderStatusFilter> value={value} onValueChange={next => { if (next) onChange(next); }} disabled={disabled}>
            <SelectTrigger id={id} aria-label={t("columns.status")}>
                <SelectValue><TypographyBody className="text-sm">{value === "all" ? t("all") : t(`statuses.${value}`)}</TypographyBody></SelectValue>
            </SelectTrigger>
            <SelectContent>
                {includeAll && <SelectItem value="all"><TypographyBody className="text-sm">{t("all")}</TypographyBody></SelectItem>}
                {orderStatuses.map(status => <SelectItem key={status} value={status}><TypographyBody className="text-sm">{t(`statuses.${status}`)}</TypographyBody></SelectItem>)}
            </SelectContent>
        </Select>
    );
}
