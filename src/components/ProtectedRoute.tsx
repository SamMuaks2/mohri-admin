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

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/check`,
          { credentials: "include" }
        );

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-gold text-lg">Verifying authentication…</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
