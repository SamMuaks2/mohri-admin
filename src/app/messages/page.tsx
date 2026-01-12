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
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

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

  const openReplyModal = (message: Message) => {
    setCurrentMessage(message);
    setReplyModalOpen(true);
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
              onReply={() => openReplyModal(msg)}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          ))}
        </div>

        {!loading && messages.length === 0 && (
          <p className="text-center text-silver py-8">No messages yet.</p>
        )}

        {replyModalOpen && currentMessage && (
          <ReplyModal
            message={currentMessage}
            onClose={() => {
              setReplyModalOpen(false);
              setCurrentMessage(null);
            }}
            onSuccess={() => {
              fetchMessages();
              setReplyModalOpen(false);
              setCurrentMessage(null);
            }}
          />
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
  onReply,
  formatDate,
  formatTime,
}: {
  message: Message;
  isSelected: boolean;
  onSelect: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  onReply: () => void;
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
              {message.replied && (
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                  REPLIED
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
            <button 
              onClick={onReply}
              className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold"
            >
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

function ReplyModal({
  message,
  onClose,
  onSuccess,
}: {
  message: Message;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!replyText.trim()) {
      setError("Please enter a reply message");
      return;
    }

    try {
      setSending(true);
      setError("");
      await apiClient.post(`/messages/${message._id}/reply`, {
        message: replyText,
      });
      alert("Reply sent successfully!");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-gold rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gold">Reply to {message.name}</h3>
            <button
              onClick={onClose}
              className="text-silver hover:text-gold text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-900 rounded border border-gray-700">
            <p className="text-sm text-silver mb-2">
              <strong>To:</strong> {message.email}
            </p>
            <p className="text-sm text-silver mb-2">
              <strong>Subject:</strong> Re: {message.subject || "Your Message"}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-silver mb-2">Original Message:</p>
              <p className="text-sm text-silver">{message.message}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-silver mb-2 font-semibold">
              Your Reply:
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded focus:border-gold focus:outline-none min-h-[200px]"
              placeholder="Type your reply here..."
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors font-semibold"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-6 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}