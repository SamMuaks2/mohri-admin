// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               email,
//               password,
//             }),
//           }
//         );

//         if (!res.ok) {
//           throw new Error("Invalid credentials");
//         }

//         const data = await res.json();

//         // Store JWT in cookie
//         document.cookie = `token=${data.access_token}; path=/; max-age=86400;`;

//         router.push("/dashboard");
//       } catch (error: any) {
//         alert(error.message || "Login failed");
//       }
//     };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black">
//       <div className="bg-gold p-8 rounded-lg w-full max-w-md border-4 border-black">
//         <h2 className="text-3xl font-bold mb-6 text-black text-center">Admin Login</h2>

//         <input
//           className="w-full mb-4 p-3 bg-white text-black border-2 border-black rounded"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="w-full mb-6 p-3 bg-white text-black border-2 border-black rounded"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full bg-black text-gold py-3 rounded font-semibold hover:bg-gray-900 transition-colors border-2 border-black"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { isAuthenticated, setToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        console.log("Already authenticated, redirecting to dashboard");
        router.replace("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔐 Starting login process...");
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Invalid credentials" }));
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await res.json();

      console.log("Full response data:", data);

      // Verify we got a token
      if (!data.access_token) {
        console.error("❌ No access_token in response!");
        console.error("Response keys:", Object.keys(data));
        throw new Error("No token received from server");
      }

      const token = data.access_token;
      console.log("✅ Token received (first 30 chars):", token.substring(0, 30) + "...");
      console.log("Token length:", token.length);

      console.log("💾 Storing token...");
      setToken(token);
      
      // Verify in multiple locations
      const lsStored = localStorage.getItem('__app_auth_token__');
      const ssStored = sessionStorage.getItem('__app_auth_token__');
      const windowStored = (window as any).__auth_token__;
      
      console.log("✅ Token stored in localStorage:", lsStored ? "YES" : "NO");
      console.log("✅ Token stored in sessionStorage:", ssStored ? "YES" : "NO");
      console.log("✅ Token stored in window:", windowStored ? "YES" : "NO");
      
      if (!lsStored && !ssStored && !windowStored) {
        console.error("❌ Failed to store token in ANY location!");
        throw new Error("Failed to store token!");
      }

      console.log("🚀 Redirecting to dashboard...");
      
      // Use replace instead of href to avoid full page reload
      router.replace("/dashboard");
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setError(error.message || "Login failed");
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-silver text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gold p-8 rounded-lg w-full max-w-md border-4 border-black">
        <h2 className="text-3xl font-bold mb-6 text-black text-center">Admin Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full mb-4 p-3 bg-white text-black border-2 border-black rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          disabled={loading}
        />

        <input
          type="password"
          className="w-full mb-6 p-3 bg-white text-black border-2 border-black rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          disabled={loading}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-gold py-3 rounded font-semibold hover:bg-gray-900 transition-colors border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}