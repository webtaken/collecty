import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnProjects = req.nextUrl.pathname.startsWith("/projects");
  const isOnLogin = req.nextUrl.pathname === "/login";
  const isProtectedRoute = isOnDashboard || isOnProjects;

  // Redirect to login if accessing protected routes while not logged in
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files, api routes (except auth), and _next
    "/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|widget).*)",
  ],
};
