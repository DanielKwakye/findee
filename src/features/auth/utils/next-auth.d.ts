import type { DefaultSession } from "next-auth";
import type { AuthRole } from "@/features/auth/utils/auth.types";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        role: AuthRole;
    }
    interface Session {
        user: DefaultSession["user"] & { id: string; role: AuthRole };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: AuthRole;
    }
}
