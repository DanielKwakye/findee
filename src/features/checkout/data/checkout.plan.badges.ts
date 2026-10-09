export const checkoutPlanBadgeClasses = {
    personal: "bg-destructive/15 text-destructive",
    family: "bg-primary/15 text-primary",
    business: "bg-success/15 text-success",
} as const;

export const checkoutPlanAccentClasses = {
    personal: "[--primary:var(--destructive)] [--ring:var(--destructive)]",
    family: "[--ring:var(--primary)]",
    business: "[--primary:var(--success)] [--ring:var(--success)]",
} as const;
