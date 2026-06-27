# 01. Solution Structure

## Objective
Define the high-level implementation structure for the application so teams can build in parallel without conflicting ownership.

## Technology Baseline
- Frontend: vanilla JavaScript first, with optional Vue-based UI widgets loaded without npm or a bundler.
- Backend: ASP.NET Core Web API and server-rendered landing experience.
- Data layer: Entity Framework Core with MySQL.
- Authentication: Google and Microsoft sign-in.
- Storage consent: user-owned content must be stored in the user’s Google Drive or Microsoft OneDrive folder after explicit consent, and access tokens must remain in the client-side consent flow rather than being stored on the server as the primary credential.
- Plugins must expose both frontend and backend entry points.

## Solution Layout
```text
apps/
  web/
  api/
modules/
  calendar/
  planning/
  finance/
  risk/
  knowledge/
  collaboration/
  ai-playground/
  data-etl/
  notifications/
  maps/
  settings/
shared/
  contracts/
  models/
  events/
  security/
  utils/
```

## Responsibilities
- apps/web: shell, routing, plugin loading, theming
- apps/api: authentication, API orchestration, background jobs
- modules/*: isolated feature implementation
- shared/*: reusable models, contracts, utilities, event definitions

## Implementation Rules
- Each module owns its frontend and backend code.
- No cross-module UI code should be duplicated.
- Shared logic should live in shared/ and be consumed through contracts.

## Deliverables
- folder structure created
- routing registration pattern defined
- plugin manifest convention defined
- module ownership mapped to team members

## Audit Review and Fixes
- Gap: the structure lacked clear module boundaries. Fix: every feature is now assigned to its own module folder with frontend and backend subfolders.
- Gap: persistence strategy was too vague. Fix: the database context pattern and MySQL configuration are now documented.
- Gap: shared ownership was ambiguous. Fix: core shell, shared layer, and feature modules now have explicit responsibilities.

## Acceptance Criteria
- The solution can be built with isolated frontend/backend module folders.
- Each feature module can be added without restructuring the app shell.
- The architecture supports plugin registration, shared contracts, and MySQL persistence.

## Database Context Pattern
```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<EventItem> Events => Set<EventItem>();
    public DbSet<GoalItem> Goals => Set<GoalItem>();
    public DbSet<FinancialEntry> FinancialEntries => Set<FinancialEntry>();
}
```

## MySQL Configuration Example
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));
```
