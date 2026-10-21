import "server-only";
import Holidays from "date-holidays";

const postalProvinces: Record<string, string> = {
    A: "NL", B: "NS", C: "PE", E: "NB", G: "QC", H: "QC", J: "QC",
    K: "ON", L: "ON", M: "ON", N: "ON", P: "ON", R: "MB", S: "SK", T: "AB", V: "BC", Y: "YT",
};

/** Resolves a Canadian postal code's province when its prefix identifies one unambiguously. */
export function getPostalProvince(postalCode?: string): string | undefined {
    if (typeof postalCode !== "string") return undefined;
    const normalized = postalCode.replace(/[-\s]/g, "").toUpperCase();
    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalized)) return undefined;
    if (/^X0[ABC]/.test(normalized)) return "NU";
    if (/^X(?:0[EG]|1A)/.test(normalized)) return "NT";
    return postalProvinces[normalized[0]];
}

type DeliveryEstimateOptions = {
    dateType?: "delivery" | "posting";
    orderedAt?: Date;
    transitBusinessDays?: 2 | 3 | 4;
    holidays?: readonly string[];
    destinationProvince?: string;
    postalCode?: string;
    shippingAddress?: string | null;
};

/** Builds Canada Post's closure calendar, including observed dates and regional exceptions. */
function getPostalHolidays(year: number, provinces: readonly string[]): Set<string> {
    const calendar = new Holidays();
    calendar.setTimezone("UTC");
    const rules = ["01-01", "easter -2", "easter 1", "monday before 05-25", "07-01",
        "1st monday in September", "09-30 since 2021", "2nd monday in October", "11-11", "12-25", "12-26"];
    if (provinces.includes("QC")) rules.push("06-24");
    if (provinces.some(province => province !== "QC" && province !== "YT")) rules.push("1st monday in August");
    if (provinces.includes("YT")) rules.push("3rd monday in August");
    for (const rule of rules) calendar.setHoliday(rule, { name: rule, type: "public" });
    const dates = calendar.getHolidays(year).map(holiday => holiday.date.slice(0, 10)).sort();
    const closures = new Set(dates);
    for (const value of dates) {
        const observed = new Date(`${value}T00:00:00Z`);
        if (observed.getUTCDay() !== 0 && observed.getUTCDay() !== 6) continue;
        do {
            observed.setUTCDate(observed.getUTCDate() + 1);
        } while (!isPostalBusinessDay(observed, closures));
        closures.add(observed.toISOString().slice(0, 10));
    }
    return closures;
}

/** Identifies postal working days using UTC dates and supplied Canada Post holidays. */
function isPostalBusinessDay(date: Date, holidays: ReadonlySet<string>): boolean {
    const day = date.getUTCDay();
    return day !== 0 && day !== 6 && !holidays.has(date.toISOString().slice(0, 10));
}

/**
 * Estimates Lettermail arrival after the weekly Saturday dispatch, using a Friday-midnight UTC cutoff.
 * Defaults to four national transit business days, excluding the postal acceptance day.
 * Supply observed Canada Post holidays as YYYY-MM-DD dates to exclude them as well as weekends.
 * Returns an estimated calendar date (YYYY-MM-DD), not a guaranteed arrival timestamp.
 */
export function getEstimatedDeliveryDate({ orderedAt = new Date(), transitBusinessDays, holidays = [], destinationProvince, postalCode, shippingAddress, dateType = "delivery" }: DeliveryEstimateOptions = {}): string {
    const addressPostalCode = shippingAddress?.match(/([A-Z]\d[A-Z])[-\s]?(\d[A-Z]\d)\.?\s*$/i);
    destinationProvince = destinationProvince?.trim().toUpperCase()
        ?? getPostalProvince(postalCode ?? (addressPostalCode ? `${addressPostalCode[1]}${addressPostalCode[2]}` : undefined));
    const originProvince = process.env.SHIPPING_ORIGIN_PROVINCE?.trim().toUpperCase();
    transitBusinessDays ??= destinationProvince && destinationProvince === originProvince ? 3 : 4;
    if (!Number.isFinite(orderedAt.getTime())) throw new Error("Invalid order timestamp");
    const delivery = new Date(orderedAt);
    delivery.setUTCHours(0, 0, 0, 0);
    const daysUntilSaturday = (6 - delivery.getUTCDay() + 7) % 7 || 7;
    delivery.setUTCDate(delivery.getUTCDate() + daysUntilSaturday);
    if (dateType === "posting") return delivery.toISOString().slice(0, 10);
    if (![2, 3, 4].includes(transitBusinessDays)) throw new Error("Invalid Lettermail transit duration");
    for (const holiday of holidays) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(holiday)
            || !Number.isFinite(Date.parse(holiday)) || new Date(holiday).toISOString().slice(0, 10) !== holiday) {
            throw new Error("Invalid postal holiday date");
        }
    }
    const excludedDates = new Set(holidays);
    const provinces = [process.env.SHIPPING_ORIGIN_PROVINCE, destinationProvince]
        .filter((province): province is string => !!province?.trim()).map(province => province.trim().toUpperCase());
    if (provinces.some(province => !["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"].includes(province))) {
        throw new Error("Invalid Canadian shipping province");
    }
    for (let year = orderedAt.getUTCFullYear() - 1; year <= orderedAt.getUTCFullYear() + 1; year++) {
        for (const holiday of getPostalHolidays(year, provinces)) excludedDates.add(holiday);
    }
    while (!isPostalBusinessDay(delivery, excludedDates)) {
        delivery.setUTCDate(delivery.getUTCDate() + 1);
    }
    let remaining = transitBusinessDays;
    while (remaining > 0) {
        delivery.setUTCDate(delivery.getUTCDate() + 1);
        if (isPostalBusinessDay(delivery, excludedDates)) remaining--;
    }
    return delivery.toISOString().slice(0, 10);
}
