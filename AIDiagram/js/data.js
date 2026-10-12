/**
 * AI Architecture Diagram Data Store
 * Comprehensive definitions for:
 * - Architectural Layers (Matrix View with RACI for AI, Product, Governance, Cyber Security)
 * - C4 Level 1: System Context Diagram
 * - C4 Level 2: Container Diagram
 * - C4 Level 3: Component Diagram (Agent Harness / Orchestrator Deep-Dive)
 * - Dynamic Flow: Interactive End-to-End Execution Trace
 */

const ARCHITECTURE_DATA = {
  meta: {
    title: "Enterprise Agentic AI Architecture Platform",
    version: "2.5.0",
    lastUpdated: "October 2026",
    author: "Enterprise AI Architecture Board"
  },

  teams: {
    ai: {
      id: "ai",
      name: "AI & ML Team",
      short: "AI Team",
      color: "#3b82f6", // Blue
      lightBg: "rgba(59, 130, 246, 0.12)",
      border: "rgba(59, 130, 246, 0.4)",
      roleDescription: "Builds, fine-tunes, and evaluates models, prompt graphs, agent workflows, and semantic routing logic.",
      coreMembers: ["ML Engineers", "Agent Engineers", "Prompt Engineers", "Data Scientists", "AI Platform Engineers", "MLOps / LLMOps Engineers"]
    },
    product: {
      id: "product",
      name: "Product & UX Team",
      short: "Product Team",
      color: "#10b981", // Emerald Green
      lightBg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.4)",
      roleDescription: "Defines user journeys, multi-channel experiences, domain workflows, business ROI, and value delivery.",
      coreMembers: ["AI Product Managers", "UX / Conversational Designers", "Business Analysts", "Domain & Business Process Owners", "Enterprise Application Owners", "Finance / FinOps Analysts", "Service Desk Leads"]
    },
    governance: {
      id: "governance",
      name: "Governance & Risk Team",
      short: "Governance",
      color: "#f59e0b", // Amber/Gold
      lightBg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.4)",
      roleDescription: "Coordinates risk classification, applicability review, ethical review, bias assessment where relevant, and corporate audit evidence.",
      coreMembers: ["AI Ethics Officers", "Compliance Analysts", "Legal Counsel", "Model Risk Officers", "Privacy & Data Governance Officers", "Third-Party Risk Officers", "Audit Leads"]
    },
    security: {
      id: "security",
      name: "Cyber Security & AppSec",
      short: "Cyber Security",
      color: "#ef4444", // Crimson Red
      lightBg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.4)",
      roleDescription: "Protects against prompt injection, jailbreaks, data exfiltration, secret leakage, and enforces Zero-Trust boundaries.",
      coreMembers: ["AppSec Engineers", "Red Teamers / Jailbreak Testers", "IAM Specialists", "Cloud Platform / SRE Engineers", "IT Operations & Incident Managers", "SecOps Analysts"]
    }
  },

  layers: [
    {
      id: "channels",
      name: "Multi-Interaction Channels",
      category: "Interaction & Ingress",
      description: "Omni-channel ingress enabling conversational, programmatic, ambient, and multimodal interactions across the enterprise.",
      techStack: ["Next.js Copilot UI", "React Native", "Slack Bot / Teams SDK", "WebRTC / Whisper Voice Gateway", "GraphQL & REST Endpoints", "Kafka Event Listeners"],
      components: [
        "Conversational Copilot Web UI",
        "Mobile Agent Client SDKs",
        "Enterprise ChatOps (Slack / MS Teams)",
        "Voice & Realtime Audio Ingress",
        "Headless API & Webhook Ingestion",
        "Human Identity Federation & Session Authentication",
        "Workload Identity Bootstrap for Service-to-Service Calls",
        "Tenant Context, Request Correlation & Consent Envelope"
      ],
      raci: {
        ai: { role: "C", details: "Advises on streaming latency budgets, context payload constraints, and multimodal token handling." },
        product: { role: "R/A", details: "Primary owner of channel feature parity, conversational UX, feedback loops, and customer journeys." },
        governance: { role: "C", details: "Audits consent disclosures, AI transparency banners (e.g. EU AI Act Article 50), and accessibility." },
        security: { role: "R", details: "Enforces OAuth2 / OIDC mutual TLS, WAF, bot mitigation, CSRF, and rate limiting per client channel." }
      },
      keyDeliverables: ["Channel Adapters", "Streaming SSE Clients", "Human Feedback (Thumbs up/down) Widgets", "Enterprise Single Sign-On"],
      governanceTouchpoints: ["User AI Disclosure Banner", "Explicit Opt-in for Voice Biometrics", "Session Retention Disclaimers"],
      securityControls: ["Authenticate human and workload identities separately; reject missing, expired, or invalid credentials", "Bind tenant, purpose, and correlation context to each request; do not infer identity from model output", "Cloudflare WAF / AWS Shield", "mTLS Channel Endpoints", "Session Token Revocation", "Input Rate Caps"],
      finopsLevers: ["Client-side caching of static responses", "Debounce high-frequency keystrokes", "Channel-specific token budgets"],
      aiopsMetrics: ["Channel P50/P95/P99 latency by journey (targets set by service owner)", "Client-side dropout and streaming stability"]
    },
    {
      id: "guardrails",
      name: "Guardrails & Safety Firewall",
      category: "Security & Alignment",
      description: "Dual-sided (Ingress & Egress) safety firewall intercepting malicious inputs, jailbreaks, PII leakage, hallucinations, and harmful outputs.",
      techStack: ["NVIDIA NeMo Guardrails", "Meta Llama Guard 3", "Microsoft Presidio (PII)", "Lakera Gandalf Defenses", "Custom Regex & Embedding Classifiers"],
      components: [
        "Prompt Injection & Jailbreak Detector",
        "PII Anonymization & Token Vault",
        "Toxicity & Hate Speech Sanitizer",
        "Hallucination & Groundedness Checker",
        "System Prompt Leakage Prevention",
        "Structured JSON Schema Enforcer",
        "Retrieved-Content and Model-Output Trust Boundary Classifier",
        "Secret / PII Egress Minimization and Redaction Gate",
        "Untrusted Tool-Result and Agent-Handoff Labeling"
      ],
      raci: {
        ai: { role: "R", details: "Trains domain classifiers, tunes safety embeddings, benchmark false-positive rates on domain vocabulary." },
        product: { role: "C", details: "Defines acceptable brand tone, escalation fallback messages, and frictionless user recovery paths." },
        governance: { role: "A", details: "Sign-off on risk thresholds, regulatory safety taxonomies, ethical boundaries, and compliance reports." },
        security: { role: "R/A", details: "Owns prompt injection defenses, vulnerability red-teaming, zero-day jailbreak mitigations, and secret detection." }
      },
      keyDeliverables: ["Dual Ingress/Egress Interceptor Pipeline", "Zero-PII Tokenizer Vault", "Automated Red-Teaming Test Suites"],
      governanceTouchpoints: ["Risk register maps direct/indirect injection, poisoned or stale knowledge, unsafe parameters, exfiltration, secret/PII leakage, and repeated actions to enforcement point, accountable owner, decision, and auditable outcome", "Review applicable obligations and safety thresholds for the use case; framework references do not establish compliance", "Audit Trail of Intercepted Prompts"],
      securityControls: ["Treat user prompts, retrieved documents, provider responses, tool results, and agent handoffs as untrusted data", "Screen for direct/indirect prompt injection and unsafe parameters; detection informs policy and is not a prevention guarantee", "Validate tool arguments against schemas and authorization before execution", "Redact/minimize secrets and PII before provider egress; deny or route to approved private inference when policy requires", "If required guardrail checks are unavailable, deny consequential actions; any lower-risk degraded mode requires explicit policy", "Multi-layer Classifier Ensemble", "TruffleHog Secret Scans", "Prompt Obfuscation De-cloaker"],
      finopsLevers: ["Fast-path heuristic reject (avoids costly LLM invocation for banned prompts)", "Lightweight embedding filter before LLM guard"],
      aiopsMetrics: ["Guardrail latency overhead", "False-positive and false-negative rates by threat class (risk-based targets TBD)", "Adversarial test coverage and escape rate"]
    },
    {
      id: "orchestrator",
      name: "Agentic Orchestrator & State Engine",
      category: "Cognitive Core",
      description: "Agent harness and central orchestration runtime managing bounded model/tool turns, context, plan execution, stateful checkpoints, policy hooks, and recovery.",
      techStack: ["Agent Harness / Execution Loop", "LangGraph Runtime", "AutoGen / CrewAI Engine", "FastAPI Asynchronous Gateway", "Temporal.io Workflow Coordinator", "Redis State Checkpoints"],
      components: [
        "Task Graph Decomposition Engine",
        "Agent Harness & Bounded Execution Loop",
        "ReAct & Reflection Loop Controller",
        "Short-term Working Memory Manager",
        "Checkpoint & State Store",
        "Human-in-the-Loop (HITL) Interrupter",
        "Dynamic Tool Calling Dispatcher",
        "Delegated Identity & Authorization Context Propagator",
        "Durable Workflow, Timeout, Retry & Idempotency Coordinator",
        "Cancellation, Backpressure & Dead-Letter Recovery Controller",
        "Human Approval Evidence, Expiry & Revocation Handler"
      ],
      raci: {
        ai: { role: "R/A", details: "Designs graph topologies, prompt templates, reflection heuristics, loop limits, and state machines." },
        product: { role: "C", details: "Defines task completion criteria, escalation boundaries, human-handoff rules, and multi-turn expectations." },
        governance: { role: "C", details: "Reviews autonomous agent permissions, ensures human override capability, and enforces accountability chains." },
        security: { role: "R", details: "Enforces least-privilege tool execution tokens, sandbox isolation, and prevention of infinite reasoning loops." }
      },
      keyDeliverables: ["Stateful Workflow Graphs", "Bounded Agent Harness Runtime", "Human Checkpoint UI Integration", "Agent Context Cache"],
      governanceTouchpoints: ["Human-in-the-Loop (HITL) Approval Records", "Explainability Logs of Agent Reasoning Steps"],
      securityControls: ["Propagate actor, tenant, purpose, and authorization decision context to retrieval and tools; use short-lived, audience-bound delegated credentials", "Re-authorize every resource and action at the enforcement point; least privilege and tenant isolation; deny on absent/expired context", "Maximum Step, Time & Token Budgets", "Per-Agent Tool and Identity Scopes", "Sandboxed Execution Boundaries", "Ephemeral Memory Auto-purge"],
      finopsLevers: ["Prune past trajectory history under approved context policy", "Early exit based on calibrated, use-case-specific confidence and risk thresholds"],
      aiopsMetrics: ["Agent plan success and safe termination rate", "Average steps per goal", "Checkpoint serialization time and recovery outcomes"]
    },
    {
      id: "multiagent",
      name: "Multi-Agent Swarm & Specialists",
      category: "Cognitive Core",
      description: "Ecosystem of specialized autonomous agents (research, coding, data analysis, critique) operating in hierarchical or peer swarms.",
      techStack: ["Hierarchical Supervisor Pattern", "Versioned Agent Skills Catalog", "A2A (Agent-to-Agent) Pub/Sub", "Python Dynamic Sandboxes", "Docker Tool Runners", "Ray Core Cluster"],
      components: [
        "Supervisor / Orchestrator Agent",
        "Agent Skills Catalog & Registry",
        "Deep Research & Document Synthesis Agent",
        "Code Generation & Sandboxed Runner Agent",
        "SQL & Enterprise Data Analyst Agent",
        "Critic & Quality Verification Agent",
        "Domain Specialist Sub-agents",
        "Agent-to-Agent Delegation Envelope with Provenance and Scope",
        "Versioned Skills Trust, Review & Compatibility Metadata"
      ],
      raci: {
        ai: { role: "R/A", details: "Develops agent system personas, sub-goal delegation logic, multi-agent debate protocols, and evaluations." },
        product: { role: "C", details: "Validates domain accuracy of specialized agents and sets business metrics for multi-agent workflows." },
        governance: { role: "C", details: "Assesses agent autonomy risks, bias propagation across multi-agent consensus, and audit trails." },
        security: { role: "R", details: "Ensures containerized sandboxing for code-executing agents, egress network filtering, and role isolation." }
      },
      keyDeliverables: ["Agent Persona Definitions", "Multi-Agent Consensus Protocols", "Sandboxed Agent Worker Pods", "Sub-task Eval Suites"],
      governanceTouchpoints: ["Dual-Signoff on High-Stakes Actions", "Clear Attribution of Which Sub-Agent Made Specific Claims"],
      securityControls: ["Treat inter-agent messages and skill assets as untrusted; preserve source/provenance labels across handoffs", "Constrain delegated agents to task-specific tools, resources, and time budgets; deny unapproved privilege escalation", "gVisor / Firecracker Container Isolation", "No Internet Egress from Code Agent Sandbox", "Role-Based Agent Scopes"],
      finopsLevers: ["Assign lightweight models to sub-agents (e.g. Haiku/Flash for workers, Sonnet/GPT-4o for supervisor)", "Parallel batching"],
      aiopsMetrics: ["Multi-Agent Consensus Convergence Time", "Sub-Agent Failure Rate", "Inter-Agent Token Communication Overhead"]
    },
    {
      id: "decisions",
      name: "Decision & Policy Engine",
      category: "Governance & Control",
      description: "Hybrid decisioning system combining deterministic rule engines, Policy-as-Code (OPA), and probabilistic confidence gates.",
      techStack: ["Open Policy Agent (OPA) / Rego", "Camunda / Drools Business Rules", "Confidence Threshold Evaluator", "HITL Escalation Manager", "Risk Tier Matrix"],
      components: [
        "Policy-as-Code Engine (OPA / Rego)",
        "Probabilistic Routing Confidence Gate",
        "Deterministic Business Rules Validator",
        "Human-in-the-Loop Escalation Queue",
        "Action Impact & Financial Thresholds",
        "Resource-Level ABAC / Tenant Authorization Decision Point",
        "Human Review Queue with Decision Context, Expiry and Revocation",
        "Fail-Closed Policy and Evidence-Dependency Behavior"
      ],
      raci: {
        ai: { role: "C", details: "Provides confidence scores, uncertainty estimations, and calibrated probability outputs to the decision gate." },
        product: { role: "R", details: "Authors business logic, decision trees, risk escalation tiers, and customer-facing fallback logic." },
        governance: { role: "R/A", details: "Primary owner of corporate policy rules, regulatory guidelines, fair lending/credit policies, and compliance guards." },
        security: { role: "R", details: "Enforces access control policies (ABAC/RBAC) on action execution and validates digital signatures on decisions." }
      },
      keyDeliverables: ["Rego Policy Repository", "Automated Decision Audit Trail", "Escalation Workflow Dashboard", "Risk Scoring Matrix"],
      governanceTouchpoints: ["Compliance Certification of Policy Rules", "Immutable Decision Ledgers for Regulators (SEC/FINRA/HIPAA)"],
      securityControls: ["Re-authorize against resource ACL and current actor/delegation claims at action time; default deny when context is missing or stale", "Require idempotency key / deduplication for retryable consequential actions", "Cryptographically Signed Decisions", "ABAC Policy Evaluation at Runtime", "Immutable Audit Storage"],
      finopsLevers: ["Bypass LLMs entirely when deterministic rule matches 100% (Instant, 0-token cost execution)"],
      aiopsMetrics: ["Decision latency", "Human review and escalation rates", "Policy evaluation coverage for in-scope actions (target set by owner)"]
    },
    {
      id: "mcps",
      name: "Model Context Protocol (MCP) Hub",
      category: "Tool & Knowledge Integration",
      description: "Standardized tool integration layer implementing Anthropic's Model Context Protocol (MCP) for secure, plug-and-play tool discovery and execution.",
      techStack: ["MCP Specification (JSON-RPC over stdio / SSE)", "Official TypeScript & Python MCP SDKs", "Postgres MCP Server", "GitHub MCP Server", "Enterprise ERP MCP Adapters"],
      components: [
        "MCP Client Host Runtime",
        "MCP Server Registry & Discovery",
        "Database & Data Warehouse MCPs (Postgres, Snowflake)",
        "Enterprise SaaS MCPs (Salesforce, SAP, Jira)",
        "Developer Ecosystem MCPs (Git, Filesystem, Terminal)",
        "Dynamic Tool Schema Synthesizer",
        "Identity-Aware MCP Authorization & Resource ACL Adapter",
        "Tool Parameter Validation, Idempotency & Duplicate-Action Guard",
        "MCP Timeout, Retry/Backoff, Cancellation & Dead-Letter Handler"
      ],
      raci: {
        ai: { role: "R", details: "Integrates MCP tool schemas into agent prompt contexts, optimizes tool selection prompts, and validates JSON outputs." },
        product: { role: "C", details: "Identifies required business integrations (CRM, ERP, ticketing) and prioritizes MCP connectors." },
        governance: { role: "C", details: "Verifies that data accessed via MCP adheres to data residency laws, NDAs, and customer data segmentation." },
        security: { role: "R/A", details: "Secures MCP server authentication, credentials injection, API key rotation, parameter fuzzing, and egress firewalls." }
      },
      keyDeliverables: ["Standardized MCP Server Catalog", "Dynamic Tool Permission Gate", "Tool Parameter Injection Validator"],
      governanceTouchpoints: ["Data Minimization Audits on Tool Returns", "Data Residency Validation per MCP Connector"],
      securityControls: ["Use workload identity for MCP services and short-lived delegated user identity for user-scoped actions; never share a broad service credential", "Enforce resource-level authorization, tenant isolation, least privilege, parameter validation, and egress allowlists at each server", "Unsafe parameters, unauthorized actions, repeated non-idempotent requests, and missing identity context are denied and audited", "If a dependency fails, retry only bounded/idempotent actions with backoff; surface timeout or manual recovery for uncertain outcomes", "Scoped Tool Execution Credentials", "Parameter Schema Hardening (validate against injection; does not guarantee prevention)", "Egress Whitelisting"],
      finopsLevers: ["Payload pruning: Truncate large MCP tool outputs before injecting into LLM context window", "Cache static MCP tool results"],
      aiopsMetrics: ["Tool call success and denial rates", "MCP server response latency", "Timeout, retry, duplicate, and manual recovery rates"]
    },
    {
      id: "multillm",
      name: "Multi-LLM Inference & Gateway",
      category: "Inference & Foundation Tier",
      description: "Intelligent gateway providing semantic routing, model tiering, multi-provider failover, prompt caching, and cost-latency optimization.",
      techStack: ["LiteLLM Proxy Gateway", "OpenAI GPT-4o / o1", "Anthropic Claude 3.5 Sonnet / Haiku", "Google Gemini 1.5/2.0 Pro", "Local vLLM / Triton (Llama 3.3, Mistral)", "Redis Semantic Cache"],
      components: [
        "Semantic Router (Complexity & Task Classifier)",
        "Multi-Provider Gateway & Unified API",
        "Frontier Model Pool (GPT-4o, Claude 3.5 Sonnet, Gemini Pro)",
        "Fast/Cost-effective Model Pool (GPT-4o-mini, Haiku, Flash)",
        "Self-Hosted Private LLM Cluster (vLLM / Triton on GPUs)",
        "Semantic Response Cache & Prompt Caching",
        "Automatic Model Failover & Circuit Breaker",
        "Provider Privacy, Region & Egress Policy Router",
        "Provider Response Provenance and Untrusted-Output Contract"
      ],
      raci: {
        ai: { role: "R/A", details: "Evaluates model capabilities, configures semantic router thresholds, manages prompt caching, and fine-tunes OSS models." },
        product: { role: "C", details: "Defines acceptable trade-offs between response quality, output creativity, and latency per user tier." },
        governance: { role: "C", details: "Enforces vendor terms of service, zero-data-retention (ZDR) agreements, and sovereign AI requirements." },
        security: { role: "R", details: "Secures API keys via Key Vault, monitors prompt egress to third-party APIs, and validates encryption in transit." }
      },
      keyDeliverables: ["Multi-Model Dynamic Routing Rules", "Semantic Cache Layer", "Automated Failover Topology", "Private vLLM GPU Nodes"],
      governanceTouchpoints: ["Zero Data Retention (ZDR) Verification with Providers", "Sovereign Cloud Data Residency Compliance"],
      securityControls: ["Keep service/workload credentials in managed secrets; rotate and scope provider keys", "Apply tenant, data classification, purpose, residency, and approved-provider policy before egress", "Treat provider output as untrusted and validate before tool use or user delivery", "Encrypted Provider Keys in HashiCorp Vault", "TLS 1.3 Strict Ingress/Egress", "Prompt Scrubbing before External Cloud Egress"],
      finopsLevers: ["Semantic Cache Hit Ratio (>25% target savings)", "Model Down-tiering for simple tasks (90% cost drop)", "Prompt Caching discounts (up to 75% off)"],
      aiopsMetrics: ["Time to first token and tokens per second by workload", "Provider availability and failover outcomes (service targets TBD)", "Circuit-breaker and fallback rates"]
    },
    {
      id: "infra",
      name: "Data, Software & Compute Infrastructure",
      category: "Infrastructure, Software & Hardware",
      description: "Enterprise platform foundation spanning cloud and on-prem compute, CPU/GPU hardware, network, storage, data services, orchestration software, capacity, and recovery.",
      techStack: ["Kubernetes / Terraform / GitOps", "x86 / ARM CPU Nodes", "NVIDIA H100 / A100 or Equivalent GPU Accelerators", "VPC / Service Mesh / Load Balancers", "Milvus / Qdrant / pgvector", "PostgreSQL / Redis", "NVMe / Object Storage / Backup"],
      components: [
        "Distributed Vector Knowledge Base",
        "Hybrid Search (Dense + Sparse BM25) Engine",
        "Document Ingestion & Chunking Pipeline",
        "Distributed Session & Memory Store (Redis)",
        "General-Purpose CPU Compute & Container Runtime Pools",
        "GPU Accelerator, Inference & Training Hardware Pools",
        "Network Fabric, DNS, Load Balancing & Service Mesh",
        "Block, File, NVMe & Object Storage with Backup / Restore",
        "Infrastructure Provisioning, Patching & Capacity Management",
        "High Availability, Disaster Recovery & Regional Failover",
        "Durable Queue, Event Bus & Workflow Checkpoint Store",
        "Source ACL Snapshot, Index Version & Citation Metadata Store",
        "Tenant / Region / Environment Network and Egress Boundaries"
      ],
      raci: {
        ai: { role: "R", details: "Selects embedding models, chunking strategies, hybrid search reciprocal rank fusion (RRF), and vector indexes (HNSW)." },
        product: { role: "I", details: "Receives updates on storage capacity, search retrieval quality, and system scalability." },
        governance: { role: "C", details: "Ensures data retention policies, right-to-be-forgotten deletion in vector indexes, and role-based data partitioning." },
        security: { role: "R/A", details: "Secures Kubernetes network policies, enforces AES-256 encryption at rest, vector multi-tenancy isolation, and secret management." }
      },
      keyDeliverables: ["Compute / Network / Storage Service Catalog", "GPU Autoscaling and Capacity Plans", "Infrastructure-as-Code Modules", "Backup Restore and Disaster Recovery Playbooks"],
      governanceTouchpoints: ["Infrastructure implements governance-approved retention, correction, legal hold, and deletion; it does not set data purpose or retention policy", "Track deletion completion across replicas, embeddings, indexes, caches, and derived artifacts with evidence", "Validate tenant isolation and regional placement in each deployment environment"],
      securityControls: ["Row-Level Security (RLS) in Vector Search", "Kubernetes Network Policies & mTLS", "OS / Container / Firmware Patch Baselines", "FIPS 140-2 Compliant Key Storage"],
      finopsLevers: ["HNSW index quantization reducing RAM use", "Right-size CPU and GPU pools", "Spot GPU scaling for eligible offline workloads", "Storage tiering and retention"],
      aiopsMetrics: ["Retrieval recall/precision at selected K (risk-based target TBD)", "Vector search P95/P99 latency", "CPU / GPU / memory utilization", "Storage IOPS and capacity headroom", "Backup restore and failover outcomes against approved RTO/RPO"]
    },
    {
      id: "aiops",
      name: "AIOps & Observability Platform",
      category: "Operations & Quality",
      description: "Continuous telemetry, distributed LLM tracing, synthetic evals, prompt regression testing, drift detection, and automated alerting.",
      techStack: ["OpenTelemetry GenAI Semantic Conventions", "Langfuse / Arize Phoenix", "Ragas / DeepEval Framework", "Prometheus & Grafana", "PagerDuty Incident Bridge"],
      components: [
        "Distributed End-to-End LLM Tracing",
        "Continuous RAG & Agent Evaluation Suite (Ragas)",
        "Prompt Regression CI/CD Pipeline",
        "Model Drift & Output Quality Monitors",
        "Automated Incident Alerting & Triage",
        "Human Feedback & Ground Truth Annotations",
        "Privacy-Minimized Audit and Trace Correlation Pipeline",
        "Evaluation Dataset / Version Provenance and Risk-Based Threshold Registry",
        "SLO, Alert, On-Call and Incident Learning Dashboards"
      ],
      raci: {
        ai: { role: "R/A", details: "Builds synthetic eval datasets, defines Ragas metrics (Faithfulness, Answer Relevance), debugs trace spans." },
        product: { role: "R", details: "Monitors CSAT, thumb ratings, user task completion rates, and business conversion analytics." },
        governance: { role: "C", details: "Audits model performance degradation, tracks bias metric shifts over time, and exports compliance reports." },
        security: { role: "C", details: "Monitors anomaly spikes in token output, unexpected tool invocation bursts, and suspicious user interaction patterns." }
      },
      keyDeliverables: ["Trace Dashboard (Spans, Inputs, Tokens, Latency)", "Automated CI/CD Eval Gate", "Drift Detection Alarms", "Annotation Portal"],
      governanceTouchpoints: ["Model Card Updates Based on Continuous Evals", "Systemic Bias Degradation Notifications"],
      securityControls: ["Record actor/workload, tenant, purpose, policy and guardrail decisions, versions, citations, tool/action outcomes, approval identity, timing, and correlation IDs", "Minimize or redact prompts, outputs, secrets, and PII; restrict trace access and configure retention/legal hold", "If required audit evidence storage is unavailable, block consequential actions; safe read-only behavior follows an approved degraded-mode policy", "Sanitized Telemetry Storage", "Audit Logging of Trace Access", "Tamper-evident Log Retention"],
      finopsLevers: ["Sampling traces for high-volume non-critical queries to save telemetry storage costs", "Identifying expensive slow prompt chains"],
      aiopsMetrics: ["Evaluate task success, groundedness, quality, robustness, safety/security, privacy, fairness where relevant, and calibration/uncertainty where relevant", "Record evaluation dataset and system versions, thresholds, reviewer, and release decision", "Set service-specific latency, availability, recovery, and incident targets (TBD until owned)"]
    },
    {
      id: "finops",
      name: "FinOps & Unit Economics Governance",
      category: "Financial Operations",
      description: "Real-time token metering, per-department cost allocation, budget ceilings, dynamic rate-limiting, and unit economics optimization.",
      techStack: ["ClickHouse Metering Store", "Redis Token Bucket Rate Limiter", "Stripe / Internal Enterprise Ledger", "AWS Cost Explorer / Kubecost", "Tableau / Grafana Cost Dashboards"],
      components: [
        "Real-Time Token Usage Accounting Engine",
        "Tenant & Department Cost Attribution Ledger",
        "Dynamic Rate Limiting & Hard Budget Caps",
        "Semantic Cache ROI & Token Savings Calculator",
        "Cost-per-Query & Unit Economics Dashboard",
        "Enterprise AI TCO (Models, SaaS, Compute, Storage & Network)",
        "Cost / Quality / Latency Trade-off Optimizer",
        "Automated Model Down-tiering Recommendations"
      ],
      raci: {
        ai: { role: "C", details: "Optimizes prompt token density, implements prompt caching, and benchmarks smaller models for high-volume tasks." },
        product: { role: "R/A", details: "Monitors feature unit margins, determines freemium vs premium limits, and manages product line P&L." },
        governance: { role: "C", details: "Ensures fair resource distribution across corporate business units and prevents rogue budget consumption." },
        security: { role: "I", details: "Coordinates on DoS-induced token exhaustion attacks (Financial Denial of Service / FDoS)." }
      },
      keyDeliverables: ["Per-Department and Per-Service Cost Allocation", "AI TCO / ROI Forecasts", "Real-Time Quota Breaker Service", "Token Optimization Audit Report"],
      governanceTouchpoints: ["Corporate Cost Transparency Audits", "Executive Budget Variance Notifications"],
      securityControls: ["Protection Against Financial Denial of Service (FDoS)", "API Key Hard Spend Thresholds", "Tamper-resistant Billing Records"],
      finopsLevers: ["Per-user and per-tenant token rate limits", "Budget-triggered routing or throttling at owner-approved thresholds", "Prompt compression"],
      aiopsMetrics: ["Cost per resolved goal", "Semantic cache savings", "Budget forecast accuracy against service-owned tolerance"]
    },
    {
      id: "applications",
      name: "Enterprise AI Applications & Business Workflows",
      category: "Application & Business Process",
      description: "Business-facing AI products and embedded workflows with named owners, approved use cases, integrations, user journeys, and measurable outcomes.",
      techStack: ["Embedded Copilot / Workflow UI", "Enterprise API & Event Integration", "Use-Case Portfolio Registry", "Workflow Adapters", "Feedback & Case Management"],
      components: ["Enterprise AI Application & Copilot Portfolio", "Use-Case Intake, Value Assessment & Prioritization", "Business Process Integration & Workflow Adapters", "Application-Specific Retrieval, Prompts & Agent Skills", "Document Intelligence, Vision, Speech & Multimodal Applications", "Predictive Analytics, Classification & Forecasting Applications", "Human Handoff, Case Management & User Feedback", "Business Outcome, Adoption & Service Ownership Metrics"],
      raci: {
        ai: { role: "C", details: "Advises on model fit, retrieval design, prompt and skill reuse, and technical feasibility." },
        product: { role: "R/A", details: "Owns the application portfolio, process fit, user experience, product outcomes, and business service owner assignment." },
        governance: { role: "C", details: "Reviews use-case purpose, impact classification, affected people, and required oversight." },
        security: { role: "R", details: "Reviews application threat models, identity boundaries, API exposure, and data access." }
      },
      keyDeliverables: ["AI Use-Case Register", "Application Service Catalog", "Process Maps & Outcome Baselines", "Business Owner and Support Handoff"],
      governanceTouchpoints: ["Use-case inventory, purpose, risk classification, jurisdiction/sector applicability review, affected parties, and named accountable owner before build", "For consequential actions, show reviewers the proposed action, rationale, evidence, data, and impact; record reviewer identity and decision; expire or revoke approvals", "Define reject, timeout, appeal/correction, cancellation, and safe-resumption paths; operators retain stop/containment control", "Business process owner sign-off, user disclosure, and meaningful human handoff design"],
      securityControls: ["Application Threat Model", "Least-Privilege Identity & Data Scopes", "Approved Integration Inventory"],
      finopsLevers: ["Value and cost per completed business outcome", "Application tier budgets", "Retire or redesign low-value use cases"],
      aiopsMetrics: ["Adoption and task completion rate", "Business process cycle time", "Application availability and user satisfaction"]
    },
    {
      id: "data-governance",
      name: "Enterprise Data Governance & Knowledge Lifecycle",
      category: "Data Management & Governance",
      description: "Controls enterprise data from source onboarding through classification, quality, lineage, retrieval, retention, correction, and deletion for AI use.",
      techStack: ["Enterprise Data Catalog & Lineage", "Data Quality / DLP Rules", "Lakehouse & ETL/ELT Pipelines", "Embedding / Index Build Pipeline", "Retention & Deletion Workflows"],
      components: ["Source Registration, Data Contracts & Ownership", "Classification, Consent, Residency & Purpose Controls", "Data Quality, Provenance, Lineage & Freshness Checks", "Source ACL Synchronization and Authorization-Aware Retrieval", "Curated Dataset, Document & Knowledge Versioning", "RAG Ingestion, Chunking, Embedding & Index Promotion", "Citations with Source Version and Freshness Metadata", "Retention, Correction, Legal Hold & Right-to-Erasure Workflow", "Deletion Propagation and Completion Evidence Across Replicas, Indexes, Caches and Derived Artifacts"],
      raci: {
        ai: { role: "R", details: "Defines dataset and retrieval requirements, validates grounding quality, and versions AI-ready corpora." },
        product: { role: "C", details: "Identifies authoritative business sources, data owners, and freshness expectations." },
        governance: { role: "A", details: "Approves purpose, classification, retention, residency, consent, and privacy requirements." },
        security: { role: "R", details: "Enforces identity-aware access, encryption, DLP, isolation, and secure data movement." }
      },
      keyDeliverables: ["AI Data Source Register", "Dataset Cards & Lineage", "Approved Ingestion Pipelines", "Retention and Deletion Evidence"],
      governanceTouchpoints: ["Data owner approval, lawful purpose and classification", "Dataset / knowledge change review; source ACL changes propagate to retrieval authorization", "Correction, retention expiry, legal hold, and deletion workflow records completion evidence across replicas, indexes, caches, and derived artifacts"],
      securityControls: ["Synchronize source ACLs and enforce resource-level authorization at retrieval time; deny when identity or ACL state is unavailable/stale", "Track source provenance and freshness; quarantine or exclude poisoned, stale, or unverified content according to owner policy", "Retrieval failure must not silently fall back to an unfiltered corpus; disclose degraded/insufficient evidence", "Row / Document-Level Authorization", "DLP and Secret Scanning", "Encrypted Transfer and Tenant Isolation"],
      finopsLevers: ["Storage and embedding cost per corpus", "Incremental index refresh", "Archive stale or unused knowledge"],
      aiopsMetrics: ["Source freshness lag", "Ingestion and index build duration", "Retrieval coverage and data quality failure rate"]
    },
    {
      id: "ai-engineering",
      name: "AI Engineering, MLOps & Release Lifecycle",
      category: "Engineering & Change Management",
      description: "Reproducible lifecycle for datasets, models, prompts, skills, agents, evaluations, approvals, deployment, monitoring, and rollback.",
      techStack: ["Git / Artifact Repository", "Experiment Tracking & Model Registry", "Prompt / Agent / Skill Versioning", "CI/CD & Evaluation Gates", "Canary / Blue-Green Release Automation"],
      components: ["Experiment, Dataset & Model Artifact Tracking", "Model, Prompt, Agent Graph & Skill Version Registry", "Feature Engineering, Training & Offline / Online Model Serving", "Evaluation of task success, groundedness, quality, robustness, safety/security, privacy, fairness and calibration as relevant", "Dataset/version provenance, risk-based thresholds and independent review where required", "Material-change assessment, incident/complaint feedback, rollback and retirement workflow", "Risk-Based Review, Approval & Release Gates", "Build, Package, Sign & Environment Promotion Pipeline", "Canary, A/B, Rollback & Model Retirement Controller"],
      raci: {
        ai: { role: "R", details: "Builds reproducible pipelines, evaluations, model packages, prompts, agents, and skills." },
        product: { role: "C", details: "Approves user impact, release timing, acceptance criteria, and business readiness." },
        governance: { role: "A", details: "Sets risk-based approval evidence and required validation for material changes." },
        security: { role: "R", details: "Secures source, artifacts, build systems, signing keys, deployment identities, and supply chain." }
      },
      keyDeliverables: ["Versioned Model / Prompt / Agent / Skill Artifacts", "Evaluation Reports & Release Evidence", "Signed Deployment Packages", "Rollback and Retirement Records"],
      governanceTouchpoints: ["Map use-case risk to applicable jurisdiction/sector obligations and oversight requirements; architecture reference does not establish compliance", "Pre-Production Risk Review", "Independent Evaluation where risk and policy require it", "Material-change assessment, release approval, retained evidence, rollback, retirement, and incident/complaint feedback"],
      securityControls: ["Protected Branches and Artifact Signing", "Dependency / Container Scanning", "Separated Build and Production Credentials"],
      finopsLevers: ["Training and inference cost per release", "GPU queue and experiment budgets", "Release cost / quality comparison"],
      aiopsMetrics: ["Change lead time", "Deployment frequency and failure rate", "Rollback time", "Evaluation gate pass rate"]
    },
    {
      id: "operating-model",
      name: "Enterprise AI Operating Model, Policies & Service Management",
      category: "People, Process & Control Plane",
      description: "Defines accountable people, lifecycle procedures, policy ownership, operational controls, service levels, training, incident response, and audit evidence. Targets and obligations are set by each service and jurisdiction.",
      techStack: ["RACI & Service Ownership Register", "Policy / Procedure Repository", "ITSM Change / Incident / Problem Workflows", "Runbooks & On-Call Schedules", "Training & Competency Records"],
      components: ["Named Business, Application, Data, Model & Service Owners", "AI Use-Case, Risk Classification & Approval Procedure", "Regulatory & Internal Policy Applicability Register", "Acceptable Use, Data Use, Human Oversight & Model Change Policies", "Standard Operating Procedures, Runbooks & Exception Handling", "Incident, Escalation, Complaint & Problem Management", "Service Levels, Support Handoff, Training & Competency Management", "Third-Party Model / Vendor Review, Renewal & Exit Procedure"],
      raci: {
        ai: { role: "R", details: "Maintains technical runbooks, model / agent ownership, evaluation operations, and on-call expertise." },
        product: { role: "R", details: "Assigns business and application owners, process approvers, service desk paths, and continuity expectations." },
        governance: { role: "A", details: "Owns enterprise AI policy, risk acceptance, review cadence, training requirements, and audit evidence." },
        security: { role: "R", details: "Owns security incident procedures, platform operations controls, access reviews, and recovery coordination." }
      },
      keyDeliverables: ["AI Operating Model & Role Directory", "Approved Policy and Procedure Set", "Service Catalog, SLOs and Runbooks", "Training, Incident and Vendor Review Records"],
      governanceTouchpoints: ["EU AI Act, NIST AI RMF, Sector and Jurisdiction Applicability Review", "Policy Approval and Scheduled Review", "Risk Acceptance and Exception Expiry", "Incident Notification and Audit Evidence Retention"],
      securityControls: ["On-Call Escalation and Breach Procedures", "Privileged Access Review", "Business Continuity and Recovery Exercises"],
      finopsLevers: ["Named budget owners and approval thresholds", "Service cost allocation", "Vendor renewal and exit cost review"],
      aiopsMetrics: ["Service-owned SLO, RTO and RPO targets (TBD until approved)", "SLO attainment, on-call response and recovery exercise outcomes", "Change approval duration, training completion and incident learning actions"]
    }
  ],

  // C4 MODEL DATA
  c4: {
    // LEVEL 1: SYSTEM CONTEXT DIAGRAM
    context: {
      id: "c4-context",
      title: "C4 Level 1: System Context Diagram",
      subtitle: "People and external systems interacting with the platform; internal identity, tenant, data, and provider controls are detailed in containers and layer specifications.",
      nodes: [
        // Actors
        { id: "actor-business", type: "actor", label: "Business User / Employee", desc: "Interacts via Web Copilot, Slack/Teams to execute workflows and retrieve intelligence.", role: "Starts an approved business journey, supplies task context, reviews the generated result, and provides feedback. The business owner remains responsible for decisions made using that result.", x: 100, y: 120 },
        { id: "actor-dev", type: "actor", label: "AI Developer / Engineer", desc: "Builds agent graphs and reusable skills, deploys custom MCP servers, reviews traces, and monitors evals.", role: "Builds and evaluates data, models, prompts, agent graphs, skills, and integrations through the controlled engineering and release lifecycle.", x: 100, y: 320 },
        { id: "actor-auditor", type: "actor", label: "Governance & SecOps Auditor", desc: "Reviews safety logs, inspects policy decisions, verifies compliance with regulations.", role: "Independently reviews risk classifications, policy decisions, human approvals, release evidence, and retained audit records.", x: 100, y: 520 },

        // Core System
        { id: "system-platform", type: "system-core", label: "Enterprise Agentic AI Platform", desc: "Enterprise AI applications and workflows supported by governed data, agent skills, model lifecycle controls, safety, inference, operations, and cost governance.", role: "Provides the governed execution boundary for AI use cases: authenticates requests, applies policy and safety controls, coordinates models and tools, records evidence, and measures service quality and cost.", x: 480, y: 280, width: 340, height: 260 },

        // External Systems
        { id: "ext-llm-cloud", type: "system-ext", label: "Frontier Cloud LLMs", desc: "OpenAI (GPT-4o), Anthropic (Claude 3.5), Google Vertex AI (Gemini Pro/Flash).", role: "Supplies externally hosted model inference. The platform sends requests according to its provider, privacy, residency, and routing controls, then treats returned content as model output subject to validation.", x: 960, y: 100 },
        { id: "ext-enterprise-apps", type: "system-ext", label: "Enterprise Systems & ERP", desc: "SAP, Salesforce, Jira, ServiceNow, Snowflake, SharePoint via MCP Servers.", role: "Remains the system of record for enterprise transactions and knowledge. The platform accesses it through approved, scoped integrations and returns results or permitted actions.", x: 960, y: 270 },
        { id: "ext-idp", type: "system-ext", label: "Identity & Access (IdP)", desc: "Okta / Microsoft Entra ID providing OAuth2, SAML, and user group claims.", role: "Authenticates people and workloads and supplies identity claims used by the platform to make access decisions for applications, data, and tools.", x: 960, y: 440 },
        { id: "ext-regulators", type: "system-ext", label: "Enterprise Audit & Evidence Repositories", desc: "Illustrative external archives or evidence repositories selected according to organizational policy and retention requirements.", role: "Receives or preserves evidence needed for oversight and audit when configured. Retention, immutability, access, and legal obligations depend on approved organizational policy and deployment controls.", x: 960, y: 610 }
      ],
      edges: [
        { from: "actor-business", to: "system-platform", label: "Submits prompts, tasks, receives synthesized answers [HTTPS/WSS]", team: "product" },
        { from: "actor-dev", to: "system-platform", label: "Configures agent graphs, registers tools, inspects traces [REST/gRPC]", team: "ai" },
        { from: "actor-auditor", to: "system-platform", label: "Inspects decision logs, audit trails, and policy violations [HTTPS]", team: "governance" },
        { from: "system-platform", to: "ext-llm-cloud", label: "Routes policy-approved, minimized prompts; provider terms/configuration apply [protocol per deployment]", team: "security" },
        { from: "system-platform", to: "ext-enterprise-apps", label: "Executes tool actions via Model Context Protocol [JSON-RPC/SSE]", team: "ai" },
        { from: "system-platform", to: "ext-idp", label: "Validates human/workload identity and obtains scoped claims; platform enforces authorization", team: "security" },
        { from: "system-platform", to: "ext-regulators", label: "Exports policy-approved audit evidence and operational records", team: "governance" }
      ]
    },

    // LEVEL 2: CONTAINER DIAGRAM
    contextL2: {
      id: "c4-container",
      title: "C4 Level 2: Container Diagram",
      subtitle: "Illustrative control-plane and request/data-plane containers, trust boundaries, and primary flows; regional/environment topology and recovery targets are deployment decisions.",
      boundary: "Enterprise AI Platform (control plane / request-data plane; tenant, environment and regional boundaries per deployment)",
      containers: [
        {
          id: "cnt-ingress",
          name: "API & Channel Ingress Gateway",
          tech: "Kong Gateway / Envoy / Fastify",
          type: "container",
          layerIds: ["channels", "applications"],
          desc: "REQUEST / DATA PLANE entry point authenticating human and workload identities separately, binding tenant/purpose/correlation context, enforcing rate limits, and routing requests. Missing, expired, or invalid identity is denied.",
          team: "security",
          x: 60, y: 140, w: 220, h: 110
        },
        {
          id: "cnt-guardrails",
          name: "Guardrails & Safety Firewall",
          tech: "NeMo Guardrails / Presidio / Python",
          type: "container",
          layerIds: ["guardrails"],
          desc: "Dual-sided trust boundary for untrusted user, retrieved, provider, tool, and agent content; screens injection and leakage risks, applies policy-driven redaction, validates outputs, and records outcomes. Detectors reduce risk but do not guarantee prevention.",
          team: "security",
          x: 330, y: 140, w: 230, h: 110
        },
        {
          id: "cnt-orchestrator",
          name: "Agentic Orchestrator & Agent Harness Runtime",
          tech: "LangGraph / Python / AsyncIO / Redis",
          type: "container",
          layerIds: ["orchestrator", "multiagent", "applications"],
          desc: "Request-plane bounded agent runtime coordinating skills, plans, delegated identity context, durable workflow state, timeout/retry/idempotency, cancellation, backpressure, and recovery.",
          team: "ai",
          x: 610, y: 140, w: 250, h: 110
        },
        {
          id: "cnt-decision",
          name: "Decision & Policy Engine",
          tech: "Open Policy Agent (OPA) / Rego / Go",
          type: "container",
          layerIds: ["decisions", "operating-model"],
          desc: "Evaluates current resource-level authorization and risk policy; routes consequential actions to human review with evidence, reviewer identity, expiry/revocation, and recorded decisions. Denies on absent/stale identity or required evidence.",
          team: "governance",
          x: 910, y: 140, w: 220, h: 110
        },
        {
          id: "cnt-mcp",
          name: "MCP Gateway & Tool Server Hub",
          tech: "Model Context Protocol / TypeScript / Docker",
          type: "container",
          layerIds: ["mcps"],
          desc: "MCP trust boundary using scoped workload and delegated user identity, current resource ACLs, tenant isolation, parameter validation, idempotency, bounded retries, cancellation, and auditable outcomes.",
          team: "ai",
          x: 610, y: 330, w: 250, h: 110
        },
        {
          id: "cnt-multillm",
          name: "Multi-LLM Gateway & Semantic Router",
          tech: "LiteLLM Proxy / Redis Semantic Cache",
          type: "container",
          layerIds: ["multillm"],
          desc: "Intelligent inference gateway routing prompts across Frontier, Fast, and Self-hosted LLMs with caching and failover.",
          team: "ai",
          x: 330, y: 330, w: 230, h: 110
        },
        {
          id: "cnt-ai-lifecycle",
          name: "AI Engineering & Release Pipeline",
          tech: "MLflow / Git / CI-CD / Eval Gates",
          type: "container",
          layerIds: ["ai-engineering"],
          desc: "CONTROL PLANE pipeline: versions models, prompts, agent graphs, and skills; runs evaluation and approval gates before signed environment promotion, canary, rollback, or retirement.",
          team: "ai",
          x: 910, y: 330, w: 220, h: 110
        },
        {
          id: "cnt-vector",
          name: "Vector & Knowledge Storage",
          tech: "Milvus / Qdrant / PostgreSQL pgvector",
          type: "container",
          layerIds: ["infra", "data-governance"],
          desc: "Stores governed enterprise embeddings, hybrid search indexes, versioned document chunks, and domain knowledge graphs with lineage and retention controls.",
          team: "ai",
          x: 60, y: 330, w: 220, h: 110
        },
        {
          id: "cnt-aiops",
          name: "AIOps & Observability Platform",
          tech: "Langfuse / OpenTelemetry / Prometheus",
          type: "container",
          layerIds: ["aiops", "ai-engineering", "operating-model"],
          desc: "Control-plane release evaluation plus production telemetry, privacy-minimized audit, quality/drift alerts, SLO dashboards, on-call and incident evidence. Consequential actions fail closed if required evidence cannot be recorded; other degradation requires an approved policy.",
          team: "ai",
          x: 60, y: 520, w: 220, h: 110
        },
        {
          id: "cnt-finops",
          name: "FinOps Metering & Quota Controller",
          tech: "ClickHouse / Redis Token Bucket",
          type: "container",
          layerIds: ["finops", "operating-model"],
          desc: "Real-time token usage meter, departmental cost attribution, budget cap enforcer, and cost optimization advisor.",
          team: "product",
          x: 330, y: 520, w: 230, h: 110
        },
        {
          id: "cnt-workflow-store",
          name: "Durable Workflow & Event Store",
          tech: "Queue / Event Bus / Checkpoint Store (implementation TBD)",
          type: "container",
          layerIds: ["infra", "orchestrator", "operating-model"],
          desc: "Persists asynchronous jobs, workflow checkpoints, retry schedules, idempotency keys, cancellation state, and dead-letter/manual recovery records. Queue technology, retention, and delivery semantics are deployment decisions.",
          team: "ai",
          x: 330, y: 660, w: 230, h: 110
        },
        {
          id: "cnt-gpu",
          name: "Self-Hosted GPU Inference Cluster",
          tech: "vLLM / Triton / Kubernetes / NVIDIA GPUs",
          type: "container",
          layerIds: ["infra", "multillm", "ai-engineering"],
          desc: "Private on-prem / sovereign GPU nodes running open-source foundation models (Llama 3.3, Mistral) for sensitive workloads.",
          team: "security",
          x: 610, y: 520, w: 250, h: 110
        },
        {
          id: "cnt-governance-ledger",
          name: "Governance Audit Ledger",
          tech: "PostgreSQL / Cryptographic Hash Chain",
          type: "container",
          layerIds: ["decisions", "guardrails", "operating-model", "data-governance"],
          desc: "Audit/evidence store for minimized request correlation, actor/workload identity, versions, policy/guardrail decisions, citations, actions, and human approvals; immutability and retention depend on selected deployment and controls.",
          team: "governance",
          x: 910, y: 520, w: 220, h: 110
        }
      ],
      edges: [
        { from: "cnt-ingress", to: "cnt-guardrails", label: "1. Passes request, actor/workload identity, tenant and correlation context [protocol per deployment]", team: "security" },
        { from: "cnt-guardrails", to: "cnt-orchestrator", label: "2. Passes screened content with trust labels and delegated authorization context", team: "security" },
        { from: "cnt-orchestrator", to: "cnt-decision", label: "3. Requests current resource/action authorization and oversight decision", team: "governance" },
        { from: "cnt-decision", to: "cnt-orchestrator", label: "Returns allow/deny or approval-required with expiry and evidence reference", team: "governance" },
        { from: "cnt-orchestrator", to: "cnt-mcp", label: "4. Dispatches approved, scoped, idempotent tool request [MCP / JSON-RPC]", team: "ai" },
        { from: "cnt-orchestrator", to: "cnt-multillm", label: "5. Sends reasoning prompt [Unified OpenAI API]", team: "ai" },
        { from: "cnt-multillm", to: "cnt-gpu", label: "6. Routes internal/confidential tasks [vLLM gRPC]", team: "security" },
        { from: "cnt-orchestrator", to: "cnt-vector", label: "7. Retrieves with tenant, delegated identity and synchronized source ACL filters [protocol per deployment]", team: "ai" },
        { from: "cnt-orchestrator", to: "cnt-aiops", label: "8. Emits correlated trace, budget, workflow, retry, cancellation and recovery evidence [OTel]", team: "ai" },
        { from: "cnt-multillm", to: "cnt-finops", label: "9. Records token counts and cost [event/queue implementation TBD]", team: "product" },
        { from: "cnt-orchestrator", to: "cnt-governance-ledger", label: "Correlated, minimized audit/action evidence; required evidence unavailable blocks consequential actions", team: "governance" },
        { from: "cnt-decision", to: "cnt-governance-ledger", label: "Records policy decision, approval identity, expiry and outcome", team: "governance" },
        { from: "cnt-orchestrator", to: "cnt-workflow-store", label: "Persists async job, checkpoint, retry/cancel state and idempotency key", team: "ai" },
        { from: "cnt-workflow-store", to: "cnt-orchestrator", label: "Resumes durable workflow or routes dead letter to manual recovery", team: "ai" },
        { from: "cnt-aiops", to: "cnt-ai-lifecycle", label: "Evaluation results gate model and agent releases", team: "ai" },
        { from: "cnt-ai-lifecycle", to: "cnt-multillm", label: "Promotes approved signed model and prompt versions", team: "ai" }
      ]
    },

    // LEVEL 3: COMPONENT DIAGRAM (Agent Harness / Orchestrator Runtime)
    contextL3: {
      id: "c4-component",
      title: "C4 Level 3: Component Diagram",
      subtitle: "Internal components of the Agent Harness and Orchestrator container, showing the bounded model/tool loop and the services it coordinates.",
      containerName: "Container: Agentic Orchestrator & Agent Harness Runtime",
      components: [
        {
          id: "cmp-session",
          name: "Session & Context Coordinator",
          tech: "Async Python Class",
          desc: "Loads session context and carries the authenticated actor/workload, tenant, purpose, consent, and correlation envelope. Rejects missing or expired identity context and minimizes retained history.",
          team: "ai",
          x: 60, y: 120, w: 240, h: 110
        },
        {
          id: "cmp-planner",
          name: "Graph Decomposition & Planner",
          tech: "LangGraph StateGraph / ReAct",
          desc: "Breaks user intent into executable directed acyclic graphs (DAGs) of sub-tasks and dependency nodes.",
          team: "ai",
          x: 350, y: 120, w: 240, h: 110
        },
        {
          id: "cmp-supervisor",
          name: "Multi-Agent Swarm Supervisor",
          tech: "Hierarchical Agent Coordinator",
          desc: "Dispatches sub-tasks to specialized worker agents and synthesizes cross-agent debates.",
          team: "ai",
          x: 640, y: 120, w: 240, h: 110
        },
        {
          id: "cmp-harness",
          name: "Agent Harness & Execution Control Loop",
          tech: "Bounded Agent Runtime / Turn Controller",
          desc: "Coordinates each agent run: assembles context, invokes the model, routes tool calls, resumes with results, and enforces step, time, and token limits. It delegates safety, policy, state, and sandbox work to their owning components.",
          team: "ai",
          x: 640, y: 500, w: 240, h: 110
        },
        {
          id: "cmp-specialists",
          name: "Specialist Agents Pool",
          tech: "Research, SQL, Code, Critique Agents",
          desc: "Dedicated prompt personalities with isolated system instructions and assigned domain tools.",
          team: "ai",
          x: 930, y: 120, w: 240, h: 110
        },
        {
          id: "cmp-skills",
          name: "Agent Skills Catalog & Registry",
          tech: "Versioned Skill Definitions / Metadata Store",
          desc: "Indexes reusable agent skills, instructions, and supporting assets; resolves versions and makes selected skills available to agents at runtime.",
          team: "ai",
          x: 350, y: 500, w: 240, h: 110
        },
        {
          id: "cmp-memory",
          name: "Working Memory & Scratchpad",
          tech: "Redis In-Memory State Checkpoints",
          desc: "Maintains intermediate tool results, reflection notes, and rollback checkpoints for error recovery.",
          team: "ai",
          x: 60, y: 310, w: 240, h: 110
        },
        {
          id: "cmp-hitl",
          name: "Human-in-the-Loop Checkpointer",
          tech: "Interrupt Hook & Webhook Notifier",
          desc: "Pauses consequential work and presents the reviewer with proposed action, impact, source evidence, policy basis, and uncertainty. Records reviewer identity and decision; approval expires or can be revoked, and rejection/timeout/cancellation cannot silently resume work.",
          team: "governance",
          x: 350, y: 310, w: 240, h: 110
        },
        {
          id: "cmp-mcp-client",
          name: "MCP Client & Tool Invoker",
          tech: "MCP Protocol Client / JSON-RPC",
          desc: "Validates parameters and current resource ACLs, passes least-privilege delegated identity to MCP, applies tenant isolation and idempotency, and handles timeout/cancel/retry policy. Authorization denial or missing context blocks execution.",
          team: "security",
          x: 640, y: 310, w: 240, h: 110
        },
        {
          id: "cmp-llm-client",
          name: "Multi-LLM Client Connector",
          tech: "Async HTTP Client / SSE Streamer",
          desc: "Sends prompt payloads to the Multi-LLM Gateway and streams response chunks back into the execution graph.",
          team: "ai",
          x: 930, y: 310, w: 240, h: 110
        },
        {
          id: "cmp-guardrail-hook",
          name: "Guardrail Validation Interceptor",
          tech: "Middleware Pipeline Hook",
          desc: "Treats prompts, retrieved content, provider responses, tool results, and agent handoffs as untrusted; screens for injection and leakage risks and routes policy decisions. Detection does not guarantee prevention.",
          team: "security",
          x: 60, y: 500, w: 240, h: 110
        },
        {
          id: "cmp-telemetry-hook",
          name: "AIOps & FinOps Emitter Hook",
          tech: "OpenTelemetry Span Exporter",
          desc: "Instruments every graph node with step latency, token count, model ID, and cost metadata.",
          team: "product",
          x: 930, y: 500, w: 240, h: 110
        }
      ],
      edges: [
        { from: "cmp-session", to: "cmp-planner", label: "Passes sanitized context & intent", team: "ai" },
        { from: "cmp-planner", to: "cmp-supervisor", label: "Assigns sub-task DAG to agent swarm", team: "ai" },
        { from: "cmp-supervisor", to: "cmp-harness", label: "Starts bounded agent run", team: "ai" },
        { from: "cmp-harness", to: "cmp-skills", label: "Resolves selected reusable skill", team: "ai" },
        { from: "cmp-skills", to: "cmp-specialists", label: "Loads selected skill definitions & assets", team: "ai" },
        { from: "cmp-harness", to: "cmp-specialists", label: "Runs selected specialist within turn limits", team: "ai" },
        { from: "cmp-harness", to: "cmp-guardrail-hook", label: "Checks model turns and tool requests", team: "security" },
        { from: "cmp-guardrail-hook", to: "cmp-hitl", label: "Checks if action requires human review", team: "governance" },
        { from: "cmp-hitl", to: "cmp-mcp-client", label: "Approves safe execution of tool", team: "governance" },
        { from: "cmp-mcp-client", to: "cmp-memory", label: "Writes tool output to working memory", team: "ai" },
        { from: "cmp-memory", to: "cmp-harness", label: "Resumes loop from checkpointed result", team: "ai" },
        { from: "cmp-harness", to: "cmp-mcp-client", label: "Dispatches approved tool calls", team: "security" },
        { from: "cmp-harness", to: "cmp-llm-client", label: "Invokes model and processes each response", team: "ai" },
        { from: "cmp-harness", to: "cmp-telemetry-hook", label: "Emits run trace, budgets, and outcome", team: "product" }
      ]
    }
  },

  // DYNAMIC EXECUTION TRACE (Step-by-step interactive simulation)
  simulation: {
    title: "End-to-End Enterprise Agentic Request Trace",
    scenario: "User Query: 'Analyze Q3 regional revenue dip, pull relevant ERP audit records, check fraud policy, and generate executive summary.'",
    steps: [
      {
        step: 1,
        name: "User Ingress & Identity Authentication",
        layerId: "channels",
        containerId: "cnt-ingress",
        team: "security",
        summary: "User submits query via Enterprise Slack Copilot. Gateway validates Okta JWT token, verifies user role (Financial Analyst), and establishes SSE streaming connection.",
        details: {
          protocol: "HTTPS / WSS / OAuth2 Bearer",
          payload: "{ user_id: 'emp_9421', role: 'finance_analyst', query: 'Analyze Q3 regional revenue dip...' }",
          guardCheck: "Rate limit: 20 req/min (PASSED). WAF inspection: Clean.",
          finopsImpact: "Session initiated; tenant tagged: 'corporate_finance'"
        }
      },
      {
        step: 2,
        name: "Ingress Guardrail & PII Tokenization",
        layerId: "guardrails",
        containerId: "cnt-guardrails",
        team: "security",
        summary: "Guardrails scan prompt for prompt injection or jailbreak patterns. Presidio identifies customer credit card or SSN tokens and replaces them with cryptographic vault tokens.",
        details: {
          protocol: "In-memory Regex + Llama Guard 3 Classifier",
          jailbreakScore: "0.002 (Clean, below threshold 0.05)",
          piiActions: "Replaced 1 customer ID with deterministic pseudonym token 'VAULT_TOKEN_892'",
          latency: "38ms"
        }
      },
      {
        step: 3,
        name: "FinOps Quota & Budget Check",
        layerId: "finops",
        containerId: "cnt-finops",
        team: "product",
        summary: "FinOps metering verifies that Finance Dept has remaining monthly token quota ($14,200 remaining of $20,000 budget cap). Request approved to proceed.",
        details: {
          budgetStatus: "GREEN (71% remaining)",
          concurrencyBucket: "Active queries: 4/50 concurrent",
          estimatedCostTier: "Tier 1 (Multi-agent workflow budget: ~$0.08)"
        }
      },
      {
        step: 4,
        name: "Agentic Decomposition & Plan Creation",
        layerId: "orchestrator",
        containerId: "cnt-orchestrator",
        team: "ai",
        summary: "LangGraph Orchestrator decomposes query into 3 sub-tasks: (1) Query Snowflake ERP database, (2) Retrieve internal fraud guidelines from Vector DB, (3) Synthesize executive report.",
        details: {
          planDag: "Step A [SQL Agent] -> Step B [Policy Vector Search] -> Step C [Synthesis Agent]",
          agentHarness: "Runs a bounded model/tool loop with session context, checkpoint recovery, and step/token limits",
          scratchpadState: "Initialized session state key in Redis: session_f92b",
          loopBreaker: "Max reasoning steps capped at 8"
        }
      },
      {
        step: 5,
        name: "Multi-Agent Swarm Delegation",
        layerId: "multiagent",
        containerId: "cnt-orchestrator",
        team: "ai",
        summary: "Supervisor discovers versioned skills in the Agent Skills Catalog, loads the relevant instructions and assets, then dispatches work to the Enterprise SQL Specialist and Compliance Research Agent.",
        details: {
          skillsCatalog: "Resolved finance.sql-analysis v2.1 and compliance.policy-research v1.4",
          agentA: "SQL Agent loaded with Snowflake read-only schema",
          agentB: "Research Agent loaded with Financial Policy embeddings",
          executionMode: "Parallel asynchronous dispatch"
        }
      },
      {
        step: 6,
        name: "Decision & Policy Pre-Execution Validation",
        layerId: "decisions",
        containerId: "cnt-decision",
        team: "governance",
        summary: "Before executing the SQL tool, the Decision Engine checks current delegated identity, tenant, resource ACL, and approved purpose/action policy. Jurisdiction and sector applicability are assessed by the accountable governance process; this example makes no compliance determination.",
        details: {
          opaEngine: "Evaluated rule 'finance.access.read_revenue'",
          policyResult: "Illustrative ALLOW only if current claims and resource ACL satisfy policy",
          hitlStatus: "Oversight depends on use-case risk and impact; consequential actions require configured review"
        }
      },
      {
        step: 7,
        name: "MCP Tool Execution (Database & Vector Store)",
        layerId: "mcps",
        containerId: "cnt-mcp",
        team: "ai",
        summary: "MCP Client communicates with the Snowflake MCP Server via JSON-RPC to pull aggregate regional revenue numbers. Concurrently, Vector DB MCP retrieves 3 fraud compliance passages.",
        details: {
          mcpRequest: "tools/call: { server: 'snowflake-mcp', tool: 'run_aggregate_sql', params: {...} }",
          mcpResponse: "Returned 14 rows of aggregated regional numbers in 180ms",
          sanitization: "Output truncated to 1,200 tokens to preserve context budget"
        }
      },
      {
        step: 8,
        name: "Multi-LLM Semantic Routing & Inference",
        layerId: "multillm",
        containerId: "cnt-multillm",
        team: "ai",
        summary: "Multi-LLM Gateway checks Semantic Cache (miss). Router directs synthesis prompt to Claude 3.5 Sonnet with temperature 0.2 and structured JSON schema.",
        details: {
          modelSelected: "claude-3-5-sonnet-20241022 (High reasoning capability)",
          promptCaching: "HIT on system prompt & corporate taxonomy (Saved 4,500 input tokens)",
          tokens: "Input: 2,840 tokens, Output: 640 tokens",
          inferenceLatency: "1,120ms"
        }
      },
      {
        step: 9,
        name: "Egress Guardrail Inspection",
        layerId: "guardrails",
        containerId: "cnt-guardrails",
        team: "security",
        summary: "Safety interceptor checks citations against returned tool facts, screens for possible PII/secret leakage, and validates JSON structure. These checks reduce risk but cannot guarantee factuality or detect every leak.",
        details: {
          faithfulnessCheck: "Citation and grounding checks run; results require calibrated evaluation and review",
          leakageScanner: "Secret/PII screening result recorded; detection is not a prevention guarantee",
          schemaValidator: "Valid ExecutiveReport JSON Schema"
        }
      },
      {
        step: 10,
        name: "AIOps Telemetry & FinOps Ledgering",
        layerId: "aiops",
        containerId: "cnt-aiops",
        team: "product",
        summary: "OpenTelemetry flushes trace spans to Langfuse. FinOps bills $0.038 to Finance Dept cost center. Ragas evaluates answer relevance score: 0.94.",
        details: {
          traceId: "tr_8910bba29048",
          totalDuration: "1.48s end-to-end",
          finopsBilled: "$0.0384 USD",
          evalScore: "Relevance: 0.94 / Faithfulness: 0.99"
        }
      },
      {
        step: 11,
        name: "Client Delivery & Response Stream",
        layerId: "channels",
        containerId: "cnt-ingress",
        team: "product",
        summary: "Formatted markdown executive summary streamed back to user's Slack window with interactive citation links to Snowflake tables and compliance clauses.",
        details: {
          status: "SUCCESS (200 OK)",
          clientFeedback: "Feedback captured for review and governed evaluation; it does not automatically train or update the model"
        }
      }
    ],
    failureScenario: {
      id: "identity-denied-recovery",
      label: "Expired identity: deny and recover",
      scenario: "Illustrative: an expired delegated identity attempts a scoped ERP read; authorization denies it, evidence is recorded, and the user reauthenticates before a new request.",
      steps: [
        {
          step: 1, name: "Queued Request Resumes After Credential Expiry", layerId: "infra", containerId: "cnt-workflow-store", team: "ai",
          summary: "An authenticated request waited in the durable workflow queue. Before any consequential action, its delegated credential expired; the resume path revalidates identity and sends no tool request.",
          details: { workflow: "Authenticated request resumes from a durable checkpoint", identity: "Delegated credential expired while queued", action: "No MCP call dispatched", control: "Revalidate identity at execution time" }
        },
        {
          step: 2, name: "Authorization Fails Closed", layerId: "decisions", containerId: "cnt-decision", team: "governance", outcome: "denied",
          summary: "The policy enforcement point cannot establish a current actor and resource authorization context, so it denies the ERP read. No broad service credential is substituted.",
          details: { policy: "Require current user/workload identity plus resource ACL", decision: "DENY", scope: "No MCP call; no data returned", owner: "Decision policy and MCP enforcement point" }
        },
        {
          step: 3, name: "Record Minimized Denial Evidence", layerId: "operating-model", containerId: "cnt-governance-ledger", team: "governance",
          summary: "The platform records the correlation ID, identity state, policy version, denial reason, and outcome without retaining unnecessary prompt content. If required evidence storage is unavailable, the consequential action remains blocked.",
          details: { evidence: "Correlation ID, actor/workload reference, policy version, denial outcome", privacy: "Prompt content minimized or redacted per policy", outcome: "Denied action is auditable" }
        },
        {
          step: 4, name: "Reauthenticate and Submit a New Request", layerId: "channels", containerId: "cnt-ingress", team: "security",
          summary: "The user completes the identity provider challenge. A new request receives fresh scoped claims and a new idempotency key; policy and resource ACL checks run again before any action.",
          details: { identity: "Fresh delegated context issued by identity provider", retry: "New request after authentication; no replay of the denied tool call", authorization: "Re-evaluate current policy and resource ACL", status: "May proceed only if the new check allows" }
        }
      ]
    }
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.ARCHITECTURE_DATA = ARCHITECTURE_DATA;
}

