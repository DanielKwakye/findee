import { NextResponse } from "next/server";
import { auth } from "@/features/auth/utils/auth";

/** Redirects portal requests according to the verified session's authentication and role. */
export const proxy = auth((request) => {
    const user = request.auth?.user;
    if (request.nextUrl.pathname === "/login") {
        if (!user?.id) return NextResponse.next();
        const destination = user.role === "ADMIN" ? "/admin/products" : "/customer";
        return NextResponse.redirect(new URL(destination, request.url));
    }
    const isAdminRoute = request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/admin/");
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (isAdminRoute && user.role !== "ADMIN") return NextResponse.redirect(new URL("/", request.url));
    if (!isAdminRoute && user.role !== "CUSTOMER") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
});

export const config = {
    matcher: ["/login", "/admin/:path*", "/customer/:path*"],
};
