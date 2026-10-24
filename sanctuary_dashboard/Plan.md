# Sandbox & Sanctuary: Review and Product Plan

**Reviewed:** 2026-10-24  
**Current entry point:** `sandbox_sanctuary_dashboard.html`

## Product intent

Sandbox & Sanctuary is designed around a shift some men experience as they mature: balancing a need for predictability, focus, and a controlled personal foundation with a desire to experiment, build, and exercise agency in a wider arena. This is the product's design premise, not a claim that every man has the same needs.

The application should help users move across three connected layers:

1. **Sanctuary - control and focus:** a predictable, low-friction personal workspace for daily energy and friction check-ins, clear boundaries, routines, and private creative work.
2. **Sandbox - systems and expansion:** a structured place to mature selected ideas into blueprints for larger systems, with components, milestones, and long-term outcomes.
3. **Trusted collaboration:** a deliberate way to engage family, friends, and peers through clear roles and ownership, while keeping the work purposeful and the core architecture legible.

The bridge between these layers is the central workflow: protect focus in the Sanctuary, develop an idea privately, choose when it is ready, then promote it into a Sandbox blueprint with an intentional scope and invited collaborators. Sanctuary data stays private by default. Promoting an idea must never expose personal check-ins or private notes automatically.

The first release can be a framework-free, single-user web app. Local records can model people and roles for planning, while Sandbox-only JSON packages support deliberate manual exchange. They do not provide accounts, access control, live co-editing, or cross-device synchronization. Browser `localStorage` is not encrypted or account protected. Real shared collaboration requires a backend and an explicit sharing model.

## Review of the current HTML

The current page has a dark dashboard shell, Sanctuary and Sandbox modes, routine cards, a private lab, initiative cards, category filters, modal forms, and sample records. This already expresses the product's core two-space concept and is a useful visual starting point.

Key findings:

1. **The current JavaScript does not parse.** Around line 600, `function filterCategory = 'all';` is invalid syntax. The browser cannot execute the script, so initialization and all inline handlers declared in it fail.
2. **The app is one 770-line document.** Markup, Tailwind configuration, CSS, sample records, state, rendering, and event handling all live in `sandbox_sanctuary_dashboard.html`.
3. **Styling and icons rely on external runtime scripts.** Tailwind is loaded from a CDN, with Lucide and Google Fonts also external. A vanilla implementation should use local CSS, system-font fallbacks, and inline SVG or text icons.
4. **The distinctive personal foundation is only a sketch.** The cognitive-friction slider is not saved by day and has only a noise value; there is no separate energy/bandwidth check-in, review history, configurable routine, or explicit boundary between operational work and creative time.
5. **The private lab is too shallow for idea development.** It stores a title, tag, notes, and a promoted flag, but has no maturity/review state, iteration history, or privacy-specific controls.
6. **Sandbox cards track arbitrary progress, not systems.** The current progress button adds ten points. Blueprints have no structured system model, building blocks, milestones, success criteria, or long-term outcomes.
7. **Collaboration is decorative rather than operational.** Initials and collaborator labels do not define ownership, scope, decision rights, or actual access. The prototype has no collaboration backend.
8. **Some metrics are hard-coded and inconsistent.** For example, the banner says four shared projects while the sample array contains three. Stability and collaborator counts are also sample text rather than calculated values.
9. **Changes disappear on refresh.** Routines, lab entries, initiatives, and progress are kept only in in-memory arrays. No local persistence or data portability is provided.
10. **Existing records cannot be managed fully.** Users can add initiatives and lab entries, but cannot edit or archive them. Sandbox has category filters but no search, stage/status filters, or sorting.
11. **Rendering needs safe text handling.** User-entered values are interpolated into `innerHTML`; render user content as text so it cannot be interpreted as markup.
12. **Accessibility and feedback need work.** Clickable routine rows are `div` elements, dialogs lack expected keyboard/focus behavior, and actions have limited feedback. Use semantic buttons and forms, accessible dialog behavior, visible focus, and clear confirmation and error states.

## Product requirements

### 1. Sanctuary: a grounded private workspace

- **Daily energy and friction check-in:** Let the user record available bandwidth/energy and external friction/noise separately, with a date and optional private reflection. Show the current check-in and a simple recent trend so the user can decide what kind of work fits today.
- **Actionable, non-clinical guidance:** Offer user-configurable prompts such as choosing deep work, routine work, or rest/recovery when bandwidth is low. Treat the meter as a personal planning aid; do not diagnose burnout or make medical claims.
- **Privacy by default:** Keep check-ins, private reflections, and unpromoted lab work visible only in the Sanctuary. Exclude them from Sandbox cards, collaborators, exports intended for sharing, and promotion unless the user explicitly selects content.
- **Private innovation lab:** Create and iterate on ideas, architecture concepts, personal models, and side projects without comments or unsolicited critique. Support draft, exploring, ready to review, promoted, and archived states, with iteration notes and dates.
- **Structured routines and boundaries:** Allow the user to define routines and rules that protect core operational responsibilities and creative time. Track routine completion for the day and make the boundary between "daily grind" and "creative output" explicit and adjustable.

### 2. Sandbox: systemic design and expansion

- **Blueprint promotion:** Let the user deliberately promote a selected lab idea into a Sandbox blueprint. Show a review step where they choose the title, purpose, description, and any notes to share. Preserve the private source entry and its private notes.
- **Systemic modeling:** Organize a blueprint around vision/outcome, major systems, building blocks, dependencies, milestones, success measures, and open decisions. Emphasize architecture and long-term structure over micromanaging every small daily task.
- **Blueprint lifecycle:** Give blueprints clear stages such as concept, shaping, active, paused, complete, and archived. Let users add or revise milestones and update stage/progress based on milestone state instead of an arbitrary increment button.
- **High-level portfolio view:** Show what is active, what is blocked or waiting, upcoming milestones, and which blueprints are ready for review. Search, filter, and sort without turning the view into a noisy task feed.

### 3. Trusted collaboration: purposeful ownership

- **Family projects:** Support blueprints for shared long-term work such as a home workshop, family trip, or legacy asset. Make the desired outcome, contributors, and ownership visible.
- **Peer and mentor circles:** Support high-level technical, strategic, or creative blueprints where trusted peers can have a defined feedback, co-creation, or advisory role.
- **Role-based agency:** Provide explicit roles such as **Architect**, **Builder**, and **Advisor**. Each blueprint should state who owns the core architecture, what each role can contribute, and which milestones or areas they own.
- **Purposeful interaction:** Let the owner manually capture feedback, co-creation, and advisory input from trusted conversations, link each note to a system, milestone, or decision, and mark it as considering, incorporated, or parked. Keep these notes tied to the blueprint; do not make unstructured chat a requirement.
- **Control and agency together:** Preserve the architect's ability to maintain the core blueprint while giving family members and peers clear, meaningful ownership within agreed boundaries.
- **Honest prototype behavior:** In a local-only release, show assigned people and roles as planning records, not as signed-in or connected collaborators. Invitations, shared editing, comments, notifications, and access control belong to a later server-backed phase.

## Suggested information architecture

- **Sanctuary** is the default landing space: today's check-in, protected routines/boundaries, and private lab.
- **Sandbox** is the broader portfolio: blueprint overview, systems, milestones, ownership, and review points.
- **Promote to Blueprint** is the explicit bridge between the spaces; it shows exactly what will become part of a shared blueprint.
- Keep the names **Sanctuary**, **Sandbox**, **Private Innovation Lab**, and **Blueprint**. Explain them with plain-language subtitles so new business users understand the purpose without losing the product's identity.

## Proposed file structure

```text
sanctuary_dashboard/
|-- index.html
|-- Plan.md
`-- assets/
    |-- css/
    |   |-- tokens.css          # colors, spacing, typography, focus styles
    |   |-- layout.css          # page structure and responsive layout
    |   `-- components.css      # cards, sliders, forms, dialogs, buttons
    `-- js/
        |-- app.js              # startup and view coordination
        |-- state.js            # state updates and derived summaries
        |-- storage.js          # versioned local storage and JSON portability
        |-- events.js           # event delegation and form actions
        |-- render.js           # safe DOM rendering and shared UI
        |-- utils.js            # IDs, validation, dates, formatting
        |-- sanctuary/
        |   |-- checkins.js     # energy/friction entries and trends
        |   |-- routines.js     # daily routines and personal boundaries
        |   `-- lab.js          # private ideas, iterations, promotion
        `-- sandbox/
            |-- blueprints.js   # blueprint lifecycle and system model
            |-- milestones.js   # milestone planning and completion
            |-- inputs.js       # captured feedback, co-creation, and advisory notes
            `-- roles.js        # Architect, Builder, Advisor assignments
```

Use local `<link rel="stylesheet">` files and native ES modules, starting with `<script type="module" src="assets/js/app.js"></script>`. Do not add a JavaScript framework, runtime CSS framework, or required third-party service. Serve the files from a static web server such as GitHub Pages; ES modules may not load when opened directly through `file://`.

## Data model direction

Keep private Sanctuary data separate from Sandbox blueprint data in both the model and rendering paths. Use stable IDs and explicit states. A starting point:

```js
{
  version: 1,
  sanctuary: {
    checkIns: [
      { id: "checkin-…", date: "2026-10-24", energy: 65, friction: 25, privateNote: "…" }
    ],
    routines: [
      { id: "routine-…", title: "Protected creative hour", boundary: "Creative time", completedDates: [] }
    ],
    labEntries: [
      {
        id: "idea-…", title: "Family workshop plan", state: "exploring",
        privateNotes: "…", iterations: [], promotedBlueprintId: null
      }
    ]
  },
  sandbox: {
    blueprints: [
      {
        id: "blueprint-…", sourceIdeaId: null, title: "Shared workshop",
        purpose: "Create a place for family projects", stage: "shaping",
        outcome: "…", successMeasures: [], systems: [], milestones: [], inputs: [], decisions: [],
        roles: [
          { personId: "person-…", displayName: "Family member", role: "builder", ownership: "Workshop layout" }
        ]
      }
    ]
  }
}
```

The ellipses are placeholders; generate IDs and timestamps in the app. In particular, a promotion operation must copy only user-approved fields, must not copy `privateNote`/`privateNotes`, and must leave the source lab entry available in the Sanctuary.

## Implementation phases

### Phase 1 - Repair and separate the prototype

- Fix the invalid `filterCategory` declaration so the existing JavaScript parses.
- Move the page into `index.html`, styles into local CSS, and application behavior/data into native JavaScript modules.
- Replace Tailwind utility classes with semantic CSS classes and responsive rules. Remove required runtime CDN dependencies and use inline SVG or text icons.
- Replace inline `onclick`/`onsubmit` attributes with event listeners.
- Render user-provided content safely and adopt semantic, keyboard-operable controls.

### Phase 2 - Complete the Sanctuary

- Implement separate daily energy and friction check-ins, private notes, recent history, and simple trends.
- Add editable routines and boundary rules that distinguish operational responsibilities from protected creative work.
- Expand the private lab with draft/exploring/review states, iteration history, and archive behavior.
- Keep this layer quiet, personal, and private; do not add unsolicited critique or collaboration controls here.

### Phase 3 - Build the Sandbox blueprint model

- Define blueprint stages, systems/building blocks, dependencies, milestones, outcomes, and decision notes.
- Replace arbitrary progress increments with milestone-derived status and meaningful stage transitions.
- Add portfolio search/filter/sort and a review view for blocked work, upcoming milestones, and blueprint decisions.

### Phase 4 - Implement the bridge and role-based collaboration model

- Add an explicit promotion review that lets the user choose which idea content becomes a blueprint.
- Add ownership and Architect/Builder/Advisor roles, with each person's scope and owned milestone visible.
- Let the blueprint owner capture and review input from offline family, friend, and peer conversations without implying the named people have app access.
- Seed family-project and peer/mentor scenarios so sample data demonstrates meaningful agency and clear system ownership.
- Keep local collaborators clearly labeled as planned participants. Defer real invitations and shared editing until a backend exists.

### Phase 5 - Persistence, portability, and privacy

- Save versioned app state in `localStorage`; keep Sanctuary and Sandbox records separated.
- Add JSON export/import with validation and a warning before replacing data. Clearly label exports that contain private Sanctuary material; offer a Sandbox-only export for sharing.
- Handle missing, unavailable, or malformed storage with a readable message and a usable in-memory session.
- Explain that data stays in this browser and is not synchronized to other devices or people.

### Phase 6 - Responsive and accessible polish

- Refine narrow-screen layouts, validation, focus management, dialogs, confirmations, visible keyboard focus, and assistive-technology status messages.
- Check that the meters have labels and explain what their values mean; do not rely on color alone.
- Review the three layers with realistic Sanctuary, family blueprint, and peer/mentor examples.

## Acceptance criteria without testing

- The app starts without JavaScript syntax errors and works as static files using native HTML, CSS, and JavaScript with no framework or build step.
- The Sanctuary supports dated energy/friction check-ins, configurable routines/boundaries, and private lab entries that remain private by default.
- A private idea can be promoted through an explicit review into a structured blueprint; private notes and check-ins are not copied.
- Blueprints capture systems, building blocks, milestones, long-term outcomes, and meaningful stages; progress reflects milestone state.
- A blueprint can assign Architect, Builder, and Advisor roles with visible areas of ownership. Local participant records are not presented as live collaboration.
- Blueprint owners can record feedback, co-creation, and advisory notes against a system or milestone and track whether each input is being considered, incorporated, or parked.
- Search and portfolio summaries reflect saved records; metrics are derived rather than hard-coded.
- Records survive refresh in the same browser and can be exported/imported with validation and clear privacy choices.
- User-entered content is rendered as text, and core interactions work by keyboard on desktop and mobile layouts.
- Copy presents the product as a bridge from predictable personal focus to intentional family/peer system building, without framing the app as a clinical tool.

## Suggested delivery order

Repair and modularize the prototype first. Then deliver Sanctuary privacy, check-ins, routines, and the private lab; build the structured Sandbox blueprint model; connect them through explicit promotion and role-based ownership; and finish with persistence, portability, and accessibility polish. Keep actual cross-user collaboration as a separate backend-enabled milestone.
