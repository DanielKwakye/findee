import {portalTablePageSizes} from "@/components/platform/data/portal.table";

/** Identifies row interactions that belong to nested controls instead of the row action. */
export function isPortalTableControl(target: EventTarget | null, row: EventTarget): boolean {
    return !(target instanceof Element) || !(row instanceof Element) || !row.contains(target) ||
        !!target.closest('[data-row-click-ignore], button, input, select, textarea, a, [role="button"], [role="checkbox"], [role="menuitem"]');
}

/** Keeps the current page size available alongside the standard table page sizes. */
export function getPortalTablePageSizes(pageSize: number): number[] {
    return portalTablePageSizes.includes(pageSize) ? portalTablePageSizes : [...portalTablePageSizes, pageSize].sort((a, b) => a - b);
}
