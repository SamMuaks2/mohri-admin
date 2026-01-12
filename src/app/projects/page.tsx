"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  createdAt?: string;
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
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

  const handleCreate = async () => {
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        tech: formData.tech.split(",").map(t => t.trim()).filter(t => t),
      };

      await apiClient.post("/projects", projectData);
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingProject) return;

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        tech: formData.tech.split(",").map(t => t.trim()).filter(t => t),
      };

      await apiClient.put(`/projects/${editingProject._id}`, projectData);
      setShowModal(false);
      setEditingProject(null);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await apiClient.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tech: "",
    });
    setEditingProject(null);
  };

  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Projects</h2>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors"
          >
            + Add Project
          </button>
        </div>

        {loading && <p className="text-silver">Loading projects...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={() => openEditModal(project)}
              onDelete={() => handleDelete(project._id)}
            />
          ))}
        </div>

        {!loading && projects.length === 0 && (
          <p className="text-center text-silver py-8">
            No projects yet. Create your first one!
          </p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-black border-2 border-gold p-8 rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gold mb-6">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-silver mb-2 font-semibold">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="e.g., E-Commerce Platform"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">
                    Technologies (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={formData.tech}
                    onChange={(e) =>
                      setFormData({ ...formData, tech: e.target.value })
                    }
                    placeholder="React, Node.js, MongoDB, AWS"
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={editingProject ? handleUpdate : handleCreate}
                  className="flex-1 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
                    resetForm();
                  }}
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

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gold mb-2">
            {project.title}
          </h3>
          <p className="text-silver mb-3">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
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
  );
}