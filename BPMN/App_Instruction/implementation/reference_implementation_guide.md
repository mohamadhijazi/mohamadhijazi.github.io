# Reference Implementation Guide

## Purpose
This document is the single reference for implementation decisions. It connects the business features described in the product brief to the required technology stack and the modular implementation structure.

## Core Technology Baseline
- Frontend: vanilla JavaScript first, with optional Vue-based UI widgets loaded without npm.
- Backend: ASP.NET Core Web API and server-rendered ASP.NET Core pages for the public landing experience.
- Database: MySQL with Entity Framework Core.
- Authentication: Google and Microsoft OAuth/OpenID Connect.
- Storage integration: Google Drive and Microsoft OneDrive folder access through explicit user consent.
- Architecture: plugin-based modular system where each feature is implemented independently.

## Business Feature to Module Mapping

### 1. Calendar and Life Planning
- Module: Calendar
- Frontend: calendar UI, event cards, filters, reminders
- Backend: events, recurring events, reminder jobs
- Data: MySQL tables for events, reminders, categories

### 2. Planning and Execution
- Module: Planning
- Frontend: timelines, goals, Kanban, milestone views
- Backend: goals, tasks, milestones, planning services

### 3. Financial Planning
- Module: Finance
- Frontend: dashboard, obligations, forecast views
- Backend: financial entries, scenarios, obligations

### 4. Risk and Resilience
- Module: Risk
- Frontend: risk matrix, scenario analysis, impact view
- Backend: risks, scenarios, impact models

### 5. Knowledge and Biography
- Module: Knowledge
- Frontend: library view, content organization, biography timeline
- Backend: knowledge items, categories, biography entities

### 6. Collaboration and Shared Workspaces
- Module: Collaboration
- Frontend: workspaces, roles, shared views, invites
- Backend: workspace membership, roles, invitations

### 7. AI Playground
- Module: AI Playground
- Frontend: chat UI, provider settings, module preview
- Backend: provider configurations, generation services, prompt templates

### 8. Data Integration and Dashboards
- Module: Data ETL
- Frontend: connectors, transforms, preview table
- Backend: import jobs, transformations, data sources

### 9. Notifications and Reminders
- Module: Notifications
- Frontend: notification center, preferences
- Backend: jobs, email integration, scheduled reminders

### 10. Maps and Location Planning
- Module: Maps
- Frontend: map view, location pins
- Backend: locations and bookmarks

### 11. Personalization and Settings
- Module: Settings
- Frontend: user preferences, theme, providers, consent UI
- Backend: settings, integration configs, consent state

### 12. Social Context, Family, Friendship, and Live Intelligence
- Module: Knowledge + Calendar + Notifications
- Frontend: social contribution reminders, family and friendship context cards, live feed widgets, external event awareness panels
- Backend: social context entries, reminder rules, feed ingestion service, external event enrichment service
- Data: social_context_entries, feed_sources, feed_items, event_enrichment_rules

This area must explicitly support:
- moral, family, friendship, and social contribution reminders
- external events such as news, weather, economic, political, and regional/global developments
- population of relevant data into the user’s planning and notification experience through scheduled or event-driven ingestion

## Frontend Implementation Rules
- Use plain JavaScript first.
- Use Vue-compatible components only when necessary and without npm.
- Each plugin should expose a frontend entry point and register routes/widgets.
- The shell should load modules dynamically.
- The landing page must be server-rendered using ASP.NET Core views or Razor pages to support SEO, fast first paint, and strong marketing presentation.
- UI must be clean, modular, and theme-aware.

## Backend Implementation Rules
- Use ASP.NET Core Web API.
- Use Entity Framework Core with MySQL.
- Each module should expose its own controller/service layer.
- Cross-module communication should happen through shared contracts, APIs, or events.
- Sensitive operations should require authentication and proper authorization.

## Security and Consent Rules
- Google and Microsoft login must be supported.
- Folder access to Google Drive and Microsoft OneDrive must be requested through explicit client-side consent.
- Only the minimum required scopes should be requested.
- Consent actions must be clear and explain what folders or data will be accessed.

## Recommended MVP Scope
Start with these modules first:
1. Core shell
2. Calendar
3. Planning
4. Finance
5. Settings

The landing page must also be implemented in this MVP as a server-rendered experience that communicates the product vision, core value proposition, key benefits, sign-in options, and trust signals.

These modules provide immediate value and establish the plugin foundation for later expansion.

## Implementation Notes for Teams
- Build shared contracts first.
- Implement core shell before feature modules.
- Keep each module isolated.
- Do not create cross-module dependencies in UI code.
- Use the shared layer to expose reusable data contracts and services.
- The landing page should be treated as a business-critical entry point and implemented with server-side rendering from the start.
- The landing page must cover: problem statement, solution value, key capabilities, trust and privacy messaging, sign-in entry points, and a strong call to action.

## Full Audit Review Summary
- Gap: architecture guidance was too high-level. Fix: concrete module contracts, API surfaces, and acceptance criteria were added.
- Gap: module overlap risk was high. Fix: each feature now has clear ownership boundaries and shared integration rules.
- Gap: technology implementation was not explicit enough. Fix: the stack is now anchored around vanilla JavaScript, optional Vue via script inclusion, ASP.NET Core, EF Core, and MySQL.
- Gap: authentication and storage consent were under-specified. Fix: Google and Microsoft login and Drive/OneDrive consent flows are now explicit requirements.
- Gap: product experience coverage was incomplete. Fix: the server-rendered landing page is now treated as part of MVP delivery.

## Final Guardrails Against Loops and Overlap
- No circular module dependencies are allowed.
- Data ownership stays with the module that defines the business domain.
- Shared services are used for cross-domain actions such as notifications, permissions, and workspace context.
- Social context, family/friendship reminders, and live feed enrichment are treated as shared enrichment services rather than duplicated business modules.
- The implementation team should review each feature against this rule before development begins.
