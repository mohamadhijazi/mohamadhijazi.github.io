# 03. Core Shell Module

## Objective
Implement the main application shell, navigation, authentication flow, workspace switching, and theming.

## Technology Baseline
The shell should be implemented with plain JavaScript and optional Vue components loaded from CDN, with the business logic handled by ASP.NET Core endpoints and Entity Framework Core persistence.

## Frontend Responsibilities
- app layout
- sidebar navigation
- top bar actions
- theme toggle
- plugin loader
- global state initialization
- Google and Microsoft sign-in entry buttons
- authentication state handling

## Backend Responsibilities
- auth endpoints
- workspace endpoints
- user profile endpoints
- settings endpoints
- plugin registry endpoints
- Google OAuth callback handling
- Microsoft OAuth callback handling

## Required Components
- ShellLayout
- AppRouter
- NavigationMenu
- WorkspaceSwitcher
- ThemeProvider
- AuthGuard
- PluginRegistryLoader

## API Endpoints
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/google/login
- GET /api/auth/microsoft/login
- GET /api/auth/google/callback
- GET /api/auth/microsoft/callback
- GET /api/users/me
- GET /api/workspaces
- POST /api/workspaces
- GET /api/plugins

## Implementation Checklist
- create shell routes
- implement auth flow
- create theme engine
- register default plugins
- ensure plugin loading is isolated

## Deliverables
- shell UI implemented
- authentication integrated
- workspace switching works
- plugins load dynamically

## Audit Review and Fixes
- Gap: the shell lacked detailed responsibilities. Fix: navigation, routing, auth, theme management, and plugin loading are now explicitly defined.
- Gap: sign-in support was missing from the shell plan. Fix: Google and Microsoft login entry points and callback handling are now included.
- Gap: plugin lifecycle was not clear. Fix: the shell must register and initialize plugins through a shared plugin registry.

## Acceptance Criteria
- The shell loads a plugin-based layout without requiring a full application rebuild for each feature.
- Users can sign in with Google or Microsoft and reach the app shell.
- The theme system and workspace switcher work from a single global state model.
