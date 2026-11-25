import type { Prisma } from '@/generated/client';

// MongoDB stores optional fields as either null or missing; both mean unclaimed here.
export const availableProducts: Prisma.ProductWhereInput = {
    published: true,
    AND: [
        { OR: [{ reservedById: null }, { reservedById: { isSet: false } }] },
        { OR: [{ assignedToId: null }, { assignedToId: { isSet: false } }] },
        { OR: [{ orderId: null }, { orderId: { isSet: false } }] },
    ],
};
