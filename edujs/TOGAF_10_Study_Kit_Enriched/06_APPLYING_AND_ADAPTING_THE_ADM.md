# 6. Applying and Adapting the ADM

## 6.1 Tailoring is required

The ADM is a generic method. Tailor it based on:

- enterprise scope and maturity;
- organizational structure and governance;
- architecture purpose and required decisions;
- industry and regulation;
- delivery model, including agile/product/DevOps;
- available assets and repository;
- risk, complexity, time, and budget.

Tailoring does not mean deleting controls without thought. Preserve intent, accountability, traceability, and outcomes.

## 6.2 Scoping dimensions

Consider:

- **Breadth:** organizational and domain coverage.
- **Depth:** level of detail.
- **Time period:** planning horizon and transition periods.
- **Architecture domains:** business, data, application, technology and cross-cutting concerns.

Good scope is the minimum sufficient to support the required decisions, while accounting for dependencies.

## 6.3 Iteration

Iteration reduces risk and increases learning. Common forms:

- iteration between Baseline and Target understanding;
- iteration across B, C, and D due to cross-domain impacts;
- iteration between architecture and opportunity/migration decisions;
- multiple ADM cycles at strategic, segment, portfolio, or capability levels.

## 6.4 Levels of architecture

Organizations often coordinate architecture at different levels, such as strategic, segment/portfolio, and capability/solution-supporting. Terms vary. The exam principle is to maintain alignment, reuse, and controlled delegation across levels.

## 6.5 Agile and product delivery

TOGAF and agile are complementary when configured well:

- architecture provides direction, guardrails, intentional decisions, and runway;
- delivery provides fast feedback and empirical learning;
- requirements and architecture evolve under governance;
- architects engage continuously rather than delivering a large document and disappearing;
- compliance is automated or embedded where possible.

Avoid two extremes: “architecture must be complete before delivery” and “agile needs no architecture”.

## 6.6 Digital enterprise

Digital transformation usually crosses business model, customer experience, data, operating model, applications, ecosystem, and technology. Use stakeholders, value streams, capabilities, data, and transition planning. Do not treat “digital” as only cloud migration.

## 6.7 Security and risk

Security is a cross-cutting concern integrated through all ADM phases:

- principles and governance in Preliminary;
- risk, stakeholders, scope, and high-level needs in A;
- security concerns and controls in B-D;
- secure transition and sourcing in E-F;
- assurance and conformance in G;
- emerging threats and changes in H;
- traceable security requirements throughout.

## 6.8 Architecture partitioning

Partitioning divides architecture work while preserving coherence. Define boundaries, ownership, interfaces, dependencies, and integration rules. Partition to manage complexity, not to create disconnected silos.

## 6.9 Reuse

Before creating new content:

1. search the Architecture Repository and relevant external reference assets;
2. assess fitness, currency, licensing, and context;
3. adapt under governance;
4. contribute improved assets back for reuse.

## 6.10 Federated enterprise

In federated environments, balance autonomy and enterprise coherence. Standardize where shared value, risk, interoperability, or regulation requires it. Delegate where local differentiation is valuable. Use explicit decision rights and contracts.

## 6.11 Applying TOGAF to a constrained engagement

If time is limited:

- clarify decision and stakeholders;
- scope to material concerns;
- reuse trusted assets;
- develop just-enough Baseline and Target views;
- maintain requirements and decision traceability;
- identify risks and transition impacts;
- obtain governance approval.

Compress detail, not discipline.

# PDF-enriched applying guidance

## Iteration types

### Develop the Architecture Landscape

Each Architecture Project may run a full ADM cycle initiated by a Request for Architecture Work. Multiple cycles may run concurrently, and one project may trigger another when more detailed work or out-of-scope impacts are discovered.

### Architecture Development iteration

Phases can run concurrently, cycle across B/C/D, or return to previous phases to refine architecture and roadmap based on implementation knowledge or changed priorities.

### Architecture Capability iteration

Phase A or Phase H may reveal the need to revisit Preliminary and adjust the Architecture Capability.

### Four practical iteration cycles

- **Architecture Capability:** establish or improve approach, principles, scope, vision, and governance.
- **Architecture Development:** integrate B/C/D and extend into E/F to prove implementability.
- **Transition Planning:** create formal roadmaps and migration plans.
- **Architecture Governance:** govern delivery toward the Target.

## Architecture styles

A style may change focus, form, techniques, subject, material, or time horizon. Adapt mainly by changing models, viewpoints, tools, notation, metamodel extensions, reference models, and stakeholder focus. A dominant new style may justify revisiting Preliminary to update the capability.

## Agile exam knowledge

Enterprise agility emphasizes response to change, value-first prioritization, practical experimentation, empowered teams, customer collaboration, continuous improvement, and respect for people.

Avoid Big Design Up Front. Maintain enough strategic direction to avoid fragmentation, while producing Minimum Viable Architecture and guardrails close to delivery.

### Four collaboration approaches

1. **EA Development Agility:** perform ADM A-F through architecture sprints.
2. **Solution Collaboration:** EA and solution-development sprints collaborate; EA prepares MVAs for subsequent delivery.
3. **Cross-Development Collaboration:** business development, EA, and solution development run collaborating sprints; business provides minimum viable business developments and EA provides MVAs.
4. **Cross-Functional Agility:** one mixed team contains business, EA, and solution competencies.

## Partitioning reasons

- resolve or manage conflicting organizational architectures;
- allow multiple architecture teams to work concurrently with clear ownership;
- enable modular reuse.

The partition model must reflect the enterprise operating model. Define boundaries, ownership, interfaces, relationships, and governance.

