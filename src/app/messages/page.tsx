import ProtectedRoute from "../../components/ProtectedRoute";

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gold">Messages</h2>
        <div className="space-y-4">
          <div className="bg-black border-2 border-gold p-4 rounded">
            <p className="font-semibold text-gold">John Doe</p>
            <p className="text-silver">Interested in working together.</p>
          </div>
          <div className="bg-black border-2 border-gold p-4 rounded">
            <p className="font-semibold text-gold">Jane Smith</p>
            <p className="text-silver">Great work on your recent project!</p>
          </div>
          <div className="bg-black border-2 border-gold p-4 rounded">
            <p className="font-semibold text-gold">Mike Johnson</p>
            <p className="text-silver">Would love to discuss collaboration opportunities.</p>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}