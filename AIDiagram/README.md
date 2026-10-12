# Enterprise Agentic AI Architecture & C4 Governance Platform

Interactive reference architecture built with pure vanilla **HTML5**, **CSS3**, and **Modern JavaScript (ES6+)**. It maps enterprise AI responsibilities (**RACI**), capability layers, illustrative C4 views, and example execution traces. It describes design considerations; it is not evidence that any control is deployed or that an organization complies with a law or standard.

## Architecture Scope

The architecture covers 14 enterprise AI capability layers, including the runtime, engineering lifecycle, business operating model, and supporting enterprise services:
1. **Multi-Interaction Channels**: Omnichannel ingress (Next.js Copilot Web UI, Mobile SDKs, Enterprise ChatOps for Slack & MS Teams, Realtime Voice/WebRTC, Headless REST/GraphQL APIs).
2. **Guardrails & Safety Firewall**: Dual-sided (Ingress/Egress) security interceptor (Prompt injection defense, Jailbreak detection, Presidio PII tokenization vault, Toxicity filters, Hallucination/Groundedness verification, JSON Schema validation).
3. **Agentic Orchestrator & State Engine**: Agent harness and cognitive runtime (bounded model/tool loop, LangGraph / AutoGen / CrewAI, task graph decomposition, ReAct / reflection, state checkpoints, human approval, and tool dispatch).
4. **Multi-Agent Swarm & Specialists**: Ecosystem of specialized autonomous agents and a versioned Agent Skills Catalog for reusable instructions and assets (Supervisor Agent, Deep Research Agent, Sandboxed Code Runner, SQL Data Analyst, Critic/Verification Agent).
5. **Decision & Policy Engine**: Hybrid decisioning combining Policy-as-Code (Open Policy Agent / Rego), deterministic business rules (Drools/JSON Rules), probabilistic confidence thresholds, and risk escalation workflows.
6. **Model Context Protocol (MCP) Hub**: Standardized tool discovery and execution implementing Anthropic's Model Context Protocol (PostgreSQL/Snowflake MCPs, Enterprise SaaS MCPs for SAP/Salesforce/Jira, Git & Filesystem MCPs).
7. **Multi-LLM Inference & Gateway Tier**: Intelligent gateway (LiteLLM proxy, Redis Semantic Caching, Tier 1 Frontier models, Tier 2 Fast models, Self-hosted vLLM/Triton open-source models, Automated failover).
8. **Data, Software & Compute Infrastructure**: Cloud/on-prem platform foundation (CPU/GPU hardware, Kubernetes, networks, service mesh, vector/relational databases, object storage, capacity management, backup and disaster recovery).
9. **AIOps & Observability Platform**: Continuous telemetry & production quality monitoring (OpenTelemetry GenAI semantic conventions, Langfuse distributed tracing, Ragas/DeepEval RAG benchmarks, Model drift alerts).
10. **FinOps & Unit Economics Governance**: Financial governance (Real-time token metering, Departmental cost attribution, Hard budget caps, Semantic cache ROI analytics, Model down-tiering recommendations).
11. **Enterprise AI Applications & Business Workflows**: Application portfolio, use-case intake and prioritization, process integration, named business owners, human handoff, adoption, and business outcome measures.
12. **Enterprise Data Governance & Knowledge Lifecycle**: Data ownership, classification, consent, quality, lineage, versioned corpora, RAG ingestion, freshness, retention, correction, and deletion.
13. **AI Engineering, MLOps & Release Lifecycle**: Experiment and artifact tracking, model/prompt/agent/skill registries, evaluation gates, approvals, signed releases, canary deployment, rollback, and retirement.
14. **Enterprise AI Operating Model, Policies & Service Management**: People and accountability, policies, procedures, runbooks, service levels, training, incident and problem management, vendor review, and audit evidence.

---

## Architectural Views

### View 1: Layer Responsibility & RACI Matrix
- Comprehensive tabular matrix mapping all 14 architectural layers against the 4 key enterprise teams:
  - **AI Team** (Data Science, ML / AI Platform Engineering, Agent Engineering, Prompt Specialists, MLOps / LLMOps)
  - **Product Team** (Product Managers, Business Process and Application Owners, UX, Finance / FinOps, Service Desk)
  - **Governance Team** (AI Ethics, Model Risk, Legal, Privacy / Data Governance, Third-Party Risk, Audit)
  - **Cyber Security Team** (AppSec, Red Teamers, IAM, Cloud Platform / SRE, IT Operations, Incident Response)
- Interactive features:
  - Team Filter (Highlight and filter to show only layers where a specific team is **Responsible (R)** or **Accountable (A)**).
  - Expandable in-depth technical details per layer: Core Components, Security Controls, Governance Checkpoints, FinOps Levers, AIOps SLAs, and Deliverables.
  - Deep-dive inspection drawer.

### View 2: C4 Level 1 - System Context Diagram
- Shows the Enterprise AI Platform boundary within the broader enterprise ecosystem:
  - Enterprise personas: Business User, AI Developer, Governance & SecOps Auditor.
  - External model providers, enterprise systems, and identity providers are illustrative examples.
  - Shows external relationships and system context; internal trust boundaries and enforcement points are detailed in layers and containers.

### View 3: C4 Level 2 - Container Diagram
- Detailed illustrative landscape showing 13 runtime, control-plane, workflow, and evidence containers, their example technologies, team ownership, mapped layers, trust boundaries, and primary request, authorization, retrieval, audit, and release flows. Protocols are named only where specified; topology, regions, and failure domains require deployment decisions.
- Interactive click-to-inspect for any container or inter-container communication edge.

### View 4: C4 Level 3 - Component Diagrams
  - Select any of the 14 architecture layers to see its listed internal responsibilities and components.
- Includes an additional in-depth decomposition of the **Agentic Orchestrator & Agent Harness Runtime** container:
  - Session & Context Coordinator
  - Graph Decomposition & Planner (ReAct / LangGraph)
  - Multi-Agent Swarm Supervisor
  - Agent Harness & Execution Control Loop
  - Agent Skills Catalog & Registry
  - Specialist Agents Pool (Research, Code, SQL, Critic)
  - Working Memory & Scratchpad
  - Human-in-the-Loop Checkpointer
  - MCP Client & Tool Invoker
  - Multi-LLM Client Connector
  - Guardrail Interceptor & AIOps Telemetry Emitter
- C4 Level 2 containers declare their mappings to one or more architecture layers; selecting a container opens the mapped layer specification.

### View 5: Dynamic Execution Trace (Interactive Simulation)
  - Selectable illustrative traces for a successful request and an expired-identity denial/recovery path.
  - Demonstrates identity propagation, policy checks, tool execution boundaries, evidence recording, and recovery. Example values and outcomes are not production measurements or guarantees.

---

## How to Run & View

### Option 1: Direct File
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari). Zero dependencies, zero build steps, and zero external CDNs required.

### Option 2: Local HTTP Server
Using Python:
```bash
python -m http.server 8000
# Open http://localhost:8000
```
Or using Node `npx serve`:
```bash
npx serve .
```

### Option 3: GitHub Pages
When pushed to GitHub, accessible directly at:
```
https://mohamadhijazi.github.io/AIDiagram/
```

---

## Governance References and Assumptions
- Risk classification and applicability review can consider the **EU AI Act (Regulation 2024/1689)**, **NIST AI Risk Management Framework (AI RMF 1.0)**, sector rules, and local requirements. Naming a framework does not establish applicability or compliance.
- Human oversight, evidence retention, SLOs, RTO/RPO, regional placement, provider terms, and failure policies require service-specific decisions and accountable owners. Where no approved values are provided, the architecture marks them as TBD or illustrative.
- Detection, redaction, evaluation, and audit mechanisms reduce and help manage risk; they do not guarantee prevention, correctness, availability, or legal compliance.
- Named vendors, sample model choices, costs, metric values, and thresholds in the matrix and successful-request trace are illustrative examples unless an organization separately adopts them as approved targets.
- **C4 Model**: Context (L1), Containers (L2), Components (L3) are used as architecture views; L3 layer diagrams list responsibilities and are not full deployable component specifications.
- **Model Context Protocol (MCP)**: Used as an example tool integration interface; actual protocol versions, transports, and security profiles are deployment choices.

