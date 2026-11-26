import 'dotenv/config';
import { PrismaClient } from '@/generated/client';
import { availableProducts } from '@/features/products/utils/product.availability';
import type { ProductVariantFilterValue } from '@/features/products/utils/product.types';

type ProductVariant = Exclude<ProductVariantFilterValue, 'all'>;

/** Converts a fixed number of the oldest available products to another variant. */
export async function seedProductVariant(
    count: number,
    source: ProductVariant,
    destination: ProductVariant,
) {
    const db = new PrismaClient();
    try {
        if (!Number.isSafeInteger(count) || count < 1)
            throw new Error('PRODUCT_COUNT must be a positive whole number.');
        if (source === destination) throw new Error('Choose a different source variant.');

        await db.$transaction(async (transaction) => {
            const eligible = { ...availableProducts, variant: source };
            const products = await transaction.product.findMany({
                where: eligible,
                orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                take: count,
                select: { id: true },
            });
            if (products.length < count)
                throw new Error(
                    `Found ${products.length} eligible ${source} products. Need ${count}.`,
                );

            const updated = await transaction.product.updateMany({
                where: { ...eligible, id: { in: products.map(({ id }) => id) } },
                data: { variant: destination },
            });
            if (updated.count !== count)
                throw new Error('Eligible products changed during the update. Run the seed again.');
        });
        console.log(`Changed ${count} products from ${source} to ${destination}.`);
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Product variant seed failed.');
        process.exitCode = 1;
    } finally {
        await db.$disconnect();
    }
}
