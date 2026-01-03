import ProtectedRoute from "../../components/ProtectedRoute";

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <section>
        <h2 className="text-3xl font-bold mb-6">Messages</h2>
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded border border-gray-800">
            <p className="font-semibold">John Doe</p>
            <p className="text-gray-400">Interested in working together.</p>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
