"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import Card from "../components/Card";

const buildProfile = (user) => ({
  name: user?.name || user?.username || "",
  email: user?.email || "",
  company: user?.company || "Acme Corporation",
  phone: user?.phone || "",
  role: user?.role || "Finance Member",
  location: user?.location || "",
  joinDate: user?.joinDate || "",
  receiptsProcessed: user?.receiptsProcessed || 0,
  totalSpent: typeof user?.totalSpent === "number"
    ? `$${user.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : user?.totalSpent || "$0.00",
});

function StatCard({ label, value }) {
  return (
    <Card style={{ padding: "16px 20px" }}>
      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
        {value}
      </div>
    </Card>
  );
}

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(() => buildProfile(user));

  useEffect(() => {
    const profileTimer = window.setTimeout(() => {
      setProfile(buildProfile(user));
    }, 0);

    return () => window.clearTimeout(profileTimer);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/auth/me/", {
        username: profile.name,
        email: profile.email,
      });
      await loadUser();
      setEditing(false);
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const rawSpent = parseFloat(profile.totalSpent.replace(/[$,]/g, "")) || 0;
  const avgSpent = profile.receiptsProcessed > 0 ? (rawSpent / profile.receiptsProcessed) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifySpaceBetween: "space-between", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>
            My Profile
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text2)" }}>
            Manage your account settings and personal information
          </p>
        </div>
        <button
          onClick={() => {
            if (editing) {
              // reset back to user context
              setProfile(buildProfile(user));
            }
            setEditing(!editing);
          }}
          style={{
            padding: "10px 20px",
            background: editing ? "rgba(239, 68, 68, 0.1)" : "rgba(124, 58, 237, 0.1)",
            border: editing ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(124, 58, 237, 0.3)",
            color: editing ? "#ef4444" : "var(--purple)",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = editing ? "rgba(239, 68, 68, 0.15)" : "rgba(124, 58, 237, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = editing ? "rgba(239, 68, 68, 0.1)" : "rgba(124, 58, 237, 0.1)";
          }}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Card */}
      <Card style={{ padding: "32px" }}>
        <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
          {/* Avatar Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--purple), var(--blue))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 40, fontWeight: 700, color: "#fff",
            }}>
              {getInitials(profile.name)}
            </div>
          </div>

          {/* Info Section */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { label: "Username / Full Name", value: profile.name, key: "name", editable: true },
                { label: "Email Address", value: profile.email, key: "email", editable: true },
                { label: "Company", value: profile.company, key: "company", editable: false },
                { label: "Role", value: profile.role, key: "role", editable: false },
                { label: "Phone", value: profile.phone || "Not provided", key: "phone", editable: false },
                { label: "Location", value: profile.location || "Not provided", key: "location", editable: false },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", display: "block", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  {editing && field.editable ? (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        fontSize: 14,
                        fontFamily: "var(--font-sans)",
                        color: "var(--text)",
                        background: "var(--surface2)",
                      }}
                    />
                  ) : (
                    <p style={{ margin: 0, fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
                      {field.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Since */}
        <div style={{ paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)" }}>
              Member Since
            </p>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
              {profile.joinDate || "N/A"}
            </p>
          </div>
          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "10px 24px",
                background: "linear-gradient(135deg, var(--brand), var(--brand2))",
                border: "none",
                color: "#fff",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          Account Statistics
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <StatCard label="Receipts Processed" value={profile.receiptsProcessed} />
          <StatCard label="Total Amount" value={profile.totalSpent} />
          <StatCard label="Average Per Receipt" value={`$${avgSpent.toFixed(2)}`} />
          <StatCard label="Processing Accuracy" value="98.2%" />
        </div>
      </div>
    </div>
  );
}
