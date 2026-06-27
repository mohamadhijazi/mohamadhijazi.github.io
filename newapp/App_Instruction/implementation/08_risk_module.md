# 08. Risk Module Implementation Guide

## Objective
Implement risk recognition, impact analysis, and scenario resilience modeling.

## Frontend Scope
- risk register
- risk matrix
- scenario impact view
- risk summary panel
- capability and maturity modeling for personal, family, and business scenarios
- BPMN.io-based workflow and process modeling views where process flows are relevant

## Backend Scope
- Risk entity
- RiskImpact entity
- Scenario entity
- risk evaluation service

## Data Model
- Risk
  - Id
  - Title
  - Category
  - Severity
  - Probability
  - Description
  - WorkspaceId

## API Endpoints
- GET /api/risk/items
- POST /api/risk/items
- GET /api/risk/scenarios
- POST /api/risk/scenarios

## Implementation Notes
- This module should be able to consume calendar and finance data through shared services.
- Keep the logic general enough to support personal and business use cases.

## Deliverables
- risk register implemented
- scenario analysis available
- risk views connected to shared data

## Audit Review and Fixes
- Gap: risk module lacked explicit outputs. Fix: risk register, impact analysis, and scenario models are now defined.
- Gap: dependency on other modules was underspecified. Fix: the module may consume calendar and finance data through shared services but must not depend on their UI code.
- Gap: data handling was vague. Fix: risk records must be persisted in MySQL and exposed via dedicated APIs.

## Acceptance Criteria
- Users can create risks and view scenario-based impact analysis.
- Risk data is stored and queryable through backend services.
- The module can incorporate planning and financial context without hard coupling.
