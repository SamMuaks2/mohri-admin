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

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");

      console.log("🔐 Starting login...");
      console.log("📍 API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("📧 Email:", email);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      console.log("🌐 Full URL:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("📥 Response status:", res.status);
      console.log("📥 Response ok:", res.ok);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          message: "Invalid credentials" 
        }));
        console.error("❌ Login failed:", errorData);
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await res.json();
      console.log("✅ Login successful!");
      console.log("📦 Response data:", data);

      if (!data.access_token) {
        console.error("❌ No access_token in response!");
        throw new Error("No token received");
      }

      // Set auth flag
      setToken(data.access_token);
      console.log("✅ Auth flag set");
      
      // Check cookies
      console.log("🍪 All cookies:", document.cookie);
      
      // Force navigation
      console.log("🚀 Redirecting to dashboard...");
      window.location.href = "/dashboard";
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setError(error.message || "Login failed. Please check the console for details.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gold p-8 rounded-lg w-full max-w-md border-4 border-black">
        <h2 className="text-3xl font-bold mb-6 text-black text-center">
          Admin Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full mb-4 p-3 bg-white text-black border-2 border-black rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            className="w-full mb-6 p-3 bg-white text-black border-2 border-black rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-gold py-3 rounded font-semibold hover:bg-gray-900 transition-colors border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 p-3 bg-black text-gold text-xs rounded">
          <p className="font-semibold mb-1">Debug Info:</p>
          <p>API: {process.env.NEXT_PUBLIC_API_URL || "NOT SET"}</p>
        </div>
      </div>
    </div>
  );
}