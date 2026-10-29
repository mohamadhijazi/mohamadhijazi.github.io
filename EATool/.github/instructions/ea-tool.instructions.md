---
description: "Use when building or changing the EA Tool: a vanilla HTML, CSS, and JavaScript enterprise-architecture app driven by MetaModel.csv, business data entry, modeling, dashboards, and the customizable Studio."
applyTo: "**"
---

# EA Tool Vibe-Coding Instructions

## Product goal

Build a browser-based enterprise architecture workspace for business users to manage organization, strategy, processes, solutions, applications, integrations, and technology. Users should be able to enter and relate architecture data, model processes and solutions, track work, explore dashboards, and tailor their own fields, pages, and visualizations.

## Technology and implementation

- Use semantic HTML, modern CSS, and vanilla JavaScript. Do not introduce a framework, compiler, bundler, or dependency unless the user explicitly changes this requirement.
- Keep the app usable as a static client-side application. Use browser APIs and existing project conventions; do not assume a server or external service exists.
- Separate data/model logic, rendering, and interaction where practical. Prefer small, understandable modules and reusable UI patterns over a monolithic script.
- Make layouts responsive and accessible: use labels, keyboard-operable controls, visible focus, adequate contrast, and meaningful headings.
- Preserve existing behavior and visual conventions when changing the app. Make focused changes and validate the actual requested behavior.

## Metamodel is the source of truth

-
- The CSV has these columns: `A_COMMENTS`, `CAPTION`, `CARDINALITY`, `CREATION_DATE`, `HINT`, `LAST_UPDATE`, `RELATION`, `SOURCE_CLASS`, `SOURCE_CLASS_CAPTION`, and `TARGET_CLASS`.
- Treat each row as a relationship definition from `SOURCE_CLASS` to `TARGET_CLASS`. Use `SOURCE_CLASS_CAPTION` and `CAPTION` for readable names, `RELATION` as the relationship identifier, `HINT`/`A_COMMENTS` as help text when present, and preserve the original `CARDINALITY` value. The file describes relationships; do not assume it defines every class attribute or field type.
- Load and parse the CSV as data, not executable markup. Handle the UTF-8 BOM, quoted fields, commas, escaped quotes, and empty values correctly. Do not split rows or columns naively on commas.
- Derive the available class and relationship catalogue from the CSV. Keep internal identifiers distinct from display captions, preserve duplicate-looking rows when their source, target, or relation differs, and do not silently discard unknown classes or cardinality values.
- Make CSV loading failures visible to the user with a useful message and recovery path. Do not silently substitute a partial or hard-coded metamodel.
- Keep built-in metamodel definitions read-only. Additions made in Studio are user extensions layered over the CSV, not edits to or rewrites of the source file.

## Business data and relationships

- Provide model-driven lists, detail views, and forms for entities and their relationships. Render fields and relationship controls from the available metadata and user extensions rather than maintaining disconnected hard-coded versions of the same model.
- Let business users create, view, edit, search, filter, and relate records. Display human-friendly captions while retaining stable identifiers for storage and links.
- Respect relationship direction and the CSV's cardinality metadata in selectors and editing flows. Where cardinality semantics are not clear, show the raw metadata and avoid inventing stricter validation.
- Organize navigation and examples around organization, organizational units, strategy, business capabilities, goals, processes, solutions, applications, integrations, and technology. Map these concepts to classes found in the CSV; do not fabricate metamodel classes just to match a screen.
- Make forms understandable to non-technical users with clear labels, helpful hints, required-state cues where justified by metadata, and field-level validation.

## Studio: extend and shape the workspace

- Provide a Studio for adding user-defined properties to selected classes. Support at minimum text, number, datetime, and lookup fields. Each property needs a stable identifier, display name, type, optional description, and type-appropriate configuration.
- Configure lookups to reference a chosen class or an explicit option list; validate that the selected target exists. Use date/time-aware inputs and preserve numbers as numbers.
- Keep custom property definitions separate from CSV metadata. Show how extensions affect generated forms, detail pages, filters, and charts, and preserve existing record values when a property is edited or removed.
- Allow users to create and modify pages by choosing a class, fields, layout, and supported components. Allow them to configure visualizations by selecting a data source, dimensions, measures, and chart type where the data supports it.
- Persist user-created metadata, page layouts, and visualization configuration across reloads using the project's existing persistence mechanism. If none exists, use a small versioned `localStorage` store and provide an explicit export/import path for user data. Never overwrite the source CSV.

## Core workspace experiences

- **Forms and browsing:** entity lists, searchable/filterable tables or cards, create/edit forms, and useful record detail views with related records.
- **Organization and strategy:** navigable organization structures and links between organizational units, goals, capabilities, and initiatives where supported by the metamodel.
- **Process and solution modeling:** visual, editable representations of process steps and solution components with explicit links to their underlying records. Keep diagrams understandable and keyboard-accessible; do not make a canvas the only way to inspect or edit data.
- **Applications and integrations:** catalog views and relationship views that make application ownership, connected systems, and integration paths discoverable using the modeled relationships.
- **Kanban and Gantt:** provide a Kanban board for records with a configured status field and a Gantt/timeline for records with suitable start/end dates and dependencies. Do not invent status or schedule fields silently; use configured/custom fields or clearly label example data.
- **Dashboards and charts:** show useful summaries and charts based on actual stored records and selected fields. Recompute from data; avoid hard-coded KPI values presented as live results. Include empty, loading, and error states.

## Data integrity and safety

- Use stable record IDs and validate references before saving. Keep user data, custom schema, and presentation configuration logically separate.
- Escape or safely render user-entered text; never inject untrusted values as HTML. Avoid `eval` and dynamic code generation.
- Clearly distinguish sample/demo records from business-entered records, and provide sensible empty states rather than implying fabricated data is real.
- Handle malformed imported data, missing fields, stale lookup targets, and storage failures explicitly. Do not silently lose data or report success after a failed save.
- Do not add authentication, permissions, integrations, or claims of server-side persistence unless the user asks for them and the project supports them.

## Delivery workflow

1
2. Identify which metamodel classes and relationships support the requested experience. Call out gaps rather than inventing schema.
3. Implement the smallest complete vertical slice, wiring its model, UI, validation, and persistence together.
4. Verify the app loads the CSV, and test the requested user flow including empty/error states and reload persistence when applicable.
5. Update directly related documentation when behavior or setup changes. Summarize changed files and validation performed.
