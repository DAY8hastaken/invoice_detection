// app/lib/mockData.js

export const RECEIPTS = [
  { id: "RCP-001", merchant: "Whole Foods",    emoji: "🛒", amount: 84.37,  date: "Apr 24, 2025", category: "Groceries",   status: "processed" },
  { id: "RCP-002", merchant: "Uber Eats",      emoji: "🍔", amount: 32.50,  date: "Apr 23, 2025", category: "Dining",      status: "processed" },
  { id: "RCP-003", merchant: "AWS",            emoji: "☁️",  amount: 219.00, date: "Apr 22, 2025", category: "Software",    status: "processed" },
  { id: "RCP-004", merchant: "Delta Airlines", emoji: "✈️",  amount: 486.00, date: "Apr 21, 2025", category: "Travel",      status: "pending"   },
  { id: "RCP-005", merchant: "Shell Gas",      emoji: "⛽",  amount: 67.80,  date: "Apr 20, 2025", category: "Transport",   status: "processed" },
  { id: "RCP-006", merchant: "Apple Store",    emoji: "🍎", amount: 129.99, date: "Apr 19, 2025", category: "Electronics", status: "failed"    },
  { id: "RCP-007", merchant: "WeWork",         emoji: "🏢", amount: 350.00, date: "Apr 18, 2025", category: "Office",      status: "processed" },
  { id: "RCP-008", merchant: "Marriott",       emoji: "🏨", amount: 293.00, date: "Apr 17, 2025", category: "Travel",      status: "pending"   },
];

export const STATS = [
  {
    id: "total",
    label: "Total Expenses",
    value: "$12,438",
    delta: "+8.2%",
    trend: "up",
    icon: "💰",
    color: "#6366f1",
    bgColor: "rgba(99,102,241,0.12)",
    sparkline: [40, 55, 48, 70, 60, 80, 75, 95],
  },
  {
    id: "receipts",
    label: "Receipts Processed",
    value: "284",
    delta: "+24",
    trend: "up",
    icon: "🧾",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.12)",
    sparkline: [20, 35, 28, 50, 42, 60, 58, 80],
  },
  {
    id: "categories",
    label: "Active Categories",
    value: "12",
    delta: "+3",
    trend: "up",
    icon: "📂",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.12)",
    sparkline: [6, 7, 8, 8, 9, 10, 11, 12],
  },
  {
    id: "avg",
    label: "Avg per Receipt",
    value: "$43.80",
    delta: "-2.1%",
    trend: "down",
    icon: "📊",
    color: "#38bdf8",
    bgColor: "rgba(56,189,248,0.12)",
    sparkline: [55, 50, 48, 52, 47, 45, 44, 43],
  },
];

export const CATEGORY_BREAKDOWN = [
  { name: "Travel",      amount: 4820, pct: 82, color: "#6366f1" },
  { name: "Software",    amount: 2190, pct: 60, color: "#10b981" },
  { name: "Dining",      amount: 1430, pct: 44, color: "#f59e0b" },
  { name: "Groceries",   amount: 980,  pct: 36, color: "#38bdf8" },
  { name: "Transport",   amount: 720,  pct: 28, color: "#ec4899" },
  { name: "Electronics", amount: 620,  pct: 22, color: "#a78bfa" },
];

export const MONTHLY_TREND = [
  { month: "Oct", val: 6200  },
  { month: "Nov", val: 8100  },
  { month: "Dec", val: 11400 },
  { month: "Jan", val: 7900  },
  { month: "Feb", val: 9300  },
  { month: "Mar", val: 10800 },
  { month: "Apr", val: 12438 },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",      href: "/dashboard", icon: "grid"     },
  { id: "upload",    label: "Upload Receipt", href: "/upload",    icon: "upload"   },
  { id: "history",   label: "History",        href: "/history",   icon: "clock"    },
  { id: "reports",   label: "Reports",        href: "/reports",   icon: "bar-chart"},
];