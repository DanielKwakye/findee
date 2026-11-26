import 'server-only';

import { generateReferenceCode } from '@/components/platform/utils/reference.code.utils';
import type { ConfirmationOrder } from '@/features/orders/utils/order.types';
import type { getOrderNotificationContext } from '@/features/orders/utils/order.confirmation.notifications';
import type { Prisma } from '@/generated/client';
import { availableProducts } from '@/features/products/utils/product.availability';

/** Retrieves the customer, allocation, and delivery state needed to confirm an order. */
export async function getConfirmationOrder(transaction: Prisma.TransactionClient, id: string) {
    const order = await transaction.order.findUnique({
        where: { id },
        select: {
            id: true,
            number: true,
            customerId: true,
            status: true,
            autoAssign: true,
            cancellable: true,
            paymentAt: true,
            confirmationNotifiedAt: true,
            planDetail: { select: { allocations: true } },
            customerConfirmationNotifiedAt: true,
            adminConfirmationNotifiedAt: true,
            defaultReachoutModes: true,
            customer: { select: { name: true, email: true } },
        },
    });
    if (!order) throw new Error('Order not found');
    return order;
}

/** Finds enough oldest available stickers to fulfill every variant without claiming inventory. */
export async function findOrderConfirmationProducts(
    transaction: Prisma.TransactionClient,
    allocations: ConfirmationOrder['planDetail']['allocations'],
    orderId: string,
) {
    if (
        !allocations.length ||
        allocations.some(
            (allocation) =>
                !allocation.variant ||
                !Number.isSafeInteger(allocation.quantity) ||
                allocation.quantity < 0,
        ) ||
        !allocations.some((allocation) => allocation.quantity > 0) ||
        new Set(allocations.map((allocation) => allocation.variant)).size !== allocations.length
    ) {
        throw new Error('Invalid order allocations');
    }
    const productIds: string[] = [];
    const assigned = await transaction.product.groupBy({
        by: ['variant'],
        where: { orderId },
        _count: { _all: true },
    });
    const assignedCounts = new Map(assigned.map(({ variant, _count }) => [variant, _count._all]));
    // Collect candidates without assigning any: every requested variant must be fully available.
    for (const allocation of allocations) {
        const quantity = allocation.quantity - (assignedCounts.get(allocation.variant) ?? 0);
        if (quantity <= 0) continue;
        const products = await transaction.product.findMany({
            where: { ...availableProducts, variant: allocation.variant },
            // Use oldest stock first, with a stable tie-breaker for matching creation times.
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            take: quantity,
            select: { id: true },
        });
        if (products.length < quantity) return { productIds, restocking: true };
        productIds.push(...products.map((product) => product.id));
    }
    return { productIds, restocking: false };
}

/** Records a support request containing an order's complete restocking requirements. */
export async function createOrderRestockTicket(
    transaction: Prisma.TransactionClient,
    order: ConfirmationOrder,
    t: Awaited<ReturnType<typeof getOrderNotificationContext>>['t'],
) {
    await transaction.ticket.create({
        data: {
            code: generateReferenceCode(),
            customerId: order.customerId,
            customerName: order.customer.name || order.customer.email,
            customerEmail: order.customer.email,
            message: t('restockTicket', {
                number: order.number,
                allocations: order.planDetail.allocations
                    .map((allocation) => t('allocation', allocation))
                    .join('\n'),
            }),
        },
        select: { id: true },
    });
}

/** Reserves and assigns a complete sticker selection to the order's customer. */
export async function assignOrderConfirmationProducts(
    transaction: Prisma.TransactionClient,
    order: Pick<ConfirmationOrder, 'id' | 'customerId' | 'defaultReachoutModes'>,
    productIds: string[],
    expectedUpdatedAt?: Date,
) {
    if (!productIds.length) return;
    // Claim the whole selection, rechecking availability to protect against competing allocations.
    const now = new Date();
    const assigned = await transaction.product.updateMany({
        where: {
            ...(expectedUpdatedAt
                ? { published: true, updatedAt: expectedUpdatedAt }
                : availableProducts),
            id: { in: productIds },
        },
        data: {
            reservedById: order.customerId,
            assignedToId: order.customerId,
            orderId: order.id,
            reservedAt: now,
            assignedAt: now,
            reachoutModes: order.defaultReachoutModes,
        },
    });
    // Throwing rolls back every assignment if the complete selection could not be claimed.
    if (assigned.count !== productIds.length)
        throw new Error('Order inventory changed during allocation');
}

/** Saves the confirmed fulfillment state and resets delivery tracking for its notifications. */
export async function saveOrderConfirmation(
    transaction: Prisma.TransactionClient,
    order: ConfirmationOrder,
    restocking: boolean,
) {
    const status = restocking ? ('HOLD' as const) : ('CONFIRMED' as const);
    await transaction.order.update({
        where: { id: order.id },
        data: {
            status,
            cancellable: restocking,
            confirmationNotifiedAt: null,
            customerConfirmationNotifiedAt: null,
            adminConfirmationNotifiedAt: null,
        },
        select: { id: true },
    });
    return {
        ...order,
        status,
        cancellable: restocking,
        confirmationNotifiedAt: null,
        customerConfirmationNotifiedAt: null,
        adminConfirmationNotifiedAt: null,
    };
}
