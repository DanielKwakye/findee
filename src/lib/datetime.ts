import type {useFormatter} from "next-intl";

/** Formats an unchanged timestamp for display in the user's locale and timezone. */
export function formatUserDateTime(date: Date | number, formatter: ReturnType<typeof useFormatter>, timeZone: string, options: { dateOnly?: boolean } = {}) {
    return formatter.dateTime(date, {
        timeZone: options.dateOnly ? "UTC" : timeZone,
        year: "numeric",
        month: "short",
        day: "numeric",
        ...(!options.dateOnly && { hour: "numeric" as const, minute: "2-digit" as const, hour12: true }),
    });
}
