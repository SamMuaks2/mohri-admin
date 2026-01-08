"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface Stats {
  projects: number;
  articles: number;
  messages: number;
  unreadMessages: number;
  experience: number;
  certifications: number;
}

interface AnalyticsData {
  _id: string;
  count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    articles: 0,
    messages: 0,
    unreadMessages: 0,
    experience: 0,
    certifications: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        projectsData,
        articlesData,
        messagesData,
        experienceData,
        certificationsData,
        analyticsData,
      ] = await Promise.all([
        apiClient.get("/projects"),
        apiClient.get("/articles"),
        apiClient.get("/messages"),
        apiClient.get("/experience"),
        apiClient.get("/certifications"),
        apiClient.get("/analytics/stats"),
      ]);

      const unreadCount = messagesData.filter((m: any) => !m.read).length;

      setStats({
        projects: projectsData.length,
        articles: articlesData.length,
        messages: messagesData.length,
        unreadMessages: unreadCount,
        experience: experienceData.length,
        certifications: certificationsData.length,
      });

      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTopPages = () => {
    return analytics.slice(0, 5);
  };

  const getTotalPageViews = () => {
    return analytics.reduce((sum, item) => sum + item.count, 0);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-silver text-xl">Loading dashboard...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gold">Dashboard Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard
              title="Total Projects"
              value={stats.projects.toString()}
              icon="🚀"
              href="/projects"
            />
            <StatCard
              title="Published Articles"
              value={stats.articles.toString()}
              icon="📝"
              href="/articles"
            />
            <StatCard
              title="Unread Messages"
              value={stats.unreadMessages.toString()}
              icon="💬"
              href="/messages"
              highlight={stats.unreadMessages > 0}
            />
            <StatCard
              title="Page Views"
              value={getTotalPageViews().toLocaleString()}
              icon="👁️"
            />
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-4 text-gold">Content Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black border-2 border-gold p-6 rounded">
              <h4 className="text-xl font-semibold text-white mb-4">Portfolio Content</h4>
              <div className="space-y-3">
                <ContentBar label="Projects" count={stats.projects} max={20} />
                <ContentBar label="Articles" count={stats.articles} max={20} />
                <ContentBar label="Work Experience" count={stats.experience} max={10} />
                <ContentBar label="Certifications" count={stats.certifications} max={10} />
              </div>
            </div>

            <div className="bg-black border-2 border-gold p-6 rounded">
              <h4 className="text-xl font-semibold text-white mb-4">Messages Overview</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gold rounded">
                  <div>
                    <p className="text-silver text-sm">Total Messages</p>
                    <p className="text-2xl font-bold text-white">{stats.messages}</p>
                  </div>
                  <span className="text-4xl">📬</span>
                </div>
                <div className="flex justify-between items-center p-4 border border-gold rounded">
                  <div>
                    <p className="text-silver text-sm">Unread Messages</p>
                    <p className="text-2xl font-bold text-gold">{stats.unreadMessages}</p>
                  </div>
                  <span className="text-4xl">📩</span>
                </div>
                <div className="flex justify-between items-center p-4 border border-gold rounded">
                  <div>
                    <p className="text-silver text-sm">Read Messages</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.messages - stats.unreadMessages}
                    </p>
                  </div>
                  <span className="text-4xl">✅</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {analytics.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-4 text-gold">Traffic Analytics</h3>
            <div className="bg-black border-2 border-gold p-6 rounded">
              <h4 className="text-xl font-semibold text-white mb-4">Top Pages</h4>
              <div className="space-y-3">
                {getTopPages().map((page, index) => (
                  <PageStat
                    key={page._id}
                    rank={index + 1}
                    page={page._id}
                    views={page.count}
                  />
                ))}
              </div>
              {analytics.length === 0 && (
                <p className="text-center text-silver py-4">
                  No analytics data yet. Start tracking page views!
                </p>
              )}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-2xl font-bold mb-4 text-gold">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <QuickActionButton
              icon="📝"
              label="Write New Article"
              href="/articles"
            />
            <QuickActionButton
              icon="🚀"
              label="Add Project"
              href="/projects"
            />
            <QuickActionButton
              icon="💬"
              label="Check Messages"
              href="/messages"
              badge={stats.unreadMessages > 0 ? stats.unreadMessages : undefined}
            />
            <QuickActionButton
              icon="💼"
              label="Add Experience"
              href="/experience"
            />
            <QuickActionButton
              icon="⭐"
              label="Add Certification"
              href="/certifications"
            />
            <QuickActionButton
              icon="⚙️"
              label="Settings"
              href="/settings"
            />
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
  highlight = false,
}: {
  title: string;
  value: string;
  icon: string;
  href?: string;
  highlight?: boolean;
}) {
  const content = (
    <div
      className={`${
        highlight ? "bg-gold" : "bg-gold"
      } border-2 border-black p-6 rounded transition-transform hover:scale-105 cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-black font-semibold">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-black">{value}</p>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

function ContentBar({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const percentage = Math.min((count / max) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-silver">{label}</span>
        <span className="text-white font-semibold">{count}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gold h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function PageStat({
  rank,
  page,
  views,
}: {
  rank: number;
  page: string;
  views: number;
}) {
  return (
    <div className="flex justify-between items-center p-3 border border-gold rounded hover:bg-gray-900 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-gold font-bold text-lg">#{rank}</span>
        <span className="text-silver font-mono text-sm">{page}</span>
      </div>
      <span className="text-white font-semibold">{views} views</span>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  href,
  badge,
}: {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}) {
  return (
    <a
      href={href}
      className="relative flex items-center gap-3 bg-black border-2 border-gold p-4 rounded hover:bg-gold hover:text-black transition-colors group"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-gold group-hover:text-black">
        {label}
      </span>
      {badge && badge > 0 && (
        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </a>
  );
}