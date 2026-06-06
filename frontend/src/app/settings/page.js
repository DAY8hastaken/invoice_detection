"use client";
import { useState } from "react";
import Card from "../components/Card";

function SettingRow({ title, description, children }) {
  return (
    <div style={{
      padding: "20px 0",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    }}>
      <div>
        <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
          {title}
        </h4>
        <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 48, height: 28, borderRadius: 999,
        background: enabled ? "var(--purple)" : "rgba(0,0,0,0.1)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.3s",
      }}
    >
      <div style={{
        width: 24, height: 24, borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 2, left: enabled ? 22 : 2,
        transition: "left 0.3s",
      }} />
    </button>
  );
}

function Select({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "8px 12px",
        border: "1px solid var(--border)",
        borderRadius: 6,
        fontSize: 13,
        fontFamily: "var(--font-sans)",
        color: "var(--text)",
        background: "var(--surface)",
        cursor: "pointer",
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    autoTagging: true,
    darkMode: false,
    twoFactor: false,
    currency: "USD",
    language: "English",
    theme: "light",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>
          Settings
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text2)" }}>
          Customize your experience and manage preferences
        </p>
      </div>

      {/* Notifications */}
      <Card style={{ padding: "24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "var(--text)" }}>
          Notifications
        </h2>
        <SettingRow
          title="Email Notifications"
          description="Receive updates via email"
        >
          <Toggle
            enabled={settings.emailNotifications}
            onChange={(val) => setSettings({ ...settings, emailNotifications: val })}
          />
        </SettingRow>
        <SettingRow
          title="Push Notifications"
          description="Get instant alerts on your device"
        >
          <Toggle
            enabled={settings.pushNotifications}
            onChange={(val) => setSettings({ ...settings, pushNotifications: val })}
          />
        </SettingRow>
        <SettingRow
          title="Weekly Report"
          description="Send summary reports every Monday"
        >
          <Toggle
            enabled={settings.weeklyReport}
            onChange={(val) => setSettings({ ...settings, weeklyReport: val })}
          />
        </SettingRow>
      </Card>

      {/* Receipt Processing */}
      <Card style={{ padding: "24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "var(--text)" }}>
          Receipt Processing
        </h2>
        <SettingRow
          title="Auto Tagging"
          description="Automatically categorize receipts"
        >
          <Toggle
            enabled={settings.autoTagging}
            onChange={(val) => setSettings({ ...settings, autoTagging: val })}
          />
        </SettingRow>
        <div style={{
          padding: "20px 0",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              Default Currency
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
              Set your preferred currency for receipts
            </p>
          </div>
          <Select
            value={settings.currency}
            options={["USD", "EUR", "GBP", "CAD", "AUD"]}
            onChange={(val) => setSettings({ ...settings, currency: val })}
          />
        </div>
      </Card>

      {/* Appearance */}
      <Card style={{ padding: "24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "var(--text)" }}>
          Appearance
        </h2>
        <div style={{
          padding: "20px 0",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              Theme
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
              Choose your preferred theme
            </p>
          </div>
          <Select
            value={settings.theme}
            options={["Light", "Dark", "Auto"]}
            onChange={(val) => setSettings({ ...settings, theme: val })}
          />
        </div>
        <div style={{
          paddingTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              Language
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
              Select your preferred language
            </p>
          </div>
          <Select
            value={settings.language}
            options={["English", "Spanish", "French", "German", "Chinese"]}
            onChange={(val) => setSettings({ ...settings, language: val })}
          />
        </div>
      </Card>

      {/* Security */}
      <Card style={{ padding: "24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "var(--text)" }}>
          Security
        </h2>
        <SettingRow
          title="Two-Factor Authentication"
          description="Add an extra layer of security"
        >
          <Toggle
            enabled={settings.twoFactor}
            onChange={(val) => setSettings({ ...settings, twoFactor: val })}
          />
        </SettingRow>
        <div style={{
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              Change Password
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
              Update your account password
            </p>
          </div>
          <button style={{
            padding: "8px 16px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            color: "#3b82f6",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}>
            Change Password
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card style={{ padding: "24px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "#ef4444" }}>
          Danger Zone
        </h2>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
              Delete Account
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
              Permanently delete your account and all data
            </p>
          </div>
          <button style={{
            padding: "8px 16px",
            background: "rgba(239, 68, 68, 0.9)",
            border: "none",
            color: "#fff",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}>
            Delete Account
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div style={{ display: "flex", gap: 12 }}>
        <button style={{
          padding: "12px 32px",
          background: "linear-gradient(135deg, var(--purple), var(--blue))",
          border: "none",
          color: "#fff",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
        }}>
          Save Settings
        </button>
        <button style={{
          padding: "12px 32px",
          background: "rgba(0,0,0,0.05)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
        }}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
