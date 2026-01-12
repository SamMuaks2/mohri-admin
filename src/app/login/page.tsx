"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { setToken, isAuthenticated } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Checking if already authenticated
  useEffect(() => {
    console.log("🔐 Login page: Checking if already authenticated");
    
    const checkAuth = () => {
      if (isAuthenticated()) {
        console.log("✅ Already authenticated, redirecting to dashboard");
        router.replace("/dashboard");
      } else {
        console.log("❌ Not authenticated, showing login form");
        setChecking(false);
      }
    };

    // Adding small delay to ensure localStorage is ready
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");

      console.log("🔐 Starting login...");

      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      console.log("📥 Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          message: "Invalid credentials" 
        }));
        console.error("❌ Login failed:", errorData);
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await res.json();
      console.log("✅ Login successful");

      if (!data.access_token) {
        console.error("❌ No access_token in response!");
        throw new Error("No token received");
      }

      // Storing token in localStorage
      console.log("💾 Storing token...");
      setToken(data.access_token);
      
      // Verifying storage
      await new Promise(resolve => setTimeout(resolve, 100));
      const stored = localStorage.getItem('__app_auth_token__');
      console.log("✅ Token stored:", stored ? "YES" : "NO");
      
      if (!stored) {
        throw new Error("Failed to store authentication token");
      }
      
      console.log("🚀 Redirecting to dashboard...");
      
      // Using router.push for client-side navigation
      router.push("/dashboard");
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setError(error.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  // Showing loading while checking auth
  if (checking) {
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
      </div>
    </div>
  );
}