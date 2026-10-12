# Enterprise Agentic AI Architecture & C4 Governance Platform

Interactive architectural modeling tool built with pure vanilla **HTML5**, **CSS3**, and **Modern JavaScript (ES6+)**. This application visualizes the complete reference architecture for modern enterprise Agentic AI platforms with responsibility mapping (**RACI**) across multidisciplinary teams and full **C4 Model** engineering views.

## Architecture Scope

The architecture covers all 10 core enterprise AI capability tiers:
1. **Multi-Interaction Channels**: Omnichannel ingress (Next.js Copilot Web UI, Mobile SDKs, Enterprise ChatOps for Slack & MS Teams, Realtime Voice/WebRTC, Headless REST/GraphQL APIs).
2. **Guardrails & Safety Firewall**: Dual-sided (Ingress/Egress) security interceptor (Prompt injection defense, Jailbreak detection, Presidio PII tokenization vault, Toxicity filters, Hallucination/Groundedness verification, JSON Schema validation).
3. **Agentic Orchestrator & State Engine**: Cognitive brain (LangGraph / AutoGen / CrewAI runtime, Task graph DAG decomposition, ReAct & Reflection reasoning loops, Temporal state checkpoints, Human-in-the-Loop approval gates, Dynamic tool caller).
4. **Multi-Agent Swarm & Specialists**: Ecosystem of specialized autonomous agents (Supervisor Agent, Deep Research Agent, Sandboxed Code Runner, SQL Data Analyst, Critic/Verification Agent).
5. **Decision & Policy Engine**: Hybrid decisioning combining Policy-as-Code (Open Policy Agent / Rego), deterministic business rules (Drools/JSON Rules), probabilistic confidence thresholds, and risk escalation workflows.
6. **Model Context Protocol (MCP) Hub**: Standardized tool discovery and execution implementing Anthropic's Model Context Protocol (PostgreSQL/Snowflake MCPs, Enterprise SaaS MCPs for SAP/Salesforce/Jira, Git & Filesystem MCPs).
7. **Multi-LLM Inference & Gateway Tier**: Intelligent gateway (LiteLLM proxy, Redis Semantic Caching, Tier 1 Frontier models, Tier 2 Fast models, Self-hosted vLLM/Triton open-source models, Automated failover).
8. **Data & Core Infrastructure Tier**: High-scale data backbone (Milvus/Qdrant/pgvector hybrid search, Chunking pipelines, Redis cluster session state, Kubernetes GPU Operator with NVIDIA H100/A100 nodes, S3/GCS object storage).
9. **AIOps & Observability Platform**: Continuous telemetry & production quality monitoring (OpenTelemetry GenAI semantic conventions, Langfuse distributed tracing, Ragas/DeepEval RAG benchmarks, Model drift alerts).
10. **FinOps & Unit Economics Governance**: Financial governance (Real-time token metering, Departmental cost attribution, Hard budget caps, Semantic cache ROI analytics, Model down-tiering recommendations).

---

## Architectural Views

### View 1: Layer Responsibility & RACI Matrix
- Comprehensive tabular matrix mapping all 10 architectural layers against the 4 key enterprise teams:
  - **AI Team** (Data Science, ML Engineering, Agent Engineers, Prompt Specialists)
  - **Product Team** (Product Managers, Conversational UX Designers, Business SMEs)
  - **Governance Team** (AI Ethics, Legal Counsel, Regulatory Compliance for EU AI Act & NIST AI RMF, Audit Leads)
  - **Cyber Security Team** (AppSec, Red Teamers, Zero-Trust IAM Specialists, SecOps)
- Interactive features:
  - Team Filter (Highlight and filter to show only layers where a specific team is **Responsible (R)** or **Accountable (A)**).
  - Expandable in-depth technical details per layer: Core Components, Security Controls, Governance Checkpoints, FinOps Levers, AIOps SLAs, and Deliverables.
  - Deep-dive inspection drawer.

### View 2: C4 Level 1 - System Context Diagram
- Shows the Enterprise AI Platform boundary within the broader enterprise ecosystem:
  - Enterprise Personas: Business User, AI Developer, Governance Auditor.
  - External Foundation Models: OpenAI, Anthropic, Google Vertex AI.
  - Enterprise Systems: SAP, Salesforce, Jira, Snowflake.
  - Identity & Access Provider: Okta / Microsoft Entra ID.
  - Regulatory Archives.

### View 3: C4 Level 2 - Container Diagram
- Detailed container landscape showing all 11 technical containers running within the platform boundary, their tech stacks, protocols (HTTP/2, gRPC, JSON-RPC over MCP, Kafka, SSE), and team ownership badges.
- Interactive click-to-inspect for any container or inter-container communication edge.

### View 4: C4 Level 3 - Component Diagram
- In-depth architectural decomposition of the **Agentic Orchestrator & Swarm Runtime** container:
  - Session & Context Coordinator
  - Graph Decomposition & Planner (ReAct / LangGraph)
  - Multi-Agent Swarm Supervisor
  - Specialist Agents Pool (Research, Code, SQL, Critic)
  - Working Memory & Scratchpad
  - Human-in-the-Loop Checkpointer
  - MCP Client & Tool Invoker
  - Multi-LLM Client Connector
  - Guardrail Interceptor & AIOps Telemetry Emitter

### View 5: Dynamic Execution Trace (Interactive Simulation)
- Step-by-step interactive simulation tracing an end-to-end request:
  - *Scenario*: "Analyze Q3 regional revenue dip, pull ERP audit records, check fraud policy, and generate executive summary."
  - Follows steps 1 through 11 with live protocol inspection, guardrail check scores, FinOps token billing, and dynamic spotlighting on the C4 Container diagram.

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

## Regulatory & Standards Compliance
- **EU AI Act (Regulation 2024/1689)**: Article 50 transparency requirements, Article 14 human oversight checkpointers, Article 15 cybersecurity safeguards.
- **NIST AI Risk Management Framework (AI RMF 1.0)**: Govern, Map, Measure, Manage functions embedded across the RACI matrix.
- **C4 Model**: Context (L1), Containers (L2), Components (L3) based on Simon Brown's software architecture visualization framework.
- **Model Context Protocol (MCP)**: Tool integration aligned with Anthropic's open MCP specification.

