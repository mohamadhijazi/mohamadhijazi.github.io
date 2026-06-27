# 15. Settings Module Implementation Guide

## Objective
Implement user preferences, theme settings, provider configuration, privacy settings, and authentication provider connection for Google and Microsoft, including explicit client-side consent for accessing folders on Google Drive and Microsoft OneDrive.

## Frontend Scope
- profile settings
- theme selection
- AI provider configuration
- storage preferences
- notification preferences
- sign-in method selection for Google and Microsoft
- connect/disconnect account provider actions
- explicit consent UI for folder access on Google Drive and Microsoft OneDrive
- permission summary explaining which folders and data will be accessed

## Backend Scope
- UserSettings entity
- ThemePreference entity
- IntegrationConfig entity
- privacy settings service
- authentication provider configuration service
- OAuth callback and token exchange handling
- consent state persistence
- scoped access token management for Drive and OneDrive operations

## Data Model
- UserSettings
  - Id
  - UserId
  - Theme
  - Language
  - NotificationMode
- IntegrationConfig
  - Id
  - UserId
  - ProviderName
  - IsConnected
  - TokenReference
  - Scope

## API Endpoints
- GET /api/settings
- PUT /api/settings
- GET /api/settings/integrations
- POST /api/settings/integrations/google/connect
- POST /api/settings/integrations/microsoft/connect
- POST /api/settings/integrations/google/disconnect
- POST /api/settings/integrations/microsoft/disconnect
- POST /api/settings/integrations/google/consent
- POST /api/settings/integrations/microsoft/consent
- GET /api/auth/google/login
- GET /api/auth/microsoft/login
- GET /api/auth/google/callback
- GET /api/auth/microsoft/callback

## Implementation Notes
- This module should be the centralized place for personalization.
- Settings should be shared across other modules through the shared layer.
- Google and Microsoft sign-in should be implemented using OAuth 2.0/OpenID Connect.
- User consent should be stored securely and only used for required scopes.
- Folder access for Google Drive and Microsoft OneDrive must be requested explicitly through the client consent flow.
- The application should request only the minimum scope needed to view or manage the selected folders.
- The consent screen must clearly explain which folder access is being granted and why.
- Access tokens must be handled in a security-conscious way and never stored in an unsafe or overly broad manner.

## Deliverables
- settings UI implemented
- theme support wired
- provider and privacy settings available
- Google login flow implemented
- Microsoft login flow implemented

## Audit Review and Fixes
- Gap: settings scope was too broad and under-specified. Fix: the module now clearly includes personalization, provider configuration, consent, and privacy controls.
- Gap: authentication integration was incomplete. Fix: Google and Microsoft login and consent flows are now explicit requirements.
- Gap: storage access handling was missing. Fix: consent-based Drive and OneDrive access must be supported through the settings experience.

## Acceptance Criteria
- Users can configure theme, notifications, privacy, and provider settings.
- Google and Microsoft sign-in flows are supported and can be connected/disconnected from settings.
- Consent-based Drive and OneDrive access can be enabled and managed from the settings module.
