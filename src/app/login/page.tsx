"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Replace with real backend auth later
    if (email && password) {
      document.cookie = `token=mock-jwt-token; path=/;`;
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

        <input
          className="w-full mb-4 p-3 bg-gray-800 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 p-3 bg-gray-800 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
