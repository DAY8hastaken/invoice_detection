"use client";
import Card from "../components/Card";
import { RECEIPTS } from "../lib/mockData";

function StatusBadge({ status }) {
  const map = {
    processed: { cls: "badge-success", label: "Processed", dot: "#10b981" },
    pending:   { cls: "badge-pending", label: "Pending",   dot: "#f59e0b" },
    failed:    { cls: "badge-failed",  label: "Failed",    dot: "#f43f5e" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`badge ${s.cls}`}>
      <span className="badge-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export default function HistoryPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200 }}>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search by merchant, category…" style={{ width: "100%" }} />
        </div>
        {["All", "Processed", "Pending", "Failed"].map((f, i) => (
          <button key={f} className="btn-ghost" style={{
            fontSize: 12,
            ...(i === 0 ? { background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.25)", color: "var(--indigo2)" } : {}),
          }}>{f}</button>
        ))}
        <button className="btn-ghost" style={{ marginLeft: "auto", fontSize: 12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      <Card>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Merchant</th><th>Date</th>
              <th>Category</th><th>Amount</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {[...RECEIPTS, ...RECEIPTS].map((r, i) => (
              <tr key={`${r.id}-${i}`}>
                <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{r.id}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="merchant-icon">{r.emoji}</div>
                    <span style={{ fontWeight: 500 }}>{r.merchant}</span>
                  </div>
                </td>
                <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)" }}>{r.date}</span></td>
                <td>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text2)" }}>
                    {r.category}
                  </span>
                </td>
                <td><span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>${r.amount.toFixed(2)}</span></td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>Showing 16 of 284 results</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["←", "1", "2", "3", "...", "24", "→"].map((p, i) => (
              <button key={i} className="btn-ghost" style={{
                minWidth: 28, height: 28, padding: "0 6px", fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                ...(p === "1" ? { background: "rgba(99,102,241,0.12)", borderColor: "rgba(99,102,241,0.25)", color: "var(--indigo2)" } : {}),
              }}>{p}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
