'use server';

import { createHash } from 'node:crypto';
import { isValidEmail, normalizeEmail } from '@/features/auth/utils/auth.validation';
import {
    checkoutVariants,
    checkoutComingSoonVariants,
} from '@/features/checkout/data/checkout.variants';
import type { StickerAvailabilityValues } from '@/features/notifications/utils/sticker.availability.types';

/** Subscribes an email to sticker availability updates in the configured Mailchimp audience. */
export async function subscribeStickerAvailability(
    values: Pick<StickerAvailabilityValues, 'email' | 'variants' | 'name'>,
): Promise<void> {
    if (
        !values ||
        typeof values.email !== 'string' ||
        !isValidEmail(values.email) ||
        (values.name !== undefined &&
            (typeof values.name !== 'string' || values.name.length > 100)) ||
        !Array.isArray(values.variants) ||
        values.variants.length === 0 ||
        new Set(values.variants).size !== values.variants.length ||
        values.variants.some(
            (variant) =>
                !checkoutVariants.some(
                    (option) => option.id === variant && checkoutComingSoonVariants[option.id],
                ),
        )
    )
        throw new Error('Invalid sticker subscription');

    const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX?.trim();
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
    if (!apiKey || !serverPrefix || !/^us\d+$/.test(serverPrefix) || !audienceId)
        throw new Error('Mailchimp subscriptions are not configured');

    const email = normalizeEmail(values.email);
    const name = values.name?.trim();
    const subscriberHash = createHash('md5').update(email).digest('hex');
    const memberUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members/${subscriberHash}`;
    const headers = {
        Authorization: `Basic ${Buffer.from(`findee:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
    };
    const response = await fetch(memberUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            email_address: email,
            status_if_new: 'subscribed',
            ...(name ? { merge_fields: { FNAME: name } } : {}),
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error('Mailchimp subscription failed');
    const member: { status?: string } = await response.json();
    if (member.status !== 'pending' && member.status !== 'subscribed')
        throw new Error('Mailchimp subscription is unavailable for this email');
    if (member.status === 'pending') {
        const confirmation = await fetch(memberUrl, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: 'subscribed' }),
            cache: 'no-store',
            signal: AbortSignal.timeout(10_000),
        });
        if (!confirmation.ok) throw new Error('Mailchimp subscription could not be completed');
    }

    const tagsResponse = await fetch(`${memberUrl}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            tags: values.variants.map((variant) => ({ name: variant, status: 'active' })),
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
    });
    if (!tagsResponse.ok) throw new Error('Mailchimp subscription preferences could not be saved');
}
