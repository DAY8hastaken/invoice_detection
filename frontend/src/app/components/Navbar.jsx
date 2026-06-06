"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard",      sub: "Good morning" },
  "/upload":    { title: "Upload Receipt", sub: "Add a new expense"      },
  "/history":   { title: "History",        sub: "All processed receipts" },
  "/reports":   { title: "Reports",        sub: "Spending analytics"     },
  "/profile":   { title: "Profile",        sub: "Manage your account"    },
  "/settings":  { title: "Settings",       sub: "System configurations"  },
  "/help":      { title: "Help & Support",  sub: "Finsight user guide"    },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const page = PAGE_TITLES[pathname] || { title: "FinSight", sub: "" };
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [receiptSearch, setReceiptSearch] = useState("");
  const searchInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const dynamicSub = pathname === "/dashboard" 
    ? `Good morning, ${user?.username || "Guest"} 👋`
    : page.sub;

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleReceiptSearch = (event) => {
    event.preventDefault();
    const query = receiptSearch.trim();
    if (pathname === "/history") {
      window.dispatchEvent(new CustomEvent("receipt-navbar-search", { detail: query }));
    }
    router.push(query ? `/history?search=${encodeURIComponent(query)}` : "/history");
  };

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
        {dynamicSub && (
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {dynamicSub}
          </div>
        )}
      </div>

      {/* Search */}
      <form className="search-bar" onSubmit={handleReceiptSearch}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={searchInputRef}
          placeholder="Search receipts…"
          value={receiptSearch}
          onChange={(event) => setReceiptSearch(event.target.value)}
        />
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "1px 6px", borderRadius: 5,
          border: "1px solid var(--border2)",
          fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text3)",
          background: "var(--surface)",
        }}>
          ⌘K
        </div>
      </form>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Date chip */}
        <div className="nav-chip" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--surface2)", border: "1px solid var(--border2)",
          fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20
        }}>
          <div className="live-dot" style={{ width: 6, height: 6 }} />
          Jun 2026
        </div>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
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
                { icon: "🧾", text: "Receipt seeded successfully", time: "just now" },
                { icon: "🔑",  text: "You logged in successfully", time: "1m ago" },
                { icon: "📊",  text: "Monthly stats compiled",  time: "3m ago" },
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

        {/* Avatar block with menu dropdown */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
              padding: "4px 10px 4px 4px",
              borderRadius: 8, border: "1px solid var(--border2)",
              background: "var(--surface2)",
              userSelect: "none"
            }}
          >
            <div className="avatar">{getInitials(user?.username)}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1, color: "var(--text)" }}>
                {user?.username || "Guest User"}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1, textTransform: "capitalize" }}>
                {user?.role || "Member"}
              </div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          {userMenuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 180, background: "var(--surface)",
              border: "1px solid var(--border2)", borderRadius: 10,
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              zIndex: 100, overflow: "hidden",
              padding: "4px 0"
            }}>
              <Link href="/profile" style={{ textDecoration: "none" }} onClick={() => setUserMenuOpen(false)}>
                <div style={{
                  padding: "10px 14px", fontSize: 13, color: "var(--text)",
                  cursor: "pointer", transition: "background 0.12s",
                  display: "flex", alignItems: "center", gap: 8
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span>👤</span> Profile Settings
                </div>
              </Link>
              
              <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "4px 0" }} />
              
              <div
                onClick={() => { setUserMenuOpen(false); logout(); }}
                style={{
                  padding: "10px 14px", fontSize: 13, color: "var(--red)",
                  cursor: "pointer", transition: "background 0.12s",
                  display: "flex", alignItems: "center", gap: 8, fontWeight: 600
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--red-soft)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span>🚪</span> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
