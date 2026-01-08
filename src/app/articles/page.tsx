// import ProtectedRoute from "../../components/ProtectedRoute";

// export default function ArticlesPage() {
//   return (
//     <ProtectedRoute>
//       <section>
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gold">Articles</h2>
//           <button className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors">
//             + New Article
//           </button>
//         </div>

//         <div className="mb-6 flex gap-4">
//           <input
//             type="text"
//             placeholder="Search articles..."
//             className="flex-1 px-4 py-2 bg-black border-2 border-gold rounded text-white placeholder-silver"
//           />
//           <select className="px-4 py-2 bg-black border-2 border-gold rounded text-white">
//             <option>All Status</option>
//             <option>Published</option>
//             <option>Draft</option>
//           </select>
//         </div>

//         <div className="space-y-4">
//           <ArticleCard
//             title="Getting Started with Next.js 15"
//             status="Published"
//             date="2025-01-05"
//             views="1.2k"
//             category="Web Development"
//           />
//           <ArticleCard
//             title="Advanced TypeScript Patterns"
//             status="Published"
//             date="2025-01-03"
//             views="856"
//             category="TypeScript"
//           />
//           <ArticleCard
//             title="Building Scalable APIs"
//             status="Draft"
//             date="2025-01-02"
//             views="0"
//             category="Backend"
//           />
//           <ArticleCard
//             title="React Server Components Deep Dive"
//             status="Published"
//             date="2024-12-28"
//             views="2.1k"
//             category="React"
//           />
//           <ArticleCard
//             title="Authentication Best Practices"
//             status="Draft"
//             date="2024-12-25"
//             views="0"
//             category="Security"
//           />
//         </div>
//       </section>
//     </ProtectedRoute>
//   );
// }

// function ArticleCard({
//   title,
//   status,
//   date,
//   views,
//   category,
// }: {
//   title: string;
//   status: string;
//   date: string;
//   views: string;
//   category: string;
// }) {
//   return (
//     <div className="bg-black border-2 border-gold p-6 rounded">
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex-1">
//           <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
//           <div className="flex gap-4 text-sm text-silver">
//             <span className="bg-gold text-black px-2 py-1 rounded text-xs font-semibold">
//               {category}
//             </span>
//             <span
//               className={`px-2 py-1 rounded text-xs font-semibold ${
//                 status === "Published"
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-600 text-white"
//               }`}
//             >
//               {status}
//             </span>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <button className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
//             Edit
//           </button>
//           <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
//             Delete
//           </button>
//         </div>
//       </div>
//       <div className="flex gap-6 text-sm text-silver">
//         <span>📅 {date}</span>
//         <span>👁️ {views} views</span>
//       </div>
//     </div>
//   );
// }


"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

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
    content: "",
    excerpt: "",
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

  const handleCreate = async () => {
    try {
      const articleData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        published: formData.published,
      };

      await apiClient.post("/articles", articleData);
      setShowModal(false);
      resetForm();
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingArticle) return;

    try {
      const articleData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        published: formData.published,
      };

      await apiClient.put(`/articles/${editingArticle._id}`, articleData);
      setShowModal(false);
      setEditingArticle(null);
      resetForm();
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await apiClient.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      tags: article.tags.join(", "),
      published: article.published,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      tags: "",
      published: false,
    });
    setEditingArticle(null);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "published" && article.published) ||
                         (filterStatus === "draft" && !article.published);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Articles</h2>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors"
          >
            + New Article
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-black border-2 border-gold rounded text-white placeholder-silver"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-black border-2 border-gold rounded text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading && <p className="text-silver">Loading articles...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              onEdit={() => openEditModal(article)}
              onDelete={() => handleDelete(article._id)}
              formatDate={formatDate}
            />
          ))}
        </div>

        {!loading && filteredArticles.length === 0 && (
          <p className="text-center text-silver py-8">
            {searchTerm || filterStatus !== "all" 
              ? "No articles match your filters."
              : "No articles yet. Create your first one!"}
          </p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-black border-2 border-gold p-8 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gold mb-6">
                {editingArticle ? "Edit Article" : "Create New Article"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-silver mb-2 font-semibold">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Excerpt</label>
                  <input
                    type="text"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="Brief summary (optional)"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="Write your article content here..."
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="React, TypeScript, Web Development (comma-separated)"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="published" className="text-white font-semibold">
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={editingArticle ? handleUpdate : handleCreate}
                  className="flex-1 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors"
                >
                  {editingArticle ? "Update Article" : "Create Article"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingArticle(null);
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

function ArticleCard({
  article,
  onEdit,
  onDelete,
  formatDate,
}: {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
          <div className="flex gap-4 text-sm text-silver mb-2">
            {article.tags.map(tag => (
              <span key={tag} className="bg-gold text-black px-2 py-1 rounded text-xs font-semibold">
                {tag}
              </span>
            ))}
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                article.published
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {article.published ? "Published" : "Draft"}
            </span>
          </div>
          {article.excerpt && (
            <p className="text-silver text-sm mb-2">{article.excerpt}</p>
          )}
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
      <div className="flex gap-6 text-sm text-silver">
        <span>📅 {formatDate(article.createdAt)}</span>
      </div>
    </div>
  );
}