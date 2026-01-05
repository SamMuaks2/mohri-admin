"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
      try {
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

        if (!res.ok) {
          throw new Error("Invalid credentials");
        }

        const data = await res.json();

        // Store JWT in cookie
        document.cookie = `token=${data.access_token}; path=/; max-age=86400;`;

        router.push("/dashboard");
      } catch (error: any) {
        alert(error.message || "Login failed");
      }
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gold p-8 rounded-lg w-full max-w-md border-4 border-black">
        <h2 className="text-3xl font-bold mb-6 text-black text-center">Admin Login</h2>

        <input
          className="w-full mb-4 p-3 bg-white text-black border-2 border-black rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 p-3 bg-white text-black border-2 border-black rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-gold py-3 rounded font-semibold hover:bg-gray-900 transition-colors border-2 border-black"
        >
          Login
        </button>
      </div>
    </div>
  );
}