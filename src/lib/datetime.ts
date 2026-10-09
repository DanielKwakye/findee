import type {useFormatter} from "next-intl";

/** Formats an unchanged timestamp for display in the user's locale and timezone. */
export function formatUserDateTime(date: Date | number, formatter: ReturnType<typeof useFormatter>, timeZone: string) {
    return formatter.dateTime(date, {
        timeZone,
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
