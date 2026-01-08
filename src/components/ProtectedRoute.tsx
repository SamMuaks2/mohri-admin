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

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const checkAuth = async () => {
      // Check local auth flag
      const hasLocalAuth = isAuthenticated();
      
      if (!hasLocalAuth) {
        router.replace("/login");
        return;
      }
      
      // Verify with backend that session is still valid
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/check`,
          {
            credentials: 'include',
          }
        );
        
        if (res.ok) {
          setIsAuth(true);
        } else {
          // Session expired, redirect to login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

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

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}