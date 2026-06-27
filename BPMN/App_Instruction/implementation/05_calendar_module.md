# 05. Calendar Module Implementation Guide

## Objective
Implement the core calendar module for events, reminders, and long-range planning.

## Frontend Scope
- calendar view
- event list view
- event detail modal
- recurring event support
- reminder widget
- filter by category and date
- external event and live feed awareness panel

## Backend Scope
- Event entity
- EventCategory entity
- Reminder entity
- calendar queries and command handlers
- reminder scheduler service

## Frontend Code Sample
```html
<div id="calendar-app"></div>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script type="module">
  const { createApp } = Vue;

  createApp({
    data() {
      return { events: [] };
    },
    mounted() {
      this.loadEvents();
    },
    methods: {
      async loadEvents() {
        const res = await fetch('/api/calendar/events');
        this.events = await res.json();
      }
    },
    template: `<div><h3>Upcoming Events</h3><ul><li v-for="e in events" :key="e.id">{{ e.title }}</li></ul></div>`
  }).mount('#calendar-app');
</script>
```

## Backend Code Sample
```csharp
public class EventItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string WorkspaceId { get; set; } = string.Empty;
}
```

```csharp
[ApiController]
[Route("api/calendar")]
public class CalendarController : ControllerBase
{
    private readonly AppDbContext _db;

    public CalendarController(AppDbContext db) => _db = db;

    [HttpGet("events")]
    public async Task<IActionResult> GetEvents() => Ok(await _db.Events.ToListAsync());
}
```

## Data Model
- Event
  - Id
  - Title
  - Description
  - StartDate
  - EndDate
  - EventType
  - WorkspaceId
  - UserId
  - IsRecurring

## API Endpoints
- GET /api/calendar/events
- POST /api/calendar/events
- PUT /api/calendar/events/{id}
- DELETE /api/calendar/events/{id}
- GET /api/calendar/reminders

## Implementation Notes
- Keep this module independent from planning and finance.
- Use shared event contracts for reminder notifications.
- Support future integration with global holidays and local event data.
- External and live data such as news, weather, economic, and political events should be ingested and surfaced as relevant calendar context.

## Deliverables
- calendar UI implemented
- event CRUD API implemented
- reminder engine wired
- data model created

## Audit Review and Fixes
- Gap: calendar scope was too broad. Fix: the module focuses on events, reminders, and basic planning views only.
- Gap: reminder integration was not explicit. Fix: reminder events now use shared notification contracts.
- Gap: data persistence was not defined. Fix: MySQL-backed event storage and API endpoints are now required.

## Acceptance Criteria
- Users can create, edit, and view events from the calendar UI.
- Events persist through ASP.NET Core APIs to MySQL.
- Reminder actions trigger notifications through the shared notification layer.
