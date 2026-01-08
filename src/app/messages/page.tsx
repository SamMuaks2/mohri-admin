// import ProtectedRoute from "../../components/ProtectedRoute";

// export default function MessagesPage() {
//   return (
//     <ProtectedRoute>
//       <section>
//         <h2 className="text-3xl font-bold mb-6 text-gold">Messages</h2>
//         <div className="space-y-4">
//           <div className="bg-black border-2 border-gold p-4 rounded">
//             <p className="font-semibold text-gold">John Doe</p>
//             <p className="text-silver">Interested in working together.</p>
//           </div>
//           <div className="bg-black border-2 border-gold p-4 rounded">
//             <p className="font-semibold text-gold">Jane Smith</p>
//             <p className="text-silver">Great work on your recent project!</p>
//           </div>
//           <div className="bg-black border-2 border-gold p-4 rounded">
//             <p className="font-semibold text-gold">Mike Johnson</p>
//             <p className="text-silver">Would love to discuss collaboration opportunities.</p>
//           </div>
//         </div>
//       </section>
//     </ProtectedRoute>
//   );
// }


"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState } from "react";

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Messages</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold">
              Mark All Read
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
              Delete Selected
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search messages..."
            className="flex-1 px-4 py-2 bg-black border-2 border-gold rounded text-white placeholder-silver"
          />
          <select className="px-4 py-2 bg-black border-2 border-gold rounded text-white">
            <option>All Messages</option>
            <option>Unread</option>
            <option>Read</option>
            <option>Starred</option>
          </select>
        </div>

        <div className="space-y-4">
          <MessageCard
            id={1}
            name="John Doe"
            email="john.doe@example.com"
            subject="Project Collaboration Inquiry"
            message="Hi, I came across your portfolio and I'm impressed with your work. I'd like to discuss a potential collaboration on a web development project. Are you available for a call this week?"
            date="2025-01-06"
            time="10:30 AM"
            isRead={false}
            isStarred={true}
            isSelected={selectedMessage === 1}
            onSelect={() => setSelectedMessage(selectedMessage === 1 ? null : 1)}
          />
          <MessageCard
            id={2}
            name="Jane Smith"
            email="jane.smith@company.com"
            subject="Great Work!"
            message="I just finished reading your article on Next.js 15. It was incredibly helpful and well-written. Thank you for sharing your knowledge with the community!"
            date="2025-01-05"
            time="2:15 PM"
            isRead={false}
            isStarred={false}
            isSelected={selectedMessage === 2}
            onSelect={() => setSelectedMessage(selectedMessage === 2 ? null : 2)}
          />
          <MessageCard
            id={3}
            name="Mike Johnson"
            email="mike.j@startup.io"
            subject="Job Opportunity"
            message="We're looking for a senior full-stack developer to join our team. Based on your experience and portfolio, I think you'd be a great fit. Would you be interested in learning more?"
            date="2025-01-04"
            time="4:45 PM"
            isRead={true}
            isStarred={true}
            isSelected={selectedMessage === 3}
            onSelect={() => setSelectedMessage(selectedMessage === 3 ? null : 3)}
          />
          <MessageCard
            id={4}
            name="Sarah Williams"
            email="sarah.w@agency.com"
            subject="Website Redesign Quote"
            message="Our company is looking to redesign our website and we'd like to get a quote from you. Could you send over your rates and availability?"
            date="2025-01-03"
            time="11:20 AM"
            isRead={true}
            isStarred={false}
            isSelected={selectedMessage === 4}
            onSelect={() => setSelectedMessage(selectedMessage === 4 ? null : 4)}
          />
          <MessageCard
            id={5}
            name="Tom Brown"
            email="tom.brown@email.com"
            subject="Question About Your Project"
            message="I noticed your Signal Bot Platform project. I'm working on something similar and would love to know more about your tech stack and approach."
            date="2025-01-02"
            time="9:00 AM"
            isRead={true}
            isStarred={false}
            isSelected={selectedMessage === 5}
            onSelect={() => setSelectedMessage(selectedMessage === 5 ? null : 5)}
          />
        </div>
      </section>
    </ProtectedRoute>
  );
}

function MessageCard({
  id,
  name,
  email,
  subject,
  message,
  date,
  time,
  isRead,
  isStarred,
  isSelected,
  onSelect,
}: {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`bg-black border-2 p-6 rounded transition-all ${
        isRead ? "border-gray-600" : "border-gold"
      } ${isSelected ? "ring-2 ring-gold" : ""}`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="mt-1 w-4 h-4"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <h3
                className={`font-bold ${
                  isRead ? "text-silver" : "text-gold"
                }`}
              >
                {name}
              </h3>
              {!isRead && (
                <span className="bg-gold text-black px-2 py-0.5 rounded text-xs font-semibold">
                  NEW
                </span>
              )}
              {isStarred && <span className="text-gold">⭐</span>}
            </div>
            <span className="text-sm text-silver">
              {date} at {time}
            </span>
          </div>
          <p className="text-sm text-silver mb-2">{email}</p>
          <p
            className={`font-semibold mb-2 ${
              isRead ? "text-silver" : "text-white"
            }`}
          >
            {subject}
          </p>
          <p className="text-silver leading-relaxed mb-4">{message}</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
              Reply
            </button>
            <button className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold">
              {isStarred ? "Unstar" : "Star"}
            </button>
            <button className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold">
              {isRead ? "Mark Unread" : "Mark Read"}
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}