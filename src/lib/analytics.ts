import type { EventParams } from 'firebase/analytics';
import { trackEvent as trackFirebaseEvent } from '@/lib/firebase';
import { trackMetaEvent } from '@/lib/meta.pixel';

const purchases = new Set<string>();

/** Reports an event to one service and remembers successfully queued purchases. */
async function trackServiceEvent(
    service: string,
    send: () => boolean | Promise<boolean>,
    order?: string,
) {
    const key = order ? `${service}_purchase_${order}` : '';
    if (key) {
        if (purchases.has(key)) return;
        try {
            if (localStorage.getItem(key)) return;
        } catch {
            // In-memory deduplication still works when browser storage is unavailable.
        }
        purchases.add(key);
    }
    const sent = await send();
    if (!key) return;
    if (!sent) {
        purchases.delete(key);
        return;
    }
    try {
        localStorage.setItem(key, '1');
    } catch {
        // In-memory deduplication still works when browser storage is unavailable.
    }
}

/** Reports website actions to the configured analytics services. */
export async function trackEvent(name: string, parameters?: EventParams): Promise<void> {
    const order = name === 'purchase' ? String(parameters?.transaction_id ?? '') : undefined;
    if (name === 'purchase' && !order) return;
    await Promise.allSettled([
        trackServiceEvent('meta', () => trackMetaEvent(name, parameters), order),
        trackServiceEvent('firebase', () => trackFirebaseEvent(name, parameters), order),
    ]);
}
