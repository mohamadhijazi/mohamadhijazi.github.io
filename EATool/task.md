# EA Tool Implementation Task Plan

## Objective

Build a static HTML/CSS/vanilla JavaScript enterprise architecture workspace ` as the primary source of model metadata, supports business-user data entry, and provides modeling, planning, dashboard, and Studio customization capabilities without requiring a backend.

This task plan is derived from:

- `.github/instructions/ea-tool.instructions.md`

## Core principles

- The application must be browser-only and openable via `index.html`.

- Business users can operate without technical expertise.
- Studio-defined custom properties and pages are additive to the metamodel, not edits to the source CSV.
- Data persistence should occur in browser storage (`localStorage`) unless a project-level persistence layer already exists.

## Phase 0 — Discovery and metamodel interpretation

### Tasks

- [ ] Extract and normalize model classes, captions, relation names, cardinality, and hints.
- [ ] Build a metadata index for: source class, target class, relation, caption, and cardinality.
- [ ] Identify the major business domains represented in the data: organization, strategy, processes, solutions, applications, integrations, and technology.
- [ ] Determine which classes are likely to be used for forms, lists, dashboards, relationship views, and planning artifacts.
- [ ] Validate that the CSV is a relationship catalog, not a full object-schema definition.

### Output
- A metamodel registry object with class names, labels, relationship definitions, and source/target mapping.
- A list of supported primitive categories for custom Studio properties.

## Phase 1 — Application shell and base UX

### Tasks
- [ ] Create the main `index.html` structure with the shell layout:
  - left navigation
  - top bar
  - central workspace
  - modal areas for forms and dialogs
- [ ] Implement a responsive design system with an enterprise dashboard look and feel.
- [ ] Define reusable UI components:
  - cards
  - tables
  - badges
  - forms
  - filters
  - tabs
  - modals
  - alerts
  - empty states
- [ ] Add a theme for business architecture use: neutral backgrounds, blue/green/amber/red accents, readable typography, and strong hierarchy.
- [ ] Implement navigation sections that map to the metamodel and business needs:
  - Dashboard
  - Organization
  - Strategy
  - Processes
  - Solutions
  - Applications
  - Integrations
  - Technology
  - Studio
  - Reports

### Output
- A working static app shell with all major sections available.
- A consistent design language for all modules.

## Phase 2 — Data layer and persistence

### Tasks
- [ ] Build a data store layer using plain JavaScript objects and browser storage.
- [ ] Create a schema for:
  - records
  - metamodel metadata
  - custom property definitions
  - page layouts
  - chart definitions
  - saved views
  - relationships
- [ ] Add record ID generation and validation.
- [ ] Add import/export support for user data and custom model extensions.
- [ ] Keep CSV metamodel data read-only and separate from user-created data.
- [ ] Define a local storage structure versioning strategy.
- [ ] Add graceful handling for missing or malformed data.

### Output
- A robust client-side data layer with persistence and safe fallback states.

## Phase 3 — Records, forms, and CRUD flows

### Tasks
- [ ] Build a generic class browser that lists records by class.
- [ ] Build a searchable, filterable record list view for each class group.
- [ ] Implement generic create/edit forms that display:
  - field labels
  - text inputs
  - numeric fields
  - datetime fields
  - lookup selectors
  - relationship selectors
- [ ] Add form validation for required values and invalid references.
- [ ] Add hints and help text for each custom property and relationship-aware field.
- [ ] Build record detail pages with summary and related-record panels.
- [ ] Support simple relationship creation between records.
- [ ] Add a form designer that can map custom properties to the right input component.

### Output
- A reusable CRUD layer for metadata-driven records.
- Empty state and validation flows for record editing.

## Phase 4 — Studio extension engine

### Tasks
- [ ] Add a Studio section where users can define new properties for a selected model class.
- [ ] Implement property types:
  - text
  - number
  - datetime
  - lookup
- [ ] Allow users to set:
  - property name
  - key / identifier
  - type
  - description
  - default value
  - lookup target or option list
- [ ] Persist custom property definitions in local storage.
- [ ] Extend dynamic forms to render custom properties automatically.
- [ ] Add lookup validation and support for class-based or explicit-option lookup references.
- [ ] Add a way to review current custom fields and remove or update them safely.
- [ ] Ensure custom property definitions do not modify 
### Output
- A usable Studio for metadata extension and custom property management.

## Phase 5 — Page builder and visualization studio

### Tasks
- [ ] Allow users to create or modify pages by selecting a class and a layout template.
- [ ] Support page sections such as:
  - summary KPI cards
  - table list
  - record form
  - relationship map
  - chart panel
- [ ] Add a simple visual builder that chooses fields, sections, and arrangement.
- [ ] Implement chart configuration using actual record data:
  - bar
  - pie
  - line
  - donut
  - timeline
- [ ] Allow chart definitions to be stored and re-used.
- [ ] Add a page preview mode to test configured views before saving.

### Output
- A page and chart configuration experience for non-developers.

## Phase 6 — Strategy, organization, and capability views

### Tasks
- [ ] Create an organization model view with units, people, roles, and ownership.
- [ ] Create strategy views for goals, initiatives, and business capabilities.
- [ ] Add business process and solution modeling views backed by stored records.
- [ ] Show relationships between capability, process, application, and technology objects.
- [ ] Add navigation that reflects metamodel relationships rather than random hard-coded pages.
- [ ] Include relationship panels that show both upstream and downstream links.

### Output
- Business-user-friendly views for strategy and organizational architecture.

## Phase 7 — Applications, integrations, and technology catalog

### Tasks
- [ ] Build application catalog views with ownership, lifecycle, and dependency metadata.
- [ ] Build integration catalog views showing source, target, connectivity, and relation labels.
- [ ] Surface technology stack items and platform dependencies.
- [ ] Add relationship-driven discovery for application-to-application and application-to-technology links.
- [ ] Add filtering by class, owner, domain, status, and tag when available.

### Output
- Catalogs and relationship views for applications, integrations, and technology assets.

## Phase 8 — Planning workspaces: Kanban, Gantt, and dashboards

### Tasks
- [ ] Add a Kanban view for records with status-oriented fields.
- [ ] Add a Gantt or timeline view for records with start/end dates and dependencies.
- [ ] Build KPI cards based on actual data and user-defined metrics.
- [ ] Implement dashboard widgets for:
  - portfolio counts
  - status distribution
  - owners and responsibilities
  - overdue/due items
  - active risks
  - application/integration counts
- [ ] Add chart panels for actual record sets and metadata-driven aggregations.
- [ ] Add controls to switch between records and views.

### Output
- Operational planning views that support initiative tracking and executive overview.

## Phase 9 — Visual analytics and charts

### Tasks
- [ ] Add lightweight charting using HTML/CSS/JS only.
- [ ] Support at least the following chart types:
  - bar chart
  - line chart
  - donut chart
  - pie chart
  - simple timeline or progress chart
- [ ] Compute values from current record sets, not static placeholder numbers.
- [ ] Allow a dashboard panel to choose dataset, measure, and grouping dimension.
- [ ] Provide clear empty-state messaging when no data exists for a chart.

### Output
- A chart library that works with stored data and custom property fields.

## Phase 10 — Validation, polish, and smoke testing

### Tasks
- [ ] Smoke-test the app by opening `index.html` in a browser.
- [ ] Verify metamodel parsing does not break on BOM or multiline fields.
- [ ] Verify create/edit/delete flows for records and relationships.
- [ ] Verify custom property definitions persist after reload.
- [ ] Verify page and chart configurations persist after reload.
- [ ] Validate empty states, duplicate values, and invalid references.
- [ ] Verify responsive layout and keyboard navigation.
- [ ] Ensure no code uses unsafe HTML injection with untrusted data.
- [ ] Confirm the app remains static and dependency-free.

### Output
- Stable app shell with a credible end-to-end user flow.

## Suggested file structure

```text
EATool/
  index.html
  css/
    styles.css
    app-shell.css
    dashboard.css
    forms.css
    kanban.css
    gantt.css
    studio.css
  js/
    app.js
    storage.js
    metamodel.js
    records.js
    forms.js
    studio.js
    dashboard.js
    charts.js
    utils.js
  data/
    sample-data.js
  assets/
    icons/
    images/
```

## Acceptance criteria

The implementation is complete when the following are true:

- [ ] The app loads without a build or backend.

- [ ] Users can create, view, edit, and filter enterprise records.
- [ ] Users can define custom text, number, datetime, and lookup properties in Studio.
- [ ] Users can create or modify pages and dashboards for a selected class or record set.
- [ ] Users can view data through dashboards, charts, Kanban, and schedule views.
- [ ] Applications, integrations, and technology objects can be related through the metamodel-driven views.
- [ ] Data persistence survives reload using browser storage.
- [ ] The app is understandable to business users and not only developers.

## Suggested implementation order

1. Metamodel loader and storage layer
2. Generic record CRUD and forms
3. Studio custom field engine
4. Dashboard and charting
5. Planning views (Kanban/Gantt)
6. Modeling views for organization/strategy/processes/applications/integrations
7. UI polish and validation

## Notes to the vibe-coding agent

- Favor small, testable modules over a giant script.
- Reuse dynamic patterns for forms and dashboards wherever possible.
`localStorage` as the project’s primary runtime data sources.
- When the CSV does not explicitly define a field, treat it as a user-extension opportunity rather than inventing a magic schema.
- Keep the code simple, readable, and easy to adjust as the model expands.
