# 06. Planning Module Implementation Guide

## Objective
Implement planning workflows using timelines, milestones, goals, and task boards.

## Frontend Scope
- goal list
- timeline view
- Gantt-like board
- Kanban board
- milestone status cards

## Backend Scope
- Goal entity
- Milestone entity
- Task entity
- planning query services
- planning command handlers

## Frontend Code Sample
```html
<div id="planning-app"></div>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script type="module">
  const { createApp } = Vue;

  createApp({
    data() {
      return { goals: [] };
    },
    mounted() {
      this.loadGoals();
    },
    methods: {
      async loadGoals() {
        const res = await fetch('/api/planning/goals');
        this.goals = await res.json();
      }
    },
    template: `<div><h3>Planning Goals</h3><ul><li v-for="g in goals" :key="g.id">{{ g.title }}</li></ul></div>`
  }).mount('#planning-app');
</script>
```

## Backend Code Sample
```csharp
public class GoalItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = "Planned";
    public string WorkspaceId { get; set; } = string.Empty;
}
```

```csharp
[ApiController]
[Route("api/planning")]
public class PlanningController : ControllerBase
{
    private readonly AppDbContext _db;

    public PlanningController(AppDbContext db) => _db = db;

    [HttpGet("goals")]
    public async Task<IActionResult> GetGoals() => Ok(await _db.Goals.ToListAsync());
}
```

## Data Model
- Goal
  - Id
  - Title
  - Description
  - Status
  - StartDate
  - EndDate
  - WorkspaceId

## API Endpoints
- GET /api/planning/goals
- POST /api/planning/goals
- PUT /api/planning/goals/{id}
- GET /api/planning/tasks
- POST /api/planning/tasks

## Implementation Notes
- This module should consume shared workspace context.
- Avoid direct coupling with finance or risk modules.
- Goal states should be reusable for dashboards and AI workflows.

## Deliverables
- planning UI implemented
- goals and tasks persisted
- planning views added
- APIs exposed for downstream modules

## Audit Review and Fixes
- Gap: planning features were too conceptual. Fix: the module now includes concrete goal, milestone, and task entities.
- Gap: downstream reuse was unclear. Fix: planning data must be consumable by dashboards, AI workflows, and risk modules through shared APIs.
- Gap: dependency risk was high. Fix: the module may read shared workspace state but must not directly depend on finance or risk code.

## Acceptance Criteria
- Users can create goals and tasks and view them in planning views.
- Planning data is stored through the backend and available to other modules via API.
- The module works with shared workspace context and permissions.
