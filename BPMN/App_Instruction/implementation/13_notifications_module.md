# 13. Notifications Module Implementation Guide

## Objective
Implement reminders, notifications, and scheduled automation.

## Frontend Scope
- notification center
- reminder list
- notification preferences

## Backend Scope
- Notification entity
- ReminderJob entity
- background worker
- SMTP integration

## Data Model
- Notification
  - Id
  - Type
  - Message
  - Recipient
  - Status
  - CreatedAt

## API Endpoints
- GET /api/notifications
- POST /api/notifications/send
- GET /api/notifications/preferences

## Implementation Notes
- This module should be event-driven and loosely coupled.
- Use shared notification contracts from the shared layer.
- Support both email and in-app delivery.

## Deliverables
- notification center implemented
- reminder jobs scheduled
- email delivery wired

## Audit Review and Fixes
- Gap: notification workflow was too thin. Fix: the module now includes a notification center, reminder jobs, and SMTP-based delivery.
- Gap: integration points were unclear. Fix: the module must use shared notification contracts and event triggers from calendar, finance, and planning.
- Gap: persistence was missing. Fix: notification state must be stored and retrievable through backend services.

## Acceptance Criteria
- Users receive reminders and in-app notifications from scheduled events.
- Notification delivery can be configured and reviewed in the UI.
- The module integrates with the shared notification contracts.
