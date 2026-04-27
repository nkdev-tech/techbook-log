import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Cookie name is BetterAuth's default. If changed, update advanced.cookies.sessionToken in api/src/lib/auth.ts together.
  const session = request.cookies.get("better-auth.session_token")?.value;
  if (!session) {
    if (request.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/login"
  ) {
    return NextResponse.redirect(new URL("/books", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
