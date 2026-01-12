"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiClient } from "../../lib/api";

// Dynamic import to prevent SSR issues
const QuillEditor = dynamic(() => import("../../components/ProTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border-2 border-gold rounded p-4 bg-black">
      <div className="text-silver">Loading editor...</div>
    </div>
  ),
});

interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

const stripHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    published: false,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get("/articles");
      setArticles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      published: false,
    });
    setEditingArticle(null);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      tags: article.tags.join(", "),
      published: article.published,
    });
    setShowModal(true);
  };

  const saveArticle = async () => {
    const payload = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      published: formData.published,
    };

    try {
      if (editingArticle) {
        await apiClient.put(`/articles/${editingArticle._id}`, payload);
      } else {
        await apiClient.post("/articles", payload);
      }

      setShowModal(false);
      resetForm();
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await apiClient.delete(`/articles/${id}`);
    fetchArticles();
  };

  const filtered = articles.filter(a => {
    const text = `${a.title} ${stripHtml(a.content)}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && a.published) ||
      (filterStatus === "draft" && !a.published);
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <div className="h-screen overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-gold font-bold">Articles</h2>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gold text-black px-6 py-2 rounded"
          >
            + New Article
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <input
            className="flex-1 px-4 py-2 bg-black border border-gold text-white"
            placeholder="Search articles…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 bg-black border border-gold text-white"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading && <p className="text-silver">Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {filtered.map(a => (
            <div key={a._id} className="border border-gold p-5 rounded bg-black">
              <div className="flex justify-between">
                <h3 className="text-white text-xl">{a.title}</h3>
                <div className="flex gap-3">
                  <button onClick={() => openEditModal(a)} className="text-gold">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteArticle(a._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-silver text-sm mt-2">
                {a.excerpt || stripHtml(a.content).slice(0, 150) + "..."}
              </p>

              <div className="flex gap-2 mt-3">
                {a.tags.map(t => (
                  <span
                    key={t}
                    className="bg-gold text-black px-2 py-1 rounded text-xs"
                  >
                    {t}
                  </span>
                ))}
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    a.published ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {a.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-start p-6 z-50 overflow-y-auto">
            <div className="bg-black border-2 border-gold p-8 rounded w-full max-w-5xl">
              <h3 className="text-gold text-2xl mb-6">
                {editingArticle ? "Edit Article" : "New Article"}
              </h3>

              <div className="space-y-4">
                <input
                  className="w-full px-4 py-2 border border-gold bg-black text-white"
                  placeholder="Title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <input
                  className="w-full px-4 py-2 border border-gold bg-black text-white"
                  placeholder="Excerpt (optional)"
                  value={formData.excerpt}
                  onChange={e =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                />

                <QuillEditor
                  value={formData.content}
                  onChange={c => setFormData({ ...formData, content: c })}
                />

                <input
                  className="w-full px-4 py-2 border border-gold bg-black text-white"
                  placeholder="Tags: React, SaaS"
                  value={formData.tags}
                  onChange={e =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />

                <label className="flex gap-3 text-white items-center">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={e =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                  />
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={saveArticle}
                  className="flex-1 bg-gold text-black p-3"
                >
                  {editingArticle ? "Update" : "Create"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 border border-gold text-gold p-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}