'use client';

import { useId, useImperativeHandle, useState, type FocusEvent, type Ref } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from '@/components/core/ui/toast';
import { footerSocialLinks } from '@/components/platform/data/footer';
import {
    getSocialShareUrl,
    type ShareDialogHandle,
    type ShareLinks,
    type SharePlatform,
} from '@/components/platform/utils/share';

/** Manages the share dialog's lifecycle, tracked links, and clipboard interactions. */
export function useShareDialog(ref: Ref<ShareDialogHandle>) {
    const t = useTranslations('ShareDialog');
    const linkId = useId();
    const [links, setLinks] = useState<ShareLinks | null>(null);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        /** Opens sharing with the supplied platform-specific links. */
        open(options) {
            setError(null);
            setLinks(options);
        },
    }));

    /** Dismisses the share dialog without changing the caller's state. */
    function changeOpen(open: boolean) {
        if (!open) setLinks(null);
    }

    /** Copies the default tracked link for sharing anywhere. */
    async function copyLink() {
        if (!links) return;
        setError(null);
        try {
            await navigator.clipboard.writeText(links.default);
            toast.add({ title: t('copied'), type: 'info' });
        } catch {
            setError(t('copyError'));
        }
    }

    /** Selects the displayed URL for manual copying. */
    function selectLink(event: FocusEvent<HTMLInputElement>) {
        event.currentTarget.select();
    }

    /** Shares a platform's tracked link through available device apps or the clipboard. */
    async function shareToApp(platform: SharePlatform) {
        if (!links) return;
        setError(null);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t('title'),
                    text: t('message'),
                    url: links[platform],
                });
                return;
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(`${t('message')}\n${links[platform]}`);
            toast.add({ title: t('messageCopied'), type: 'info' });
        } catch {
            setError(t('shareError'));
        }
    }

    const socialOptions = footerSocialLinks.map(({ key, path }) => ({
        key,
        path,
        href: links ? getSocialShareUrl(key, links[key], t('message')) : null,
    }));

    return { t, links, linkId, error, socialOptions, changeOpen, copyLink, selectLink, shareToApp };
}
