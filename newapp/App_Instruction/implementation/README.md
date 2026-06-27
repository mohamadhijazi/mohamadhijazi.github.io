# Implementation Playbook

## Goal
This folder contains implementation-ready markdown documents for building the application as a modular platform. Each document is scoped so one team or developer can implement it independently with minimal overlap.

## Technology Baseline
- Frontend must use vanilla JavaScript as the default runtime.
- Vue can be used via CDN or direct script inclusion when a richer component experience is needed, but there must be no npm-based build step for the initial implementation.
- Backend must use ASP.NET Core Web API with Entity Framework Core.
- MySQL is the relational store for application metadata and module records, while user-owned content must be stored in the user’s Google Drive or Microsoft OneDrive folder after explicit consent.
- Each feature must be implemented as an isolated plugin module with a clear frontend entry point and backend API surface.
- User data for modules must be stored in the user’s Google Drive or Microsoft OneDrive folder after explicit consent, and accessed through client-token-based Drive/OneDrive APIs whenever possible.
- The application must also support Google and Microsoft login, profile management, reminder automation, ETL workflow, maps, dashboarding, BPMN.io-based workflow modeling, and knowledge/biography experiences.

## Reference Frontend Pattern (No npm)
```html
<div id="plugin-root"></div>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script type="module">
  const { createApp } = Vue;

  createApp({
    data() {
      return { items: [] };
    },
    mounted() {
      this.loadItems();
    },
    methods: {
      async loadItems() {
        const response = await fetch('/api/calendar/events');
        this.items = await response.json();
      }
    },
    template: `<div><h3>Calendar</h3><ul><li v-for="item in items" :key="item.id">{{ item.title }}</li></ul></div>`
  }).mount('#plugin-root');
</script>
```

## Reference Backend Pattern (ASP.NET Core + MySQL)
```csharp
[ApiController]
[Route("api/calendar")]
public class CalendarController : ControllerBase
{
    private readonly AppDbContext _db;

    public CalendarController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("events")]
    public async Task<IActionResult> GetEvents()
    {
        var events = await _db.Events.ToListAsync();
        return Ok(events);
    }
}
```

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<EventItem> Events => Set<EventItem>();
}
```

## How to Use These Docs
- Start with the solution structure document.
- Implement shared contracts before feature modules.
- Build the core shell before plugin modules.
- Each feature module should be implemented as its own isolated unit.

## Parallel Workstreams
- Core platform team: solution structure, shared layer, core shell, plugin contract
- Feature team A: calendar, planning, finance
- Feature team B: risk, knowledge, collaboration
- Feature team C: AI playground, data ETL, notifications
- Feature team D: maps, settings, integrations

## Delivery Rules
- No feature module may directly depend on another feature module for core behavior.
- All communication must happen via shared contracts, events, or APIs.
- UI and backend for each module must be implemented in a consistent structure.

## Final Architecture Guardrails
- One-way dependency model only: core shell -> shared layer -> feature modules.
- Feature modules must not import or call other feature modules directly.
- Each domain concept must have a single owner. Example: calendar owns events, planning owns goals/tasks, notifications owns delivery, and settings owns preferences.
- If two modules appear to overlap, the shared layer or a shared contract must own the integration rather than duplicating logic.
- The landing page is a presentation layer only and must not contain runtime business logic for the application shell.
- Social, family, friendship, and live-feed intelligence should be implemented as shared context and integration concerns, not as duplicated feature logic in multiple modules.
- User-owned content must be persisted in Google Drive or Microsoft OneDrive folders after explicit consent, not only in the application server database.
- The application must support OAuth-based consent flows and use scoped access tokens for Drive/OneDrive operations from the client side when possible.

## Audit Review and Fixes
- Gap: the original plan lacked explicit implementation discipline. Fix: each module now has a defined frontend scope, backend scope, API surface, and acceptance criteria.
- Gap: parallel delivery could create overlap. Fix: ownership boundaries and shared contracts are now documented so teams can work independently.
- Gap: technology choices were not anchored tightly enough. Fix: the documentation now explicitly requires vanilla JavaScript/Vue via script inclusion, ASP.NET Core, EF Core, and MySQL.

## Acceptance Criteria
- Each module can be implemented by a separate team without modifying another module’s core code.
- The app can run with a server-rendered landing page and plugin-based application shell.
- The solution supports Google and Microsoft sign-in plus consent-based Drive/OneDrive folder access.
- Modules can read and write user-owned content from the user’s Drive/OneDrive folders after consent, with access scoped to the minimum required permissions.
