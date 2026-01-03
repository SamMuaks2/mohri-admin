"use client";

export default function Topbar() {
  const logout = () => {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <header className="border-b border-gold px-8 py-4 flex justify-between bg-black">
      <h1 className="font-semibold text-white">Admin Dashboard</h1>
      <button
        onClick={logout}
        className="text-sm px-4 py-2 rounded bg-gold text-black hover:bg-gold-dark transition-colors font-semibold"
      >
        Logout
      </button>
    </header>
  );
}