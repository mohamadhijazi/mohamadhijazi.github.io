# 3. ADM Complete Guide

## 3.1 ADM cycle

**Preliminary → A → B → C → D → E → F → G → H**, with **Requirements Management** interacting continuously with all phases.

The ADM is iterative:

- over the whole cycle;
- between phases;
- within a phase;
- across architecture levels.

It must be tailored to organizational context, scope, governance, maturity, and delivery approach.

## 3.2 Preliminary Phase: establish capability

### Purpose

Prepare the organization to undertake successful Enterprise Architecture work.

### Think about

- enterprise scope and impacted organizations;
- governance and decision rights;
- architecture principles;
- method tailoring;
- roles, skills, responsibilities, tools, and repository;
- integration with portfolio, project, procurement, operations, risk, and security processes.

### Exam signal

If the problem is lack of architecture authority, inconsistent method, missing board, unclear roles, or no repository, the Preliminary Phase is likely central.

## 3.3 Phase A: Architecture Vision

### Purpose

Initiate an architecture development cycle, define scope and constraints, identify stakeholders, create a high-level vision and value proposition, and obtain approval.

### Core actions

- confirm stakeholders, concerns, and business goals;
- assess readiness and transformation risks;
- establish scope, breadth, depth, and time horizon;
- develop the Architecture Vision;
- create or confirm the Statement of Architecture Work;
- obtain approval and commitment.

### Exam trap

Phase A is not where the full detailed Target Architecture is completed. It establishes a credible high-level direction and authorization.

## 3.4 Phase B: Business Architecture

### Purpose

Develop Baseline and Target Business Architecture sufficient to support the Architecture Vision and identify gaps.

### Typical focus

- strategy, goals, drivers, outcomes;
- business capabilities and value streams;
- organization, governance, roles;
- business services, functions, and processes;
- information needs and business requirements.

### Approach

Choose the level of detail necessary for decisions. Reuse existing assets. Conduct gap analysis and identify candidate roadmap components.

## 3.5 Phase C: Information Systems Architectures

Phase C includes Data Architecture and Application Architecture. Order may be adapted to context.

### Data Architecture

Focuses on data entities/assets, ownership, lifecycle, distribution, quality, security, and needed data management capabilities.

### Application Architecture

Focuses on applications and services, interactions, functional coverage, interfaces, and relation to business and data needs.

### Exam trap

Do not reduce Data Architecture to databases or Application Architecture to product selection. Architecture should first express required structures and behavior.

## 3.6 Phase D: Technology Architecture

### Purpose

Develop the technology environment needed to enable data and application components and satisfy architecture requirements.

### Typical focus

- platform services;
- infrastructure and cloud capabilities;
- networking, compute, storage;
- middleware and integration technology;
- technology standards;
- operations, resilience, performance, security.

### Exam trap

A preferred vendor product is not automatically the Technology Architecture. Preserve traceability to business, data, application, and non-functional needs.

## 3.7 Common pattern for Phases B, C, D

1. Select reference models, viewpoints, and tools.
2. Develop Baseline description to needed detail.
3. Develop Target description to needed detail.
4. Perform gap analysis.
5. Define candidate roadmap components.
6. Resolve impacts across the Architecture Landscape.
7. Conduct stakeholder review.
8. Finalize architecture.
9. Create or update the Architecture Definition Document and Architecture Requirements Specification.

The exact sequence is tailored and iterative.

## 3.8 Phase E: Opportunities and Solutions

### Purpose

Identify major implementation projects, group changes into work packages, evaluate delivery approaches, identify Transition Architectures, and produce the initial Architecture Roadmap.

### Key reasoning

- consolidate gaps from B, C, and D;
- determine dependencies and solution groupings;
- evaluate build, buy, reuse, partner, outsource, or retire choices;
- identify incremental states when the Target cannot be reached in one step;
- connect architecture to portfolio and delivery realities.

### Exam signal

If the question asks how to package change or define intermediate states, think Phase E.

## 3.9 Phase F: Migration Planning

### Purpose

Finalize a detailed Implementation and Migration Plan and coordinate it with portfolio/project management.

### Key actions

- assign business value and risk to work packages;
- prioritize projects;
- confirm dependencies, resources, and timing;
- perform cost/benefit and risk assessment;
- finalize roadmap and migration plan;
- secure stakeholder agreement.

### Phase E vs F

- **E:** What solution increments and work packages can realize the architecture?
- **F:** In what prioritized, resourced, agreed sequence will they be executed?

## 3.10 Phase G: Implementation Governance

### Purpose

Provide architectural oversight during implementation and ensure conformance.

### Key actions

- confirm project scope and priorities;
- establish Architecture Contract;
- perform compliance reviews;
- manage implementation risks and architecture issues;
- govern change requests and deviations;
- ensure solution delivery conforms to the Target and requirements.

### Exam trap

Architects govern and support realization. They do not replace project management or solution delivery management.

## 3.11 Phase H: Architecture Change Management

### Purpose

Monitor the environment and architecture, assess changes, and determine whether to make minor updates or start a new ADM cycle.

### Change categories

Use governance to classify change based on scope and impact. A small change may be handled through maintenance; a substantial change may require a new cycle. Avoid memorizing arbitrary thresholds. Assess business value, risk, affected stakeholders, requirements, and architectural impact.

### Continuous monitoring

Watch business strategy, technology, regulation, performance, implementation outcomes, and stakeholder needs.

## 3.12 Requirements Management

### Purpose

Identify, store, analyze, prioritize, maintain, communicate, and dispose of architecture requirements through the ADM cycle.

### Central behavior

- phases generate requirements;
- requirements constrain and guide phases;
- changes are assessed for impact;
- conflicts are resolved through stakeholders and governance;
- traceability links drivers, concerns, architecture decisions, work packages, solutions, and tests.

### Exam trap

Requirements Management is not a one-time phase and not merely a document repository.

## 3.13 Phase diagnosis questions

- Capability not established? **Preliminary**
- Need authorization, scope, value, commitment? **A**
- Need business target and capability gaps? **B**
- Need data/application target? **C**
- Need technology target? **D**
- Need work packages/Transition Architectures? **E**
- Need prioritized migration execution plan? **F**
- Need implementation conformance? **G**
- Need ongoing change decision? **H**
- Need lifecycle traceability of needs? **Requirements Management**

# PDF-enriched ADM objectives, steps, inputs, and outputs

## Key Version 10 interpretation

The phase sequence is a communication model, not a mandated waterfall. After Phase A begins a cycle, phases may execute iteratively, concurrently, or in a tailored order. However, the architecture must still preserve coherent inputs, decisions, stakeholder approval, requirements, and governance.

## Preliminary Phase

### Objectives

- determine the Architecture Capability required;
- understand organizational context and affected scope;
- identify intersecting frameworks and processes;
- set a capability maturity target;
- establish organization, governance, tools, resources, and principles.

### High-value outputs

- Organizational Model for Enterprise Architecture;
- Tailored Architecture Framework and configured tools;
- initial Architecture Repository;
- Architecture Principles;
- Architecture Governance Framework;
- Request for Architecture Work;
- architecture of the Architecture Capability itself.

## Phase A: Architecture Vision

### Detailed steps

1. Establish the Architecture Project.
2. Identify stakeholders, concerns, and business requirements.
3. Confirm goals, drivers, and constraints.
4. Evaluate capabilities and transformation readiness.
5. Define scope in breadth, depth, time, and domains.
6. Confirm and elaborate principles.
7. Develop the Architecture Vision.
8. Define target value propositions and KPIs.
9. Identify transformation risks and mitigation.
10. Develop and approve the Statement of Architecture Work.

### High-value outputs

Approved Statement of Architecture Work, Architecture Vision, Capability Assessment, Communications Plan, refined principles, high-level requirements, and initial Architecture Definition Document content.

## Phases B, C, and D: repeated development pattern

Each domain uses a common pattern:

1. select reference models, viewpoints, and tools;
2. develop the Baseline description to the needed level;
3. develop the Target description;
4. perform gap analysis;
5. define candidate roadmap components;
6. resolve impacts across the Architecture Landscape;
7. conduct formal stakeholder review;
8. finalize the domain architecture;
9. update the Architecture Definition Document and Requirements Specification.

### Phase B distinctive objective

Describe how the enterprise must operate to achieve goals and strategic drivers. Outputs include approved or refined business capabilities, value delivery, organization, services, processes, information concepts, gaps, requirements, and roadmap components.

### Phase C distinctive objective

Develop Data and Application Architectures, sequentially or concurrently. Data outputs include ownership, logical/physical assets, management, quality, and interoperability requirements. Application outputs include services, interactions, functional coverage, interfaces, application interoperability, and constraints on Technology Architecture.

### Phase D distinctive objective

Develop technology services and components enabling business, data, and application building blocks. Consider platforms, environments, locations, processing load, networks, hardware, resilience, operations, security, standards, and technology requirements.

## Phase E: Opportunities and Solutions

### Objectives

- create the initial complete Architecture Roadmap;
- group gaps into coherent work packages;
- define delivery vehicles such as projects, programs, and portfolios;
- decide whether incremental realization is needed;
- identify Transition Architectures;
- define overall SBBs that realize ABBs.

### Detailed steps

Confirm change attributes and implementation constraints; consolidate gaps and requirements; reconcile interoperability; validate dependencies; confirm readiness and risk; formulate implementation/migration strategy; group work packages; identify transitions; create the Roadmap and draft Implementation and Migration Plan.

## Phase F: Migration Planning

### Objectives and outputs

Finalize the Architecture Roadmap and detailed Implementation and Migration Plan, coordinate with enterprise portfolio/change management, and ensure stakeholders understand business value and cost. Assign value, estimate resources/timing, prioritize through cost-benefit and risk validation, finalize documents, complete the cycle, and capture lessons learned.

## Phase G: Implementation Governance

### Detailed steps

- confirm deployment scope and priorities;
- identify resources and skills;
- guide solution deployment;
- conduct compliance reviews;
- govern implementation-driven change requests;
- support transition into business and IT operations;
- perform post-implementation review and close implementation.

### High-value outputs

Signed Architecture Contract, Compliance Assessments, Change Requests, deployed architecture-compliant solution, recommendations/dispensations, updated repository and architecture documents, operating models, service requirements, metrics, and SLAs.

## Phase H: Architecture Change Management

### Detailed steps

Establish value realization, deploy monitoring, manage risk, analyze change, develop change requirements, run the governance process, and activate implementation of approved changes.

### Possible outcomes

- maintenance update to architecture;
- changes to framework/principles;
- updated contracts or compliance assessments;
- new Request for Architecture Work for major change.

## Requirements Management detailed process

1. Identify and document requirements.
2. Baseline requirements.
3. Monitor baselined requirements.
4. identify additions, removals, modifications, and changed priorities.
5. Resolve conflicts and generate a Requirements Impact Statement.
6. Assess impact on current and previous ADM phases.
7. Implement Phase H requirements.
8. Update the Architecture Requirements Repository.
9. Implement change in the current phase.
10. Revisit prior gap analysis where necessary.

