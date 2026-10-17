import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateCredentials } from "@/features/auth/server/auth.service";
import { authenticateCustomerOtp } from "@/features/auth/server/auth.customer";
import { db } from "@/lib/db";

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
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
            }
            // Reject previously issued sessions as soon as the account is closed.
            if (token.sub) {
                const account = await db.user.findUnique({ where: { id: token.sub }, select: { closedAt: true } });
                if (!account || account.closedAt) return null;
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
