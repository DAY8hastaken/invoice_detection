"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Card from "../components/Card";
import { api } from "../lib/api";

const getInitialSearch = () => {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("search") || "";
};

/* ── Status Badge ── */
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

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <tr>
      {[60, 160, 90, 80, 90, 85, 30].map((w, i) => (
        <td key={i}>
          <div style={{
            height: 14, width: w, borderRadius: 6,
            background: "var(--surface2)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Empty State ── */
function EmptyState({ search, statusFilter }) {
  const hasFilter = search || statusFilter;
  return (
    <div style={{
      padding: "60px 24px", textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
    }}>
      <div style={{ fontSize: 44, opacity: 0.6 }}>{hasFilter ? "🔍" : "🧾"}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
        {hasFilter ? "No Receipts Found" : "No Receipts Yet"}
      </div>
      <div style={{ fontSize: 13, color: "var(--text3)", maxWidth: 360, lineHeight: 1.6 }}>
        {hasFilter
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "Upload your first receipt from the dashboard to start tracking your expenses."
        }
      </div>
    </div>
  );
}

/* ── Sort indicator ── */
function SortIndicator({ field, currentOrdering }) {
  const isActive = currentOrdering === field || currentOrdering === `-${field}`;
  const isDesc = currentOrdering === `-${field}`;
  return (
    <span style={{
      marginLeft: 4, display: "inline-flex", flexDirection: "column",
      fontSize: 8, lineHeight: 1, opacity: isActive ? 1 : 0.3,
      color: isActive ? "var(--brand)" : "var(--text3)",
      transition: "opacity 0.15s",
    }}>
      <span style={{ opacity: isActive && !isDesc ? 1 : 0.4 }}>▲</span>
      <span style={{ opacity: isActive && isDesc ? 1 : 0.4 }}>▼</span>
    </span>
  );
}

/* ── Main History Page ── */
export default function HistoryPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Filter state
  const [search, setSearch] = useState(getInitialSearch);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [ordering, setOrdering] = useState("-date");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const pageSize = 10;

  // Debounce ref
  const searchTimer = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  useEffect(() => {
    const handleNavbarSearch = (event) => {
      const query = event.detail || "";
      setSearch(query);
      setDebouncedSearch(query);
      setPage(1);
    };

    window.addEventListener("receipt-navbar-search", handleNavbarSearch);
    return () => window.removeEventListener("receipt-navbar-search", handleNavbarSearch);
  }, []);

  // Fetch categories for dropdown
  useEffect(() => {
    api.get("/categories/")
      .then(data => {
        // Handle paginated or array response
        const cats = Array.isArray(data) ? data : (data.results || []);
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  // Fetch receipts whenever filters change
  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      if (ordering) params.set("ordering", ordering);
      params.set("page", page.toString());

      const data = await api.get(`/receipts/?${params.toString()}`);
      setReceipts(data.results || []);
      setTotalCount(data.count || 0);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (err) {
      setError(err.message);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, categoryFilter, ordering, page]);

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      fetchReceipts();
    }, 0);

    return () => window.clearTimeout(fetchTimer);
  }, [fetchReceipts]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Build page numbers array
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [];
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleSort = (field) => {
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else if (ordering === `-${field}`) {
      setOrdering(field);
    } else {
      setOrdering(`-${field}`);
    }
    setPage(1);
  };

  const statusFilters = [
    { key: "", label: "All" },
    { key: "processed", label: "Processed" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200 }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)",
            color: "var(--text)", margin: 0,
          }}>Receipt History</h1>
          <p style={{ fontSize: 13, color: "var(--text3)", margin: "4px 0 0" }}>
            {totalCount > 0 ? `${totalCount} receipt${totalCount !== 1 ? "s" : ""} found` : "Browse and search your receipts"}
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

        {/* Search */}
        <div className="search-bar" style={{ flex: 1, maxWidth: 340, minWidth: 200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="receipt-search"
            placeholder="Search merchant, category, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text3)", padding: "2px 4px", fontSize: 14,
                lineHeight: 1, display: "flex", alignItems: "center",
              }}
              aria-label="Clear search"
            >×</button>
          )}
        </div>

        {/* Status Filter Buttons */}
        {statusFilters.map((f) => (
          <button
            key={f.key}
            id={`filter-${f.key || "all"}`}
            className="btn-ghost"
            onClick={() => {
              setStatusFilter(f.key);
              setPage(1);
            }}
            style={{
              fontSize: 12,
              ...(statusFilter === f.key
                ? {
                    background: "rgba(99,102,241,0.1)",
                    borderColor: "rgba(99,102,241,0.25)",
                    color: "var(--indigo2)",
                  }
                : {}),
            }}
          >{f.label}</button>
        ))}

        {/* Category Dropdown */}
        {categories.length > 0 && (
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 8,
              border: "1px solid var(--border2)", background: "var(--surface)",
              color: "var(--text)", cursor: "pointer",
              fontFamily: "var(--font-body)", outline: "none",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              paddingRight: 28,
            }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: 10,
          background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)",
          color: "#f43f5e", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>⚠️</span> {error}
          <button
            onClick={fetchReceipts}
            style={{
              marginLeft: "auto", background: "rgba(244,63,94,0.15)",
              border: "1px solid rgba(244,63,94,0.3)", borderRadius: 6,
              padding: "4px 12px", cursor: "pointer", color: "#f43f5e",
              fontSize: 12, fontWeight: 600,
            }}
          >Retry</button>
        </div>
      )}

      {/* ── Table ── */}
      <Card>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th
                onClick={() => handleSort("merchant")}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Merchant <SortIndicator field="merchant" currentOrdering={ordering} />
              </th>
              <th
                onClick={() => handleSort("date")}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Date <SortIndicator field="date" currentOrdering={ordering} />
              </th>
              <th>Category</th>
              <th
                onClick={() => handleSort("amount")}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Amount <SortIndicator field="amount" currentOrdering={ordering} />
              </th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : receipts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 0 }}>
                  <EmptyState search={debouncedSearch} statusFilter={statusFilter} />
                </td>
              </tr>
            ) : (
              receipts.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      color: "var(--text3)",
                    }}>#{r.id}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="merchant-icon">{r.emoji || "📁"}</div>
                      <span style={{ fontWeight: 500 }}>{r.merchant}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 12,
                      color: "var(--text2)",
                    }}>
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 9px",
                      borderRadius: 6, background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border)", color: "var(--text2)",
                    }}>
                      {r.category || "Uncategorized"}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontWeight: 700,
                    }}>
                      {r.currency === "USD" ? "$" : r.currency}{parseFloat(r.amount).toFixed(2)}
                    </span>
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <button style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text3)", padding: 4,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ── Pagination Footer ── */}
        {!loading && totalCount > 0 && (
          <div style={{
            padding: "14px 24px", borderTop: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontSize: 11, color: "var(--text3)",
              fontFamily: "var(--font-mono)",
            }}>
              Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)} of {totalCount} results
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {/* Prev */}
              <button
                className="btn-ghost"
                disabled={!prevPage}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{
                  minWidth: 28, height: 28, padding: "0 6px", fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: prevPage ? 1 : 0.4, cursor: prevPage ? "pointer" : "not-allowed",
                }}
              >←</button>

              {/* Page numbers */}
              {getPageNumbers().map((p, i) => (
                <button
                  key={`${p}-${i}`}
                  className="btn-ghost"
                  disabled={p === "..."}
                  onClick={() => typeof p === "number" && setPage(p)}
                  style={{
                    minWidth: 28, height: 28, padding: "0 6px", fontSize: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: p === "..." ? "default" : "pointer",
                    ...(p === page
                      ? {
                          background: "rgba(99,102,241,0.12)",
                          borderColor: "rgba(99,102,241,0.25)",
                          color: "var(--indigo2)",
                        }
                      : {}),
                  }}
                >{p}</button>
              ))}

              {/* Next */}
              <button
                className="btn-ghost"
                disabled={!nextPage}
                onClick={() => setPage(p => p + 1)}
                style={{
                  minWidth: 28, height: 28, padding: "0 6px", fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: nextPage ? 1 : 0.4, cursor: nextPage ? "pointer" : "not-allowed",
                }}
              >→</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
