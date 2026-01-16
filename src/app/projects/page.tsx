// "use client";

// import ProtectedRoute from "../../components/ProtectedRoute";
// import { useState, useEffect } from "react";
// import { apiClient } from "../../lib/api";

// interface Project {
//   _id: string;
//   title: string;
//   description: string;
//   tech: string[];
//   createdAt?: string;
// }

// export default function ProjectsAdminPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     tech: "",
//   });

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const data = await apiClient.get("/projects");
//       setProjects(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = async () => {
//     try {
//       const projectData = {
//         title: formData.title,
//         description: formData.description,
//         tech: formData.tech.split(",").map(t => t.trim()).filter(t => t),
//       };

//       await apiClient.post("/projects", projectData);
//       setShowModal(false);
//       resetForm();
//       fetchProjects();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!editingProject) return;

//     try {
//       const projectData = {
//         title: formData.title,
//         description: formData.description,
//         tech: formData.tech.split(",").map(t => t.trim()).filter(t => t),
//       };

//       await apiClient.put(`/projects/${editingProject._id}`, projectData);
//       setShowModal(false);
//       setEditingProject(null);
//       resetForm();
//       fetchProjects();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this project?")) return;

//     try {
//       await apiClient.delete(`/projects/${id}`);
//       fetchProjects();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const openEditModal = (project: Project) => {
//     setEditingProject(project);
//     setFormData({
//       title: project.title,
//       description: project.description,
//       tech: project.tech.join(", "),
//     });
//     setShowModal(true);
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       tech: "",
//     });
//     setEditingProject(null);
//   };

//   return (
//     <ProtectedRoute>
//       <section>
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gold">Projects</h2>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowModal(true);
//             }}
//             className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors"
//           >
//             + Add Project
//           </button>
//         </div>

//         {loading && <p className="text-silver">Loading projects...</p>}
//         {error && <p className="text-red-500">{error}</p>}

//         <div className="space-y-4">
//           {projects.map((project) => (
//             <ProjectCard
//               key={project._id}
//               project={project}
//               onEdit={() => openEditModal(project)}
//               onDelete={() => handleDelete(project._id)}
//             />
//           ))}
//         </div>

//         {!loading && projects.length === 0 && (
//           <p className="text-center text-silver py-8">
//             No projects yet. Create your first one!
//           </p>
//         )}

//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//             <div className="bg-black border-2 border-gold p-8 rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
//               <h3 className="text-2xl font-bold text-gold mb-6">
//                 {editingProject ? "Edit Project" : "Add New Project"}
//               </h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-silver mb-2 font-semibold">Title *</label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                     className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
//                     placeholder="e.g., E-Commerce Platform"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-silver mb-2 font-semibold">Description *</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) =>
//                       setFormData({ ...formData, description: e.target.value })
//                     }
//                     rows={4}
//                     className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
//                     placeholder="Describe your project..."
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-silver mb-2 font-semibold">
//                     Technologies (comma-separated) *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.tech}
//                     onChange={(e) =>
//                       setFormData({ ...formData, tech: e.target.value })
//                     }
//                     placeholder="React, Node.js, MongoDB, AWS"
//                     className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-4 mt-6">
//                 <button
//                   onClick={editingProject ? handleUpdate : handleCreate}
//                   className="flex-1 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors"
//                 >
//                   {editingProject ? "Update Project" : "Create Project"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowModal(false);
//                     setEditingProject(null);
//                     resetForm();
//                   }}
//                   className="flex-1 bg-black border-2 border-gold text-gold px-6 py-3 rounded font-semibold hover:bg-gold hover:text-black transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>
//     </ProtectedRoute>
//   );
// }

// function ProjectCard({
//   project,
//   onEdit,
//   onDelete,
// }: {
//   project: Project;
//   onEdit: () => void;
//   onDelete: () => void;
// }) {
//   return (
//     <div className="bg-black border-2 border-gold p-6 rounded">
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex-1">
//           <h3 className="text-xl font-bold text-gold mb-2">
//             {project.title}
//           </h3>
//           <p className="text-silver mb-3">{project.description}</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={onEdit}
//             className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold"
//           >
//             Edit
//           </button>
//           <button
//             onClick={onDelete}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {project.tech.map((t) => (
//           <span
//             key={t}
//             className="bg-black border border-gold text-gold px-3 py-1 rounded text-sm"
//           >
//             {t}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface ProjectLink {
  label: string;
  url: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  links: ProjectLink[];
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
    links: [{ label: "", url: "" }],
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
        links: formData.links.filter(link => link.label && link.url),
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
        links: formData.links.filter(link => link.label && link.url),
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
      links: project.links.length > 0 ? project.links : [{ label: "", url: "" }],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tech: "",
      links: [{ label: "", url: "" }],
    });
    setEditingProject(null);
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { label: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      links: newLinks.length > 0 ? newLinks : [{ label: "", url: "" }],
    });
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
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
            <div className="bg-black border-2 border-gold p-8 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-silver font-semibold">
                      Project Links (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addLink}
                      className="text-gold hover:text-[#b8941e] text-sm flex items-center gap-1"
                    >
                      <span>+ Add Link</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateLink(index, 'label', e.target.value)}
                          placeholder="Label (e.g., Live Demo)"
                          className="flex-1 px-3 py-2 bg-black border border-gold rounded text-white text-sm"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 bg-black border border-gold rounded text-white text-sm"
                        />
                        {formData.links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
      
      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-black border border-gold text-gold px-3 py-1 rounded text-sm hover:bg-gold hover:text-black transition-colors"
            >
              {link.label}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      )}
      
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