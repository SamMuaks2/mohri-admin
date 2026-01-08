import ProtectedRoute from "../../components/ProtectedRoute";

export default function ArticlesPage() {
  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Articles</h2>
          <button className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors">
            + New Article
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 bg-black border-2 border-gold rounded text-white placeholder-silver"
          />
          <select className="px-4 py-2 bg-black border-2 border-gold rounded text-white">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="space-y-4">
          <ArticleCard
            title="Getting Started with Next.js 15"
            status="Published"
            date="2025-01-05"
            views="1.2k"
            category="Web Development"
          />
          <ArticleCard
            title="Advanced TypeScript Patterns"
            status="Published"
            date="2025-01-03"
            views="856"
            category="TypeScript"
          />
          <ArticleCard
            title="Building Scalable APIs"
            status="Draft"
            date="2025-01-02"
            views="0"
            category="Backend"
          />
          <ArticleCard
            title="React Server Components Deep Dive"
            status="Published"
            date="2024-12-28"
            views="2.1k"
            category="React"
          />
          <ArticleCard
            title="Authentication Best Practices"
            status="Draft"
            date="2024-12-25"
            views="0"
            category="Security"
          />
        </div>
      </section>
    </ProtectedRoute>
  );
}

function ArticleCard({
  title,
  status,
  date,
  views,
  category,
}: {
  title: string;
  status: string;
  date: string;
  views: string;
  category: string;
}) {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <div className="flex gap-4 text-sm text-silver">
            <span className="bg-gold text-black px-2 py-1 rounded text-xs font-semibold">
              {category}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                status === "Published"
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
            Edit
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
            Delete
          </button>
        </div>
      </div>
      <div className="flex gap-6 text-sm text-silver">
        <span>📅 {date}</span>
        <span>👁️ {views} views</span>
      </div>
    </div>
  );
}