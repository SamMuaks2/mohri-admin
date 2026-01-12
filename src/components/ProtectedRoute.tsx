// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { isAuthenticated } from "../lib/auth";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     console.log("🔒 ProtectedRoute: Checking auth...");
    
//     const hasAuth = isAuthenticated();
//     console.log("🔒 Auth status:", hasAuth);
    
//     if (!hasAuth) {
//       console.log("❌ Not authenticated, redirecting...");
//       router.replace("/login");
//     } else {
//       console.log("✅ Authenticated, showing content");
//       setIsChecking(false);
//     }
//   }, [router]);

//   if (isChecking) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-silver text-lg">Loading...</p>
//         </div>
//       </div>
//     );
//   }

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
    console.log("🔒 ProtectedRoute: Checking authentication...");
    
    // Checking localStorage for token
    const hasAuth = isAuthenticated();
    console.log("🔒 Authentication status:", hasAuth);
    
    if (!hasAuth) {
      console.log("❌ Not authenticated - redirecting to login");
      setIsChecking(false);
      router.replace("/login");
      return;
    }
    
    console.log("✅ Authenticated - showing protected content");
    setIsAuth(true);
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-silver text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}