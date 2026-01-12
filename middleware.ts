// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Allow login page
//   if (pathname.startsWith("/login")) {
//     return NextResponse.next();
//   }

//   // Read token from cookies (BEST PRACTICE)
//   const token = request.cookies.get("token")?.value;

//   // If no token, redirect to login
//   if (!token) {
//     const loginUrl = new URL("/login", request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Token exists → allow request
//   return NextResponse.next();
// }

// // Apply middleware only to admin routes
// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/projects/:path*",
//     "/articles/:path*",
//     "/experience/:path*",
//     "/certifications/:path*",
//     "/messages/:path*",
//     "/settings/:path*",
//   ],
// };




// ============
// Version 2
// ============
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Reading token from cookies
//   const token = request.cookies.get("token")?.value;

//   // If user is on login page WITH a token, redirect to dashboard
//   if (pathname === "/login" && token) {
//     const dashboardUrl = new URL("/dashboard", request.url);
//     return NextResponse.redirect(dashboardUrl);
//   }

//   // Allowing login page access if no token
//   if (pathname === "/login") {
//     return NextResponse.next();
//   }

//   // For protected routes, checking token
//   if (!token) {
//     const loginUrl = new URL("/login", request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Token exists → allowing request
//   return NextResponse.next();
// }

// // Applying middleware to login and all admin routes
// export const config = {
//   matcher: [
//     "/login",
//     "/dashboard/:path*",
//     "/projects/:path*",
//     "/articles/:path*",
//     "/experience/:path*",
//     "/certifications/:path*",
//     "/messages/:path*",
//     "/settings/:path*",
//   ],
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Since we're using localStorage for auth (not cookies),
  // and middleware can't access localStorage,
  // we'll handle all auth checks client-side via ProtectedRoute
  
  // Just allow all requests through
  return NextResponse.next();
}

// We still need to export config, but we can remove the matcher
// or keep it minimal to avoid unnecessary middleware runs
export const config = {
  matcher: [
    // Only run on routes that need any processing
    // For now, we're not doing any middleware auth checks
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};