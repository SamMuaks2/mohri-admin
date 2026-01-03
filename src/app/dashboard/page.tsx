import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <section>
        <h2 className="text-3xl font-bold mb-6">Overview</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Stat title="Projects" value="12" />
          <Stat title="Articles" value="6" />
          <Stat title="Messages" value="24" />
          <Stat title="Visitors" value="1.2k" />
        </div>
      </section>
    </ProtectedRoute>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded">
      <p className="text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
