export type AuthRole = "ADMIN" | "CUSTOMER";

export type LoginValues = {
    email: string;
    password: string;
};

export type AuthUser = {
    id: string;
    email: string;
    name: string | null;
    role: AuthRole;
};
