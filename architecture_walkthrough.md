# FinSight — Full Architecture Walkthrough

## 1. Project Overview

**FinSight** is a frontend-only prototype for an AI-powered receipt/invoice scanner and expense management system. It's built with **Next.js 16 (App Router)** and uses **mock data** — no real backend or OCR exists yet.

---

## 2. File Structure

```
invoice_detection/
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── layout.js              ← Root layout (html + body + globals.css)
│   │       ├── page.js                ← "/" → auto-redirects to /dashboard
│   │       ├── globals.css            ← Design system (315 lines of CSS tokens + components)
│   │       │
│   │       ├── components/
│   │       │   ├── SharedLayout.jsx   ← Wraps Sidebar + Navbar + {children}
│   │       │   ├── Sidebar.jsx        ← Dark sidebar navigation (fixed left)
│   │       │   ├── Navbar.jsx         ← Top navbar (search, notifications, user)
│   │       │   ├── Card.jsx           ← Reusable card wrapper
│   │       │   └── Button.jsx         ← Button component
│   │       │
│   │       ├── lib/
│   │       │   └── mockData.js        ← All fake data (receipts, stats, categories, nav)
│   │       │
│   │       ├── dashboard/
│   │       │   ├── layout.js          ← SharedLayout wrapper
│   │       │   └── page.js            ← Main dashboard (624 lines)
│   │       │
│   │       ├── upload/
│   │       │   ├── layout.js          ← SharedLayout wrapper
│   │       │   └── page.js            ← Receipt upload page (563 lines)
│   │       │
│   │       ├── result/
│   │       │   └── page.js            ← OCR result display (448 lines, standalone layout)
│   │       │
│   │       ├── history/
│   │       │   ├── layout.js          ← SharedLayout wrapper
│   │       │   └── page.js            ← Receipt history table
│   │       │
│   │       ├── reports/
│   │       │   ├── layout.js          ← SharedLayout wrapper
│   │       │   └── page.js            ← Reports page
│   │       │
│   │       ├── settings/
│   │       │   ├── layout.js          ← SharedLayout wrapper
│   │       │   └── page.js            ← Settings page
│   │       │
│   │       ├── profile/
│   │       │   ├── layout.js          ← SharedLayout wrapper
│   │       │   └── page.js            ← Profile page
│   │       │
│   │       └── help/
│   │           ├── layout.js          ← SharedLayout wrapper
│   │           └── page.js            ← Help & support page
│   │
│   ├── package.json                   ← Next.js 16, React 19, Tailwind v4
│   ├── next.config.mjs
│   ├── postcss.config.mjs
│   ├── tailwind.config.js             ← Unused (v3-style, project uses v4)
│   └── jsconfig.json                  ← Path alias: @/* → ./src/*
│
└── frontend_backup/                   ← Empty
```

---

## 3. Component Hierarchy

```mermaid
graph TD
    A["RootLayout<br/>(layout.js)"] --> B["globals.css<br/>Design Tokens"]
    A --> C{"Route?"}

    C -->|"/"| D["RootPage<br/>↳ redirect → /dashboard"]

    C -->|"/dashboard"| E["SharedLayout"]
    C -->|"/upload"| F["SharedLayout"]
    C -->|"/history"| G["SharedLayout"]
    C -->|"/reports"| H["SharedLayout"]
    C -->|"/settings"| I["SharedLayout"]
    C -->|"/profile"| J["SharedLayout"]
    C -->|"/help"| K["SharedLayout"]

    C -->|"/result"| L["ResultPage<br/>(standalone, own navbar)"]

    E --> E1["Sidebar"] & E2["Navbar"] & E3["DashboardPage"]
    F --> F1["Sidebar"] & F2["Navbar"] & F3["UploadPage"]
    G --> G1["Sidebar"] & G2["Navbar"] & G3["HistoryPage"]

    E3 --> E3a["Sparkline"] & E3b["CategoryBar"] & E3c["TrendBars"] & E3d["StatusBadge"] & E3e["QuickAction"] & E3f["Card"]
    F3 --> F3a["Card"] & F3b["File Preview Grid"]
    G3 --> G3a["Card"] & G3b["Data Table"] & G3c["StatusBadge"]
    L --> L1["ReceiptCard"] & L2["DataRow"] & L3["ConfidenceBar"]

    style A fill:#7c3aed,color:#fff
    style E fill:#2563eb,color:#fff
    style F fill:#2563eb,color:#fff
    style G fill:#2563eb,color:#fff
    style L fill:#dc2626,color:#fff
```

> [!NOTE]
> The `/result` page does **NOT** use `SharedLayout` — it has its own standalone navbar. All other pages share the Sidebar + Navbar layout.

---

## 4. Routing Architecture

```mermaid
flowchart LR
    subgraph "Next.js App Router"
        ROOT["/ (page.js)"]
        DASH["/dashboard"]
        UP["/upload"]
        RES["/result"]
        HIST["/history"]
        REP["/reports"]
        SET["/settings"]
        PROF["/profile"]
        HELP["/help"]
    end

    ROOT -->|"useEffect redirect"| DASH

    subgraph "Layout Wrappers"
        SL["SharedLayout<br/>Sidebar + Navbar"]
    end

    SL --- DASH & UP & HIST & REP & SET & PROF & HELP
    RES -.- STANDALONE["Standalone Layout"]

    style ROOT fill:#f59e0b,color:#000
    style RES fill:#dc2626,color:#fff
    style SL fill:#2563eb,color:#fff
```

---

## 5. Data Flow

```mermaid
flowchart TD
    subgraph "Data Sources (All Mock)"
        MD["mockData.js<br/>─────────<br/>RECEIPTS (8 items)<br/>STATS (4 KPIs)<br/>CATEGORY_BREAKDOWN (6)<br/>MONTHLY_TREND (7)<br/>NAV_ITEMS (4)"]
        LS["localStorage<br/>──────────<br/>key: processedReceipts"]
        MG["generateMockReceipt()<br/>──────────<br/>Random merchant/amount/tax<br/>fake line items"]
    end

    subgraph "Pages That Consume Data"
        DASH["Dashboard Page"]
        HIST["History Page"]
        UP["Upload Page"]
        RES["Result Page"]
    end

    MD -->|"import"| DASH
    MD -->|"import"| HIST

    UP -->|"user drops images"| MG
    MG -->|"JSON.stringify → localStorage"| LS
    UP -->|"router.push('/result')"| RES
    LS -->|"JSON.parse on mount"| RES

    DASH -->|"also has inline upload"| MG

    style MD fill:#7c3aed,color:#fff
    style LS fill:#f59e0b,color:#000
    style MG fill:#dc2626,color:#fff
```

> [!IMPORTANT]
> There is **no real API call** anywhere. The "OCR processing" is a `setTimeout` of 2.4 seconds followed by `generateMockReceipt()` which creates random fake data.

---

## 6. User Journey — Upload Flow

```mermaid
sequenceDiagram
    actor User
    participant Upload as Upload Page
    participant Mock as generateMockReceipt()
    participant LS as localStorage
    participant Result as Result Page

    User->>Upload: Drag & drop receipt images
    Upload->>Upload: FileReader.readAsDataURL()<br/>Generate image previews
    Upload->>Upload: Display file grid with ✕ remove buttons

    User->>Upload: Click "Process N Receipts"
    Upload->>Upload: setLoading(true)<br/>Show spinner animation
    Upload->>Upload: await setTimeout(2400ms)

    loop For each uploaded file
        Upload->>Mock: generateMockReceipt(fileName, index)
        Mock-->>Upload: { merchant, amount, tax, items, confidence, ... }
    end

    Upload->>LS: localStorage.setItem("processedReceipts", JSON.stringify(receipts))
    Upload->>Result: router.push("/result")
    Result->>LS: localStorage.getItem("processedReceipts")
    Result->>Result: Render ReceiptCard for each receipt<br/>Show totals, confidence bars, line items
```

---

## 7. User Journey — Dashboard Quick Upload

```mermaid
sequenceDiagram
    actor User
    participant Dashboard as Dashboard Page
    participant Mock as generateMockReceipt()
    participant LS as localStorage
    participant Result as Result Page

    User->>Dashboard: Drag receipts onto "Drag Receipts" zone
    Dashboard->>Dashboard: FileReader previews
    Dashboard->>Dashboard: Show "Upload Now" button

    User->>Dashboard: Click "Upload Now"
    Dashboard->>Dashboard: setTimeout(2400ms) processing
    Dashboard->>Mock: generateMockReceipt() × N files
    Dashboard->>LS: Save to localStorage
    Dashboard->>Result: router.push("/result")
```

> [!TIP]
> The dashboard has its own inline upload zone that duplicates the upload page functionality. Both flows end at `/result`.

---

## 8. Design System (globals.css)

```mermaid
mindmap
  root["globals.css<br/>315 lines"]
    Tokens
      Colors["Brand: #7c3aed (purple)<br/>Brand2: #2563eb (blue)<br/>Accents: green/amber/red"]
      Sidebar["Dark bg: #1a1f2e<br/>Text: rgba(255,255,255,0.5)"]
      Fonts["Display: Syne<br/>Body: DM Sans<br/>Mono: DM Mono"]
      Shadows["sm / md / lg"]
    Layout
      layout-root["Flexbox root"]
      layout-sidebar["Fixed left, 240px"]
      layout-main["margin-left: 240px"]
      layout-navbar["Sticky top, 60px"]
    Components
      Cards["card, stat-card"]
      Badges["badge-success/pending/failed"]
      Tables["data-table"]
      Buttons["btn-primary, btn-ghost"]
      Search["search-bar"]
      Charts["chart-bar-wrap/fill"]
    Animations
      fade-up
      fade-in
      pulse-slow
      ring-fill
```

---

## 9. What Exists vs What's Missing

| Layer | Current State | What's Needed |
|-------|--------------|---------------|
| **Frontend UI** | ✅ Complete — 8 pages, polished design | Minor fixes (Tailwind v4 mismatch ✅ fixed) |
| **Routing** | ✅ All routes work | — |
| **State Management** | ⚠️ `useState` + `localStorage` only | Consider Zustand/Context for shared state |
| **Backend API** | ❌ None | FastAPI/Express server for OCR |
| **OCR/AI Engine** | ❌ None (mock only) | Tesseract, Google Vision API, or custom ML model |
| **Database** | ❌ None | PostgreSQL/MongoDB for receipts, users |
| **Authentication** | ❌ None (hardcoded "Jane Doe") | NextAuth.js or similar |
| **File Storage** | ❌ None (files stay in browser memory) | S3/Cloudinary for uploaded receipt images |
| **Search & Filters** | ❌ UI exists but non-functional | Backend query support |
| **Export (CSV/JSON)** | ❌ Buttons exist but do nothing | Implement client-side or server-side export |

---

## 10. Suggested Architecture for Full Implementation

```mermaid
flowchart TD
    subgraph "Frontend (Next.js)"
        UI["React Pages"]
        API_C["API Client<br/>(fetch/axios)"]
    end

    subgraph "Backend (FastAPI / Express)"
        AUTH["Auth Service<br/>(JWT/OAuth)"]
        OCR["OCR Service<br/>(Tesseract / Google Vision)"]
        CRUD["Receipt CRUD<br/>API"]
        EXPORT["Export Service<br/>(CSV/PDF)"]
    end

    subgraph "Storage"
        DB["PostgreSQL<br/>Users, Receipts, Reports"]
        S3["Object Storage<br/>(S3 / Cloudinary)<br/>Receipt Images"]
    end

    UI --> API_C
    API_C --> AUTH
    API_C --> OCR
    API_C --> CRUD
    API_C --> EXPORT

    OCR --> S3
    CRUD --> DB
    AUTH --> DB
    OCR --> DB

    style UI fill:#7c3aed,color:#fff
    style OCR fill:#dc2626,color:#fff
    style DB fill:#2563eb,color:#fff
    style S3 fill:#f59e0b,color:#000
```
