"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/* ── sub-components ── */
function SectionLabel({ children }) {
  return (
    <p style={{
      margin: "0 0 12px",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "var(--ink-3)",
    }}>{children}</p>
  );
}

function DataRow({ icon, label, value, mono, accent }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px",
      borderRadius: 12,
      background: "rgba(255,255,255,0.5)",
      border: "1px solid var(--border)",
      transition: "background 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.8)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.5)"}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: accent ? "rgba(91,71,251,0.1)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${accent ? "rgba(91,71,251,0.18)" : "var(--border)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accent ? "var(--accent)" : "var(--ink-3)",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {label}
        </p>
        <p style={{
          margin: 0,
          fontSize: accent ? 22 : 14,
          fontWeight: accent ? 600 : 500,
          fontFamily: mono ? "monospace" : "var(--font-sans)",
          color: accent ? "var(--accent)" : "var(--ink)",
          letterSpacing: accent ? "-0.03em" : 0,
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ConfidenceBar({ value }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 400); return () => clearTimeout(t); }, [value]);
  const color = value > 90 ? "#22c55e" : value > 70 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 999, background: "rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, background: color,
          width: `${w}%`, transition: "width 1s cubic-bezier(.22,.68,0,1.2)",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color, minWidth: 40, textAlign: "right" }}>
        {value}%
      </span>
    </div>
  );
}

function ReceiptCard({ data, delay, index }) {
  const [rawOpen, setRawOpen] = useState(false);

  const delayStyle = {
    opacity: 1,
    transform: "translateY(0)",
    transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s cubic-bezier(.22,.68,0,1.2) ${index * 80}ms`,
  };

  return (
    <div style={{
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      background: "rgba(255,255,255,0.5)",
      padding: "28px",
      marginBottom: 24,
    }}>
      {/* Receipt Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingBottom: 20,
        borderBottom: "1px solid var(--border)",
      }}>
        <div>
          <h3 style={{
            margin: "0 0 4px",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--ink)",
          }}>
            {data.merchant}
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>
            {data.date}
          </p>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 999,
          background: "rgba(91,71,251,0.08)",
          border: "1px solid rgba(91,71,251,0.18)",
          fontSize: 13, fontWeight: 600, color: "var(--accent)",
        }}>
          {data.category === "Groceries" ? "🛒" : data.category === "Electronics" ? "💻" : data.category === "Clothing" ? "👕" : "🏪"} {data.category}
        </div>
      </div>

      {/* Hero amount section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr auto auto",
        gap: 24,
        alignItems: "center",
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Amount */}
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            Total
          </p>
          <p style={{
            margin: 0, fontSize: 32, fontWeight: 600,
            letterSpacing: "-0.04em", color: "var(--ink)",
            fontFamily: "var(--font-serif)",
          }}>
            {fmt(data.amount)}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-3)" }}>
            {data.payment}
          </p>
        </div>

        <div style={{ width: 1, height: 56, background: "var(--border)" }} />

        {/* Confidence */}
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            AI Confidence
          </p>
          <ConfidenceBar value={data.confidence} />
          <p style={{ margin: "5px 0 0", fontSize: 11, color: "var(--ink-3)" }}>High accuracy</p>
        </div>

        <div style={{ width: 1, height: 56, background: "var(--border)" }} />

        {/* Tax */}
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            Tax
          </p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: "monospace", color: "var(--ink)" }}>
            {fmt(data.tax)}
          </p>
        </div>
      </div>

      {/* Extracted fields */}
      <div style={delayStyle}>
        <SectionLabel>Extracted Fields</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          <DataRow accent label="Total Amount" value={fmt(data.amount)} mono
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
          />
          <DataRow label="Merchant" value={data.merchant}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
          />
          <DataRow label="Date" value={data.date}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          />
          <DataRow label="Tax" value={fmt(data.tax)} mono
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          />
          <DataRow label="Location" value={data.location}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
          />
          <DataRow label="Payment" value={data.payment} mono
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
          />
        </div>
      </div>

      {/* Line items */}
      <div style={delayStyle}>
        <SectionLabel>Line Items</SectionLabel>
        <div className="glass" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {data.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 20px",
              borderBottom: i < data.items.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: "rgba(0,0,0,0.04)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "var(--ink-3)", fontFamily: "monospace",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 14, color: "var(--ink-2)" }}>{item.name}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace", color: "var(--ink)" }}>
                {fmt(item.price)}
              </span>
            </div>
          ))}

          {/* Total row */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 20px",
            background: "rgba(91,71,251,0.05)",
            borderTop: "1px solid rgba(91,71,251,0.12)",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: "var(--accent)" }}>
              {fmt(data.amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const [show, setShow] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      const stored = localStorage.getItem("processedReceipts");
      if (stored) {
        try {
          setReceipts(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing receipts:", e);
        }
      }
      setLoaded(true);
      setShow(true);
    }, 80);

    return () => clearTimeout(t);
  }, []);

  const delay = (n) => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.5s ease ${n * 80}ms, transform 0.5s cubic-bezier(.22,.68,0,1.2) ${n * 80}ms`,
  });

  const totalAmount = receipts.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalTax = receipts.reduce((sum, r) => sum + Number(r.tax || 0), 0);
  const avgConfidence = receipts.length > 0 
    ? Math.round((receipts.reduce((sum, r) => sum + r.confidence, 0) / receipts.length) * 10) / 10 
    : 0;

  const showActionMessage = (message) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(""), 2600);
  };

  const handleExportJson = () => {
    if (!receipts.length) {
      showActionMessage("No receipts to export.");
      return;
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      receiptCount: receipts.length,
      totals: {
        amount: totalAmount,
        tax: totalTax,
        averageConfidence: avgConfidence,
      },
      receipts,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `finsight-receipts-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showActionMessage("JSON exported.");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!receipts.length) {
      showActionMessage("No receipts to share.");
      return;
    }

    const text = `FinSight receipt report: ${receipts.length} receipt${receipts.length !== 1 ? "s" : ""}, ${fmt(totalAmount)} total.`;
    const shareData = {
      title: "FinSight Receipt Report",
      text,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showActionMessage("Share opened.");
        return;
      }

      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      showActionMessage("Share link copied.");
    } catch (error) {
      if (error.name !== "AbortError") {
        showActionMessage("Share failed.");
      }
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="bg-mesh" />

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(244,243,240,0.82)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 56,
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="6" fill="var(--accent)" />
            <path d="M5 15 L9 9 L13 12 L17 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="17" cy="6" r="2" fill="#fff" opacity=".7"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            Fin<span style={{ color: "var(--accent)" }}>Sight</span>
          </span>
        </Link>

        <Link href="/" className="btn-ghost" style={{ textDecoration: "none", fontSize: 12 }}>
          ← New receipt
        </Link>
      </nav>

      <main style={{
        flex: 1, padding: "48px 20px 80px",
        maxWidth: 680, margin: "0 auto", width: "100%",
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", gap: 24,
      }}>

        {/* Header */}
        <div style={delay(0)}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#16a34a" }}>
              Analysis complete
            </span>
          </div>
          <h1 style={{
            margin: "0 0 4px",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 4vw, 36px)",
            fontWeight: 400, letterSpacing: "-0.03em",
            color: "var(--ink)",
          }}>
            Receipt Report
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)" }}>
            {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} processed · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Summary Card */}
        <div className="glass" style={{
          ...delay(1),
          borderRadius: "var(--radius-xl)",
          padding: "28px 28px",
          display: "grid",
          gridTemplateColumns: receipts.length > 1 ? "1fr auto 1fr auto 1fr" : "1fr",
          gap: 24,
          alignItems: "center",
        }}>
          {receipts.length > 1 && (
            <>
              {/* Total spent */}
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Total Spent
                </p>
                <p style={{
                  margin: 0, fontSize: 42, fontWeight: 600,
                  letterSpacing: "-0.04em", color: "var(--ink)",
                  fontFamily: "var(--font-serif)",
                }}>
                  {fmt(totalAmount)}
                </p>
              </div>

              <div style={{ width: 1, height: 56, background: "var(--border)" }} />

              {/* Receipts count */}
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Receipts
                </p>
                <p style={{
                  margin: 0, fontSize: 42, fontWeight: 600,
                  letterSpacing: "-0.04em", color: "var(--ink)",
                  fontFamily: "var(--font-serif)",
                }}>
                  {receipts.length}
                </p>
              </div>

              <div style={{ width: 1, height: 56, background: "var(--border)" }} />

              {/* Avg confidence */}
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Avg Confidence
                </p>
                <ConfidenceBar value={avgConfidence} />
              </div>
            </>
          )}
          {receipts.length === 1 && (
            <>
              {/* Single receipt summary */}
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Total
                </p>
                <p style={{
                  margin: 0, fontSize: 42, fontWeight: 600,
                  letterSpacing: "-0.04em", color: "var(--ink)",
                  fontFamily: "var(--font-serif)",
                }}>
                  {fmt(receipts[0].amount)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Individual Receipt Cards */}
        {loaded && receipts.map((receipt, idx) => (
          <ReceiptCard key={receipt.id} data={receipt} delay={delay} index={idx + 2} />
        ))}

        {/* Action buttons */}
        <div style={{ ...delay(receipts.length + 2), display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn-ghost"
            onClick={handleExportJson}
            disabled={!loaded || receipts.length === 0}
            style={{ flex: 1, minWidth: 140, justifyContent: "center", opacity: !loaded || receipts.length === 0 ? 0.55 : 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export JSON
          </button>
          <button
            className="btn-ghost"
            onClick={handlePrint}
            disabled={!loaded || receipts.length === 0}
            style={{ flex: 1, minWidth: 140, justifyContent: "center", opacity: !loaded || receipts.length === 0 ? 0.55 : 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
          </button>
          <button
            className="btn-ghost"
            onClick={handleShare}
            disabled={!loaded || receipts.length === 0}
            style={{ flex: 1, minWidth: 140, justifyContent: "center", opacity: !loaded || receipts.length === 0 ? 0.55 : 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        </div>

        {actionMessage && (
          <div style={{
            ...delay(receipts.length + 3),
            fontSize: 12,
            color: "var(--ink-3)",
            textAlign: "center",
          }}>
            {actionMessage}
          </div>
        )}
      </main>
    </div>
  );
}
