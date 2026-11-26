'use client';

import type { Ref } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/core/ui/button';
import { Checkbox } from '@/components/core/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/core/ui/dialog';
import { Input } from '@/components/core/ui/input';
import { Item, ItemGroup } from '@/components/core/ui/item';
import TypographyBody from '@/components/core/ui/typography-body';
import { PortalConfirmDialog } from '@/components/platform';
import { useOrderProductsDialog } from '@/features/orders/components/hooks/use.order.products.dialog';
import OrderAllocationAlert from '@/features/orders/components/ui/order-allocation-alert';
import OrderStatusBadge from '@/features/orders/components/ui/order-status-badge';
import type { OrderProductsDialogHandle } from '@/features/orders/utils/order.types';

/** Presents the assigned stickers and available inventory for an order. */
export default function OrderProductsDialog({ ref }: { ref: Ref<OrderProductsDialogHandle> }) {
    const {
        t,
        order,
        assigned,
        allocationMismatch,
        matches,
        results,
        search,
        searchInput,
        quantityInput,
        allocationInputs,
        saveQuantity,
        isQuantityDirty,
        quantityError,
        isUpdating,
        autoAssign,
        changeAutoAssign,
        confirmRef,
        changeOpen,
        requestChange,
    } = useOrderProductsDialog(ref);

    return (
        <Dialog open={!!order} onOpenChange={changeOpen}>
            <DialogContent
                showCloseButton={false}
                className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl"
            >
                <DialogHeader className="pr-8">
                    <DialogTitle>
                        <TypographyBody className="font-medium">
                            {t('products.title')}
                        </TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('products.description', { number: order?.number ?? '' })}
                        </TypographyBody>
                    </DialogDescription>
                    {order && (
                        <OrderStatusBadge
                            status={order.status}
                            label={t(`statuses.${order.status}`)}
                        />
                    )}
                </DialogHeader>
                <DialogClose
                    render={
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-4 right-4"
                            aria-label={t('products.close')}
                            disabled={isUpdating}
                        />
                    }
                >
                    <XIcon aria-hidden="true" />
                </DialogClose>
                {allocationMismatch && <OrderAllocationAlert />}
                <label className="flex items-center gap-2">
                    <Checkbox
                        checked={autoAssign ?? false}
                        disabled={autoAssign === undefined || isUpdating}
                        onCheckedChange={changeAutoAssign}
                    />
                    <TypographyBody>{t('products.autoAssign')}</TypographyBody>
                </label>
                {assigned.data && (
                    <form onSubmit={saveQuantity} noValidate className="space-y-2">
                        <label htmlFor={quantityInput.id}>
                            <TypographyBody className="block font-medium">
                                {t('details.quantity')}
                            </TypographyBody>
                        </label>
                        <Input
                            {...quantityInput}
                            type="number"
                            min={1}
                            max={2_147_483_647}
                            step={1}
                            required
                            disabled={isUpdating}
                        />
                        <fieldset className="space-y-2" disabled={isUpdating}>
                            <legend>
                                <TypographyBody className="font-medium">
                                    {t('details.allocations')}
                                </TypographyBody>
                            </legend>
                            <div className="grid gap-2 sm:grid-cols-3">
                                {allocationInputs?.map(({ label, input }) => (
                                    <label key={input.id} className="block space-y-1">
                                        <TypographyBody className="block text-sm">
                                            {label}
                                        </TypographyBody>
                                        <Input {...input} type="number" min={0} step={1} required />
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        {quantityError && (
                            <div role="alert">
                                <TypographyBody className="text-sm text-destructive">
                                    {quantityError}
                                </TypographyBody>
                            </div>
                        )}
                        <Button type="submit" disabled={isUpdating || !isQuantityDirty}>
                            <TypographyBody className="text-sm">
                                {t('products.saveQuantity')}
                            </TypographyBody>
                        </Button>
                    </form>
                )}
                <section
                    className="flex min-w-0 flex-col gap-1"
                    aria-label={t('products.assigned')}
                >
                    <TypographyBody className="font-medium">
                        {t('products.assigned')}
                    </TypographyBody>
                    {assigned.isError ? (
                        <div role="alert">
                            <TypographyBody className="text-sm text-destructive">
                                {t('products.loadError')}
                            </TypographyBody>
                        </div>
                    ) : assigned.isLoading ? (
                        <div role="status">
                            <TypographyBody className="text-sm text-muted-foreground">
                                {t('products.loading')}
                            </TypographyBody>
                        </div>
                    ) : !assigned.data?.products.length ? (
                        <div>
                            <TypographyBody className="text-sm text-muted-foreground">
                                {t('products.empty')}
                            </TypographyBody>
                        </div>
                    ) : (
                        <ul className="flex max-h-52 flex-row flex-wrap content-start gap-1 overflow-y-auto -translate-x-3">
                            {assigned.data.products.map(({ code, variant }) => (
                                <li key={code} className="max-w-full">
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto max-w-full py-1.5 text-left whitespace-normal"
                                        disabled={isUpdating}
                                        aria-label={t('products.removeSticker', { code })}
                                        onClick={() => requestChange('remove', code)}
                                    >
                                        <TypographyBody className="min-w-0 text-sm wrap-break-word">
                                            {t('products.sticker', { code, variant })}
                                        </TypographyBody>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <div className="space-y-2">
                    <label className="block space-y-2">
                        <TypographyBody className="block font-medium">
                            {t('products.search')}
                        </TypographyBody>
                        <Input
                            {...searchInput}
                            type="search"
                            autoComplete="off"
                            maxLength={255}
                            placeholder={t('products.searchPlaceholder')}
                        />
                    </label>
                    {search && (
                        <div aria-busy={matches.isFetching || (!matches.data && !matches.isError)}>
                            {matches.isError ? (
                                <div role="alert">
                                    <TypographyBody className="text-sm text-destructive">
                                        {t('products.searchError')}
                                    </TypographyBody>
                                </div>
                            ) : results?.length ? (
                                <ItemGroup aria-label={t('products.matches')}>
                                    {results.map(
                                        ({
                                            code,
                                            variant,
                                            isAvailable,
                                            isOnOrder,
                                            assignee,
                                            assignedElsewhere,
                                        }) => (
                                            <div key={code} role="listitem">
                                                <Item
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-auto flex-col items-start gap-1 text-left whitespace-normal"
                                                    render={
                                                        !isOnOrder ? (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                disabled={isUpdating}
                                                                onClick={() =>
                                                                    requestChange('add', code)
                                                                }
                                                            />
                                                        ) : undefined
                                                    }
                                                >
                                                    <TypographyBody className="max-w-full wrap-break-word">
                                                        {t('products.sticker', { code, variant })}
                                                    </TypographyBody>
                                                    {assignee && (
                                                        <TypographyBody className="text-sm text-muted-foreground">
                                                            {t('products.assignee', {
                                                                name: assignee,
                                                            })}
                                                        </TypographyBody>
                                                    )}
                                                    {isAvailable && (
                                                        <TypographyBody className="text-sm text-success">
                                                            {t('products.availableForAssignment')}
                                                        </TypographyBody>
                                                    )}
                                                    {assignedElsewhere && (
                                                        <TypographyBody className="text-sm text-destructive">
                                                            {t('products.assignedElsewhere')}
                                                        </TypographyBody>
                                                    )}
                                                </Item>
                                            </div>
                                        ),
                                    )}
                                </ItemGroup>
                            ) : matches.data ? (
                                <div role="status">
                                    <TypographyBody className="text-sm text-muted-foreground">
                                        {t('products.noMatches')}
                                    </TypographyBody>
                                </div>
                            ) : (
                                <div role="status">
                                    <TypographyBody className="text-sm text-muted-foreground">
                                        {t('products.searching')}
                                    </TypographyBody>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
            <PortalConfirmDialog ref={confirmRef} />
        </Dialog>
    );
}
