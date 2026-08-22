# Multi-Mode PWA Workspace - Feature Documentation (v4.0/v5.0)

## Overview

A zero-dependency progressive web application with dual-mode interface (Lite/Power) for managing daily routines, spatial floor plans, contact directories, location mapping, calendar events, cost planning, maturity radar visualization, real-time telemetry alerts, and personal competence development. Built entirely with vanilla HTML5, CSS3, and JavaScript.

**Version 4.0** introduces polymorphic data model architecture with cost tracking and event taxonomy. **Version 5.0** adds the UX Touchpoint Matrix mapping 4 Stages of Competence to digital touchpoints, transforming the application into a Personal Digital Twin.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Core Features](#core-features)
3. [Polymorphic Data Model v4.0/v5.0](#polymorphic-data-model-v40v50)
4. [Application Views](#application-views)
5. [Template Library & Form-to-JSON Engine](#template-library--form-to-json-engine)
6. [Event Telemetry & Status Badges](#event-telemetry--status-badges)
7. [PWA Packaging & Local Portability](#pwa-packaging--local-portability)
8. [Data Schema](#data-schema)
9. [File Structure](#file-structure)
10. [Third-Party Libraries](#third-party-libraries)
11. [Phase 7: UX Touchpoint Matrix - 4 Stages of Competence](#phase-7-ux-touchpoint-matrix---4-stages-of-competence)
12. [Future Enhancement Opportunities](#future-enhancement-opportunities)

---

## Architecture

### Design Patterns
- **Module Pattern**: All functionality encapsulated in named namespace objects (App, Storage, Templates, etc.)
- **Event-Driven Communication**: Custom DOM events (`telemetry-event`) for inter-module communication
- **Single Source of Truth**: LocalStorage-backed workspace data object
- **Component-Based Views**: Each view module renders its own HTML templates
- **Polymorphic Entity Connections**: v4.0/v5.0 introduces cross-entity relationships with cost rollup, multi-party associations, and spatial hierarchy
- **Competence Tracking**: v5.0 adds 4 Stages of Competence detector with right panel

### Technology Stack
| Component | Technology |
|-----------|-----------|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Map Engine | Leaflet.js 1.9.4 (CDN) |
| Calendar Engine | FullCalendar.js 6.1.10 (CDN) |
| Chart Engine | Chart.js (CDN) |
| Radar Visualization | Highcharts (CDN) |
| Data Storage | Browser LocalStorage |
| Service Worker | Cache API |
| PWA | Web App Manifest |

### Browser Requirements
- Modern browser with ES6+ support
- LocalStorage support
- Service Worker support
- Fetch API support

---

## Core Features

### 1. Dual-Mode Interface

#### Lite Mode (Default)
- Clean, minimal interface
- Light color scheme
- Simplified navigation
- Reduced visual effects for performance
- Ideal for casual users and low-end devices

#### Power Mode
- Dark enhanced theme
- Additional visual indicators
- Expanded data visualization
- Enhanced contrast ratios
- Ideal for power users and detailed analysis

**Mode Persistence**: User's mode preference is saved to `localStorage` and restored on page load.

### 2. Ten Application Views

| View | Description | Key Features |
|------|-------------|--------------|
| **Dashboard** | Central hub with overview cards | Quick navigation, statistics, action buttons |
| **Calendar** | FullCalendar event management | Multi-type events, drag-and-drop, filters, tech events |
| **Routines** | BPMN-style routine management | Step checklists, progress tracking, templates |
| **Floor Plans** | Spatial workspace management | Room cards, status tracking, tag system |
| **Contacts** | Org-chart contact directory | Parent-child relationships, skill tags, location associations |
| **Map** | Interactive location mapping | Leaflet.js, geocoding, pin management |
| **Cost Planning** | Financial management dashboard | Income, expenses, assets, liabilities, charts |
| **Maturity Radar** | Maturity level visualization | Financial, Health, Skills radar charts |
| **Alerts** | Telemetry event log | Severity filtering, tag-based alerts |
| **Right Panel** | Competence Detector (v5.0) | Domains, Paths, Enhance tabs |

### 3. Polymorphic Alert System with Multi-Party Associations (v4.0)
- Real-time telemetry events from mock SignalR stream
- Tag matching against routines, contacts, and rooms
- **Polymorphic alert propagation**: Alerts cascade through entity connections
  - Contact → Location associations → Buildings → Rooms
  - Routine → Location stops → Map pins → Buildings → Rooms
  - MapPin → Contacts, Routines, and Buildings
- **Multi-party trip assignments**: Multiple persons can be assigned to routines with roles (organizer, participant, observer)
- Visual feedback: pulsing badges on matching cards
- Severity levels: info, warning, critical
- 1-hour alert window with auto-dismissal

### 4. Cost Tracking on Every Entity (v4.0)
- Every entity (Contact, Location, Routine, Trip, Plan) supports cost tracking
- Cost Categories: Trip Cost, Routine Cost, Floor Cost, Room Cost, Contact Cost
- Contact Cost Breakdown: housing, food, transport, health, education, entertainment
- Financial Structure: currency, budget, actual, categories, income, assets, liabilities
- Cost aggregation: entity costs roll up to parent entities
- Financial reports: net worth, cash flow, budget vs actual

### 5. Data Portability
- Export workspace as downloadable JSON file
- Import workspace from JSON file upload
- Schema version validation (current: 5.0)
- Automatic migration for older versions
- User confirmation prompts for version mismatches

---

## Application Views

### 1. Dashboard View

The central hub providing an overview of all workspace data with quick navigation cards.

**Features**:
- Statistics cards for all views (routines, floor plans, contacts, map pins, buildings, events)
- Quick navigation buttons to each view
- Alert count display
- Cost planning summary
- Maturity radar summary
- Competence stage indicator (v5.0)

### 2. Calendar View (calendarView.js)

FullCalendar.js integration for comprehensive event management and scheduling.

**Features**:
- **Multi-view Calendar**: Month, Week, Day, List views
- **Event Type Filters**: Routines, Activities, Technology, Economic, Political, International, External
- **Drag-and-Drop**: Reschedule events by dragging
- **Event Creation**: Modal form for creating new events
- **Event Editing**: Edit existing event details
- **Event Deletion**: Remove events with confirmation
- **Color-Coded Events**: Different colors per event type
- **Attendee Management**: Multi-select attendees from contacts
- **Budget Tracking**: Associate costs with events
- **Recurring Events**: Daily, Weekly, Monthly, Yearly recurrence
- **External URLs**: Link to external event pages
- **Priority Levels**: Low, Medium, High, Critical
- **Technology Source Tracking**: Apple, Microsoft, IBM, NVIDIA, OpenAI, Tesla, Gartner

**Event Taxonomy (v4.0)**:
| Event Type | Description | Examples |
|------------|-------------|----------|
| Routine | Linked to user routines, recurring patterns | Daily morning routine, weekly review |
| External | Third-party events imported or manually added | Conferences, meetings |
| Activity | Personal activities with duration and location | Exercise, meditation |
| International | Global holidays, cultural celebrations | New Year, Eid |
| Economic | Market openings, financial reports, policy changes | Fed meetings, earnings |
| Political | Summits, elections, treaties, diplomatic meetings | G20, UN sessions |
| Technology | Product launches, conferences, software releases | WWDC, Build, GTC |

**Technology Event Sources**:
| Source | Examples |
|--------|----------|
| Apple | WWDC, iPhone launches, iPad events, Apple Watch announcements |
| Microsoft | Build, Surface events, Windows announcements, Azure updates |
| IBM | Think conference, quantum computing events, hybrid cloud announcements |
| NVIDIA | GTC conference, GPU launches, AI announcements |
| OpenAI | Model releases, research publications, partnership announcements |
| Tesla | Battery Day, AI Day, vehicle launches, energy product events |
| Gartner | Hype Cycle releases, IT conferences, market research publications |

**Event Form Fields**:
| Field | Type | Description |
|-------|------|-------------|
| Event Title | text | Required |
| Event Type | select | 7 categories |
| Technology Source | select | For technology events |
| Start Date/Time | datetime-local | Required |
| End Date/Time | datetime-local | Optional |
| Priority | select | Low/Medium/High/Critical |
| Description | textarea | Optional |
| External URL | url | Optional |
| Attendees | multi-select | From contacts |
| Budget | number | Optional |
| Recurring | select | None/Daily/Weekly/Monthly/Yearly |

### 3. Routines View (routineView.js)

BPMN-style routine management with polymorphic visualization.

**Features**:
- Routine cards with progress bars
- Step completion checkboxes
- Location stops display with building info
- Assigned persons display with roles (organizer, participant, observer)
- Add/Edit/Delete routine operations
- Template gallery for quick creation
- Category filtering
- Cost tracking per routine (v4.0)
- Streak tracking and consistency metrics (v5.0)

### 4. Floor Plans View (spatialView.js)

Building hierarchy and room card management with spatial nesting.

**Features**:
- Buildings view with hierarchical tree (Buildings → Floors → Rooms)
- Floor plans dropdown selector (legacy)
- Room cards with status indicators
- Room tag system
- Add/Edit/Delete room operations
- Equipment tracking per room
- Status categories: Good, Warning, Critical
- Contact assignment to rooms
- Building metadata with connected pins display
- Floor cost tracking: maintenance, utility, rental/lease (v4.0)
- Room cost tracking: equipment, setup, per-use costs (v4.0)

### 5. Contacts View

Org-chart and location associations display with multi-party support.

**Features**:
- Contact cards with name, role, tags, skills
- "Reports To" hierarchy display
- Location associations count display
- Edit/Delete actions
- Skill tag filtering
- **Location associations** (v4.0): Geographic (lat/lng), Building, Floor, Room levels
- **Cost tracking** (v4.0): Living cost, support cost, compensation with breakdown
- **Multi-party trip assignments** (v4.0): Many-to-many with routines

### 6. Map View (mapView.js)

Interactive map with Leaflet.js and polymorphic connections.

**Features**:
- Leaflet.js map initialization
- OpenStreetMap tile layer
- Text search with Nominatim geocoding
- Auto-categorization of locations
- Polymorphic popup content: connected contacts, routines, buildings
- Pin edit/delete via popup buttons
- Edit dialog with connection management
- Multi-select for contacts and routines
- Building selector
- Automatic map fitting to pins
- Spatial hierarchy support: Map Region → Building → Floor → Room (v4.0)

### 7. Cost Planning View (costView.js)

Financial planning dashboard with Chart.js visualizations.

**Features**:
- **Summary Cards**:
  - Total Income
  - Total Spending
  - Net Cash Flow (color-coded green/red)
  - Total Assets
  - Total Liabilities
  - Net Worth (color-coded green/red)

- **Charts**:
  - Asset Allocation (Pie Chart)
  - Liability Breakdown (Bar Chart)
  - Income vs Spending Trend (Line Chart - 6 months)
  - Spending by Category (Doughnut Chart)

- **Entity Cost Breakdown**:
  - Trips/Routines cost table
  - Buildings/Floors cost table
  - Contacts cost table

- **Financial Transactions Tables**:
  - Income records
  - Expense records
  - Asset records
  - Liability records

- **CRUD Operations**:
  - Add Income (source, amount, type, date)
  - Add Expense (category, amount, description)
  - Add Asset (name, value, type, purchase date)
  - Add Liability (name, balance, type, due date)
  - Export Financial Report (JSON)

**Cost Categories**:
| Category | Subcategories |
|----------|--------------|
| Income | Salary, Investment, Freelance, Other |
| Expense | Housing, Food, Transport, Health, Education, Entertainment |
| Assets | Real Estate, Vehicle, Investment, Cash, Other |
| Liabilities | Mortgage, Loan, Credit Card, Other |

### 8. Maturity Radar View (maturityView.js)

Maturity level visualization using Highcharts radar charts.

**Features**:
- **Maturity Level Overview Cards**:
  - Financial Maturity (score + level badge)
  - Health Maturity (score + level badge)
  - Skills Maturity (score + level badge)

- **Radar Charts** (Highcharts.js):
  - Financial Maturity Radar (7 dimensions)
  - Health Maturity Radar (7 dimensions)
  - Skills Maturity Radar (7 dimensions)
  - Comparison View (all three maturity types)

- **Dimension Scores**: Visual progress bars for each dimension
- **Maturity History Chart**: Line chart showing trend over time
- **Improvement Recommendations**: AI-generated suggestions based on lowest scores
- **Score Editing**: Modal form to manually adjust all scores
- **Export Report**: Download maturity report as JSON
- **Current vs Target Overlay** (v5.0): Gap visualization between current and target maturity

**Maturity Levels**:
| Level | Score Range | Name | Description |
|-------|-------------|------|-------------|
| 1 | 0-29 | Initial | Ad-hoc and chaotic processes |
| 2 | 30-49 | Managed | Reactive with basic project-level management |
| 3 | 50-69 | Defined | Proactive and well-defined processes |
| 4 | 70-89 | Quantitatively Managed | Measured and controlled |
| 5 | 90-100 | Optimizing | Continuous improvement culture |

**Financial Maturity Dimensions** (7):
- Budgeting Discipline, Savings Rate, Investment Diversification, Debt Management, Insurance Coverage, Retirement Planning, Cash Flow Stability

**Health Maturity Dimensions** (7):
- Physical Health, Mental Health, Nutrition Management, Exercise Routine, Sleep Quality, Preventive Care, Work-Life Balance

**Skills Maturity Dimensions** (7):
- Technical Skills, Leadership, Communication, Problem Solving, Teamwork, Innovation, Time Management

### 9. Alerts View

Telemetry event log with severity filtering.

**Features**:
- Alert list with severity icons (🔴 critical, 🟡 warning, 🔵 info)
- Timestamp and category display
- Tag badges for each alert
- Clear all alerts option
- Alert count badge in navigation

---

## Polymorphic Data Model v4.0/v5.0

### Overview

Version 4.0 introduces enhanced polymorphic entity connections with cost model and event taxonomy. Version 5.0 adds competence domains, development paths, and telemetry baselines for personal development tracking.

### Entity Connection Graph

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Contacts   │────▶│   Map Pins   │────▶│  Buildings  │
│             │     │              │     │             │
│ location    │     │ connected    │     │ floors      │
│ associations│     │ Contacts     │     │  └─ rooms   │
└─────────────┘     │ connected    │     └─────────────┘
                    │ Routines     │
┌─────────────┐     └──────────────┘     ┌─────────────┐
│  Routines   │◀───┐                       │   Alerts    │
│             │    │                       │             │
│ location    │────┘                       │ polymorphic │
│ stops       │                             │ propagation│
│             │     ┌──────────────┐       └─────────────┘
│ assigned    │────▶│    Contacts   │
│ persons     │     │               │
└─────────────┘     └──────────────┘

Cost Rollup: Room → Floor → Building → Workspace
Competence: Maturity Scores → Domains → Development Path
```

### Connection Types

#### 1. Contact → Location Associations (Many-to-Many, v4.0)
Contacts can be associated with multiple locations at multiple granularity levels.

| Field | Type | Description |
|-------|------|-------------|
| locationId | string | Reference to mapPin or building ID |
| locationType | enum | 'mapPin', 'building', 'floor', 'room' |
| associationType | enum | 'home', 'work', 'frequent', 'temporary' |
| assignedAt | timestamp | When association was created |
| coordinates | object | {lat, lng} for geographic level |

**Spatial Hierarchy**: Map Region → Building → Floor → Room
- Geographic Level: lat/lng coordinates on a map
- Building Level: structured building with unique identifier
- Floor Level: floors within a building (e.g., Floor 1, Floor 2)
- Room Level: rooms within floors (e.g., Room 101, Conference Room A)

#### 2. Routine → Location Stops (One-to-Many, v4.0)
Routines/trips consist of multiple geographic stops in ordered sequence.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique stop identifier |
| order | number | Stop sequence number |
| stopName | string | Display name for the stop |
| locationId | string | Reference to mapPin ID |
| locationType | enum | 'mapPin' or 'custom' |
| estimatedDuration | number | Expected duration in minutes |
| description | string | Stop notes |

#### 3. Routine → Assigned Persons (Many-to-Many, v4.0)
Routines can have multiple persons assigned with specific roles.

| Field | Type | Description |
|-------|------|-------------|
| contactId | string | Reference to contact ID |
| role | enum | 'organizer', 'participant', 'observer' |
| confirmed | boolean | Whether person has confirmed |

#### 4. Map Pin → Connected Entities (Many-to-Many, v4.0)
Map pins can reference multiple contacts, routines, and buildings.

| Field | Type | Description |
|-------|------|-------------|
| connectedContacts | array | Array of contact IDs |
| connectedRoutines | array | Array of routine IDs |
| connectedBuilding | string | Reference to building ID |

#### 5. Building → Floors → Rooms (Hierarchical, v4.0)
Buildings contain floors, which contain rooms with contact associations.

| Level | Field | Type | Description |
|-------|-------|------|-------------|
| Building | floors | array | Array of floor objects |
| Floor | number | string | Floor number/name |
| Floor | name | string | Floor display name |
| Floor | rooms | array | Array of room objects |
| Room | assignedContacts | array | Array of contact IDs |
| Room | type | string | Room type |
| Room | capacity | number | Maximum occupancy |
| Room | area | string | Room area |
| Room | equipment | array | Room equipment list |

#### 6. Cost Model (v4.0)
Every entity supports cost tracking with polymorphic financial structure.

**Cost Structure per Entity**:
```json
{
  "cost": {
    "currency": "USD",
    "budget": number,
    "actual": number,
    "categories": [
      {
        "name": "string",
        "amount": number,
        "date": "ISO timestamp",
        "description": "string"
      }
    ],
    "income": [
      {
        "source": "string",
        "amount": number,
        "date": "ISO timestamp",
        "type": "salary | investment | freelance | other"
      }
    ],
    "assets": [
      {
        "name": "string",
        "value": number,
        "type": "real_estate | vehicle | investment | cash | other",
        "purchaseDate": "ISO timestamp"
      }
    ],
    "liabilities": [
      {
        "name": "string",
        "balance": number,
        "type": "mortgage | loan | credit_card | other",
        "interestRate": number,
        "dueDate": "ISO timestamp"
      }
    ]
  }
}
```

**Cost Categories per Entity**:
| Entity | Cost Types |
|--------|-----------|
| Trip/Routine | Total budget, actual spending, currency, breakdown by category |
| Routine | Per-routine budget, execution cost, recurring expenses |
| Floor | Maintenance cost, utility cost, rental/lease cost |
| Room | Equipment cost, setup cost, per-use cost |
| Contact | Living cost, support cost, compensation |
| Contact Breakdown | Housing, food, transport, health, education, entertainment |

**Cost Aggregation**: Entity costs roll up to parent entities (room → floor → building)

### Competence Domains (v5.0)

**Competence Domain Structure**:
```json
{
  "domainId": "string",
  "domainName": "string",
  "stage": "sensing | diagnostics | orchestration | automated",
  "consciousLevel": number, // 0-100
  "consciousState": "unconsciousIncompetence | consciousIncompetence | consciousCompetence | unconsciousCompetence",
  "targetLevel": number,
  "currentScore": number,
  "gap": number,
  "dataGaps": ["string"],
  "recommendedActions": ["string"],
  "enhancementSuggestions": ["string"],
  "repetitionCount": number,
  "streakDays": number,
  "lastAssessed": "ISO timestamp",
  "telemetrySources": ["string"]
}
```

**Four Stages of Competence**:
| Stage | Goal | Current Coverage | Enhancement |
|-------|------|-----------------|-------------|
| Sensing | Surface unmonitored life metrics without active effort | Highcharts Baseline, Telemetry Signal Engine, Open Map | Passive data ingestion from device sensors |
| Diagnostics | Create cognitive friction highlighting reality vs goals | Maturity Assistant, Personal Risk Table, Capabilities Canvas | Current vs Target radar overlay with gap visualization |
| Orchestration | Structured execution workbench for habit building | BPMN.js Workflow, Kanban/Gantt, FullCalendar | Myelination Tracker, streak tracking, consistency heatmaps |
| Automated Twin | Frictionless automated baseline operation | SignalR Auto-Alerts, OrgChart Kinship Badges | Executive Dashboard, automated exception handling |

---

## Template Library & Form-to-JSON Engine

### templates.js

Pre-packaged JSON presets for rapid workspace initialization.

**Default Templates**:

#### Routines
- **Morning Routine** (Operations category)
  - 5 steps: Wake Up, Hygiene, Exercise, Breakfast, Review
  - Tags: morning, daily, health
  - Progress tracking enabled

#### Floor Plans
- **2BR Apartment** (Residential type)
  - 5 rooms: Living Room, Master Bedroom, Kitchen, Bathroom, Balcony
  - Each room has status, tags, and equipment list
  - Floor area: 120 sqm

#### Contacts
- **Family** (family category)
  - Father, Mother, Child 1, Child 2
  - Hierarchical reporting structure
  
- **Corporate** (corporate category)
  - CEO, CTO, Marketing Director, Software Engineer
  - 4-level org chart hierarchy

#### Map Pins
- **Home** (residential) - Riyadh coordinates
- **Office** (work) - Riyadh coordinates

### routineWizard.js

Dynamic form for creating/editing routine BPMN processes with polymorphic v4.0 model.

**Features**:
- Multi-stop location editor with add/remove
- Multi-person assignment with add/remove
- Dynamic step list with drag-handle reordering
- BPMN JSON compilation on save
- Template selection for quick start
- Cost tracking fields (v4.0)

### contactWizard.js

Quick contact form with org-chart integration and polymorphic location associations.

**Features**:
- "Reports To" dropdown from existing contacts
- Self-reference prevention in edit mode
- Hierarchical org chart compilation
- Skill tag system
- Dynamic location association rows
- Cost tracking fields (v4.0)

---

## Event Telemetry & Status Badges

### eventEngine.js

Mock SignalR event streamer for simulating real-time telemetry.

**Event Categories**:
| Category | Sample Events |
|----------|--------------|
| Operations | Routine completion, floor plan updates, system sync |
| Risk | Budget variance, compliance failures, anomaly detection |
| Health | System health, storage usage, API performance |
| Finance | Transaction summaries, budget alerts, exchange rates |

**Event Payload Structure**:
```json
{
  "eventId": "evt-timestamp-random",
  "timestamp": "2026-01-01T12:00:00.000Z",
  "category": "Operations",
  "message": "Routine task completed: Morning Reset - 3/5 steps done",
  "severity": "info",
  "tags": ["Operations", "Routine"]
}
```

**Configuration**:
- Event interval: 10 seconds
- Auto-starts 2 seconds after page load
- Manual event firing capability

### app.js (Alert Dispatcher with Polymorphic Propagation)

Tag-based visual alert dispatcher with polymorphic v4.0 propagation.

**Alert Flow**:
1. EventEngine fires `telemetry-event` custom event
2. App receives event via `setupTelemetryListener()`
3. Alert added to workspace storage
4. **Tag matching against active items**:
   - Routine cards (routine tags + step tags)
   - Contact cards (contact tags)
   - Room cards (room tags)
5. **Polymorphic alert propagation** (v4.0):
   - Contact matched → propagate to location associations → map pins → buildings → rooms
   - Routine matched → propagate to location stops → map pins → buildings → rooms → assigned persons
   - MapPin matched → propagate to connected contacts, routines, buildings → rooms
6. Visual feedback:
   - `alert-active` class added to matching cards
   - Pulsing alert badge overlay
   - Nav item flash animation
   - Alert count badge update

**Propagation Matrix**:
| Source Entity | Propagates To |
|---------------|---------------|
| Contact | Location associations → Map Pins → Buildings → Rooms, Connected routines |
| Routine | Location stops → Map Pins → Buildings → Rooms, Assigned persons |
| Map Pin | Connected contacts, Connected routines, Connected building → Rooms |
| Building | All floors → all rooms |

---

## PWA Packaging & Local Portability

### portability.js

JSON import/export with schema versioning.

**Export Features**:
- Single-click download as JSON
- Timestamped filename
- Pretty-printed JSON (2-space indent)
- Blob URL creation and cleanup

**Import Features**:
- File validation (JSON extension)
- Schema version comparison
- Migration prompts for version mismatches
- User confirmation before overwrite
- Auto-reload after successful import

### sw.js (Service Worker)

Offline PWA support via cache-first strategy.

**Cache Strategy**:
1. Check cache for requested resource
2. If found, return cached response
3. If not found, fetch from network
4. Cache successful network responses
5. Fallback to offline page for navigation requests

**Service Worker Lifecycle**:
| Event | Action |
|-------|--------|
| `install` | Cache static assets, skip waiting |
| `activate` | Clean old caches, claim clients |
| `fetch` | Cache-first strategy with network fallback |
| `message` | Handle skipWaiting, clearCache commands |
| `sync` | Background sync placeholder |
| `push` | Push notification handler |

### manifest.json

PWA installability manifest.

**Configuration**:
- Display mode: standalone
- Theme color: #4a90d9
- Background color: #f8f9fa
- Orientation: any
- Categories: productivity, utilities

---

## Data Schema

### Workspace Structure (v5.0)

```json
{
  "version": "5.0",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  
  "routines": [...],
  "floorPlans": [...],
  "buildings": [...],
  "contacts": [...],
  "mapPins": [...],
  "alerts": [...],
  "calendarEvents": [...],
  "costs": {
    "income": [...],
    "expenses": [...],
    "assets": [...],
    "liabilities": [...]
  },
  "maturityScores": {
    "financial": {
      "budgetingDiscipline": 0-100,
      "savingsRate": 0-100,
      "investmentDiversification": 0-100,
      "debtManagement": 0-100,
      "insuranceCoverage": 0-100,
      "retirementPlanning": 0-100,
      "cashFlowStability": 0-100,
      "overall": 0-100,
      "level": { "level": 1-5, "name": "...", "description": "..." }
    },
    "health": {
      "physicalScore": 0-100,
      "mentalScore": 0-100,
      "nutritionScore": 0-100,
      "exerciseScore": 0-100,
      "sleepScore": 0-100,
      "preventiveCareScore": 0-100,
      "workLifeBalanceScore": 0-100,
      "overall": 0-100,
      "level": { "level": 1-5, "name": "...", "description": "..." }
    },
    "skills": {
      "technicalSkills": 0-100,
      "leadership": 0-100,
      "communication": 0-100,
      "problemSolving": 0-100,
      "teamwork": 0-100,
      "innovation": 0-100,
      "timeManagement": 0-100,
      "overall": 0-100,
      "level": { "level": 1-5, "name": "...", "description": "..." }
    }
  },
  
  "competenceDomains": [
    {
      "domainId": "string",
      "domainName": "string",
      "stage": "sensing | diagnostics | orchestration | automated",
      "consciousLevel": 0-100,
      "consciousState": "unconsciousIncompetence | consciousIncompetence | consciousCompetence | unconsciousCompetence",
      "targetLevel": number,
      "currentScore": number,
      "gap": number,
      "dataGaps": ["string"],
      "recommendedActions": ["string"],
      "enhancementSuggestions": ["string"],
      "repetitionCount": number,
      "streakDays": number,
      "lastAssessed": "ISO timestamp",
      "telemetrySources": ["string"]
    }
  ],
  
  "developmentPath": {
    "currentStage": "sensing | diagnostics | orchestration | automated",
    "progression": [
      {
        "domainId": "string",
        "prerequisites": ["domainId"],
        "recommendedOrder": number,
        "status": "notStarted | inProgress | mastered"
      }
    ],
    "nextRecommendedAction": "string",
    "lastReview": "ISO timestamp"
  },
  
  "telemetryBaselines": {
    "sleep": { "avgHours": number, "targetHours": number, "source": "string" },
    "movement": { "avgSteps": number, "targetSteps": number, "source": "string" },
    "utilitySpend": { "avgMonthly": number, "targetMonthly": number, "source": "string" },
    "stress": { "avgLevel": number, "targetLevel": number, "source": "string" }
  },
  
  "familyStatus": {
    "members": [
      {
        "contactId": "string",
        "realTimeStatus": {
          "sleepGoalMet": boolean,
          "exerciseGoalMet": boolean,
          "nutritionGoalMet": boolean,
          "documentRenewals": [{ "name": "string", "dueDate": "ISO", "status": "valid | expiring | expired" }]
        },
        "skillBadges": ["string"],
        "lastUpdated": "ISO timestamp"
      }
    ]
  },
  
  "preferences": {
    "mode": "lite|power",
    "theme": "light|dark",
    "sidebarCollapsed": "boolean",
    "defaultView": "dashboard|calendar",
    "rightPanel": {
      "collapsed": "boolean",
      "activeTab": "domains|paths|enhance",
      "selectedDomain": "string"
    }
  }
}
```

---

## File Structure

```
├── index.html          # PWA shell, navigation, modal container
├── styles.css          # Complete styling with dual themes, right panel
├── manifest.json       # PWA manifest for installability
├── sw.js              # Service worker for offline support
│
├── storage.js         # LocalStorage management, schema v5.0, migration
├── templates.js       # JSON presets for routines, floor plans, contacts
│
├── routineWizard.js   # Routine creation with multi-stop & multi-person (v4.0)
├── contactWizard.js   # Contact creation with location associations (v4.0)
│
├── routineView.js     # Routine cards with polymorphic visualization (v4.0)
├── spatialView.js     # Building hierarchy and room card rendering (v4.0)
├── mapView.js         # Leaflet map with polymorphic connections (v4.0)
├── calendarView.js    # FullCalendar integration with multi-type events (v4.0)
├── costView.js        # Financial planning with Chart.js visualizations (v4.0)
├── maturityView.js    # Maturity radar with Highcharts.js (v4.0)
├── eventEngine.js     # Mock SignalR telemetry streamer
├── app.js             # Main controller, polymorphic alert dispatcher (v4.0)
├── portability.js     # JSON import/export with v5.0 versioning
└── rightPanel.js      # Competence Detector panel (v5.0, NEW)
```

---

## Third-Party Libraries

| Library | Version | Purpose | CDN |
|---------|---------|---------|-----|
| Leaflet | 1.9.4 | Interactive maps | unpkg |
| FullCalendar | 6.1.10 | Calendar views | cdn.jsdelivr.net |
| Chart.js | Latest | Bar, Pie, Doughnut, Line charts | cdn.jsdelivr.net |
| Highcharts | Latest | Radar charts, maturity visualization | code.highcharts.com |

---

## Phase 7: UX Touchpoint Matrix - 4 Stages of Competence

### Overview

Phase 7 transforms the application from a workspace tool into a **Personal Digital Twin** that guides users through competence development. It maps four stages of personal development to digital touchpoints within the application.

### 7.1 Four Stages of Competence

| Stage | Goal | Current Coverage | Enhancement |
|-------|------|-----------------|-------------|
| **Sensing** | Surface unmonitored life metrics without active effort | ✅ Highcharts Baseline, ✅ Telemetry Signal Engine, ✅ Open Map | Add passive data ingestion from device sensors |
| **Diagnostics** | Create cognitive friction highlighting reality vs goals | ✅ Maturity Assistant, ✅ Personal Risk Table, ✅ Capabilities Canvas | Add current vs target radar overlay with gap visualization |
| **Orchestration** | Structured execution workbench for habit building | ✅ BPMN.js Workflow, ✅ Kanban/Gantt, ✅ FullCalendar | Add Myelination Tracker, streak tracking, consistency heatmaps |
| **Automated Twin** | Frictionless automated baseline operation | ✅ SignalR Auto-Alerts, ✅ OrgChart Kinship Badges | Add Executive Dashboard, automated exception handling |

### 7.2 Right Panel: Competence & Consciousness Detector

**NEW COMPONENT (v5.0)**: Right-side expandable panel (width: 380px, collapsible to 48px)

**Panel Structure**:
```
┌─────────────────────────────────────────┐
│ 🧠 Competence Detector    [◀] [─] [X] │
├─────────────────────────────────────────┤
│ Tab Bar: [Domains] [Paths] [Enhance]   │
├─────────────────────────────────────────┤
│                                         │
│ Domain: Sleep Hygiene                   │
│ ─────────────────────────────────────── │
│ Conscious Level: ████████░░ 80%        │
│ Detected State: Conscious Competence    │
│ Recommended Action: Automate bedtime    │
│ Data Gap: Missing evening routine log   │
│ Enhancement: Add sleep score tracking   │
│                                         │
│ Domain: Financial Runway                │
│ ─────────────────────────────────────── │
│ Conscious Level: ████░░░░░ 40%         │
│ Detected State: Conscious Incompetence  │
│ Recommended Action: Run maturity eval   │
│ Data Gap: No budget vs actual comparison│
│ Enhancement: Link bank statements       │
│                                         │
└─────────────────────────────────────────┘
```

**Panel Features**:
1. **Expand/Collapse**: Click header to toggle (animated CSS transition)
2. **Domain Tabs**: Show all assessed domains with scores and status
3. **Path Tab**: Show recommended data entry sequence (prioritized by maturity level)
4. **Enhance Tab**: Show actionable enhancement suggestions per domain
5. **Auto-Update**: React to telemetry events and update competence levels
6. **Export**: Generate "Personal Development Path" report

**Implementation**:
- File: `rightPanel.js` (new)
- CSS: `styles.css` additions (.right-panel, .panel-header, .domain-card, etc.)
- State: `localStorage.pwa_rightPanel` (collapsed, activeTab, selectedDomain)
- Integration: `App.js` panel toggle, telemetry event listener

### 7.3 Stage-Specific UX Touchpoint Mapping

| Touchpoint | Current Component | Enhancement | Data Captured |
|------------|------------------|-------------|---------------|
| **1.1 Spatial & Environment** | mapView.js | Add "Energy Leak Detection" overlay | Commute radiuses, home quiet zones, habit-station layouts |
| **1.2 Passive Telemetry** | eventEngine.js | Add device sensor integration | Sleep hours, utility spend, travel history |
| **2.1 Personal Maturity** | maturityView.js | Add current vs target radar overlay | Life domain ratings (Sleep, Stress, Family, Financial) |
| **2.2 Life Threat Scoring** | alerts system | Add "Risk Table" view | Vulnerabilities with probability and impact scores |
| **2.3 Strengths Assessment** | contact.skillTags | Add "Capabilities Canvas" | Personal/family competencies and missing capabilities |
| **3.1 Routine Modeling** | routineView.js | Add "Myelination Tracker" | Daily routine execution, step completion, timing |
| **3.2 Milestone Scheduling** | calendarView.js | Add automated countdown triggers | 5-year horizons, school terms, renewals |
| **3.3 Habit Execution** | routineView.js | Add Kanban board view | Daily micro-task completion across life domains |
| **4.1 Family Status** | contactWizard.js | Add real-time status badges | Family member status, health indicators, admin readiness |
| **4.2 Exception Handling** | eventEngine.js | Add external impact detection | External events affecting personal plans |

### 7.4 Daily & Weekly Personal Operating Cadence

| Cadence | Time | UX Component | Action | Display |
|---------|------|--------------|--------|---------|
| **Morning Reset** | 2 min | routineView.js (BPMN) | Check off morning routine steps | Daily high-priority micro-tasks |
| **Midday Check-In** | 1 min | mapView.js | Review location-based reminders | Pick-up routes, workout alerts |
| **Evening Shutdown** | 3 min | maturityView.js, Kanban | Log sleep, hydration, movement | Clear completed habit cards |
| **Weekly Review** | 15 min | alerts, costView | Review renewal dates, update scores | Priority alignment for week |
| **Monthly Scan** | 30 min | calendarView.js, contacts | Scan 5-year milestones, update badges | Strategic horizon adjustments |

### 7.5 Neuro-Trigger Implementation

| Trigger | Stage | Mechanism |
|---------|-------|-----------|
| **DMN Disruption** | Sensing | Visual rendering of physical environments, unexpected data revelations |
| **Prefrontal Friction** | Diagnostics | Constructive cognitive dissonance via gap visualization |
| **Synaptic Myelination** | Orchestration | Structured repetition tracking, consistency rewards, streaks |
| **Basal Ganglia Automation** | Automated | Reduced manual input, automated exception handling |

### 7.6 UI/UX Enhancement Requirements

1. **Right Panel (rightPanel.js)**:
   - Expandable/collapsible (380px width, CSS transition)
   - Three tabs: Domains, Paths, Enhance
   - Domain cards with progress bars and status indicators
   - Color coding by stage: Sensing (blue), Diagnostics (amber), Orchestration (green), Automated (purple)
   - Responsive: collapses to icon strip on mobile

2. **Stage Indicator (header badge)**:
   - Show current application stage based on dominant user activity
   - Updates based on most frequently accessed view
   - Click to see stage progression recommendations

3. **Gap Visualization**:
   - Radar chart overlay: current vs target maturity scores
   - Animated gap-closing animation when scores improve
   - Heat map showing domains needing attention

4. **Repetition Tracking**:
   - Streak counter for routine completion
   - Consistency heatmap (like GitHub contributions)
   - Myelination score based on repetition consistency

5. **Executive Dashboard (Stage 4)**:
   - Single-screen family overview
   - Real-time status badges on family members
   - Automated alert aggregation
   - Predictive recommendations

### 7.7 Priority Implementation Order (v5.0)

1. ✅ rightPanel.js - Core panel structure with expand/collapse
2. ✅ Data model extension (v5.0) - Add competenceDomains, developmentPath
3. ⏳ Domain assessment engine - Auto-calculate competence levels
4. ⏳...I have to give the solution based on the reasoning directly now.</think>

<write_to_file>
<path>features.md</path>
<content># Multi-Mode PWA Workspace - Feature Documentation (v4.0/v5.0)

## Overview

A zero-dependency progressive web application with dual-mode interface (Lite/Power) for managing daily routines, spatial floor plans, contact directories, location mapping, calendar events, cost planning, maturity radar visualization, real-time telemetry alerts, and personal competence development. Built entirely with vanilla HTML5, CSS3, and JavaScript.

**Version 4.0** introduces polymorphic data model architecture with cost tracking and event taxonomy. **Version 5.0** adds the UX Touchpoint Matrix mapping 4 Stages of Competence to digital touchpoints, transforming the application into a Personal Digital Twin.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Core Features](#core-features)
3. [Polymorphic Data Model v4.0/v5.0](#polymorphic-data-model-v40v50)
4. [Application Views](#application-views)
5. [Template Library & Form-to-JSON Engine](#template-library--form-to-json-engine)
6. [Event Telemetry & Status Badges](#event-telemetry--status-badges)
7. [PWA Packaging & Local Portability](#pwa-packaging--local-portability)
8. [Data Schema](#data-schema)
9. [File Structure](#file-structure)
10. [Third-Party Libraries](#third-party-libraries)
11. [Phase 7: UX Touchpoint Matrix - 4 Stages of Competence](#phase-7-ux-touchpoint-matrix---4-stages-of-competence)
12. [Future Enhancement Opportunities](#future-enhancement-opportunities)

---

## Architecture

### Design Patterns
- **Module Pattern**: All functionality encapsulated in named namespace objects (App, Storage, Templates, etc.)
- **Event-Driven Communication**: Custom DOM events (`telemetry-event`) for inter-module communication
- **Single Source of Truth**: LocalStorage-backed workspace data object
- **Component-Based Views**: Each view module renders its own HTML templates
- **Polymorphic Entity Connections**: v4.0/v5.0 introduces cross-entity relationships with cost rollup, multi-party associations, and spatial hierarchy
- **Competence Tracking**: v5.0 adds 4 Stages of Competence detector with right panel

### Technology Stack
| Component | Technology |
|-----------|-----------|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Map Engine | Leaflet.js 1.9.4 (CDN) |
| Calendar Engine | FullCalendar.js 6.1.10 (CDN) |
| Chart Engine | Chart.js (CDN) |
| Radar Visualization | Highcharts (CDN) |
| Data Storage | Browser LocalStorage |
| Service Worker | Cache API |
| PWA | Web App Manifest |

### Browser Requirements
- Modern browser with ES6+ support
- LocalStorage support
- Service Worker support
- Fetch API support

---

## Core Features

### 1. Dual-Mode Interface

#### Lite Mode (Default)
- Clean, minimal interface
- Light color scheme
- Simplified navigation
- Reduced visual effects for performance
- Ideal for casual users and low-end devices

#### Power Mode
- Dark enhanced theme
- Additional visual indicators
- Expanded data visualization
- Enhanced contrast ratios
- Ideal for power users and detailed analysis

**Mode Persistence**: User's mode preference is saved to `localStorage` and restored on page load.

### 2. Ten Application Views

| View | Description | Key Features |
|------|-------------|--------------|
| **Dashboard** | Central hub with overview cards | Quick navigation, statistics, action buttons |
| **Calendar** | FullCalendar event management | Multi-type events, drag-and-drop, filters, tech events |
| **Routines** | BPMN-style routine management | Step checklists, progress tracking, templates |
| **Floor Plans** | Spatial workspace management | Room cards, status tracking, tag system |
| **Contacts** | Org-chart contact directory | Parent-child relationships, skill tags, location associations |
| **Map** | Interactive location mapping | Leaflet.js, geocoding, pin management |
| **Cost Planning** | Financial management dashboard | Income, expenses, assets, liabilities, charts |
| **Maturity Radar** | Maturity level visualization | Financial, Health, Skills radar charts |
| **Alerts** | Telemetry event log | Severity filtering, tag-based alerts |
| **Right Panel** | Competence Detector (v5.0) | Domains, Paths, Enhance tabs |

### 3. Polymorphic Alert System with Multi-Party Associations (v4.0)
- Real-time telemetry events from mock SignalR stream
- Tag matching against routines, contacts, and rooms
- **Polymorphic alert propagation**: Alerts cascade through entity connections
  - Contact → Location associations → Buildings → Rooms
  - Routine → Location stops → Map pins → Buildings → Rooms
  - MapPin → Contacts, Routines, and Buildings
- **Multi-party trip assignments**: Multiple persons can be assigned to routines with roles (organizer, participant, observer)
- Visual feedback: pulsing badges on matching cards
- Severity levels: info, warning, critical
- 1-hour alert window with auto-dismissal

### 4. Cost Tracking on Every Entity (v4.0)
- Every entity (Contact, Location, Routine, Trip, Plan) supports cost tracking
- Cost Categories: Trip Cost, Routine Cost, Floor Cost, Room Cost, Contact Cost
- Contact Cost Breakdown: housing, food, transport, health, education, entertainment
- Financial Structure: currency, budget, actual, categories, income, assets, liabilities
- Cost aggregation: entity costs roll up to parent entities
- Financial reports: net worth, cash flow, budget vs actual

### 5. Data Portability
- Export workspace as downloadable JSON file
- Import workspace from JSON file upload
- Schema version validation (current: 5.0)
- Automatic migration for older versions
- User confirmation prompts for version mismatches

---

## Application Views

### 1. Dashboard View

The central hub providing an overview of all workspace data with quick navigation cards.

**Features**:
- Statistics cards for all views (routines, floor plans, contacts, map pins, buildings, events)
- Quick navigation buttons to each view
- Alert count display
- Cost planning summary
- Maturity radar summary
- Competence stage indicator (v5.0)

### 2. Calendar View (calendarView.js)

FullCalendar.js integration for comprehensive event management and scheduling.

**Features**:
- **Multi-view Calendar**: Month, Week, Day, List views
- **Event Type Filters**: Routines, Activities, Technology, Economic, Political, International, External
- **Drag-and-Drop**: Reschedule events by dragging
- **Event Creation**: Modal form for creating new events
- **Event Editing**: Edit existing event details
- **Event Deletion**: Remove events with confirmation
- **Color-Coded Events**: Different colors per event type
- **Attendee Management**: Multi-select attendees from contacts
- **Budget Tracking**: Associate costs with events
- **Recurring Events**: Daily, Weekly, Monthly, Yearly recurrence
- **External URLs**: Link to external event pages
- **Priority Levels**: Low, Medium, High, Critical
- **Technology Source Tracking**: Apple, Microsoft, IBM, NVIDIA, OpenAI, Tesla, Gartner

**Event Taxonomy (v4.0)**:
| Event Type | Description | Examples |
|------------|-------------|----------|
| Routine | Linked to user routines, recurring patterns | Daily morning routine, weekly review |
| External | Third-party events imported or manually added | Conferences, meetings |
| Activity | Personal activities with duration and location | Exercise, meditation |
| International | Global holidays, cultural celebrations | New Year, Eid |
| Economic | Market openings, financial reports, policy changes | Fed meetings, earnings |
| Political | Summits, elections, treaties, diplomatic meetings | G20, UN sessions |
| Technology | Product launches, conferences, software releases | WWDC, Build, GTC |

**Technology Event Sources**:
| Source | Examples |
|--------|----------|
| Apple | WWDC, iPhone launches, iPad events, Apple Watch announcements |
| Microsoft | Build, Surface events, Windows announcements, Azure updates |
| IBM | Think conference, quantum computing events, hybrid cloud announcements |
| NVIDIA | GTC conference, GPU launches, AI announcements |
| OpenAI | Model releases, research publications, partnership announcements |
| Tesla | Battery Day, AI Day, vehicle launches, energy product events |
| Gartner | Hype Cycle releases, IT conferences, market research publications |

**Event Form Fields**:
| Field | Type | Description |
|-------|------|-------------|
| Event Title | text | Required |
| Event Type | select | 7 categories |
| Technology Source | select | For technology events |
| Start Date/Time | datetime-local | Required |
| End Date/Time | datetime-local | Optional |
| Priority | select | Low/Medium/High/Critical |
| Description | textarea | Optional |
| External URL | url | Optional |
| Attendees | multi-select | From contacts |
| Budget | number | Optional |
| Recurring | select | None/Daily/Weekly/Monthly/Yearly |

### 3. Routines View (routineView.js)

BPMN-style routine management with polymorphic visualization.

**Features**:
- Routine cards with progress bars
- Step completion checkboxes
- Location stops display with building info
- Assigned persons display with roles (organizer, participant, observer)
- Add/Edit/Delete routine operations
- Template gallery for quick creation
- Category filtering
- Cost tracking per routine (v4.0)
- Streak tracking and consistency metrics (v5.0)

### 4. Floor Plans View (spatialView.js)

Building hierarchy and room card management with spatial nesting.

**Features**:
- Buildings view with hierarchical tree (Buildings → Floors → Rooms)
- Floor plans dropdown selector (legacy)
- Room cards with status indicators
- Room tag system
- Add/Edit/Delete room operations
- Equipment tracking per room
- Status categories: Good, Warning, Critical
- Contact assignment to rooms
- Building metadata with connected pins display
- Floor cost tracking: maintenance, utility, rental/lease (v4.0)
- Room cost tracking: equipment, setup, per-use costs (v4.0)

### 5. Contacts View

Org-chart and location associations display with multi-party support.

**Features**:
- Contact cards with name, role, tags, skills
- "Reports To" hierarchy display
- Location associations count display
- Edit/Delete actions
- Skill tag filtering
- **Location associations** (v4.0): Geographic (lat/lng), Building, Floor, Room levels
- **Cost tracking** (v4.0): Living cost, support cost, compensation with breakdown
- **Multi-party trip assignments** (v4.0): Many-to-many with routines

### 6. Map View (mapView.js)

Interactive map with Leaflet.js and polymorphic connections.

**Features**:
- Leaflet.js map initialization
- OpenStreetMap tile layer
- Text search with Nominatim geocoding
- Auto-categorization of locations
- Polymorphic popup content: connected contacts, routines, buildings
- Pin edit/delete via popup buttons
- Edit dialog with connection management
- Multi-select for contacts and routines
- Building selector
- Automatic map fitting to pins
- Spatial hierarchy support: Map Region → Building → Floor → Room (v4.0)

### 7. Cost Planning View (costView.js)

Financial planning dashboard with Chart.js visualizations.

**Features**:
- **Summary Cards**:
  - Total Income
  - Total Spending
  - Net Cash Flow (color-coded green/red)
  - Total Assets
  - Total Liabilities
  - Net Worth (color-coded green/red)

- **Charts**:
  - Asset Allocation (Pie Chart)
  - Liability Breakdown (Bar Chart)
  - Income vs Spending Trend (Line Chart - 6 months)
  - Spending by Category (Doughnut Chart)

- **Entity Cost Breakdown**:
  - Trips/Routines cost table
  - Buildings/Floors cost table
  - Contacts cost table

- **Financial Transactions Tables**:
  - Income records
  - Expense records
  - Asset records
  - Liability records

- **CRUD Operations**:
  - Add Income (source, amount, type, date)
  - Add Expense (category, amount, description)
  - Add Asset (name, value, type, purchase date)
  - Add Liability (name, balance, type, due date)
  - Export Financial Report (JSON)

**Cost Categories**:
| Category | Subcategories |
|----------|--------------|
| Income | Salary, Investment, Freelance, Other |
| Expense | Housing, Food, Transport, Health, Education, Entertainment |
| Assets | Real Estate, Vehicle, Investment, Cash, Other |
| Liabilities | Mortgage, Loan, Credit Card, Other |

### 8. Maturity Radar View (maturityView.js)

Maturity level visualization using Highcharts radar charts.

**Features**:
- **Maturity Level Overview Cards**:
  - Financial Maturity (score + level badge)
  - Health Maturity (score + level badge)
  - Skills Maturity (score + level badge)

- **Radar Charts** (Highcharts.js):
  - Financial Maturity Radar (7 dimensions)
  - Health Maturity Radar (7 dimensions)
  - Skills Maturity Radar (7 dimensions)
  - Comparison View (all three maturity types)

- **Dimension Scores**: Visual progress bars for each dimension
- **Maturity History Chart**: Line chart showing trend over time
- **Improvement Recommendations**: AI-generated suggestions based on lowest scores
- **Score Editing**: Modal form to manually adjust all scores
- **Export Report**: Download maturity report as JSON
- **Current vs Target Overlay** (v5.0): Gap visualization between current and target maturity

**Maturity Levels**:
| Level | Score Range | Name | Description |
|-------|-------------|------|-------------|
| 1 | 0-29 | Initial | Ad-hoc and chaotic processes |
| 2 | 30-49 | Managed | Reactive with basic project-level management |
| 3 | 50-69 | Defined | Proactive and well-defined processes |
| 4 | 70-89 | Quantitatively Managed | Measured and controlled |
| 5 | 90-100 | Optimizing | Continuous improvement culture |

**Financial Maturity Dimensions** (7):
- Budgeting Discipline, Savings Rate, Investment Diversification, Debt Management, Insurance Coverage, Retirement Planning, Cash Flow Stability

**Health Maturity Dimensions** (7):
- Physical Health, Mental Health, Nutrition Management, Exercise Routine, Sleep Quality, Preventive Care, Work-Life Balance

**Skills Maturity Dimensions** (7):
- Technical Skills, Leadership, Communication, Problem Solving, Teamwork, Innovation, Time Management

### 9. Alerts View

Telemetry event log with severity filtering.

**Features**:
- Alert list with severity icons (🔴 critical, 🟡 warning, 🔵 info)
- Timestamp and category display
- Tag badges for each alert
- Clear all alerts option
- Alert count badge in navigation

---

## Polymorphic Data Model v4.0/v5.0

### Overview

Version 4.0 introduces enhanced polymorphic entity connections with cost model and event taxonomy. Version 5.0 adds competence domains, development paths, and telemetry baselines for personal development tracking.

### Entity Connection Graph

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Contacts   │────▶│   Map Pins   │────▶│  Buildings  │
│             │     │              │     │             │
│ location    │     │ connected    │     │ floors      │
│ associations│     │ Contacts     │     │  └─ rooms   │
└─────────────┘     │ connected    │     └─────────────┘
                    │ Routines     │
┌─────────────┐     └──────────────┘     ┌─────────────┐
│  Routines   │◀───┐                       │   Alerts    │
│             │    │                       │             │
│ location    │────┘                       │ polymorphic │
│ stops       │                             │ propagation│
│             │     ┌──────────────┐       └─────────────┘
│ assigned    │────▶│    Contacts   │
│ persons     │     │               │
└─────────────┘     └──────────────┘

Cost Rollup: Room → Floor → Building → Workspace
Competence: Maturity Scores → Domains → Development Path
```

### Connection Types

#### 1. Contact → Location Associations (Many-to-Many, v4.0)
Contacts can be associated with multiple locations at multiple granularity levels.

| Field | Type | Description |
|-------|------|-------------|
| locationId | string | Reference to mapPin or building ID |
| locationType | enum | 'mapPin', 'building', 'floor', 'room' |
| associationType | enum | 'home', 'work', 'frequent', 'temporary' |
| assignedAt | timestamp | When association was created |
| coordinates | object | {lat, lng} for geographic level |

**Spatial Hierarchy**: Map Region → Building → Floor → Room
- Geographic Level: lat/lng coordinates on a map
- Building Level: structured building with unique identifier
- Floor Level: floors within a building (e.g., Floor 1, Floor 2)
- Room Level: rooms within floors (e.g., Room 101, Conference Room A)

#### 2. Routine → Location Stops (One-to-Many, v4.0)
Routines/trips consist of multiple geographic stops in ordered sequence.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique stop identifier |
| order | number | Stop sequence number |
| stopName | string | Display name for the stop |
| locationId | string | Reference to mapPin ID |
| locationType | enum | 'mapPin' or 'custom' |
| estimatedDuration | number | Expected duration in minutes |
| description | string | Stop notes |

#### 3. Routine → Assigned Persons (Many-to-Many, v4.0)
Routines can have multiple persons assigned with specific roles.

| Field | Type | Description |
|-------|------|-------------|
| contactId | string | Reference to contact ID |
| role | enum | 'organizer', 'participant', 'observer' |
| confirmed | boolean | Whether person has confirmed |

#### 4. Map Pin → Connected Entities (Many-to-Many, v4.0)
Map pins can reference multiple contacts, routines, and buildings.

| Field | Type | Description |
|-------|------|-------------|
| connectedContacts | array | Array of contact IDs |
| connectedRoutines | array | Array of routine IDs |
| connectedBuilding | string | Reference to building ID |

#### 5. Building → Floors → Rooms (Hierarchical, v4.0)
Buildings contain floors, which contain rooms with contact associations.

| Level | Field | Type | Description |
|-------|-------|------|-------------|
| Building | floors | array | Array of floor objects |
| Floor | number | string | Floor number/name |
| Floor | name | string | Floor display name |
| Floor | rooms | array | Array of room objects |
| Room | assignedContacts | array | Array of contact IDs |
| Room | type | string | Room type |
| Room | capacity | number | Maximum occupancy |
| Room | area | string | Room area |
| Room | equipment | array | Room equipment list |

#### 6. Cost Model (v4.0)
Every entity supports cost tracking with polymorphic financial structure.

**Cost Structure per Entity**:
```json
{
  "cost": {
    "currency": "USD",
    "budget": number,
    "actual": number,
    "categories": [
      {
        "name": "string",
        "amount": number,
        "date": "ISO timestamp",
        "description": "string"
      }
    ],
    "income": [
      {
        "source": "string",
        "amount": number,
        "date": "ISO timestamp",
        "type": "salary | investment | freelance | other"
      }
    ],
    "assets": [
      {
        "name": "string",
        "value": number,
        "type": "real_estate | vehicle | investment | cash | other",
        "purchaseDate": "ISO timestamp"
      }
    ],
    "liabilities": [
      {
        "name": "string",
        "balance": number,
        "type": "mortgage | loan | credit_card | other",
        "interestRate": number,
        "dueDate": "ISO timestamp"
      }
    ]
  }
}
```

**Cost Categories per Entity**:
| Entity | Cost Types |
|--------|-----------|
| Trip/Routine | Total budget, actual spending, currency, breakdown by category |
| Routine | Per-routine budget, execution cost, recurring expenses |
| Floor | Maintenance cost, utility cost, rental/lease cost |
| Room | Equipment cost, setup cost, per-use cost |
| Contact | Living cost, support cost, compensation |
| Contact Breakdown | Housing, food, transport, health, education, entertainment |

**Cost Aggregation**: Entity costs roll up to parent entities (room → floor → building)

### Competence Domains (v5.0)

**Competence Domain Structure**:
```json
{
  "domainId": "string",
  "domainName": "string",
  "stage": "sensing | diagnostics | orchestration | automated",
  "consciousLevel": number, // 0-100
  "consciousState": "unconsciousIncompetence | consciousIncompetence | consciousCompetence | unconsciousCompetence",
  "targetLevel": number,
  "currentScore": number,
  "gap": number,
  "dataGaps": ["string"],
  "recommendedActions": ["string"],
  "enhancementSuggestions": ["string"],
  "repetitionCount": number,
  "streakDays": number,
  "lastAssessed": "ISO timestamp",
  "telemetrySources": ["string"]
}
```

**Four Stages of Competence**:
| Stage | Goal | Current Coverage | Enhancement |
|-------|------|-----------------|-------------|
| Sensing | Surface unmonitored life metrics without active effort | Highcharts Baseline, Telemetry Signal Engine, Open Map | Passive data ingestion from device sensors |
| Diagnostics | Create cognitive friction highlighting reality vs goals | Maturity Assistant, Personal Risk Table, Capabilities Canvas | Current vs Target radar overlay with gap visualization |
| Orchestration | Structured execution workbench for habit building | BPMN.js Workflow, Kanban/Gantt, FullCalendar | Myelination Tracker, streak tracking, consistency heatmaps |
| Automated Twin | Frictionless automated baseline operation | SignalR Auto-Alerts, OrgChart Kinship Badges | Executive Dashboard, automated exception handling |

---

## Template Library & Form-to-JSON Engine

### templates.js

Pre-packaged JSON presets for rapid workspace initialization.

**Default Templates**:

#### Routines
- **Morning Routine** (Operations category)
  - 5 steps: Wake Up, Hygiene, Exercise, Breakfast, Review
  - Tags: morning, daily, health
  - Progress tracking enabled

#### Floor Plans
- **2BR Apartment** (Residential type)
  - 5 rooms: Living Room, Master Bedroom, Kitchen, Bathroom, Balcony
  - Each room has status, tags, and equipment list
  - Floor area: 120 sqm

#### Contacts
- **Family** (family category)
  - Father, Mother, Child 1, Child 2
  - Hierarchical reporting structure
  
- **Corporate** (corporate category)
  - CEO, CTO, Marketing Director, Software Engineer
  - 4-level org chart hierarchy

#### Map Pins
- **Home** (residential) - Riyadh coordinates
- **Office** (work) - Riyadh coordinates

### routineWizard.js

Dynamic form for creating/editing routine BPMN processes with polymorphic v4.0 model.

**Features**:
- Multi-stop location editor with add/remove
- Multi-person assignment with add/remove
- Dynamic step list with drag-handle reordering
- BPMN JSON compilation on save
- Template selection for quick start
- Cost tracking fields (v4.0)

### contactWizard.js

Quick contact form with org-chart integration and polymorphic location associations.

**Features**:
- "Reports To" dropdown from existing contacts
- Self-reference prevention in edit mode
- Hierarchical org chart compilation
- Skill tag system
- Dynamic location association rows
- Cost tracking fields (v4.0)

---

## Event Telemetry & Status Badges

### eventEngine.js

Mock SignalR event streamer for simulating real-time telemetry.

**Event Categories**:
| Category | Sample Events |
|----------|--------------|
| Operations | Routine completion, floor plan updates, system sync |
| Risk | Budget variance, compliance failures, anomaly detection |
| Health | System health, storage usage, API performance |
| Finance | Transaction summaries, budget alerts, exchange rates |

**Event Payload Structure**:
```json
{
  "eventId": "evt-timestamp-random",
  "timestamp": "2026-01-01T12:00:00.000Z",
  "category": "Operations",
  "message": "Routine task completed: Morning Reset - 3/5 steps done",
  "severity": "info",
  "tags": ["Operations", "Routine"]
}
```

**Configuration**:
- Event interval: 10 seconds
- Auto-starts 2 seconds after page load
- Manual event firing capability

### app.js (Alert Dispatcher with Polymorphic Propagation)

Tag-based visual alert dispatcher with polymorphic v4.0 propagation.

**Alert Flow**:
1. EventEngine fires `telemetry-event` custom event
2. App receives event via `setupTelemetryListener()`
3. Alert added to workspace storage
4. **Tag matching against active items**:
   - Routine cards (routine tags + step tags)
   - Contact cards (contact tags)
   - Room cards (room tags)
5. **Polymorphic alert propagation** (v4.0):
   - Contact matched → propagate to location associations → map pins → buildings → rooms
   - Routine matched → propagate to location stops → map pins → buildings → rooms → assigned persons
   - MapPin matched → propagate to connected contacts, routines, buildings → rooms
6. Visual feedback:
   - `alert-active` class added to matching cards
   - Pulsing alert badge overlay
   - Nav item flash animation
   - Alert count badge update

**Propagation Matrix**:
| Source Entity | Propagates To |
|---------------|---------------|
| Contact | Location associations → Map Pins → Buildings → Rooms, Connected routines |
| Routine | Location stops → Map Pins → Buildings → Rooms, Assigned persons |
| Map Pin | Connected contacts, Connected routines, Connected building → Rooms |
| Building | All floors → all rooms |

---

## PWA Packaging & Local Portability

### portability.js

JSON import/export with schema versioning.

**Export Features**:
- Single-click download as JSON
- Timestamped filename
- Pretty-printed JSON (2-space indent)
- Blob URL creation and cleanup

**Import Features**:
- File validation (JSON extension)
- Schema version comparison
- Migration prompts for version mismatches
- User confirmation before overwrite
- Auto-reload after successful import

### sw.js (Service Worker)

Offline PWA support via cache-first strategy.

**Cache Strategy**:
1. Check cache for requested resource
2. If found, return cached response
3. If not found, fetch from network
4. Cache successful network responses
5. Fallback to offline page for navigation requests

**Service Worker Lifecycle**:
| Event | Action |
|-------|--------|
| `install` | Cache static assets, skip waiting |
| `activate` | Clean old caches, claim clients |
| `fetch` | Cache-first strategy with network fallback |
| `message` | Handle skipWaiting, clearCache commands |
| `sync` | Background sync placeholder |
| `push` | Push notification handler |

### manifest.json

PWA installability manifest.

**Configuration**:
- Display mode: standalone
- Theme color: #4a90d9
- Background color: #f8f9fa
- Orientation: any
- Categories: productivity, utilities

---

## Data Schema

### Workspace Structure (v5.0)

```json
{
  "version": "5.0",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  
  "routines": [...],
  "floorPlans": [...],
  "buildings": [...],
  "contacts": [...],
  "mapPins": [...],
  "alerts": [...],
  "calendarEvents": [...],
  "costs": {
    "income": [...],
    "expenses": [...],
    "assets": [...],
    "liabilities": [...]
  },
  "maturityScores": {
    "financial": {
      "budgetingDiscipline": 0-100,
      "savingsRate": 0-100,
      "investmentDiversification": 0-100,
      "debtManagement": 0-100,
      "insuranceCoverage": 0-100,
      "retirementPlanning": 0-100,
      "cashFlowStability": 0-100,
      "overall": 0-100,
      "level": { "level": 1-5, "name": "...", "description": "..." }
    },
    "health": {
      "physicalScore": 0-100,
      "mentalScore": 0-100,
      "nutritionScore": 0-100,
      "exerciseScore": 0-100,
      "sleepScore": 0-100,
      "preventiveCareScore": 0-100,
      "workLifeBalanceScore": 0-100,
      "overall": 0-100,
      "level": { "level": 1-5, "name": "...", "description": "..." }
    },
    "skills": {
      "technicalSkills": 0-100,
      "leadership": 0-100,
      "communication": 0-100,
      "problemSolving": 0-100,
      "teamwork": 0-100,
      "innovation": 0-100,
      "timeManagement": 0-100,
      "overall": 0-100,
      "level": { "level": 1-5, "name": "...", "description": "..." }
    }
  },
  
  "competenceDomains": [
    {
      "domainId": "string",
      "domainName": "string",
      "stage": "sensing | diagnostics | orchestration | automated",
      "consciousLevel": 0-100,
      "consciousState": "unconsciousIncompetence | consciousIncompetence | consciousCompetence | unconsciousCompetence",
      "targetLevel": number,
      "currentScore": number,
      "gap": number,
      "dataGaps": ["string"],
      "recommendedActions": ["string"],
      "enhancementSuggestions": ["string"],
      "repetitionCount": number,
      "streakDays": number,
      "lastAssessed": "ISO timestamp",
      "telemetrySources": ["string"]
    }
  ],
  
  "developmentPath": {
    "currentStage": "sensing | diagnostics | orchestration | automated",
    "progression": [
      {
        "domainId": "string",
        "prerequisites": ["domainId"],
        "recommendedOrder": number,
        "status": "notStarted | inProgress | mastered"
      }
    ],
    "nextRecommendedAction": "string",
    "lastReview": "ISO timestamp"
  },
  
  "telemetryBaselines": {
    "sleep": { "avgHours": number, "targetHours": number, "source": "string" },
    "movement": { "avgSteps": number, "targetSteps": number, "source": "string" },
    "utilitySpend": { "avgMonthly": number, "targetMonthly": number, "source": "string" },
    "stress": { "avgLevel": number, "targetLevel": number, "source": "string" }
  },
  
  "familyStatus": {
    "members": [
      {
        "contactId": "string",
        "realTimeStatus": {
          "sleepGoalMet": boolean,
          "exerciseGoalMet": boolean,
          "nutritionGoalMet": boolean,
          "documentRenewals": [{ "name": "string", "dueDate": "ISO", "status": "valid | expiring | expired" }]
        },
        "skillBadges": ["string"],
        "lastUpdated": "ISO timestamp"
      }
    ]
  },
  
  "preferences": {
    "mode": "lite|power",
    "theme": "light|dark",
    "sidebarCollapsed": "boolean",
    "defaultView": "dashboard|calendar",
    "rightPanel": {
      "collapsed": "boolean",
      "activeTab": "domains|paths|enhance",
      "selectedDomain": "string"
    }
  }
}
```

---

## File Structure

```
├── index.html          # PWA shell, navigation, modal container
├── styles.css          # Complete styling with dual themes, right panel
├── manifest.json       # PWA manifest for installability
├── sw.js              # Service worker for offline support
│
├── storage.js         # LocalStorage management, schema v5.0, migration
├── templates.js       # JSON presets for routines, floor plans, contacts
│
├── routineWizard.js   # Routine creation with multi-stop & multi-person (v4.0)
├── contactWizard.js   # Contact creation with location associations (v4.0)
│
├── routineView.js     # Routine cards with polymorphic visualization (v4.0)
├── spatialView.js     # Building hierarchy and room card rendering (v4.0)
├── mapView.js         # Leaflet map with polymorphic connections (v4.0)
├── calendarView.js    # FullCalendar integration with multi-type events (v4.0)
├── costView.js        # Financial planning with Chart.js visualizations (v4.0)
├── maturityView.js    # Maturity radar with Highcharts.js (v4.0)
├── eventEngine.js     # Mock SignalR telemetry streamer
├── app.js             # Main controller, polymorphic alert dispatcher (v4.0)
├── portability.js     # JSON import/export with v5.0 versioning
└── rightPanel.js      # Competence Detector panel (v5.0, NEW)
```

---

## Third-Party Libraries

| Library | Version | Purpose | CDN |
|---------|---------|---------|-----|
| Leaflet | 1.9.4 | Interactive maps | unpkg |
| FullCalendar | 6.1.10 | Calendar views | cdn.jsdelivr.net |
| Chart.js | Latest | Bar, Pie, Doughnut, Line charts | cdn.jsdelivr.net |
| Highcharts | Latest | Radar charts, maturity visualization | code.highcharts.com |

---

## Phase 7: UX Touchpoint Matrix - 4 Stages of Competence

### Overview

Phase 7 transforms the application from a workspace tool into a **Personal Digital Twin** that guides users through competence development. It maps four stages of personal development to digital touchpoints within the application.

### 7.1 Four Stages of Competence

| Stage | Goal | Current Coverage | Enhancement |
|-------|------|-----------------|-------------|
| **Sensing** | Surface unmonitored life metrics without active effort | ✅ Highcharts Baseline, ✅ Telemetry Signal Engine, ✅ Open Map | Add passive data ingestion from device sensors |
| **Diagnostics** | Create cognitive friction highlighting reality vs goals | ✅ Maturity Assistant, ✅ Personal Risk Table, ✅ Capabilities Canvas | Add current vs target radar overlay with gap visualization |
| **Orchestration** | Structured execution workbench for habit building | ✅ BPMN.js Workflow, ✅ Kanban/Gantt, ✅ FullCalendar | Add Myelination Tracker, streak tracking, consistency heatmaps |
| **Automated Twin** | Frictionless automated baseline operation | ✅ SignalR Auto-Alerts, ✅ OrgChart Kinship Badges | Add Executive Dashboard, automated exception handling |

### 7.2 Right Panel: Competence & Consciousness Detector

**NEW COMPONENT (v5.0)**: Right-side expandable panel (width: 380px, collapsible to 48px)

**Panel Structure**:
```
┌─────────────────────────────────────────┐
│ 🧠 Competence Detector    [◀] [─] [X] │
├─────────────────────────────────────────┤
│ Tab Bar: [Domains] [Paths] [Enhance]   │
├─────────────────────────────────────────┤
│                                         │
│ Domain: Sleep Hygiene                   │
│ ─────────────────────────────────────── │
│ Conscious Level: ████████░░ 80%        │
│ Detected State: Conscious Competence    │
│ Recommended Action: Automate