"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "../lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Preventing multiple checks
    if (hasChecked.current) {
      console.log("🔒 ProtectedRoute: Already checked, skipping");
      return;
    }

    console.log("🔒 ProtectedRoute: Checking auth for:", pathname);
    
    // Checking multiple times to handle async storage
    const checkAuth = () => {
      const hasAuth = isAuthenticated();
      console.log("🔒 Auth status:", hasAuth);
      
      if (!hasAuth) {
        console.log("❌ Not authenticated - redirecting to login");
        hasChecked.current = true;
        router.replace("/login");
        return false;
      }
      
      console.log("✅ Authenticated - showing content");
      hasChecked.current = true;
      setIsAuth(true);
      return true;
    };

    // Trying immediately
    if (checkAuth()) return;
    
    // If failed, then try again after a short delay (for async storage)
    const timer = setTimeout(() => {
      if (!hasChecked.current) {
        checkAuth();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  // Showing loading only briefly
  if (!isAuth && !hasChecked.current) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-silver text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}