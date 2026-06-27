# 02. Shared Layer Specification

## Objective
Define the reusable foundation for the entire platform.

## Technology Baseline
The shared layer must remain framework-agnostic enough to be consumed by the no-npm frontend and the ASP.NET Core backend. Shared contracts must be simple JSON-friendly models that can be used by both layers.

## Shared Components
### Contracts
- IUserContext
- IWorkspaceContext
- IPluginManifest
- IPluginRouteDefinition
- INotificationMessage
- IIntegrationConfig

### Models
- UserProfile
- Workspace
- WorkspaceMember
- AuditEntry
- PluginPackage
- ThemeSettings

### Events
- WorkspaceChanged
- UserLoggedIn
- NotificationTriggered
- PluginRegistered
- DataSourceUpdated

### Security
- permission definitions
- role-based access models
- auth token handling strategy
- storage consent handling rules
- client-side consent token storage guidance
- scoped folder-access permissions for Google Drive and Microsoft OneDrive

## Backend Shared Services
- AuthenticationService
- PermissionService
- NotificationDispatcher
- AuditService
- ThemeService

## Frontend Shared Services
- ApiClient
- AuthStore
- WorkspaceStore
- PluginRegistry
- ThemeManager

## Implementation Notes
- Shared contracts must be stable before feature modules begin.
- Avoid module-specific models in shared layer.
- Event payloads should remain small and versioned.

## Deliverables
- shared contracts defined
- shared models created
- shared event bus pattern defined
- security interfaces documented

## Audit Review and Fixes
- Gap: shared structure was too generic. Fix: shared contracts, models, events, and security abstractions are now explicitly defined.
- Gap: cross-module communication rules were unclear. Fix: shared services and events are now the preferred mechanism for integration.
- Gap: API-model consistency was missing. Fix: JSON-friendly contracts are now required for both frontend and backend use.

## Acceptance Criteria
- Shared models can be consumed by both the frontend and ASP.NET Core backend.
- All modules communicate through shared contracts or APIs rather than direct code coupling.
- The shared layer supports authentication, workspace state, notifications, and plugin metadata.
