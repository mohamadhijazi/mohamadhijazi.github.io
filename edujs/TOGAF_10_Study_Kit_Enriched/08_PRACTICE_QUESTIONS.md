# 8. Original Practice Questions

These are original questions, not recalled exam items.

## Part 1 style

### Q1
Which statement best distinguishes a view from a viewpoint?

A. A view stores architecture assets; a viewpoint classifies them.  
B. A viewpoint defines conventions for constructing a representation; a view is the resulting representation addressing concerns.  
C. A view is a requirement; a viewpoint is a principle.  
D. They are synonyms.

**Answer: B.** A viewpoint specifies conventions; a view represents the system for related stakeholder concerns.

### Q2
What is the primary purpose of the Preliminary Phase?

A. Finalize the migration sequence.  
B. Establish the capability and organizational context for architecture work.  
C. Govern solution implementation.  
D. Develop the Target Technology Architecture.

**Answer: B.**

### Q3
Which phase primarily creates the high-level vision and secures approval for the architecture work?

A. Phase A  
B. Phase D  
C. Phase F  
D. Phase H

**Answer: A.**

### Q4
Requirements Management is best described as:

A. a phase performed after Phase D;  
B. a project-management process only;  
C. a continuous process interacting with all ADM phases;  
D. a repository classification scheme.

**Answer: C.**

### Q5
What is the best distinction between an ABB and an SBB?

A. ABBs are implementation products; SBBs are stakeholder concerns.  
B. ABBs specify required capability; SBBs represent implementation-oriented realization.  
C. ABBs are diagrams; SBBs are catalogs.  
D. There is no distinction.

**Answer: B.**

### Q6
Which item most directly helps classify reusable assets from generic to organization-specific?

A. Architecture Contract  
B. Enterprise Continuum  
C. Architecture Vision  
D. Compliance Review

**Answer: B.**

### Q7
Which phase primarily groups gaps into work packages and identifies Transition Architectures?

A. E  
B. F  
C. G  
D. H

**Answer: A.**

### Q8
Which phase primarily finalizes prioritization and the Implementation and Migration Plan?

A. A  
B. C  
C. F  
D. G

**Answer: C.**

### Q9
A catalog, matrix, and diagram are types of:

A. artifacts;  
B. principles;  
C. contracts;  
D. requirements categories.

**Answer: A.**

### Q10
What should happen when an implementation materially deviates from the approved architecture?

A. Ignore it if the project is on schedule.  
B. Immediately cancel the project.  
C. Assess through compliance governance and remediate or approve a controlled exception.  
D. Begin Phase B without review.

**Answer: C.**

### Q11
Which domain focuses on logical and physical data assets and data management resources?

A. Business  
B. Data  
C. Application  
D. Technology

**Answer: B.**

### Q12
The structure of the 10th Edition is characterized by:

A. Fundamental Content and Series Guides;  
B. only one monolithic implementation manual;  
C. removal of the ADM;  
D. replacement of governance with agile delivery.

**Answer: A.**

## Part 2 style

### Scenario 1: inconsistent architecture practice

Business units use incompatible templates and approve exceptions informally. Leadership wants a common EA approach before a major transformation.

A. Start detailed Application Architecture immediately.  
B. Establish Architecture Capability, decision rights, principles, tailored method, repository, and governance; then initiate scoped cycles.  
C. Select a single software vendor and require all units to migrate.  
D. Ask each project to document its own architecture after implementation.

**Best: B (5).** It addresses the Preliminary Phase problem comprehensively.  
**Second: D (1 at best).** Documentation is too late and lacks common governance.  
**A and C: 0.** They bypass capability and business context.

### Scenario 2: attractive product before requirements

A sponsor wants immediate purchase of a cloud platform. Stakeholders have not agreed outcomes, data-residency concerns, or operating responsibilities.

A. Approve purchase because cloud is strategic.  
B. Reject all cloud products.  
C. Use Phase A stakeholder work and a business scenario to clarify outcomes, concerns, scope, requirements, risk, and value before evaluating conformance of options.  
D. Create only a detailed network diagram.

**Best: C (5).**  
**A/B: 0.** Predetermined solution decisions.  
**D: 1.** Potentially useful later but fails to establish business and stakeholder needs.

### Scenario 3: target cannot be reached in one release

The Target Architecture is agreed, but legacy dependencies and regulatory dates prevent a single cutover.

A. Define Transition Architectures and group gaps into work packages, then prioritize migration based on value, risk, and dependency.  
B. Ignore the Target and let each project decide.  
C. Repeat only stakeholder identification.  
D. Move directly to compliance review without a roadmap.

**Best: A (5).** It correctly links E and F.  
**C: 1.** Stakeholder review helps but is insufficient.  
**B/D: 0.**

### Scenario 4: implementation deviation

A delivery team proposes replacing an approved integration pattern to meet a deadline. The change may increase long-term operating risk.

A. Permit it verbally for speed.  
B. Reject it without analysis.  
C. Assess it against requirements, principles, risk, and Architecture Contract; use compliance governance to require remediation or grant documented dispensation with conditions.  
D. Rewrite the enterprise strategy.

**Best: C (5).**  
**B: 3.** It protects conformance but lacks impact analysis and governed alternatives.  
**A: 0; D: 0.**

### Scenario 5: change after deployment

A new regulation affects data retention across the enterprise after the architecture has been deployed.

A. Use Phase H to assess impact and risk, update requirements, and determine whether maintenance or a new ADM cycle is necessary.  
B. Treat the architecture as complete and take no action.  
C. Change database settings without stakeholder or legal review.  
D. Restart every architecture effort automatically.

**Best: A (5).**  
**D: 1.** It recognizes change but is disproportionate.  
**B/C: 0.**

## Self-review prompts

For every incorrect answer, write:

1. What category did I confuse?
2. Which phase or technique applies?
3. Which words in the scenario were decisive?
4. Why is the best option more complete than the second-best?
