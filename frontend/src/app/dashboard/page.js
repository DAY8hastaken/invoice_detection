"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../components/Card";
import { RECEIPTS, STATS, CATEGORY_BREAKDOWN, MONTHLY_TREND } from "../lib/mockData";
import { api } from "../lib/api";

/* ── Sparkline SVG ── */
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 70, h = 24, pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `M ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(" ")
    + ` L ${w - pad},${h} L ${pad},${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="sparkline">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#","")})`}/>
      <polyline points={polyline} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1].split(",")[0]} cy={pts[pts.length-1].split(",")[1]} r="2.5" fill={color}/>
    </svg>
  );
}

/* ── Bar chart row ── */
function CategoryBar({ name, amount, pct, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="chart-bar-row">
      <div className="chart-bar-label">{name}</div>
      <div className="chart-bar-track">
        <div className="chart-bar-fill" style={{ width: `${width}%`, background: color }} />
      </div>
      <div className="chart-bar-val">${(amount/1000).toFixed(1)}k</div>
    </div>
  );
}

/* ── Month trend bars ── */
function TrendBars({ data }) {
  const max = Math.max(...data.map(d => d.val));
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 72, paddingTop: 8 }}>
      {data.map((d, i) => {
        const h = animated ? (d.val / max) * 72 : 0;
        const isLast = i === data.length - 1;
        return (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: "100%", height: h,
              background: isLast ? "var(--brand)" : "rgba(232,64,28,0.15)",
              borderRadius: "4px 4px 0 0",
              transition: `height 0.9s cubic-bezier(.22,.68,0,1.2) ${i * 60}ms`,
              minHeight: 2,
            }} />
            <div style={{ fontSize: 9, color: isLast ? "var(--brand)" : "var(--text3)", fontFamily: "var(--font-mono)", fontWeight: isLast ? 700 : 400 }}>
              {d.month}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    processed: { cls: "badge-success", label: "Processed" },
    pending:   { cls: "badge-pending", label: "Pending"   },
    failed:    { cls: "badge-failed",  label: "Failed"    },
  };
  const s = map[status] || map.pending;
  const dots = { "badge-success": "#16a34a", "badge-pending": "#d97706", "badge-failed": "#dc2626" };
  return (
    <span className={`badge ${s.cls}`}>
      <span className="badge-dot" style={{ background: dots[s.cls] }} />
      {s.label}
    </span>
  );
}

/* ── Quick action button (like Zoho top row) ── */
function QuickAction({ icon, label, sub, onClick, primary }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, padding: "20px 12px",
        border: primary ? "1.5px solid var(--brand-border)" : "1.5px solid var(--border2)",
        borderRadius: 12, cursor: "pointer",
        background: primary ? "var(--brand-soft)" : "var(--surface)",
        transition: "all 0.18s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "var(--brand-soft)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = primary ? "var(--brand-border)" : "var(--border2)"; e.currentTarget.style.background = primary ? "var(--brand-soft)" : "var(--surface)"; }}
    >
      <div style={{
        fontSize: 22,
        color: "var(--brand)",
        lineHeight: 1,
      }}>{icon}</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand)" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Main dashboard ── */
export default function DashboardPage() {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [addUserSaving, setAddUserSaving] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [addUserSuccess, setAddUserSuccess] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  const generateMockReceipt = (fileName, index) => {
    const merchants = ["Whole Foods Market", "Target", "Walmart", "Best Buy", "Trader Joe's", "Costco"];
    const categories = ["Groceries", "Electronics", "Clothing", "Home & Garden", "Pharmacy", "Beauty"];
    const locations = ["San Francisco, CA", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Boston, MA", "Seattle, WA"];
    
    const merchant = merchants[index % merchants.length];
    const category = categories[index % categories.length];
    const location = locations[index % locations.length];
    const amount = Math.round((Math.random() * 200 + 20) * 100) / 100;
    const tax = Math.round(amount * 0.08 * 100) / 100;
    
    return {
      id: Math.random(),
      merchant,
      amount,
      currency: "USD",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      category,
      tax,
      payment: `Visa ····${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      location,
      confidence: Math.round((Math.random() * 8 + 92) * 10) / 10,
      fileName,
      items: [
        { name: "Item 01", price: Math.round(Math.random() * 50 * 100) / 100 },
        { name: "Item 02", price: Math.round(Math.random() * 30 * 100) / 100 },
        { name: "Item 03", price: Math.round(Math.random() * 40 * 100) / 100 },
        { name: `Other items ×${Math.floor(Math.random() * 8 + 2)}`, price: Math.round((amount - 15) * 100) / 100 },
      ],
    };
  };

  const handleFiles = (fileList) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    
    if (newFiles.length > 0) {
      const filesWithPreview = newFiles.map(f => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              file: f,
              preview: e.target.result,
              id: Math.random(),
            });
          };
          reader.readAsDataURL(f);
        });
      });
      
      Promise.all(filesWithPreview).then(newFilesWithPreviews => {
        setFiles(prev => [...prev, ...newFilesWithPreviews]);
      });
    }
  };

  const processUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 2400));
    
    const receipts = files.map((f, idx) => generateMockReceipt(f.file.name, idx));
    localStorage.setItem("processedReceipts", JSON.stringify(receipts));
    
    setUploading(false);
    setFiles([]);
    router.push("/result");
  };

  const openAddUser = () => {
    setAddUserOpen(true);
    setAddUserError("");
    setAddUserSuccess("");
  };

  const closeAddUser = () => {
    if (addUserSaving) return;
    setAddUserOpen(false);
    setAddUserForm({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });
    setAddUserError("");
    setAddUserSuccess("");
  };

  const updateAddUserField = (field, value) => {
    setAddUserForm((current) => ({ ...current, [field]: value }));
    setAddUserError("");
    setAddUserSuccess("");
  };

  const submitAddUser = async (event) => {
    event.preventDefault();
    setAddUserSaving(true);
    setAddUserError("");
    setAddUserSuccess("");

    try {
      await api.post("/auth/register/", addUserForm);
      setAddUserSuccess(`User ${addUserForm.username} created.`);
      setAddUserForm({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      });
    } catch (error) {
      setAddUserError(error.message || "Could not create user.");
    } finally {
      setAddUserSaving(false);
    }
  };

  const v = (n) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.45s ease ${n * 70}ms, transform 0.45s cubic-bezier(.22,.68,0,1.2) ${n * 70}ms`,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, width: "100%" }}>

      {/* ── Quick action row (like Zoho top) ── */}
      <div style={{ ...v(0), display: "flex", gap: 14 }}>
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          style={{
            flex: 1,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "20px 12px",
            border: dragging || files.length > 0 ? "1.5px solid var(--brand)" : "1.5px solid var(--brand-border)",
            borderRadius: 12, cursor: "pointer",
            background: dragging || files.length > 0 ? "var(--brand-soft)" : "var(--brand-soft)",
            transition: "all 0.18s",
          }}
        >
          <div style={{
            fontSize: 22,
            color: "var(--brand)",
            lineHeight: 1,
          }}>📎</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand)" }}>
              {files.length > 0 ? `${files.length} Receipt${files.length > 1 ? 's' : ''}` : 'Drag Receipts'}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
              {files.length > 0 ? (uploading ? 'Processing...' : '→ Click to upload') : 'or click to attach'}
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <button
            onClick={processUpload}
            disabled={uploading}
            style={{
              flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "20px 12px",
              border: "1.5px solid rgba(16, 185, 129, 0.3)",
              borderRadius: 12, cursor: uploading ? "default" : "pointer",
              background: "rgba(16, 185, 129, 0.1)",
              transition: "all 0.18s",
              opacity: uploading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.6)"; e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)"; e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)"; }}
          >
            <div style={{
              fontSize: 22,
              color: "#10b981",
              lineHeight: 1,
            }}>✓</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>
                {uploading ? 'Processing' : 'Upload Now'}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                {uploading ? 'Converting data...' : 'Process & View'}
              </div>
            </div>
          </button>
        )}

        {files.length === 0 && (
          <>
            <QuickAction icon="💰" label="New Expense" />
            <QuickAction icon="📋" label="New Report" />
            <QuickAction icon="👤" label="Add User" onClick={openAddUser} />
          </>
        )}
      </div>

      {/* ── Reports summary (like Zoho middle panel) ── */}
      <div style={{ ...v(1), display: "grid", gridTemplateColumns: "1fr auto", gap: 16 }}>
        {/* Left summary */}
        <Card>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 18, fontFamily: "var(--font-display)" }}>
              Reports Summary
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {[
                { label: "UNSUBMITTED", value: "$57.05",     sub: "1 Report",  color: "var(--text)" },
                { label: "SUBMITTED",   value: "$1,463.66",  sub: "4 Reports", color: "var(--blue)" },
                { label: "AWAITING REIMBURSEMENT", value: "$1,451.23", sub: "4 Reports", color: "var(--green)" },
              ].map((item, i) => (
                <div key={item.label} style={{
                  flex: 1, padding: "0 24px",
                  borderLeft: i > 0 ? "1px solid var(--border2)" : "none",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text3)", marginBottom: 8, textTransform: "uppercase" }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: item.color, marginBottom: 4 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--blue)", cursor: "pointer", fontWeight: 500 }}>
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right — unported counts */}
        <Card>
          <div style={{ padding: "20px 28px", display: "flex", gap: 32, alignItems: "center", height: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "var(--blue)", lineHeight: 1 }}>3</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Unreported<br/>Expenses</div>
            </div>
            <div style={{ width: 1, height: 50, background: "var(--border2)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>7</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>From<br/>Cards</div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── KPI Cards ── */}
      <div style={v(2)}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
        }}>
          {STATS.map((s, i) => (
            <Card key={s.id} style={{
              ...v(i + 2),
              transition: `opacity 0.45s ease ${i * 80}ms, transform 0.45s cubic-bezier(.22,.68,0,1.2) ${i * 80}ms, box-shadow 0.2s`,
            }}>
              <div className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div className="stat-icon-wrap" style={{ background: s.bgColor }}>
                    <span style={{ fontSize: 17 }}>{s.icon}</span>
                  </div>
                  <Sparkline data={s.sparkline} color={s.color} />
                </div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-delta" style={{
                  background: s.trend === "up" ? "var(--green-soft)" : "var(--red-soft)",
                  color: s.trend === "up" ? "var(--green)" : "var(--red)",
                  border: `1px solid ${s.trend === "up" ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}>
                  {s.trend === "up" ? "↑" : "↓"} {s.delta} vs last month
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Middle row: Trend + Categories ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, ...v(3) }}>

        {/* Monthly trend */}
        <Card>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 2 }}>
                  Spending Trend
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Oct 2024 – Apr 2025</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--brand)" }}>
                  $12,438
                </div>
                <div style={{ fontSize: 10, color: "var(--green)", fontFamily: "var(--font-mono)", marginTop: 2 }}>↑ 15.2% MoM</div>
              </div>
            </div>
            <TrendBars data={MONTHLY_TREND} />
          </div>
        </Card>

        {/* Category breakdown */}
        <Card>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 2 }}>
                  Category Breakdown
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>This month</div>
              </div>
              <button className="btn-ghost" style={{ fontSize: 11, padding: "4px 11px" }}>Export</button>
            </div>
            <div className="chart-bar-wrap">
              {CATEGORY_BREAKDOWN.map((c, i) => (
                <CategoryBar key={c.name} {...c} delay={i * 80} />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Recent Reports (Zoho style) ── */}
      <Card style={v(4)}>
        <div style={{ padding: "18px 22px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Recent Reports
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "Processed", "Pending"].map((f, i) => (
                <button key={f} className="btn-ghost" style={{
                  fontSize: 11, padding: "4px 11px",
                  ...(i === 0 ? { background: "var(--brand-soft)", borderColor: "var(--brand-border)", color: "var(--brand)" } : {}),
                }}>
                  {f}
                </button>
              ))}
              <Link href="/history">
                <button className="btn-primary" style={{ fontSize: 11, padding: "5px 14px" }}>
                  View all
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent report rows like Zoho */}
        <div>
          {[
            { name: "Marketing Expense Report", amount: "$57.05",   status: "DRAFT",    date: null,               statusColor: "#6b7280" },
            { name: "Trip to Mumbai",            amount: "$88.33",   status: "APPROVED", date: "March 20, 2019",   statusColor: "#16a34a" },
            { name: "Sales conference",          amount: "$35.00",   status: "APPROVED", date: "January 12, 2019", statusColor: "#16a34a" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              padding: "14px 22px",
              borderTop: "1px solid var(--border)",
              transition: "background 0.12s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Report name */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--blue)", cursor: "pointer" }}>
                  {r.name}
                </span>
              </div>

              {/* Amount + status */}
              <div style={{ minWidth: 120 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{r.amount}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: r.statusColor, marginTop: 1 }}>{r.status}</div>
              </div>

              {/* Date */}
              <div style={{ minWidth: 140, fontSize: 12, color: "var(--text3)" }}>
                {r.date ? <>Submitted on<br/>{r.date}</> : null}
              </div>

              {/* Chat icon */}
              <div style={{ marginRight: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "var(--surface2)", border: "1px solid var(--border2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--brand)",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
              </div>

              {/* View report */}
              <button style={{
                padding: "6px 14px", borderRadius: 6, border: "none",
                background: "var(--brand)", color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--brand2)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--brand)"}
              >
                View Report
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 22px",
          borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, color: "var(--brand)",
            fontFamily: "var(--font-body)", padding: 0,
          }}>
            Show all reports
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {["←", "1", "2", "3", "→"].map((p, i) => (
              <button key={i} className="btn-ghost" style={{
                width: 28, height: 28, padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12,
                ...(p === "1" ? { background: "var(--brand-soft)", borderColor: "var(--brand-border)", color: "var(--brand)" } : {}),
              }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Bottom row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, ...v(5) }}>

        {/* Quick upload CTA */}
        <Card style={{
          background: "linear-gradient(135deg, #fff5f3 0%, #fff 100%)",
          borderColor: "var(--brand-border)",
        }}>
          <div style={{ padding: "24px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "var(--brand-soft)",
              border: "1px solid var(--brand-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>🧾</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 5, color: "var(--text)" }}>
                Upload New Receipt
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                Drag and drop a receipt image to instantly extract data using AI.
              </div>
            </div>
            <Link href="/upload">
              <button className="btn-primary" style={{ alignSelf: "flex-start" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Receipt
              </button>
            </Link>
          </div>
        </Card>

        {/* Month summary */}
        <Card>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: 16 }}>
              Month Summary
            </div>
            {[
              { label: "Total Spent",        value: "$12,438", color: "var(--brand)"  },
              { label: "Receipts Processed", value: "284",     color: "var(--green)"  },
              { label: "Avg per Day",        value: "$414.60", color: "var(--amber)"  },
              { label: "Largest Expense",    value: "$486.00", color: "var(--red)"    },
              { label: "Categories Used",    value: "12",      color: "var(--blue)"   },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0",
                borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>{item.label}</span>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: item.color,
                }}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {addUserOpen && (
        <div
          onClick={closeAddUser}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15,23,42,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <form
            onSubmit={submitAddUser}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(440px, 100%)",
              borderRadius: 12,
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.22)",
              padding: 22,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--text)",
                }}>
                  Add User
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text3)" }}>
                  Create a login for a new workspace member.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddUser}
                disabled={addUserSaving}
                aria-label="Close add user"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--border2)",
                  background: "var(--surface2)",
                  color: "var(--text2)",
                  cursor: addUserSaving ? "not-allowed" : "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {[
              { key: "username", label: "Username", type: "text", autoComplete: "username" },
              { key: "email", label: "Email", type: "email", autoComplete: "email" },
              { key: "password", label: "Password", type: "password", autoComplete: "new-password" },
              { key: "confirm_password", label: "Confirm Password", type: "password", autoComplete: "new-password" },
            ].map((field) => (
              <label key={field.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {field.label}
                </span>
                <input
                  type={field.type}
                  value={addUserForm[field.key]}
                  autoComplete={field.autoComplete}
                  minLength={field.type === "password" ? 6 : undefined}
                  required
                  disabled={addUserSaving}
                  onChange={(event) => updateAddUserField(field.key, event.target.value)}
                  style={{
                    height: 40,
                    borderRadius: 8,
                    border: "1px solid var(--border2)",
                    background: "var(--surface2)",
                    color: "var(--text)",
                    padding: "0 12px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </label>
            ))}

            {addUserError && (
              <div style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "#f43f5e",
                fontSize: 12,
              }}>
                {addUserError}
              </div>
            )}

            {addUserSuccess && (
              <div style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#10b981",
                fontSize: 12,
              }}>
                {addUserSuccess}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={closeAddUser}
                disabled={addUserSaving}
                style={{ opacity: addUserSaving ? 0.6 : 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={addUserSaving}
                style={{ opacity: addUserSaving ? 0.6 : 1 }}
              >
                {addUserSaving ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
