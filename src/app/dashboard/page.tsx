import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gold">Overview</h2>
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
    <div className="bg-gold border border-black p-6 rounded">
      <p className="text-black font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-2 text-black">{value}</p>
    </div>
  );
}