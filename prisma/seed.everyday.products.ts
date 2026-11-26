import type { ProductVariantFilterValue } from '@/features/products/utils/product.types';
import { seedProductVariant } from '@/features/products/utils/product.variant.seed';

const PRODUCT_COUNT = 100;
const SOURCE_VARIANT: Exclude<ProductVariantFilterValue, 'all' | 'Everyday'> = 'Tough';

await seedProductVariant(PRODUCT_COUNT, SOURCE_VARIANT, 'Everyday');
