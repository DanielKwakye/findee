"use client";

import {Fragment} from "react";
import Link from "next/link";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/core/ui/breadcrumb";
import TypographyBody from "@/components/core/ui/typography-body";
import {usePortalBreadcrumb} from "@/components/platform/hooks/use.portal.breadcrumb";

/** Renders path-based portal navigation with the current page as plain text. */
export function PortalBreadcrumb() {
    const {label, items} = usePortalBreadcrumb();
    return (
        <Breadcrumb aria-label={label} className="min-w-0">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={item.href}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                            {item.current ? (
                                <BreadcrumbPage><TypographyBody className="text-sm">{item.label}</TypographyBody></BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink render={<Link href={item.href} />}>
                                    <TypographyBody className="text-sm">{item.label}</TypographyBody>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
