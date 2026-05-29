"use client";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { CATEGORY_BREAKDOWN, MONTHLY_TREND } from "../lib/mockData";

function AnimatedBar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 400 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div className="chart-bar-track" style={{ height: 9 }}>
      <div className="chart-bar-fill" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}

export default function ReportsPage() {
  const max = Math.max(...MONTHLY_TREND.map(d => d.val));
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>

      {/* Header row */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total This Month", value: "$12,438", color: "var(--indigo2)", delta: "+15.2%" },
          { label: "Saved via AI",     value: "$640",    color: "var(--emerald)", delta: "+8 hrs" },
          { label: "Receipts",         value: "284",     color: "var(--amber)",   delta: "+24"   },
        ].map((s) => (
          <Card key={s.label} style={{ flex: 1, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--emerald)", marginTop: 6, fontFamily: "var(--font-mono)" }}>↑ {s.delta} vs last month</div>
          </Card>
        ))}
      </div>

      {/* Monthly chart */}
      <Card>
        <div style={{ padding: "22px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 20 }}>Monthly Spending</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
            {MONTHLY_TREND.map((d, i) => {
              const h = animated ? (d.val / max) * 120 : 0;
              const isLast = i === MONTHLY_TREND.length - 1;
              return (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: "100%", height: h, minHeight: 2,
                    background: isLast ? "linear-gradient(180deg,#818cf8,#6366f1)" : "rgba(99,102,241,0.18)",
                    borderRadius: "6px 6px 0 0",
                    transition: `height 1s cubic-bezier(.22,.68,0,1.2) ${i * 80}ms`,
                    position: "relative",
                  }}>
                    {isLast && (
                      <div style={{
                        position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)",
                        background: "var(--indigo)", borderRadius: 6,
                        padding: "2px 7px", fontSize: 10, fontFamily: "var(--font-mono)",
                        fontWeight: 700, color: "#fff", whiteSpace: "nowrap",
                      }}>
                        ${(d.val/1000).toFixed(1)}k
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: isLast ? "var(--indigo2)" : "var(--text3)", fontFamily: "var(--font-mono)", fontWeight: isLast ? 700 : 400 }}>
                    {d.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Category breakdown + top merchants */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 18 }}>Spending by Category</div>
            <div className="chart-bar-wrap">
              {CATEGORY_BREAKDOWN.map((c, i) => (
                <div key={c.name} className="chart-bar-row">
                  <div className="chart-bar-label">{c.name}</div>
                  <AnimatedBar pct={c.pct} color={c.color} delay={i * 80} />
                  <div className="chart-bar-val">${(c.amount/1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 18 }}>Top Merchants</div>
            {[
              { emoji: "✈️",  name: "Delta Airlines", total: "$972",  count: 2  },
              { emoji: "🏨", name: "Marriott",        total: "$586",  count: 2  },
              { emoji: "☁️",  name: "AWS",             total: "$438",  count: 2  },
              { emoji: "🏢", name: "WeWork",           total: "$350",  count: 1  },
              { emoji: "🛒", name: "Whole Foods",      total: "$253",  count: 3  },
            ].map((m, i) => (
              <div key={m.name} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0",
                borderBottom: i < 4 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", width: 18, textAlign: "right", fontFamily: "var(--font-mono)" }}>
                  {i + 1}
                </div>
                <div className="merchant-icon" style={{ fontSize: 14 }}>{m.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{m.count} receipts</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{m.total}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
