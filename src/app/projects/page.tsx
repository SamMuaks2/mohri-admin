// import ProtectedRoute from "../../components/ProtectedRoute";

// export default function ProjectsAdminPage() {
//   return (
//     <ProtectedRoute>
//       <section>
//         <div className="flex justify-between mb-6">
//           <h2 className="text-3xl font-bold text-gold">Projects</h2>
//           <button className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors">
//             + Add Project
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div className="bg-black border-2 border-gold p-4 rounded text-white">
//             Signal Bot Platform
//           </div>
//           <div className="bg-black border-2 border-gold p-4 rounded text-white">
//             Portfolio Website
//           </div>
//           <div className="bg-black border-2 border-gold p-4 rounded text-white">
//             E-commerce Platform
//           </div>
//         </div>
//       </section>
//     </ProtectedRoute>
//   );
// }


"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get("/projects");
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        tech: newProject.tech.split(",").map(t => t.trim()),
      };

      await apiClient.post("/projects", projectData);
      setShowModal(false);
      setNewProject({ title: "", description: "", tech: "" });
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold text-gold">Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors"
          >
            + Add Project
          </button>
        </div>

        {loading && <p className="text-silver">Loading projects...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-black border-2 border-gold p-6 rounded"
            >
              <h3 className="text-xl font-bold text-gold mb-2">
                {project.title}
              </h3>
              <p className="text-silver mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="bg-black border border-gold text-gold px-3 py-1 rounded text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-black border-2 border-gold p-8 rounded max-w-lg w-full">
              <h3 className="text-2xl font-bold text-gold mb-6">Add New Project</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-silver mb-2">Title</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.tech}
                    onChange={(e) =>
                      setNewProject({ ...newProject, tech: e.target.value })
                    }
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCreateProject}
                  className="flex-1 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors"
                >
                  Create Project
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-black border-2 border-gold text-gold px-6 py-3 rounded font-semibold hover:bg-gold hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}