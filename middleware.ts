import { NextResponse, type NextRequest } from "next/server";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  );
}

function hasSupabaseSessionCookie(req: NextRequest): boolean {
  const guardCookie = req.cookies.get("cc_auth")?.value;
  if (guardCookie === "1") return true;

  return req.cookies.getAll().some((cookie) => cookie.name.includes("sb-") && cookie.name.includes("auth-token"));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublicPath(pathname)) return NextResponse.next();

  const protectedPrefixes = ["/onboard", "/dashboard", "/upload", "/chat", "/report", "/alerts", "/copilot"];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  if (!hasSupabaseSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
