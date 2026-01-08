// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { isAuthenticated } from "../lib/auth";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.push("/login");
//     }
//   }, [router]);

//   return <>{children}</>;
// }



"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked.current) {
      console.log("🔒 ProtectedRoute: Already checked, skipping");
      return;
    }
    
    console.log("🔒 ProtectedRoute: Starting auth check...");
    
    // Wait a moment for storage to settle after HMR
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      hasChecked.current = true;
      
      console.log("🔒 ProtectedRoute: Auth result:", authenticated);
      
      if (!authenticated) {
        console.log("❌ Not authenticated, redirecting to login...");
        setIsChecking(false);
        router.replace("/login"); // Use replace instead of push
      } else {
        console.log("✅ Authenticated, showing protected content");
        setIsAuth(true);
        setIsChecking(false);
      }
    };

    // Delay to let HMR settle and storage be ready
    const timer = setTimeout(checkAuth, 300);
    
    return () => clearTimeout(timer);
  }, []); // Remove router from dependencies to prevent re-checks

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-silver text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-silver text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}