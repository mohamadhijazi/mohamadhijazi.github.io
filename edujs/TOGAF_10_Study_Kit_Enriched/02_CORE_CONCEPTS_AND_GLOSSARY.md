# 2. Core Concepts and Glossary

## 2.1 The TOGAF Standard, 10th Edition structure

The 10th Edition separates:

- **Fundamental Content:** enduring core concepts and method.
- **TOGAF Series Guides:** guidance on configuring and applying the core in contexts such as agile, digital, security, and business architecture.

This modular structure is a key Version 10 characteristic. Treat the standard as a configurable method, not a rigid project recipe.

## 2.2 Enterprise Architecture

Enterprise Architecture supports effective change by describing current and desired states, understanding stakeholder concerns, and governing coordinated transformation. “Enterprise” is the scope selected for the architecture effort. It may be a whole organization, agency, business unit, partnership, or other bounded endeavor.

## 2.3 Architecture domains

- **Business Architecture:** strategy, governance, organization, key processes, capabilities, and value.
- **Data Architecture:** logical and physical data assets and data management resources.
- **Application Architecture:** applications, interactions, and relationships to business processes.
- **Technology Architecture:** technology services and logical software/hardware capabilities supporting applications and data.

Do not assume “Business, Data, Application, Technology” means four independent projects. They are viewpoints on an integrated enterprise change.

## 2.4 Essential distinctions

### Architecture vs solution

Architecture sets coherent structures, principles, constraints, and major decisions. A solution realizes architecture in a specific implementation context.

### Concern, stakeholder, viewpoint, view

- **Stakeholder:** individual, team, organization, or class with interests in the system.
- **Concern:** an interest relevant to one or more stakeholders.
- **Viewpoint:** conventions for constructing and using a view to address concerns.
- **View:** representation of the system from the perspective of related concerns.

Mnemonic: **People have concerns; viewpoints prescribe; views show.**

### Requirement vs principle vs constraint

- **Requirement:** a statement of need that must be met.
- **Principle:** durable general rule guiding decisions.
- **Constraint:** restriction limiting possible realization.

A principle can generate or shape requirements. A requirement is managed and traced. A constraint narrows acceptable options.

### Baseline, Target, gap

- **Baseline Architecture:** relevant current state.
- **Target Architecture:** intended future state.
- **Gap:** difference requiring action, including what is new, removed, retained, or changed.

### Architecture Roadmap vs Implementation and Migration Plan

- **Architecture Roadmap:** packages change into a time-oriented path, often including work packages and Transition Architectures.
- **Implementation and Migration Plan:** more detailed execution plan, priorities, projects, resources, and migration sequencing.

### Deliverable, artifact, building block

- **Deliverable:** contractually specified, formally reviewed work product.
- **Artifact:** granular architecture work product, generally a catalog, matrix, or diagram.
- **Building block:** a potentially reusable component of capability.

Deliverables may contain artifacts; artifacts describe building blocks.

### ABB and SBB

- **Architecture Building Block (ABB):** required capability and its specification, technology-neutral enough to preserve design choice.
- **Solution Building Block (SBB):** implementation-oriented component that realizes all or part of an ABB.

Mnemonic: **ABB says what capability; SBB says how realized.**

## 2.5 Content categories

Artifacts commonly fall into:

- **Catalog:** lists of building blocks or items.
- **Matrix:** relationships between items.
- **Diagram:** graphical representation of items and relationships.

The content framework promotes consistency, completeness, traceability, and reuse. It should be tailored.

## 2.6 Repository and Enterprise Continuum

### Architecture Repository

A logical store for architecture outputs and related assets. Common conceptual areas include architecture metamodel, architecture capability, architecture landscape, standards information, reference library, and governance log.

### Enterprise Continuum

A classification mechanism that helps organize and communicate architecture and solution assets from generic to organization-specific. It is not itself a repository.

Key distinction: **the Repository stores; the Continuum classifies and provides context.**

### Architecture Continuum and Solutions Continuum

- **Architecture Continuum:** progression of architecture assets from generic foundation architectures toward organization-specific architectures.
- **Solutions Continuum:** corresponding progression of solution implementations and products.

## 2.7 Reference concepts

- **Reference Model:** abstract framework or common vocabulary for a domain.
- **Reference Architecture:** reusable architecture pattern or structure for a context.
- **Pattern:** reusable solution to a recurring problem in context.
- **Standard:** agreed rule or specification supporting consistency and interoperability.

## 2.8 Capability-based planning

A business-planning technique focused on the capabilities an enterprise needs to achieve outcomes. Capabilities are relatively stable compared with organization charts and projects, making them useful for investment and transformation planning.

## 2.9 Value streams and business capabilities

- **Value stream:** end-to-end sequence of value-creating stages for a stakeholder.
- **Business capability:** what the business can do, independent of a particular organization structure or process implementation.

Value streams describe value flow; capabilities describe abilities needed to enable it.

## 2.10 Interoperability

Interoperability is the ability to share information and services effectively. Analyze business, information/data, application, and technology concerns rather than treating it as only a technical interface issue.

## 2.11 Risk

Architecture risk is uncertainty that may affect objectives. Manage it iteratively: identify, assess impact and probability, define response, assign ownership, monitor residual risk.

## 2.12 Definition flashcards

- **ADM:** iterative method for developing, maintaining, and using Enterprise Architecture.
- **Architecture Capability:** organization, roles, skills, processes, governance, and tools needed to practice architecture.
- **Architecture Board:** governance body overseeing architecture decisions and compliance.
- **Architecture Contract:** joint agreement between development partners and sponsors concerning deliverables, quality, fitness for purpose, and responsibilities.
- **Architecture Compliance:** degree to which implementation conforms to architecture.
- **Transition Architecture:** architecturally significant intermediate state between Baseline and Target.
- **Work Package:** set of actions designed to achieve one or more objectives.
- **Plateau:** relatively stable state of the architecture.
- **Architecture Vision:** high-level aspirational view and business value used to secure approval and mobilize stakeholders.
- **Statement of Architecture Work:** scope, approach, governance, work plan, deliverables, and terms for an architecture engagement.

# PDF-enriched exam knowledge

## Enterprise Architecture's four broad purposes

1. **Support Strategy:** define an end-to-end Target Architecture and long-range change roadmaps, commonly spanning several programs or portfolios.
2. **Support Portfolio:** coordinate a cross-functional, multi-project change portfolio; identify projects, dependencies, synergies, and governance needs.
3. **Support Project:** clarify project purpose and value, identify cross-project requirements and future dependencies, and assure architecture compliance.
4. **Support Solution Delivery:** constrain and guide solution design and deployment, including controls, requirements, and implementation governance.

## The framework as a system

The ADM is central. Architecture Capability and Governance operate the method. ADM Techniques, Applying the ADM guidance, Series Guides, and Library assets support it. The method produces Architecture Content, which is governed and stored for use and reuse.

## Architecture abstraction and landscape levels

- **Strategic Architecture:** high-level organizing framework and executive direction across a broad scope.
- **Segment Architecture:** portfolio, program, product, or major functional segment direction and roadmaps.
- **Capability Architecture:** detailed architecture for realizing a capability or capability increment, often close to delivery.

## Additional glossary for exam recall

- **Architecture Landscape:** representation of architecture assets in use or planned at particular times.
- **Architecture Project:** effort to define the Enterprise Architecture, normally covering ADM A-F and their Requirements Management.
- **Capability Increment:** discrete portion of a capability architecture delivering specific value.
- **Foundation Architecture:** generic building blocks, relationships, principles, and guidelines on which more specific architectures can be built.
- **Metamodel:** model defining the entity types, relationships, and structure used to describe architecture.
- **Minimum Viable Architecture:** minimum realizable architecture that adds business value and satisfies known requirements without unnecessary content.
- **Plateau/transition state:** relatively stable architecture state used to reason about progression.
- **Service:** repeatable behavior that a building block can be requested or triggered to perform.
- **Solution Architecture:** focused description of a business operation or activity and how IS/IT supports it.
- **Work Package:** coordinated actions to achieve one or more business objectives; it may be part of a project, a whole project, or a program.

## Certification-critical definition chain

**Driver -> Goal/Outcome -> Stakeholder Concern -> Requirement -> Principle/Constraint -> Architecture Decision -> ABB -> SBB -> Work Package -> Project -> Deployed Solution -> Value Measurement**

Use this chain to test scenario answers. A good option maintains traceability across it.

