# 4. ADM Techniques

## 4.1 Principles

Architecture principles are general rules and guidelines intended to be enduring and seldom amended. A strong principle normally includes:

- name;
- statement;
- rationale;
- implications.

Good principles are understandable, robust, complete, consistent, and stable. Implications make the principle operational by identifying costs, responsibilities, standards, and behavioral consequences.

## 4.2 Stakeholder management

### Process

1. Identify stakeholders.
2. Analyze power, interest, influence, concerns, and likely stance.
3. Determine engagement strategy.
4. Map concerns to viewpoints and communication artifacts.
5. Engage, monitor, and update throughout the cycle.

Do not communicate one technical diagram to everyone. Tailor message, detail, and format.

## 4.3 Business scenarios

A technique for discovering and documenting business requirements by describing a business problem, environment, desired outcomes, actors, and interactions. A good scenario is specific, measurable enough to validate, and linked to business value.

Use when requirements are vague, stakeholders disagree on the problem, or technology is being proposed without a clear business need.

## 4.4 Gap analysis

Compare Baseline and Target to identify:

- existing elements retained;
- existing elements removed;
- existing elements changed;
- new elements introduced;
- missing relationships, controls, skills, or standards.

Cross-domain gaps matter. A new application may require data ownership, technology services, operating roles, and governance changes.

## 4.5 Migration planning techniques

Useful criteria include:

- business value;
- risk;
- cost and resource availability;
- dependencies;
- urgency and regulatory deadlines;
- readiness;
- ability to deliver benefits;
- technical and organizational complexity.

Avoid prioritizing only by cost or executive preference. Use transparent multi-criteria reasoning.

## 4.6 Interoperability analysis

Examine needed ability to exchange and use information/services across:

- business and operating model;
- information semantics and ownership;
- application services and interfaces;
- technology protocols and platforms.

Also consider governance, legal, security, and lifecycle ownership.

## 4.7 Business Transformation Readiness Assessment

Assesses whether the organization can absorb and sustain the target change. Typical factors include leadership, sponsorship, skills, culture, funding, governance, delivery capacity, and change history.

Use findings to adjust scope, roadmap, transition states, communication, and risk responses.

## 4.8 Risk management

1. Identify risk.
2. Assess probability and impact.
3. Determine response: avoid, reduce, transfer/share, or accept.
4. Assign owner and actions.
5. Monitor residual risk.

Architecture risk must flow into roadmap and governance decisions.

## 4.9 Capability-based planning

Start from strategic outcomes and determine the capabilities needed. Assess current capability, target level, gaps, increments, and investments. It helps maintain focus on business ability rather than projects or products.

## 4.10 Architecture alternatives and trade-offs

Evaluate alternatives against principles, requirements, concerns, risk, value, cost, time, and transition feasibility. Record rationale. A scenario answer that recommends a vendor solely because it is common or strategic is incomplete unless traced to requirements and governance.

## 4.11 Architecture compliance reviews

Structured assessment of whether implementation conforms to the architecture. Reviews:

- occur at suitable delivery checkpoints;
- use agreed requirements, principles, standards, and contracts;
- document findings and dispensations;
- distinguish acceptable variance from harmful non-conformance;
- escalate through governance when necessary.

## 4.12 Views and viewpoints

Select viewpoints based on stakeholders and concerns. Define what the view communicates, notation/modeling conventions, source information, and intended decisions. Keep the model only as detailed as needed to answer concerns.

## 4.13 Technique selection cheat sheet

- unclear business problem: **business scenarios**
- stakeholder resistance: **stakeholder management + readiness assessment**
- baseline/target differences: **gap analysis**
- investment order: **migration planning/prioritization**
- shared service/data concerns: **interoperability analysis**
- strategic ability needed: **capability-based planning**
- implementation deviation: **compliance review + governance**
- competing architecture choices: **trade-off analysis against requirements and principles**

# PDF-enriched technique detail

## Gap Analysis matrix procedure

Create a matrix with Baseline ABBs vertically and Target ABBs horizontally. Add a **New** row and an **Eliminated** column.

- Present in both states: mark **Included**.
- Present only in Baseline: verify whether elimination is intentional; otherwise it is an omission to correct.
- Present only in Target: mark in the **New** row as a gap requiring development or procurement.
- Everything in New or Eliminated must be explained and converted into architecture work where appropriate.

## Migration planning instruments

### Implementation Factor Catalog

Captures risks, issues, assumptions, dependencies, actions, impacts, conclusions, and constraints that affect the migration plan.

### Consolidated Gaps, Solutions, and Dependencies Matrix

Groups domain gaps, records potential solutions, and identifies dependencies. It is a direct planning aid for forming work packages and projects.

### Architecture Definition Increments Table

Places project deliverables across Transition Architectures or time periods to show incremental realization.

### Transition Architecture State Evolution Table

Shows how services/SBBs change across transition states, for example retain, transition, replace, or new.

### Business Value Assessment Matrix

Compares project value and risk. Value criteria may include principle compliance, financial contribution, strategic alignment, and competitive position. Risk criteria may include size/complexity, technology uncertainty, organizational capacity, and failure impact. Weight criteria explicitly.

## Risk management lifecycle

- classify risk;
- identify risk;
- perform initial assessment;
- define mitigation and assess residual risk;
- monitor continuously.

First identify transformation risks and mitigation in Phase A, and include material mitigation activities in the Statement of Architecture Work.

## Alternatives and trade-offs

Multiple Target Architectures may satisfy the vision, principles, and requirements. Presenting alternatives exposes hidden concerns, agendas, and requirements. Evaluate alternatives using stakeholder outcomes, principles, requirements, cost, value, risk, time, interoperability, transition feasibility, and operational consequences.

## Business Scenario method

1. Identify, document, and rank the business problem.
2. Describe business and technical environments using high-level models.
3. define desired objectives and make them SMART where possible.
4. identify human actors and their place in the business model.
5. identify computing actors and their place in the technology model.
6. test fitness for purpose and refine only as needed.

The technique can be used in Preliminary, Phase A, Phase B, or elsewhere, and can be repeated at different levels of decomposition.

