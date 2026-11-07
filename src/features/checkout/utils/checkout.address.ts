import { checkoutProvinces } from '@/features/checkout/data/checkout.regions';
import type { CheckoutValues } from '@/features/checkout/utils/checkout.types';

/** Separates saved shipping destinations while preserving commas within street addresses. */
export function parseCheckoutAddress(address: string) {
    const parts = address
        .trim()
        .split(',')
        .map((part) => part.trim());
    const country = parts.at(-1) === 'Canada' ? parts.pop()! : 'Canada';
    const state = checkoutProvinces.find((province) => province === parts.at(-1)) ?? '';
    if (state) parts.pop();
    const street = parts.join(', ');
    const postalCode = street.match(/(?:,\s*|\s+)([A-Z]\d[A-Z])[-\s]?(\d[A-Z]\d)\.?$/i);
    return {
        shippingAddress: postalCode ? street.slice(0, postalCode.index).trim() : street,
        postalCode: postalCode ? `${postalCode[1]}${postalCode[2]}`.toUpperCase() : '',
        state,
        country,
    };
}

/** Combines validated shipping fields into the persisted address format. */
export function formatCheckoutAddress(values: CheckoutValues) {
    if (
        values.country !== 'Canada' ||
        !checkoutProvinces.some((province) => province === values.state)
    )
        throw new Error('A valid Canadian province and country are required');
    const street = values.shippingAddress.trim();
    const postalCode = values.postalCode?.replace(/[-\s]/g, '').toUpperCase();
    return [
        postalCode ? `${street}, ${postalCode.slice(0, 3)}-${postalCode.slice(3)}` : street,
        values.state,
        values.country,
    ].join(', ');
}
