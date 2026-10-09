export const checkoutContactFields = [
    { name: "email", type: "email", autoComplete: "email", toggle: "contactByEmail" },
    { name: "name", type: "text", autoComplete: "name", toggle: "showName" },
    { name: "phone", type: "tel", autoComplete: "tel", toggle: "contactByPhone" },
] as const;
