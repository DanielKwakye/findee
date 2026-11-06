import { ImageConstants } from '@/lib/image.constants';

export const checkoutVariants = [
    { id: 'Everyday', key: 'everyday', image: ImageConstants.Cards },
    { id: 'Tough', key: 'tough', image: ImageConstants.SuitCase },
    { id: 'Fabric', key: 'fabric', image: ImageConstants.Backpack },
] as const;

export type CheckoutVariant = (typeof checkoutVariants)[number]['id'];
