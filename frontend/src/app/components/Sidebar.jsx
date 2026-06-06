"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const Icon = ({ name, size = 15 }) => {
  const icons = {
    grid: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
    upload: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>
      </svg>
    ),
    "bar-chart": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
    help: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

const NAV = [
  { id: "dashboard", label: "Dashboard",      href: "/dashboard", icon: "grid"      },
  { id: "upload",    label: "Upload Receipt", href: "/upload",    icon: "upload"    },
  { id: "history",   label: "History",        href: "/history",   icon: "clock"     },
  { id: "reports",   label: "Reports",        href: "/reports",   icon: "bar-chart" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="layout-sidebar">
      {/* Logo */}
      <div style={{
        padding: "20px 18px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: "#7c3aed",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 11L5.5 7L8.5 9.5L12.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12.5" cy="4" r="1.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700,
            letterSpacing: "-0.02em", lineHeight: 1, color: "#fff",
          }}>
            Fin<span style={{ color: "#7c3aed" }}>Sight</span>
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 2 }}>
            AI Finance
          </div>
        </div>
      </div>

      {/* Workspace pill */}
      <div style={{ padding: "12px 14px 8px" }}>
        <div style={{
          display: "flex", alignItems: "center", justifySpaceBetween: "space-between",
          padding: "8px 10px", borderRadius: 8,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 5,
              background: "#7c3aed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11,
            }}>🏢</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Acme Corp</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: "8px 18px 4px" }}>
        <div className="section-label">Main Menu</div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: "4px 10px", flex: 1 }}>
        {NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`nav-item${isActive ? " active" : ""}`}
              style={{ marginBottom: 3, display: "flex" }}
            >
              <span className="nav-icon" style={{ display: "flex", flexShrink: 0 }}>
                <Icon name={item.icon} size={15} />
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: "10px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {[
          { icon: "settings", label: "Settings", href: "/settings" },
          { icon: "help",     label: "Help & Support", href: "/help" },
        ].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-item${isActive ? " active" : ""}`}
              style={{ marginBottom: 2, display: "flex" }}
            >
              <span style={{ display: "flex", flexShrink: 0 }}>
                <Icon name={item.icon} size={15} />
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* User card - Profile Link */}
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <div style={{
            marginTop: 10, padding: "9px 10px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, display: "flex", alignItems: "center", gap: 9,
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
              {getInitials(user?.username)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user?.username || "Guest User"}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email || "No email available"}
              </div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>
      </div>
    </aside>
  );
}
