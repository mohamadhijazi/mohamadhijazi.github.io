# 12. Data ETL Module Implementation Guide

## Objective
Implement data ingestion, transformation, and dashboard preparation from local and remote sources.

## Frontend Scope
- connector setup UI
- transform mapping view
- preview table
- import wizard

## Backend Scope
- DataSource entity
- DataTransform entity
- ImportJob entity
- connector service
- transformation engine

## Data Model
- DataSource
  - Id
  - Name
  - Type
  - ConnectionConfig
  - WorkspaceId

## API Endpoints
- GET /api/etl/sources
- POST /api/etl/sources
- POST /api/etl/import
- POST /api/etl/transform

## Implementation Notes
- Support REST, Excel, and JSON sources first.
- Keep transformations declarative where possible.
- Generated datasets should be reusable by dashboards.

## Deliverables
- connectors implemented
- import and transformation flow available
- datasets prepared for dashboards

## Audit Review and Fixes
- Gap: ETL scope was vague. Fix: explicit data sources, transforms, and import jobs are now defined.
- Gap: dashboard integration was not clear. Fix: prepared datasets must be consumable by dashboard components.
- Gap: connector strategy was underspecified. Fix: REST, Excel, and JSON sources are the initial supported integrations.

## Acceptance Criteria
- Users can add a data source and import data into the platform.
- Transformation steps can be previewed and saved for later use.
- Imported datasets can be used by dashboard and analytics views.
