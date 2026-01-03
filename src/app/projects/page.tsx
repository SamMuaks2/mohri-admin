import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProjectsAdminPage() {
  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold text-gold">Projects</h2>
          <button className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors">
            + Add Project
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-black border-2 border-gold p-4 rounded text-white">
            Signal Bot Platform
          </div>
          <div className="bg-black border-2 border-gold p-4 rounded text-white">
            Portfolio Website
          </div>
          <div className="bg-black border-2 border-gold p-4 rounded text-white">
            E-commerce Platform
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}