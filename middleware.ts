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