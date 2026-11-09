import type { useFormatter } from 'next-intl';

/** Formats monetary amounts for display without changing the values used in calculations. */
export function formatAmount(
    amount: number,
    currency: string,
    formatter: ReturnType<typeof useFormatter>,
    currencyDisplay: 'code' | 'symbol' = 'code',
) {
    return formatter.number(amount, {
        style: 'currency',
        currency,
        currencyDisplay,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
