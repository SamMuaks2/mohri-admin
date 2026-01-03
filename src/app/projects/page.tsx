import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProjectsAdminPage() {
  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold">Projects</h2>
          <button className="bg-blue-600 px-4 py-2 rounded">
            + Add Project
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded border border-gray-800">
            Signal Bot Platform
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
