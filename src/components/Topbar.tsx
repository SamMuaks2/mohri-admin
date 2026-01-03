export default function Topbar() {
  return (
    <header className="border-b border-gray-800 px-8 py-4 flex justify-between">
      <h1 className="font-semibold">Admin Dashboard</h1>
      <button className="text-sm text-red-400 hover:text-red-500">
        Logout
      </button>
    </header>
  );
}
