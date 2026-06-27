# 07. Finance Module Implementation Guide

## Objective
Implement personal and family financial planning, forecasting, and obligation tracking.

## Frontend Scope
- financial dashboard
- expense and income entry
- obligations and due-date summary
- forecast chart
- scenario comparison view

## Backend Scope
- FinancialEntry entity
- Obligation entity
- FinancialScenario entity
- forecasting service
- financial aggregation service

## Data Model
- FinancialEntry
  - Id
  - Type
  - Amount
  - Category
  - Date
  - WorkspaceId

## API Endpoints
- GET /api/finance/entries
- POST /api/finance/entries
- GET /api/finance/obligations
- GET /api/finance/scenarios

## Implementation Notes
- Finance should not depend on calendar logic directly.
- Use shared event contracts for reminders about due obligations.
- Keep scenario modeling modular and extensible.

## Deliverables
- finance dashboard created
- financial data API implemented
- obligations and scenarios supported

## Audit Review and Fixes
- Gap: finance planning was too abstract. Fix: explicit entities for entries, obligations, and scenarios are now required.
- Gap: reminder and risk linkage were not defined. Fix: the module must be able to raise reminder events and connect to scenario-based planning.
- Gap: persistence needs were unclear. Fix: financial data must be stored in MySQL through EF Core.

## Acceptance Criteria
- Users can create financial entries and view obligations and forecasts.
- The module exposes financial APIs for dashboard and scenario use.
- Financial events can be surfaced through the notifications layer.
