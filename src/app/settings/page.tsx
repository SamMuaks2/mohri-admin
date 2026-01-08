"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  role: string;
}

interface Preferences {
  theme: string;
  accentColor: string;
  emailNotifications: boolean;
  commentNotifications: boolean;
  weeklySummary: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [message, setMessage] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [profileData, preferencesData] = await Promise.all([
        apiClient.get("/settings/profile"),
        apiClient.get("/settings/preferences"),
      ]);

      setProfile(profileData);
      setPreferences(preferencesData);
      
      setProfileForm({
        name: profileData.name || "",
        email: profileData.email || "",
        bio: profileData.bio || "",
        location: profileData.location || "",
        website: profileData.website || "",
      });
    } catch (err: any) {
      showMessage("Error loading settings: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      await apiClient.put("/settings/profile", profileForm);
      showMessage("Profile updated successfully!", "success");
      fetchSettings();
    } catch (err: any) {
      showMessage("Error updating profile: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("New passwords do not match!", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage("Password must be at least 6 characters long!", "error");
      return;
    }

    try {
      setSaving(true);
      await apiClient.put("/settings/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showMessage("Password updated successfully!", "success");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      showMessage("Error updating password: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesUpdate = async (updatedPreferences: Preferences) => {
    try {
      await apiClient.put("/settings/preferences", updatedPreferences);
      setPreferences(updatedPreferences);
      showMessage("Preferences saved!", "success");
    } catch (err: any) {
      showMessage("Error saving preferences: " + err.message, "error");
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-silver text-xl">Loading settings...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gold">Settings</h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded border-2 ${
              message.includes("Error")
                ? "bg-red-900 border-red-600 text-white"
                : "bg-green-900 border-green-600 text-white"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b border-gold pb-2 overflow-x-auto">
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
            label="Appearance"
            isActive={activeTab === "appearance"}
            onClick={() => setActiveTab("appearance")}
          />
        </div>

        {activeTab === "profile" && (
          <ProfileSettings
            form={profileForm}
            setForm={setProfileForm}
            onSave={handleProfileUpdate}
            saving={saving}
            profile={profile}
          />
        )}
        {activeTab === "security" && (
          <SecuritySettings
            form={passwordForm}
            setForm={setPasswordForm}
            onSave={handlePasswordUpdate}
            saving={saving}
          />
        )}
        {activeTab === "notifications" && preferences && (
          <NotificationSettings
            preferences={preferences}
            onSave={handlePreferencesUpdate}
          />
        )}
        {activeTab === "appearance" && preferences && (
          <AppearanceSettings
            preferences={preferences}
            onSave={handlePreferencesUpdate}
          />
        )}
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
      className={`px-4 py-2 rounded font-semibold transition-colors whitespace-nowrap ${
        isActive ? "bg-gold text-black" : "text-silver hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}

function ProfileSettings({
  form,
  setForm,
  onSave,
  saving,
  profile,
}: {
  form: any;
  setForm: any;
  onSave: () => void;
  saving: boolean;
  profile: UserProfile | null;
}) {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded space-y-6">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gold">
        <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-3xl font-bold text-black">
          {profile?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gold">{profile?.name}</h3>
          <p className="text-silver">{profile?.email}</p>
          <p className="text-sm text-silver">Role: {profile?.role}</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gold mb-4">Profile Information</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-silver mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-silver mb-2 font-semibold">Website</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function SecuritySettings({
  form,
  setForm,
  onSave,
  saving,
}: {
  form: any;
  setForm: any;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-black border-2 border-gold p-6 rounded">
        <h3 className="text-2xl font-bold text-gold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-silver mb-2 font-semibold">
              Current Password
            </label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            />
          </div>
          <div>
            <label className="block text-silver mb-2 font-semibold">
              New Password
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            />
            <p className="text-sm text-silver mt-1">
              Must be at least 6 characters long
            </p>
          </div>
          <div>
            <label className="block text-silver mb-2 font-semibold">
              Confirm New Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
            />
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings({
  preferences,
  onSave,
}: {
  preferences: Preferences;
  onSave: (prefs: Preferences) => void;
}) {
  const togglePreference = (key: keyof Preferences) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key],
    };
    onSave(updated);
  };

  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <h3 className="text-2xl font-bold text-gold mb-6">
        Notification Preferences
      </h3>
      <div className="space-y-4">
        <NotificationToggle
          label="Email Notifications"
          description="Receive email notifications for new messages"
          checked={preferences.emailNotifications}
          onChange={() => togglePreference("emailNotifications")}
        />
        <NotificationToggle
          label="Comment Notifications"
          description="Get notified when someone comments on your articles"
          checked={preferences.commentNotifications}
          onChange={() => togglePreference("commentNotifications")}
        />
        <NotificationToggle
          label="Weekly Summary"
          description="Receive a weekly summary of your activity"
          checked={preferences.weeklySummary}
          onChange={() => togglePreference("weeklySummary")}
        />
        <NotificationToggle
          label="Marketing Emails"
          description="Receive updates about new features and tips"
          checked={preferences.marketingEmails}
          onChange={() => togglePreference("marketingEmails")}
        />
        <NotificationToggle
          label="System Alerts"
          description="Important system and security notifications"
          checked={preferences.systemAlerts}
          onChange={() => togglePreference("systemAlerts")}
        />
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex justify-between items-center p-4 border border-gold rounded">
      <div>
        <p className="text-white font-semibold">{label}</p>
        <p className="text-sm text-silver">{description}</p>
      </div>
      <label className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          className="opacity-0 w-0 h-0 peer"
          checked={checked}
          onChange={onChange}
        />
        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-600 rounded-full transition-all peer-checked:bg-gold before:absolute before:content-[''] before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-6"></span>
      </label>
    </div>
  );
}

function AppearanceSettings({
  preferences,
  onSave,
}: {
  preferences: Preferences;
  onSave: (prefs: Preferences) => void;
}) {
  const updateTheme = (theme: string) => {
    onSave({ ...preferences, theme });
  };

  const updateAccentColor = (accentColor: string) => {
    onSave({ ...preferences, accentColor });
  };

  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <h3 className="text-2xl font-bold text-gold mb-6">Appearance</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-silver mb-3 font-semibold">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption
              label="Dark"
              isActive={preferences.theme === "dark"}
              onClick={() => updateTheme("dark")}
            />
            <ThemeOption
              label="Light"
              isActive={preferences.theme === "light"}
              onClick={() => updateTheme("light")}
            />
            <ThemeOption
              label="Auto"
              isActive={preferences.theme === "auto"}
              onClick={() => updateTheme("auto")}
            />
          </div>
        </div>

        <div>
          <label className="block text-silver mb-3 font-semibold">
            Accent Color
          </label>
          <div className="grid grid-cols-4 gap-4">
            <ColorOption
              color="#d4af37"
              label="Gold"
              isActive={preferences.accentColor === "#d4af37"}
              onClick={() => updateAccentColor("#d4af37")}
            />
            <ColorOption
              color="#c0c0c0"
              label="Silver"
              isActive={preferences.accentColor === "#c0c0c0"}
              onClick={() => updateAccentColor("#c0c0c0")}
            />
            <ColorOption
              color="#3b82f6"
              label="Blue"
              isActive={preferences.accentColor === "#3b82f6"}
              onClick={() => updateAccentColor("#3b82f6")}
            />
            <ColorOption
              color="#10b981"
              label="Green"
              isActive={preferences.accentColor === "#10b981"}
              onClick={() => updateAccentColor("#10b981")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeOption({
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
  onClick,
}: {
  color: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded border-2 font-semibold transition-colors ${
        isActive ? "border-white" : "border-gold"
      }`}
      style={{ backgroundColor: color }}
    >
      <span className={isActive ? "text-white" : "text-black"}>{label}</span>
    </button>
  );
}