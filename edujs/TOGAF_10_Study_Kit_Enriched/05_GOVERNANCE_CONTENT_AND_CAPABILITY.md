# 5. Governance, Content, and Architecture Capability

## 5.1 Architecture Governance

Architecture Governance is the practice and orientation by which enterprise architectures and their implementation are managed and controlled. It should align with corporate and technology governance.

Core characteristics:

- defined decision rights and accountability;
- transparent processes;
- compliance and assurance;
- controlled exceptions;
- monitoring and reporting;
- alignment to enterprise objectives.

## 5.2 Architecture Board

A governance body that may:

- oversee architecture strategy and process;
- approve architecture work and key decisions;
- resolve cross-organizational conflicts;
- govern standards, exceptions, and compliance;
- monitor architecture value and risk.

The exact membership and authority are tailored. Avoid assuming a universal organization chart.

## 5.3 Architecture Contract

An agreement between development partners and sponsors that governs architecture deliverables, quality, fitness for purpose, responsibilities, and conformance. It may be used between architecture function and business sponsors or between architecture and implementation teams.

It is a governance instrument, not merely a procurement contract.

## 5.4 Compliance and dispensation

- **Compliance:** implementation conforms to agreed architecture and requirements.
- **Non-conformance:** implementation diverges materially.
- **Dispensation:** formally approved temporary or permanent exception, with rationale, risk, conditions, owner, and review/expiry as appropriate.

Do not silently accept deviation. Evaluate impact, record it, and use governance.

## 5.5 Architecture Capability

Includes:

- mandate and sponsorship;
- roles and organization;
- skills and competency development;
- governance bodies and processes;
- tailored method and content framework;
- tools and repository;
- integration with strategy, portfolio, delivery, operations, security, risk, and procurement;
- performance measurement and continual improvement.

## 5.6 Roles

Exact role names vary, but responsibilities usually cover:

- sponsor and decision authority;
- lead/chief architecture coordination;
- domain architecture expertise;
- business ownership;
- project and product delivery;
- repository and standards stewardship;
- assurance and compliance.

Use a responsibility model such as RACI when accountability is ambiguous.

## 5.7 Architecture content

### Architecture Definition Document

Describes Baseline and Target Architectures and relevant views across domains. It explains architecture structure and rationale.

### Architecture Requirements Specification

Provides quantitative and qualitative requirements that the architecture and implementation must meet.

### Architecture Roadmap

Lists work packages over time and relates them to Transition Architectures and expected value.

### Implementation and Migration Plan

Provides execution detail for projects, sequencing, resources, dependencies, and migration.

### Architecture Vision

High-level description of the desired outcome and value, sufficient for stakeholder agreement and authorization.

### Statement of Architecture Work

Defines engagement scope, approach, governance, schedule, deliverables, resources, and acceptance.

## 5.8 Content Metamodel

The metamodel defines types of architecture content and relationships. Tailor it to stakeholder needs, tool capability, and organizational terminology. Its value is disciplined consistency and traceability, not maximum documentation.

## 5.9 Architecture Landscape

Represents architectures at different levels and states across the enterprise. It helps identify dependencies, reuse, overlap, and impact. Keep it governed and current enough to support decisions.

## 5.10 Standards Information Base

A repository area containing standards relevant to architecture and implementation. Standards should have ownership, scope, status, rationale, lifecycle, and exception process.

## 5.11 Governance scenario pattern

When implementation diverges:

1. verify relevant requirement, principle, standard, and contract;
2. assess business, security, operational, cost, and roadmap impact;
3. engage accountable stakeholders;
4. decide remediation or formal dispensation;
5. record decision and conditions;
6. update affected requirements, roadmap, repository, and lessons learned.

# PDF-enriched governance and content detail

## Architecture Governance controls

A functioning governance framework includes:

- controls over creation, monitoring, implementation, and evolution of architecture;
- controls for internal/external standards and regulatory compliance;
- management processes operating within agreed parameters;
- documented decision structures and stakeholder input;
- accountability to an identified stakeholder community.

## Architecture Board exam facts

The Board should represent key architecture stakeholders, with architecture, business, and program-management coverage. Typical accountabilities include change decisions, consistency among sub-architectures, reuse, flexibility, compliance enforcement, maturity improvement, escalation, contract monitoring, task assignment, product approval, and conflict resolution.

## Architecture Repository relationship

The Architecture Repository is part of a wider Enterprise Repository. It structures architecture assets at different abstraction levels and may link them to detailed design, deployment, and service-management repositories.

## Content Framework purposes

- detailed model of architecture work products;
- consistency across ADM outputs;
- checklist of possible outputs;
- reduced risk of missing content;
- common architecture concepts, terms, and deliverables;
- mapping point when another metamodel, such as ArchiMate, is used.

## ABB specification minimum

An ABB captures requirements and guides SBB development/procurement. Include fundamental functionality and attributes, semantics, security/manageability, required interfaces, standards/protocols, interoperability, relationships, dependencies, and reusable repository assets.

## SBB specification minimum

An SBB is product/vendor-aware and may be procured or developed. Include specific functionality, implemented interfaces, dependent SBBs, topology/operational policy mapping, shared quality attributes, performance/configurability, physical design constraints, and mapping to ABBs.

## Architecture Contract value

Contracts create continuous monitoring, adherence to principles/standards/requirements, risk identification, accountability, and a shared definition of governance authority. They are joint agreements about deliverables, quality, fitness for purpose, conformance, roles, metrics, and timing.

## Compliance Assessment typical coverage

Progress/status, project architecture/design, and checklists across hardware/OS, middleware/services, applications, information management, security, systems management, systems engineering, methods, and tools.

