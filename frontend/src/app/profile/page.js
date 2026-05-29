"use client";
import { useState } from "react";
import Card from "../components/Card";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane@acmecorp.io",
    company: "Acme Corporation",
    phone: "+1 (555) 123-4567",
    role: "Finance Manager",
    location: "San Francisco, CA",
    joinDate: "January 15, 2024",
    receiptsProcessed: 284,
    totalSpent: "$12,438.50",
  });

  const StatCard = ({ label, value }) => (
    <Card style={{ padding: "16px 20px" }}>
      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
        {value}
      </div>
    </Card>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>
            My Profile
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text2)" }}>
            Manage your account settings and personal information
          </p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
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
              JD
            </div>
            {editing && (
              <button style={{
                padding: "8px 16px",
                background: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                color: "var(--purple)",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                Change Avatar
              </button>
            )}
          </div>

          {/* Info Section */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { label: "Full Name", value: profile.name, key: "name" },
                { label: "Email", value: profile.email, key: "email" },
                { label: "Company", value: profile.company, key: "company" },
                { label: "Role", value: profile.role, key: "role" },
                { label: "Phone", value: profile.phone, key: "phone" },
                { label: "Location", value: profile.location, key: "location" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", display: "block", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  {editing ? (
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
              {profile.joinDate}
            </p>
          </div>
          {editing && (
            <button style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, var(--purple), var(--blue))",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}>
              Save Changes
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
          <StatCard label="Average Per Receipt" value={`$${(parseInt(profile.totalSpent.replace(/[$,]/g, '')) / profile.receiptsProcessed).toFixed(2)}`} />
          <StatCard label="Processing Accuracy" value="98.2%" />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: "rgba(59, 130, 246, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>
              🔐
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                Change Password
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
                Update your password regularly
              </p>
            </div>
            <button style={{
              padding: "6px 16px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#3b82f6",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Update
            </button>
          </div>
        </Card>

        <Card style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>
              ✅
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                Two-Factor Auth
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
                Enhance your account security
              </p>
            </div>
            <button style={{
              padding: "6px 16px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Enable
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
