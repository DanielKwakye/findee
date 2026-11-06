import { ImageConstants } from '@/lib/image.constants';
import { checkoutVariants } from '@/features/checkout/data/checkout.variants';

export const useCases = [
    { key: 'keys', image: ImageConstants.Keys, variant: 'Everyday' },
    { key: 'wallets', image: ImageConstants.Wallet, variant: 'Everyday' },
    { key: 'phones', image: ImageConstants.FindeeOnPhone, variant: 'Everyday' },
    { key: 'laptops', image: ImageConstants.Laptop, variant: 'Everyday' },
    { key: 'waterBottles', image: ImageConstants.Bottle, variant: 'Everyday' },
    { key: 'busPasses', image: ImageConstants.FindeeOnBusPass, variant: 'Everyday' },
    { key: 'backpacks', image: ImageConstants.Backpack, variant: 'Fabric' },
    { key: 'scarves', image: ImageConstants.Scarves, variant: 'Fabric' },
    { key: 'hats', image: ImageConstants.Hats, variant: 'Fabric' },
    { key: 'schoolUniforms', image: ImageConstants.Uniforms, variant: 'Fabric' },
    { key: 'jackets', image: ImageConstants.Jackets, variant: 'Fabric' },
    { key: 'shoes', image: ImageConstants.Shoes, variant: 'Fabric' },
    { key: 'luggage', image: ImageConstants.SuitCase, variant: 'Tough' },
    { key: 'helmets', image: ImageConstants.Helmets, variant: 'Tough' },
    { key: 'bikes', image: ImageConstants.Bikes, variant: 'Tough' },
] as const;

export const useCaseGroups = checkoutVariants
    .toSorted((a, b) => a.id.localeCompare(b.id))
    .map(({ id, key }) => ({
        variant: id,
        key,
        items: useCases.filter((item) => item.variant === id),
    }));
