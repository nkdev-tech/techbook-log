import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("better-auth.session_token")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (
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
