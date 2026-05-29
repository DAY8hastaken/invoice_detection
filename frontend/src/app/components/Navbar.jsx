"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard",      sub: "Good morning, Jane 👋" },
  "/upload":    { title: "Upload Receipt", sub: "Add a new expense"      },
  "/history":   { title: "History",        sub: "All processed receipts" },
  "/reports":   { title: "Reports",        sub: "Spending analytics"     },
};

export default function Navbar() {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] || { title: "FinSight", sub: "" };
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="layout-navbar">
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em",
          lineHeight: 1, color: "var(--text)",
        }}>
          {page.title}
        </div>
        {page.sub && (
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {page.sub}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="search-bar">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search receipts…" />
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "1px 6px", borderRadius: 5,
          border: "1px solid var(--border2)",
          fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text3)",
          background: "var(--surface)",
        }}>
          ⌘K
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Date chip */}
        <div className="nav-chip">
          <div className="live-dot" style={{ width: 6, height: 6 }} />
          Apr 2025
        </div>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: "var(--surface2)", border: "1px solid var(--border2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <div style={{
              position: "absolute", top: 7, right: 7,
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--brand)", border: "1.5px solid var(--surface)",
            }} />
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 280, background: "var(--surface)",
              border: "1px solid var(--border2)", borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              zIndex: 100, overflow: "hidden",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Notifications</span>
                <span style={{ fontSize: 11, color: "var(--brand)", cursor: "pointer", fontWeight: 600 }}>Mark all read</span>
              </div>
              {[
                { icon: "🧾", text: "Receipt from Delta Airlines ready", time: "2m ago" },
                { icon: "⚠️",  text: "Receipt RCP-006 failed processing", time: "1h ago" },
                { icon: "📊",  text: "Monthly report is ready to view",  time: "3h ago" },
              ].map((n, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "11px 16px",
                  borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  cursor: "pointer", transition: "background 0.12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ fontSize: 15 }}>{n.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          padding: "4px 10px 4px 4px",
          borderRadius: 8, border: "1px solid var(--border2)",
          background: "var(--surface2)",
        }}>
          <div className="avatar">JD</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1, color: "var(--text)" }}>Jane Doe</div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>Admin</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
