import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

export async function proxy(request: NextRequest) {
  const session = getSessionCookie(request);

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  const isAuthRoute = () => {
    return authRoutes.some((path) => request.nextUrl.pathname.startsWith(path));
  };

  // Let all API routes through. They enforce their own auth and return proper
  // JSON status codes (e.g. 401) instead of being redirected to an HTML page.
  // This also keeps the public Stripe webhook (/api/webhook) reachable.
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isAuthRoute()) {
    if (session) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url),
      );
    }
    return NextResponse.next();
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
