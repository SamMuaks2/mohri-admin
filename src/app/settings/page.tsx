"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <ProtectedRoute>
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gold">Settings</h2>

        <div className="flex gap-4 mb-6 border-b border-gold pb-2">
          <TabButton
            label="Profile"
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            label="Security"
            isActive={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />
          <TabButton
            label="Notifications"
            isActive={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          <TabButton
            label="API Keys"
            isActive={activeTab === "api"}
            onClick={() => setActiveTab("api")}
          />
          <TabButton
            label="Appearance"
            isActive={activeTab === "appearance"}
            onClick={() => setActiveTab("appearance")}
          />
        </div>

        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "api" && <APISettings />}
        {activeTab === "appearance" && <AppearanceSettings />}
      </section>
    </ProtectedRoute>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded font-semibold transition-colors ${
        isActive
          ? "bg-gold text-black"
          : "text-silver hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}

function ProfileSettings() {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded space-y-6">
      <h3 className="text-2xl font-bold text-gold mb-4">Profile Information</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-silver mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            defaultValue="Admin User"
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Email</label>
          <input
            type="email"
            defaultValue="admin@example.com"
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Bio</label>
          <textarea
            rows={4}
            defaultValue="Full-stack developer with expertise in modern web technologies."
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Location</label>
          <input
            type="text"
            defaultValue="San Francisco, CA"
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Website</label>
          <input
            type="url"
            defaultValue="https://example.com"
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
          />
        </div>
      </div>

      <button className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors">
        Save Changes
      </button>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="bg-black border-2 border-gold p-6 rounded">
        <h3 className="text-2xl font-bold text-gold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-silver mb-2 font-semibold">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            />
          </div>
          <div>
            <label className="block text-silver mb-2 font-semibold">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            />
          </div>
          <div>
            <label className="block text-silver mb-2 font-semibold">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            />
          </div>
          <button className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-black border-2 border-gold p-6 rounded">
        <h3 className="text-2xl font-bold text-gold mb-4">Two-Factor Authentication</h3>
        <p className="text-silver mb-4">Add an extra layer of security to your account.</p>
        <button className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors">
          Enable 2FA
        </button>
      </div>

      <div className="bg-black border-2 border-gold p-6 rounded">
        <h3 className="text-2xl font-bold text-gold mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <SessionItem
            device="Chrome on Windows"
            location="San Francisco, CA"
            lastActive="Current session"
            isCurrent={true}
          />
          <SessionItem
            device="Safari on iPhone"
            location="San Francisco, CA"
            lastActive="2 hours ago"
            isCurrent={false}
          />
        </div>
      </div>
    </div>
  );
}

function SessionItem({
  device,
  location,
  lastActive,
  isCurrent,
}: {
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}) {
  return (
    <div className="flex justify-between items-center p-4 border border-gold rounded">
      <div>
        <p className="text-white font-semibold">{device}</p>
        <p className="text-sm text-silver">{location}</p>
        <p className="text-sm text-silver">{lastActive}</p>
      </div>
      {!isCurrent && (
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
          Revoke
        </button>
      )}
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <h3 className="text-2xl font-bold text-gold mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        <NotificationToggle
          label="Email Notifications"
          description="Receive email notifications for new messages"
        />
        <NotificationToggle
          label="Comment Notifications"
          description="Get notified when someone comments on your articles"
        />
        <NotificationToggle
          label="Weekly Summary"
          description="Receive a weekly summary of your activity"
        />
        <NotificationToggle
          label="Marketing Emails"
          description="Receive updates about new features and tips"
        />
        <NotificationToggle
          label="System Alerts"
          description="Important system and security notifications"
        />
      </div>
      <button className="mt-6 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors">
        Save Preferences
      </button>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="flex justify-between items-center p-4 border border-gold rounded">
      <div>
        <p className="text-white font-semibold">{label}</p>
        <p className="text-sm text-silver">{description}</p>
      </div>
      <label className="relative inline-block w-12 h-6">
        <input type="checkbox" className="opacity-0 w-0 h-0 peer" defaultChecked />
        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-600 rounded-full transition-all peer-checked:bg-gold before:absolute before:content-[''] before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-6"></span>
      </label>
    </div>
  );
}

function APISettings() {
  return (
    <div className="space-y-6">
      <div className="bg-black border-2 border-gold p-6 rounded">
        <h3 className="text-2xl font-bold text-gold mb-4">API Keys</h3>
        <p className="text-silver mb-4">Manage your API keys for programmatic access.</p>
        <button className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors mb-6">
          Generate New Key
        </button>
        <div className="space-y-3">
          <APIKeyItem
            name="Production API Key"
            key_preview="sk_live_xxxxxxxxxxxx1234"
            created="2025-01-01"
          />
          <APIKeyItem
            name="Development API Key"
            key_preview="sk_test_xxxxxxxxxxxx5678"
            created="2024-12-15"
          />
        </div>
      </div>
    </div>
  );
}

function APIKeyItem({
  name,
  key_preview,
  created,
}: {
  name: string;
  key_preview: string;
  created: string;
}) {
  return (
    <div className="flex justify-between items-center p-4 border border-gold rounded">
      <div>
        <p className="text-white font-semibold">{name}</p>
        <p className="text-sm text-silver font-mono">{key_preview}</p>
        <p className="text-sm text-silver">Created: {created}</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
          Copy
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
          Revoke
        </button>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <h3 className="text-2xl font-bold text-gold mb-6">Appearance</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-silver mb-3 font-semibold">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption label="Dark" isActive={true} />
            <ThemeOption label="Light" isActive={false} />
            <ThemeOption label="Auto" isActive={false} />
          </div>
        </div>

        <div>
          <label className="block text-silver mb-3 font-semibold">Accent Color</label>
          <div className="grid grid-cols-4 gap-4">
            <ColorOption color="#d4af37" label="Gold" isActive={true} />
            <ColorOption color="#c0c0c0" label="Silver" isActive={false} />
            <ColorOption color="#3b82f6" label="Blue" isActive={false} />
            <ColorOption color="#10b981" label="Green" isActive={false} />
          </div>
        </div>

        <button className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function ThemeOption({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  return (
    <button
      className={`p-4 rounded border-2 font-semibold transition-colors ${
        isActive
          ? "border-gold bg-gold text-black"
          : "border-gold text-gold hover:bg-gold hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

function ColorOption({
  color,
  label,
  isActive,
}: {
  color: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <button
      className={`p-4 rounded border-2 font-semibold transition-colors ${
        isActive ? "border-white" : "border-gold"
      }`}
      style={{ backgroundColor: color }}
    >
      <span className={isActive ? "text-white" : "text-black"}>{label}</span>
    </button>
  );
}