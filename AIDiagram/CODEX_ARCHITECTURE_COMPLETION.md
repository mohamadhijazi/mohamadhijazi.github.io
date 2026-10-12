# Codex Task: Complete the Enterprise AI Architecture Content

Work in this repository to close the architecture-content gaps listed below. Implement the changes in the interactive architecture, not just in this document or the README. Keep the result a coherent reference architecture that a reviewer can understand from its diagrams, layer details, and execution trace.

## Start Here

Inspect `README.md`, `index.html`, and the existing data and rendering code under `js/` before changing anything. The architecture already has 14 layers, four RACI teams, C4 context/container/component views, an inspector drawer, and an 11-step successful-request simulation. Reuse and extend these structures. Do not create duplicate layers or imply that an existing named control is fully designed when its behavior is not shown.

The project is a static vanilla HTML/CSS/JavaScript application with no build system or external dependencies. Preserve direct browser use, existing navigation, search, team filters, C4 exports, inspector behavior, and the current visual language. Do not introduce a framework or backend.

## Required Architecture Coverage

Make the following concerns explicit and traceable across the architecture. Place them in the most appropriate existing layer(s), C4 relationships/components, and inspector detail fields; add a layer only if an existing one cannot own the concern without becoming misleadingly broad.

1. **Identity, authorization, and delegation**
   - Distinguish human identity from workload/service identity; show authentication, authorization, and credential/secrets ownership.
   - Show how user identity and authorization context are propagated or delegated from ingress through orchestration to retrieval and tool execution, including MCP actions.
   - Make resource-level authorization, least privilege, tenant isolation, and the behavior when identity context is absent, expired, or denied explicit.

2. **Trust boundaries and AI-specific threat paths**
   - Identify trusted and untrusted inputs at channel ingress, retrieved content, model/provider responses, tools, and agent-to-agent handoffs.
   - Cover direct and indirect prompt injection, poisoned/stale knowledge, unsafe tool parameters, data exfiltration, secret/PII leakage, and unauthorized or repeated actions.
   - Connect each threat to a control, enforcement point, owner, and observable/auditable outcome. Do not claim a detector prevents a threat completely.

3. **Data access and the RAG knowledge lifecycle**
   - Show source ownership/provenance, classification and purpose, source ACL synchronization, authorization-aware retrieval, citations, and freshness/version metadata.
   - Explain how correction, retention expiry, legal hold, and deletion propagate through source replicas, embeddings/indexes, caches, and derived artifacts, with evidence of completion.
   - Keep data governance responsibilities distinct from the infrastructure that stores and serves indexes.

4. **Reliable request and action execution**
   - Define the architectural behavior for synchronous versus asynchronous work, queues/events, durable workflow state, timeouts, retries/backoff, idempotency/deduplication, cancellation, backpressure, and dead-letter/manual recovery.
   - Explain partial failure and degraded modes for model providers, MCP tools, retrieval, guardrails, and audit/telemetry dependencies. State which actions fail closed and which may safely degrade.
   - Represent availability and recovery expectations (SLOs, RTO/RPO, recovery/failover scope) as illustrative targets or explicit TBDs unless the repository provides authoritative values. Avoid fabricated guarantees.

5. **Risk governance, evaluation, and change evidence**
   - Connect use-case inventory and risk classification to applicable jurisdiction/sector obligations, required human oversight, approval gates, evidence retention, and accountable owners.
   - Cover evaluation across task success, groundedness, quality, robustness, safety/security, privacy, fairness where relevant, and calibration/uncertainty where relevant.
   - Show evaluation dataset/version provenance, risk-based thresholds and independent review where appropriate, production monitoring, material-change assessment, rollback, retirement, and incident/complaint feedback.
   - Describe this as an architecture and governance workflow; do not claim regulatory compliance merely because a framework or regulation is named.

6. **Production topology and operations**
   - Make control-plane versus request/data-plane responsibilities, environment promotion, tenant and regional boundaries, network/egress boundaries, and failure domains understandable in the relevant C4 view(s).
   - Specify privacy-aware telemetry and audit behavior: what is recorded, what is redacted/minimized, access/retention controls, correlation across a request, and what happens if evidence storage is unavailable.
   - Tie SLOs, alerting, on-call ownership, incident response, kill switch/containment, recovery exercises, and post-incident learning to the operating model.

7. **Human oversight and consequential actions**
   - Define when approval or escalation is required, what context/evidence the reviewer sees, how reviewer identity and decision are recorded, and how approvals expire or are revoked.
   - Show how operators/users can stop execution and how the system handles rejection, timeout, appeal/correction, and safe resumption. Do not equate a generic human checkpoint with meaningful oversight.

## Implementation Requirements

- Extend the existing `ARCHITECTURE_DATA` structures in `js/data.js` and the existing UI/renderers only as needed to make the content visible and navigable. Follow existing layer detail and C4 data conventions; do not hard-code a second, disconnected architecture in the UI.
- Add C4 relationships/components where they clarify the required boundaries and flows. Keep C4 levels semantically appropriate: context shows external actors/systems, containers show deployable/runtime boundaries, and components show internal responsibilities.
- Update the dynamic trace to demonstrate the new controls and at least one meaningful denial or failure/recovery path, not only the happy path. Keep the trace consistent with the C4 containers and layer details. If adding a selectable scenario is the smallest clear solution, integrate it with existing controls and preserve the current trace.
- Update `README.md` so its stated scope and view descriptions match the implementation. Remove or qualify claims that are not actually represented. Label example vendors, metrics, and thresholds as illustrative when they are not mandated decisions.
- Treat all content as reference architecture, not as proof of a deployed implementation. Avoid unsupported guarantees, invented organization-specific policy, unverified legal conclusions, and arbitrary production SLO numbers.
- Keep edits scoped. Preserve the existing visual language, accessibility and responsive behavior, and zero-dependency static operation. Escape or safely render any new content using the existing code patterns; do not introduce unsafe user-controlled HTML.

## Completion Checks

Before finishing:

- Confirm each of the seven required areas is represented in the architecture data and visible in at least one appropriate view; no area should exist only as prose in this task brief.
- Check that the RACI/ownership, layer inspector, C4 mappings/edges, and simulation agree on component names and responsibilities.
- Check that every C4 relationship references existing nodes and every mapped layer/component ID resolves; avoid orphaned or misleading flows.
- Check the normal and denial/failure-recovery traces for coherent ordering, ownership, data flow, and stated outcomes.
- Open the static app or run the available checks. Verify that the matrix, inspector, C4 context/container/component views, search/team filters, simulation controls, print, and SVG export still work; report any check that could not be run.
- Finish with a concise summary of the content added, files changed, verification performed, and any remaining assumptions or TBDs.