import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateCredentials } from "@/features/auth/server/auth.service";
import { authenticateCustomerOtp } from "@/features/auth/server/auth.customer";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: { signIn: "/login" },
    session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
    providers: [Credentials({
        credentials: { email: { type: "email" }, password: { type: "password" } },
        authorize: authenticateCredentials,
    }), Credentials({
        id: "customer-otp",
        credentials: { email: { type: "email" }, code: { type: "text" } },
        authorize: authenticateCustomerOtp,
    })],
    callbacks: {
        /** Carries the authenticated account identity into the encrypted session token. */
        jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
            }
            return token;
        },
        /** Exposes only safe account details to session consumers. */
        session({ session, token }) {
            if (token.sub) session.user.id = token.sub;
            session.user.role = token.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
            return session;
        },
    },
});
