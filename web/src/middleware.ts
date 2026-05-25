import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // BetterAuth adds __Secure- prefix on HTTPS (production). HTTP (local) uses the plain name.
  const session =
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value;

  const publicPaths = ["/login", "/signup"];
  const openPaths = ["/terms", "/privacy", "/verify-email"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isOpenPath = openPaths.some((path) => pathname.startsWith(path));

  if (isOpenPath) return NextResponse.next();

  if (!session) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (pathname === "/" || isPublicPath) {
    return NextResponse.redirect(new URL("/books", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|svg|ico|jpg|jpeg|gif|webp)$).*)",
  ],
};
