// import ProtectedRoute from "../../components/ProtectedRoute";

// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <section>
//         <h2 className="text-3xl font-bold mb-6 text-gold">Overview</h2>
//         <div className="grid md:grid-cols-4 gap-6">
//           <Stat title="Projects" value="12" />
//           <Stat title="Articles" value="6" />
//           <Stat title="Messages" value="24" />
//           <Stat title="Visitors" value="1.2k" />
//         </div>
//       </section>
//     </ProtectedRoute>
//   );
// }

// function Stat({ title, value }: { title: string; value: string }) {
//   return (
//     <div className="bg-gold border border-black p-6 rounded">
//       <p className="text-black font-semibold">{title}</p>
//       <p className="text-2xl font-bold mt-2 text-black">{value}</p>
//     </div>
//   );
// }


"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gold">Dashboard Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard title="Total Projects" value="12" change="+2 this month" trend="up" />
            <StatCard title="Published Articles" value="6" change="+1 this week" trend="up" />
            <StatCard title="Unread Messages" value="24" change="+5 today" trend="up" />
            <StatCard title="Page Views" value="1.2k" change="+15% this week" trend="up" />
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-4 text-gold">Traffic Analytics</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black border-2 border-gold p-6 rounded">
              <h4 className="text-xl font-semibold text-white mb-4">Visitors This Week</h4>
              <div className="space-y-3">
                <DayBar day="Monday" visitors={145} max={200} />
                <DayBar day="Tuesday" visitors={178} max={200} />
                <DayBar day="Wednesday" visitors={192} max={200} />
                <DayBar day="Thursday" visitors={156} max={200} />
                <DayBar day="Friday" visitors={201} max={200} />
                <DayBar day="Saturday" visitors={89} max={200} />
                <DayBar day="Sunday" visitors={67} max={200} />
              </div>
            </div>

            <div className="bg-black border-2 border-gold p-6 rounded">
              <h4 className="text-xl font-semibold text-white mb-4">Top Pages</h4>
              <div className="space-y-3">
                <PageStat page="/projects" views={456} />
                <PageStat page="/articles/nextjs-guide" views={342} />
                <PageStat page="/about" views={289} />
                <PageStat page="/articles/typescript-patterns" views={234} />
                <PageStat page="/experience" views={198} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-4 text-gold">Recent Activity</h3>
          <div className="bg-black border-2 border-gold rounded overflow-hidden">
            <div className="divide-y divide-gold">
              <ActivityItem
                icon="📝"
                title="New article published"
                description="'Getting Started with Next.js 15' was published"
                time="2 hours ago"
              />
              <ActivityItem
                icon="💬"
                title="New message received"
                description="John Doe sent a project inquiry"
                time="5 hours ago"
              />
              <ActivityItem
                icon="🚀"
                title="Project updated"
                description="'Signal Bot Platform' was updated"
                time="1 day ago"
              />
              <ActivityItem
                icon="⭐"
                title="New certification added"
                description="AWS Certified Solutions Architect"
                time="2 days ago"
              />
              <ActivityItem
                icon="👁️"
                title="Milestone reached"
                description="1,000 total page views achieved"
                time="3 days ago"
              />
            </div>
          </div>
        </section>

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
  change,
  trend,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}) {
  return (
    <div className="bg-gold border-2 border-black p-6 rounded">
      <p className="text-black font-semibold mb-1">{title}</p>
      <p className="text-3xl font-bold text-black mb-2">{value}</p>
      <p
        className={`text-sm font-semibold ${
          trend === "up" ? "text-green-700" : "text-red-700"
        }`}
      >
        {trend === "up" ? "↑" : "↓"} {change}
      </p>
    </div>
  );
}

function DayBar({
  day,
  visitors,
  max,
}: {
  day: string;
  visitors: number;
  max: number;
}) {
  const percentage = (visitors / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-silver">{day}</span>
        <span className="text-white font-semibold">{visitors}</span>
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

function PageStat({ page, views }: { page: string; views: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-silver font-mono text-sm">{page}</span>
      <span className="text-white font-semibold">{views} views</span>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="p-4 hover:bg-gray-900 transition-colors">
      <div className="flex gap-4">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="text-white font-semibold">{title}</p>
          <p className="text-silver text-sm">{description}</p>
        </div>
        <span className="text-silver text-sm">{time}</span>
      </div>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  href,
}: {
  icon: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 bg-black border-2 border-gold p-4 rounded hover:bg-gold hover:text-black transition-colors group"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-gold group-hover:text-black">
        {label}
      </span>
    </a>
  );
}