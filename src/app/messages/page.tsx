"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get("/messages");
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.put(`/messages/${id}/read`, {});
      fetchMessages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await apiClient.delete(`/messages/${id}`);
      fetchMessages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleSelectMessage = (id: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMessages(newSelected);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Messages</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold">
              Mark All Read
            </button>
            {selectedMessages.size > 0 && (
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
                Delete Selected ({selectedMessages.size})
              </button>
            )}
          </div>
        </div>

        {loading && <p className="text-silver">Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageCard
              key={msg._id}
              message={msg}
              isSelected={selectedMessages.has(msg._id)}
              onSelect={() => toggleSelectMessage(msg._id)}
              onMarkAsRead={() => handleMarkAsRead(msg._id)}
              onDelete={() => handleDelete(msg._id)}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          ))}
        </div>

        {!loading && messages.length === 0 && (
          <p className="text-center text-silver py-8">No messages yet.</p>
        )}
      </section>
    </ProtectedRoute>
  );
}

function MessageCard({
  message,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
  formatDate,
  formatTime,
}: {
  message: Message;
  isSelected: boolean;
  onSelect: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}) {
  return (
    <div
      className={`bg-black border-2 p-6 rounded transition-all ${
        message.read ? "border-gray-600" : "border-gold"
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
                  message.read ? "text-silver" : "text-gold"
                }`}
              >
                {message.name}
              </h3>
              {!message.read && (
                <span className="bg-gold text-black px-2 py-0.5 rounded text-xs font-semibold">
                  NEW
                </span>
              )}
            </div>
            <span className="text-sm text-silver">
              {formatDate(message.createdAt)} at {formatTime(message.createdAt)}
            </span>
          </div>
          <p className="text-sm text-silver mb-2">{message.email}</p>
          {message.subject && (
            <p
              className={`font-semibold mb-2 ${
                message.read ? "text-silver" : "text-white"
              }`}
            >
              {message.subject}
            </p>
          )}
          <p className="text-silver leading-relaxed mb-4">{message.message}</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
              Reply
            </button>
            <button
              onClick={onMarkAsRead}
              className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold"
            >
              {message.read ? "Mark Unread" : "Mark Read"}
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}