import type { CheckoutVariant } from '@/features/checkout/data/checkout.variants';

export type StickerAvailabilityDialogHandle = {
    open: (variant: CheckoutVariant) => void;
};

export type StickerAvailabilityValues = {
    variant: CheckoutVariant | null;
    variants: CheckoutVariant[];
    email: string;
    name?: string;
};
