'use client';

import type { Ref } from 'react';
import Link from 'next/link';
import { Copy, Share2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/core/ui/dialog';
import { Button } from '@/components/core/ui/button';
import { Input } from '@/components/core/ui/input';
import { Field, FieldLabel } from '@/components/core/ui/field';
import TypographyBody from '@/components/core/ui/typography-body';
import { useShareDialog } from '@/components/platform/hooks/use.share.dialog';
import type { ShareDialogHandle } from '@/components/platform/utils/share';

/** Presents reusable social sharing and copying for supplied campaign links. */
export default function ShareDialog({ ref }: { ref: Ref<ShareDialogHandle> }) {
    const {
        t,
        links,
        linkId,
        error,
        socialOptions,
        changeOpen,
        copyLink,
        selectLink,
        shareToApp,
        onShareClick,
    } = useShareDialog(ref);
    return (
        <Dialog open={!!links} onOpenChange={changeOpen}>
            <DialogContent
                showCloseButton={false}
                className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle>
                        <TypographyBody className="font-medium">{t('title')}</TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('description')}
                        </TypographyBody>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {socialOptions.map(({ key, path, href }) => (
                        <Button
                            key={key}
                            type="button"
                            variant="outline"
                            onClick={() => onShareClick(key)}
                            nativeButton={!href}
                            render={
                                href ? (
                                    <Link href={href} target="_blank" rel="noopener noreferrer" />
                                ) : undefined
                            }
                            aria-label={t('shareOn', { platform: t(`social.${key}`) })}
                            className="h-auto flex-col gap-2 px-2 py-4"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-6"
                            >
                                <path d={path} />
                            </svg>
                            <TypographyBody className="text-xs">
                                {t(`social.${key}`)}
                            </TypographyBody>
                        </Button>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={shareToApp}
                        className="h-auto flex-col gap-2 px-2 py-4"
                    >
                        <Share2 aria-hidden="true" className="size-6" />
                        <TypographyBody className="text-xs">{t('moreApps')}</TypographyBody>
                    </Button>
                </div>
                <Field className="gap-2">
                    <FieldLabel htmlFor={linkId}>
                        <TypographyBody className="text-sm">{t('link')}</TypographyBody>
                    </FieldLabel>
                    <div className="flex gap-2">
                        <Input
                            id={linkId}
                            value={links?.default ?? ''}
                            readOnly
                            onFocus={selectLink}
                            className="min-w-0"
                        />
                        <Button type="button" variant="secondary" onClick={copyLink}>
                            <Copy aria-hidden="true" />
                            <TypographyBody className="text-sm">{t('copyLink')}</TypographyBody>
                        </Button>
                    </div>
                </Field>
                {error && (
                    <div role="alert">
                        <TypographyBody className="text-sm text-destructive">
                            {error}
                        </TypographyBody>
                    </div>
                )}
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => changeOpen(false)}>
                        <TypographyBody className="text-sm">{t('close')}</TypographyBody>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
