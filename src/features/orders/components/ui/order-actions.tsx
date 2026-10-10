"use client";

import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/core/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/core/ui/dropdown-menu";
import TypographyBody from "@/components/core/ui/typography-body";
import type { OrderStatusDialogRecord } from "@/features/orders/utils/order.types";

/** Presents the details action for a single order record. */
export default function OrderActions({ order, label, onOpen, onEdit, onChangeStatus, onViewShipments, onAddShipment }: {
    order: OrderStatusDialogRecord; label: string; onOpen: (id: string) => void; onChangeStatus: (order: OrderStatusDialogRecord) => void;
    onViewShipments: (order: OrderStatusDialogRecord) => void;
    onAddShipment: (order: OrderStatusDialogRecord) => void;
    onEdit: (id: string) => void;
}) {
    const t = useTranslations("orders");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button type="button" variant="outline" size="icon-sm" aria-label={t("columns.actions")} />}>
                <Ellipsis aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onOpen(order.id)}><TypographyBody className="text-sm">{label}</TypographyBody></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(order.id)}><TypographyBody className="text-sm">{t("edit.title")}</TypographyBody></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeStatus(order)}><TypographyBody className="text-sm">{t("changeStatus")}</TypographyBody></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewShipments(order)}><TypographyBody className="text-sm">{t("shipments.view")}</TypographyBody></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddShipment(order)}><TypographyBody className="text-sm">{t("shipments.add")}</TypographyBody></DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
