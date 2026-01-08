"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  responsibilities: string[];
  technologies: string[];
  current: boolean;
  createdAt: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    responsibilities: "",
    technologies: "",
    current: false,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get("/experience");
      setExperiences(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const experienceData = {
        company: formData.company,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.current ? undefined : formData.endDate,
        description: formData.description,
        responsibilities: formData.responsibilities.split("\n").filter(r => r.trim()),
        technologies: formData.technologies.split(",").map(t => t.trim()).filter(t => t),
        current: formData.current,
      };

      await apiClient.post("/experience", experienceData);
      setShowModal(false);
      resetForm();
      fetchExperiences();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingExperience) return;

    try {
      const experienceData = {
        company: formData.company,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.current ? undefined : formData.endDate,
        description: formData.description,
        responsibilities: formData.responsibilities.split("\n").filter(r => r.trim()),
        technologies: formData.technologies.split(",").map(t => t.trim()).filter(t => t),
        current: formData.current,
      };

      await apiClient.put(`/experience/${editingExperience._id}`, experienceData);
      setShowModal(false);
      setEditingExperience(null);
      resetForm();
      fetchExperiences();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      await apiClient.delete(`/experience/${id}`);
      fetchExperiences();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate.split("T")[0],
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
      description: experience.description || "",
      responsibilities: experience.responsibilities.join("\n"),
      technologies: experience.technologies.join(", "),
      current: experience.current,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      responsibilities: "",
      technologies: "",
      current: false,
    });
    setEditingExperience(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Work Experience</h2>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors"
          >
            + Add Experience
          </button>
        </div>

        {loading && <p className="text-silver">Loading experiences...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-6">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience._id}
              experience={experience}
              onEdit={() => openEditModal(experience)}
              onDelete={() => handleDelete(experience._id)}
              formatDate={formatDate}
            />
          ))}
        </div>

        {!loading && experiences.length === 0 && (
          <p className="text-center text-silver py-8">
            No work experience added yet. Add your first one!
          </p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-black border-2 border-gold p-8 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gold mb-6">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-silver mb-2 font-semibold">Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="e.g., Senior Full Stack Developer"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="e.g., Tech Solutions Inc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-silver mb-2 font-semibold">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-silver mb-2 font-semibold">
                      End Date {formData.current && "(Current)"}
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.current}
                      className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="current" className="text-white font-semibold">
                    I currently work here
                  </label>
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="Brief overview of your role..."
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">
                    Responsibilities (one per line)
                  </label>
                  <textarea
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="Led development of...&#10;Managed a team of...&#10;Implemented CI/CD..."
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="React, Node.js, MongoDB, AWS"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={editingExperience ? handleUpdate : handleCreate}
                  className="flex-1 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors"
                >
                  {editingExperience ? "Update Experience" : "Add Experience"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingExperience(null);
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

function ExperienceCard({
  experience,
  onEdit,
  onDelete,
  formatDate,
}: {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gold mb-1">{experience.position}</h3>
          <p className="text-lg text-white font-semibold mb-2">{experience.company}</p>
          <div className="flex gap-4 text-sm text-silver">
            <span>📅 {formatDate(experience.startDate)} - {experience.current ? "Present" : formatDate(experience.endDate!)}</span>
            {experience.current && (
              <span className="bg-gold text-black px-2 py-1 rounded text-xs font-semibold">
                Current
              </span>
            )}
          </div>
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
      {experience.description && (
        <p className="text-silver mb-4 leading-relaxed">{experience.description}</p>
      )}
      {experience.responsibilities.length > 0 && (
        <div className="mb-4">
          <p className="text-white font-semibold mb-2">Key Responsibilities:</p>
          <ul className="list-disc list-inside text-silver space-y-1">
            {experience.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </div>
      )}
      {experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-black border border-gold text-gold px-3 py-1 rounded text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}