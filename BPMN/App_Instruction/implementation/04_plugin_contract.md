# 04. Plugin Contract Specification

## Objective
Standardize how each feature module is implemented so all plugins can be developed independently.

## Technology Baseline
Every plugin must follow the same pattern:
- frontend entry point in plain JavaScript or Vue-compatible UI code without npm
- backend entry point in ASP.NET Core controllers/services
- persistence through Entity Framework Core with MySQL

## Plugin Structure
Each plugin must contain:
- frontend entry point
- backend API surface
- domain models
- persistence layer
- configuration object
- route registration

## Required Plugin Manifest
```json
{
  "id": "calendar",
  "name": "Calendar",
  "entryPoint": "./frontend/index.js",
  "apiBasePath": "/api/calendar",
  "permissions": ["read:events", "write:events"],
  "enabledByDefault": true
}
```

## Plugin Lifecycle
1. register plugin manifest
2. load frontend module
3. initialize backend services
4. expose routes and widgets
5. handle permissions and settings

## Communication Rules
- plugins must not directly import other plugins
- use shared services and event contracts
- use APIs for cross-module data access

## Deliverables
- plugin manifest format defined
- registration pattern finalized
- plugin lifecycle documented
- module isolation rules agreed

## Audit Review and Fixes
- Gap: plugin boundaries were underspecified. Fix: each plugin now has a defined manifest, frontend entry point, backend API surface, and route registration.
- Gap: isolation rules were not explicit. Fix: plugins cannot directly import other feature modules and must communicate via contracts, APIs, or shared events.
- Gap: extensibility requirements were implied only. Fix: plugin versioning and lifecycle stages are now part of the contract.

## Acceptance Criteria
- Any new module can be dropped into the platform with a manifest and frontend/backend entry points.
- Plugin loading does not produce CSS or JavaScript conflicts with the core shell.
- Modules can be enabled, disabled, and updated independently.

## Anti-Overlap and Anti-Circular Rules
- A plugin may depend on the shared layer and the core shell, but not on another plugin’s implementation code.
- Each plugin should own one business domain only.
- Cross-plugin behavior must be expressed through shared contracts, events, or API calls.
- If a requirement could be satisfied by multiple modules, assign one owner and expose the result through shared interfaces.
- Examples of ownership: calendar owns events, finance owns financial records, collaboration owns workspace membership, notifications owns delivery.
