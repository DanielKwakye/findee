"use client";

import {useRef} from "react";
import {Ellipsis} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/core/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger} from "@/components/core/ui/dropdown-menu";
import TypographyBody from "@/components/core/ui/typography-body";
import CreateOrderDialog from "@/features/orders/components/ui/create-order-dialog";
import type {CreateOrderDialogHandle} from "@/features/orders/utils/order.types";

/** Presents navigation actions for order management. */
export default function OrdersOptions() {
    const t = useTranslations("orders");
    const createRef = useRef<CreateOrderDialogHandle>(null);
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button type="button" variant="default" className="w-9 shrink-0 px-0 sm:w-auto sm:px-3" aria-label={t("options")} />}>
                <Ellipsis className="sm:hidden" aria-hidden="true" />
                <TypographyBody className="hidden text-sm sm:block">{t("options")}</TypographyBody>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => createRef.current?.open()}>
                        <TypographyBody className="text-sm">{t("createNewOrder")}</TypographyBody>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        <CreateOrderDialog ref={createRef} />
        </>
    );
}
