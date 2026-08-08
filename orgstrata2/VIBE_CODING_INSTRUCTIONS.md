# Vibe Coding Instruction Manual: Digital Twin Universal Workspace

> **System Blueprint & Task Execution Guide**  
> **Author & Lead Architect:** Mohammad Hijazi  
> **Target Audience:** AI Coding Assistants, Vibe Coders, and Engineering Teams  
> **Specification Version:** 2.3.0 (Cost Management & Payment SMS Intake for Enterprise Twin)

---

## 1. Executive Summary & Vibe Coding Philosophy

This document serves as the **authoritative technical instruction manual** for vibe-coding the **Digital Twin Universal Workspace**. The platform is a high-fidelity digital mirroring system that unifies personal life management ("Family of 4") and enterprise-scale operations ("Company of 200") into a single, real-time, interactive environment.

### Core Objectives
1. **Wireframe-Compliant UI Layout Architecture**: Implements the exact structural layout defined in the blueprint wireframe:
   - **Top Global Header Bar**: Logo (Left) and Global Settings modal trigger (Right).
   - **Workspace Navigation Bar**: Horizontal tab bar displaying active workspaces (`Workspace 1`, `Workspace 2`, `Workspace 3`) with a dedicated `+ Create New or Clone` action button.
   - **Left Sidebar Page Navigation**: Vertical page list representing pages inside the active workspace, with bottom controls for Page Search, Page Settings, and `+ Create Page`.
   - **Main Component Layout Canvas Area**: Flexible multi-column responsive grid container rendering components with layout settings, paired tabular data editors, and CSV/JSON data I/O.
2. **Local Vendor Assets (`vendor/css/` & `vendor/js/`)**: All third-party libraries (FontAwesome, Highcharts, FullCalendar, Leaflet, BPMN.js, DataTables, Three.js) are downloaded locally into the repository to guarantee 100% offline autonomy.
3. **FontAwesome Iconography**: Integrated FontAwesome icon classes (`<i class="fa-solid fa-...">`, `<i class="fa-brands fa-...">`) across the UI layout.
4. **Local-First & Sovereign Data Architecture**: Zero mandatory backend servers; 100% operational integrity offline via ServiceWorker (`sw.js`) & LocalStorage.
5. **Cost Management & Payment Intelligence**: The implemented solution includes enterprise cost tracking, SaaS and renewals management, and a payment SMS intake workflow that reads payment-related SMS messages and normalizes them into the cost management table.
6. **Pure Vanilla JavaScript (Zero NPM / No Node.js Dependencies)**: STRICT MANDATE—Must be coded using native ES6 JavaScript, HTML5, and standard CSS3. No `npm`, no `package.json`, no `npm install`, and zero build bundlers (No Webpack, Vite, Parcel, Babel, or Rollup). Runs natively by opening `index.html` directly in any browser.

---

## 2. Technical UI Layout & Modular Component Architecture

### 2.1 Visual Structural Blueprint (Wireframe Layout)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LOGO                                                                   SETTINGS (Global)│
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Workspace 1 (Active) ] [ Workspace 2 ] [ Workspace 3 ]  [ + Create New or Clone ]        │
├──────────────────────────┬──────────────────────────────────────────────────────────────┤
│  PAGES SIDEBAR           │  MAIN COMPONENT CANVAS AREA                                  │
│                          │                                                              │
│  ┌────────────────────┐  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │ 📄 Executive Overview│  │  │ Highcharts      │ │ FullCalendar    │ │ Geo Map         │  │
│  ├────────────────────┤  │  │ Component       │ │ Component       │ │ Component       │  │
│  │ 📄 BPMN Workflows   │  │  └─────────────────┘ └─────────────────┘ └─────────────────┘  │
│  ├────────────────────┤  │                                                              │
│  │ 📄 Risk & Security  │  │  ┌───────────────────────────────────┐ ┌─────────────────┐  │
│  ├────────────────────┤  │  │ Main Layout Component Area        │ │ Kanban Task     │  │
│  │ 📄 3D Floor Plans   │  │  │ (Custom Grid Span & Layout)       │ │ Component       │  │
│  └────────────────────┘  │  └───────────────────────────────────┘ └─────────────────┘  │
│                          │                                                              │
│  🔍 Search Pages         │  ┌───────────────────────┐ ┌─────────────────────────────┐  │
│  ⚙️ Page Settings        │  │ Data Table Component  │ │ 3D Layout Component         │  │
│  [ + Create Page ]       │  └───────────────────────┘ └─────────────────────────────┘  │
└──────────────────────────┴──────────────────────────────────────────────────────────────┘
```

### 2.2 Repository Directory & File Mapping
```
c:\ws\orgstrata2\
├── index.html                           # Main entry point (Portfolio Landing + Wireframe App)
├── VIBE_CODING_INSTRUCTIONS.md          # Technical blueprint manual
├── manifest.json                        # PWA Application Manifest
├── sw.js                                # Service Worker offline cache engine
├── css/
│   ├── main.css                         # Design system & dark glassmorphism variables
│   ├── portfolio.css                    # Hero section & portfolio layout
│   └── workspace.css                    # Wireframe header, workspace tabs & grid canvas
├── js/
│   ├── app.js                           # Application initializer
│   ├── state.js                         # LocalStorage partition & Workspace CRUD engine
│   ├── signalr-mock.js                  # SignalR simulated event ticker & tag intelligence
│   ├── hierarchy.js                     # Left sidebar page navigation & tree controller
│   ├── viewport-manager.js              # Canvas multi-column layout grid renderer
│   ├── component-studio.js              # Universal Component Settings & Data Studio Drawer
│   ├── portfolio.js                     # Landing page portfolio interaction logic
│   └── mock-data.js                     # Pre-seeded Personal & Enterprise Twin datasets
├── vendor/
│   ├── css/
│   │   ├── fontawesome.all.min.css       # FontAwesome Icon Library
│   │   ├── leaflet.css                  # Leaflet Map Stylesheet
│   │   ├── fullcalendar.min.css         # FullCalendar Stylesheet
│   │   ├── bpmn-js.css                  # BPMN.js Workflow Stylesheet
│   │   └── jquery.dataTables.min.css    # DataTables Data Grid Stylesheet
│   └── js/
│       ├── jquery.min.js                # jQuery Core Engine
│       ├── leaflet.js                   # Leaflet Map Engine
│       ├── highcharts.js                # Highcharts Base Core Engine
│       ├── highcharts-more.js           # Highcharts Extended Chart Types
│       ├── exporting.js                 # Highcharts Data Export Engine
│       ├── fullcalendar.min.js          # FullCalendar Multi-Year Horizon Engine
│       ├── bpmn-navigated-viewer.js     # BPMN.js Workflow Viewer & Modeler
│       ├── jquery.dataTables.min.js     # DataTables Structured Data Grid Engine
│       └── three.min.js                 # Three.js 3D Spatial Floor Layout Engine
└── components/
    ├── highcharts-component.js          # Highcharts Analytics Module
    ├── fullcalendar-component.js        # FullCalendar 5-Year Horizon Module
    ├── openmap-component.js             # Leaflet OpenStreetMap Geo-Spatial Module
    ├── bpmn-component.js                # BPMN.js Process Flow Modeling Module
    ├── jqtable-component.js             # jQuery DataTables Data Grid Module
    ├── spatial3d-component.js           # Blueprint3D / Three.js Spatial Layout Module
    ├── kanban-gantt-component.js        # Kanban & Gantt Task Management Module
    └── entity-tools-component.js        # Capabilities, Risk Matrix & Likert Maturity Assistant
```

### 2.3 Vendor Asset Linkage in `index.html`

```html
<!-- FontAwesome Iconography -->
<link rel="stylesheet" href="vendor/css/fontawesome.all.min.css">

<!-- Local Vendor Stylesheets -->
<link rel="stylesheet" href="vendor/css/leaflet.css">
<link rel="stylesheet" href="vendor/css/fullcalendar.min.css">
<link rel="stylesheet" href="vendor/css/bpmn-js.css">
<link rel="stylesheet" href="vendor/css/jquery.dataTables.min.css">

<!-- Application Stylesheets -->
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/portfolio.css">
<link rel="stylesheet" href="css/workspace.css">

...

<!-- Local Vendor JavaScript Engines -->
<script src="vendor/js/jquery.min.js"></script>
<script src="vendor/js/leaflet.js"></script>
<script src="vendor/js/highcharts.js"></script>
<script src="vendor/js/highcharts-more.js"></script>
<script src="vendor/js/exporting.js"></script>
<script src="vendor/js/fullcalendar.min.js"></script>
<script src="vendor/js/bpmn-navigated-viewer.js"></script>
<script src="vendor/js/jquery.dataTables.min.js"></script>
<script src="vendor/js/three.min.js"></script>

<!-- Application Component Scripts -->
<script src="components/highcharts-component.js"></script>
<script src="components/fullcalendar-component.js"></script>
<script src="components/openmap-component.js"></script>
<script src="components/bpmn-component.js"></script>
<script src="components/jqtable-component.js"></script>
<script src="components/spatial3d-component.js"></script>
<script src="components/kanban-gantt-component.js"></script>
<script src="components/entity-tools-component.js"></script>
```

---

## 3. Data Schemas & Intelligence Engine Specifications

### 3.1 Dynamic Workspace, Page & Component Schema
```typescript
interface GlobalState {
  schemaVersion: "2.3.0";
  activeWorkspaceId: string;
  globalSettings: {
    userName: string;
    userGUID: string;
    themeMode: "dark-glassmorphism";
    signalIntervalSeconds: number;
  };
  workspaces: WorkspaceConfig[];
}

interface WorkspaceConfig {
  id: string;
  name: string;
  type: "personal" | "enterprise" | "custom";
  description?: string;
  isCloned?: boolean;
  clonedFromId?: string;
  activePageId: string;
  pages: PageConfig[];
}

interface PageConfig {
  id: string;
  title: string;
  icon?: string;            // e.g. "fa-solid fa-chart-line"
  layoutType: "grid-flexible" | "dashboard" | "single-canvas";
  components: ComponentConfig[];
}

interface ComponentConfig {
  id: string;
  type: "highcharts" | "calendar" | "kanban" | "gantt" | "bpmn" | "map" | "3dspatial" | "jqtable" | "capabilities" | "risk" | "maturity" | "markdown";
  title: string;
  subtitle?: string;
  columnSpan: "full" | "half" | "two-thirds" | "third";
  domainTags?: string[];
  settings: ComponentSettings;
  data: ComponentDataset;
}
```

### 3.2 Cost Management & Payment SMS Intake Schema
```typescript
interface PaymentSmsRecord {
  id: string;
  source: "sms" | "manual" | "import";
  sender: string;
  body: string;
  receivedAt: string;        // ISO-8601 timestamp
  merchant: string;
  amount: number;
  currency: string;
  paymentType: "card" | "wallet" | "bank" | "cash" | "unknown";
  status: "matched" | "unmatched" | "review";
  matchedExpenseId?: string;
  notes?: string;
}

interface CostManagementRow {
  id: string;
  category: string;
  vendor: string;
  description: string;
  amount: number;
  currency: string;
  invoiceDate: string;
  paymentChannel: "sms" | "invoice" | "manual" | "bank";
  sourceReference?: string;
  status: "Paid" | "Pending" | "Review";
}
```

This is the implemented enterprise finance pattern: read all payment-related SMS messages, extract sender, amount, date, and merchant details, match the payment against the appropriate cost category, and append the normalized record to the cost management table for review and reconciliation.

---

## 4. Universal Component Studio Engine

Every component MUST implement the **Universal Component Studio Drawer** comprising:
1. **Settings Drawer Tab**: Layout span width controls, domain tag bindings, and theme customization.
2. **Paired Data Table Editor**: Interactive data grid allowing users to insert, edit, delete rows/columns directly linked to the visual component.
3. **Export Engine**: Export component dataset as `.csv`, `.json`, or image `.png`.
4. **Import Engine**: Upload or paste `.csv` / `.json` to automatically update component data.

---

## 5. Non-Functional Requirements (NFRs)

### NFR-1: Local Vendor Asset Sovereignty
- ALL JS and CSS libraries (FontAwesome, Highcharts, FullCalendar, Leaflet, BPMN.js, DataTables, Three.js) MUST be loaded from the local `vendor/` folder for 100% offline autonomy.

### NFR-2: Pure Vanilla JS & Zero NPM Mandate
- STRICT PROHIBITION: NO `package.json`, NO `npm install`, NO `node_modules`, and NO build tools (Webpack, Vite, Parcel, Babel, Rollup). Native ES6 JS, HTML5, CSS3.

### NFR-3: ServiceWorker Caching Integration
- `sw.js` MUST cache all local vendor assets in `vendor/css/` and `vendor/js/` to guarantee instant offline initialization.

---

## 6. Vibe Coding Implementation Tasks & Prompts

Use the following modular task breakdown when instructing AI vibe coders:

### Task 1: Vendor Assets & FontAwesome Linkage
> **Prompt**: "Ensure `vendor/css/` and `vendor/js/` contain all downloaded vendor libraries (FontAwesome, Leaflet, Highcharts, FullCalendar, BPMN.js, jQuery DataTables, Three.js). Link all local vendor files in `index.html` using FontAwesome icon tags (`<i class="fa-solid fa-...">`)."

### Task 2: Modular Components in `components/`
> **Prompt**: "Build individual vanilla JS component files inside `components/`: `highcharts-component.js`, `fullcalendar-component.js`, `openmap-component.js`, `bpmn-component.js`, `jqtable-component.js`, `spatial3d-component.js`, `kanban-gantt-component.js`, and `entity-tools-component.js`."

### Task 3: Workspace Manager & Clone Engine
> **Prompt**: "Write `js/state.js` handling LocalStorage partitioning, Workspace CRUD, Clone Workspace engine, Page CRUD, and Component CRUD."

### Task 4: Universal Component Data Studio
> **Prompt**: "Write `js/component-studio.js` in vanilla JS implementing the Component Settings drawer, Paired Data Table Editor, and CSV/JSON Import & Export engines for all components."

### Task 5: Payment SMS Intake & Cost Management Feed
> **Prompt**: "Implement a payment SMS ingestion workflow for the enterprise twin. Read all SMS messages related to payments and normalize each message into a payment record containing sender, merchant, amount, currency, date, payment type, and raw message text. Auto-match supported payment entries to the correct cost category or vendor and append them to the cost management table so finance users can review, reconcile, and approve the invoice or expense in one place."

### Task 6: Cost Management Table Reconciliation
> **Prompt**: "Create a finance-oriented table component in the enterprise workspace that tracks operational spend, SaaS renewals, and payment SMS reconciliations. Include columns for category, vendor, description, amount, currency, invoice date, payment channel, source reference, and status. Allow the user to flag unmatched SMS records for manual review and ensure the table remains editable from the component studio data grid."
