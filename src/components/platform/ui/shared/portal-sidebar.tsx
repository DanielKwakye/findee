'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GalleryVerticalEnd, Share2, ArrowLeft, Lightbulb, Globe } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/core/ui/sidebar';
import { PortalNavMain } from '@/components/platform/ui/shared/portal-nav-main';
import { PortalTeamSwitcher } from '@/components/platform/ui/shared/portal-team-switcher';
import { PortalNavProjects } from '@/components/platform/ui/shared/portal-nav-projects';
import { PortalNavUser } from '@/components/platform/ui/shared/portal-nav-user';
import {
    portalInventoryItems,
    portalInternalItems,
    portalCustomerItems,
} from '@/components/platform/data/portal.sidebar.menuItems';
import AppIcon from '@/components/platform/ui/shared/app-icon';
import ShareDialog from '@/components/platform/ui/shared/share-dialog';
import { useShare } from '@/components/platform/hooks/use.share';
import type { ShareLinks } from '@/components/platform/utils/share';
import TypographyBody from '@/components/core/ui/typography-body';
import FeatureRequestDialog from '@/features/tickets/components/ui/feature-request-dialog';
import { usePortalSidebar } from '@/components/platform/hooks/use.portal.sidebar';

// This is sample data.
const data = {
    teams: [
        {
            name: 'brand',
            logo: GalleryVerticalEnd,
            plan: 'plan',
        },
    ],
};

/** Renders the portal sidebar with team, navigation, and account controls. */
export function PortalSidebar({
    user,
    audience = 'admin',
    shareLinks,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user: { name: string | null; email: string };
    audience?: 'admin' | 'customer';
    shareLinks?: ShareLinks;
}) {
    const t = useTranslations('Footer');
    const tFeature = useTranslations('FeatureRequest');
    const { featureRequestRef, requestFeature } = usePortalSidebar();
    const { dialogRef, openShare } = useShare(shareLinks);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {audience === 'customer' ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                render={<Link href="/" aria-label={t('home')} />}
                            >
                                <AppIcon
                                    size="compact"
                                    className="group-data-[collapsible=icon]:[&>span]:hidden"
                                />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <PortalTeamSwitcher teams={data.teams} />
                )}
            </SidebarHeader>
            <SidebarContent>
                <PortalNavMain
                    items={audience === 'customer' ? portalCustomerItems : portalInventoryItems}
                    groupLabel={audience === 'customer' ? 'account' : 'inventory'}
                />
                {audience === 'customer' && (
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <TypographyBody className="text-xs">
                                {t('communityGroup')}
                            </TypographyBody>
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={tFeature('title')}
                                    onClick={requestFeature}
                                >
                                    <Lightbulb aria-hidden="true" />
                                    <TypographyBody className="text-sm">
                                        {tFeature('title')}
                                    </TypographyBody>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {shareLinks && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={t('social.share')}
                                        onClick={openShare}
                                    >
                                        <Share2 aria-hidden="true" />
                                        <TypographyBody className="text-sm">
                                            {t('social.share')}
                                        </TypographyBody>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={t('socials')}
                                    render={
                                        <Link
                                            href={process.env.NEXT_PUBLIC_FB_PAGE_LINK || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    }
                                >
                                    <Globe aria-hidden="true" />
                                    <TypographyBody className="text-sm">
                                        {t('socials')}
                                    </TypographyBody>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={t('backToWebsite')}
                                    render={<Link href="/" />}
                                >
                                    <ArrowLeft aria-hidden="true" />
                                    <TypographyBody className="text-sm">
                                        {t('backToWebsite')}
                                    </TypographyBody>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
                {audience === 'admin' && <PortalNavProjects projects={portalInternalItems} />}
            </SidebarContent>
            <SidebarFooter>
                <PortalNavUser user={user} audience={audience} />
            </SidebarFooter>
            <SidebarRail />
            {audience === 'customer' && (
                <FeatureRequestDialog ref={featureRequestRef} user={user} />
            )}
            {audience === 'customer' && shareLinks && <ShareDialog ref={dialogRef} />}
        </Sidebar>
    );
}
