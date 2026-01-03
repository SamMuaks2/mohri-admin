import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Read token from cookies (BEST PRACTICE)
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists → allow request
  return NextResponse.next();
}

// Apply middleware only to admin routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/articles/:path*",
    "/experience/:path*",
    "/certifications/:path*",
    "/messages/:path*",
    "/settings/:path*",
  ],
};
