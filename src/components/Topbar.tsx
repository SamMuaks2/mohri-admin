"use client";

export default function Topbar() {
  const logout = () => {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <header className="border-b border-gray-800 px-8 py-4 flex justify-between">
      <h1 className="font-semibold">Admin Dashboard</h1>
      <button
        onClick={logout}
        className="text-sm text-red-400 hover:text-red-500"
      >
        Logout
      </button>
    </header>
  );
}
