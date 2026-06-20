# Process Mining Operations Control Dashboard

This project is a high-utility Process Mining Operations Dashboard designed to provide multi-level monitoring of process health, execution latency, and optimization opportunities.

## Business Needs Addressed by Visualizations

The dashboard is structured into three distinct structural layers, each targeting specific business intelligence needs.

### 1. Global Process Level (Macro View)
**Target Audience:** Executives and Process Owners
**Goal:** Assess overall process health and prioritize strategic improvements.

*   **KPI Summary Cards (Global Cycle Time & Conformance Rate):** Provides immediate visibility into top-level process efficiency and adherence to standard procedures.
*   **Enhancement Feasibility vs Performance Impact Matrix (Bubble Chart):** 
    *   **Business Need:** Strategic resource allocation.
    *   **How it Works:** Plots automation/enhancement targets across Implementation Complexity (X-axis) and Log Frequency Volume (Y-axis). The bubble size represents the financial savings potential. This enables decision-makers to instantly identify "Quick Wins" (high savings, high volume, low complexity) versus long-term strategic projects.

### 2. Active Activity Level (Operational View)
**Target Audience:** Operations Managers and Team Leads
**Goal:** Monitor current pipeline friction and SLA compliance for immediate intervention.

*   **Active Bottleneck Alert (Pulsing KPI):** Flags immediate, critical disruptions in the pipeline (e.g., idle delays on handoffs) that require real-time attention.
*   **Current Activities: Actual vs SLA Thresholds (Column + Line Chart):**
    *   **Business Need:** SLA monitoring and compliance tracking.
    *   **How it Works:** Compares the actual average execution duration of specific tasks against corporate SLA boundaries (dashed lines). It visually highlights broken SLAs, showing exactly which activities are violating their time constraints.
*   **Transition Latency Map / Process Handoff Delay (Heatmap):**
    *   **Business Need:** Identifying hidden queue times and structural friction.
    *   **How it Works:** Rather than measuring how long a task takes to perform, this heatmap measures the *idle time between* consecutive tasks. Darker red spots instantly flag where work is sitting untouched in queues (e.g., waiting for approvals), which is often the largest hidden contributor to slow cycle times.

### 3. Child Level Subprocesses (Diagnostic View)
**Target Audience:** Process Analysts and Data Engineers
**Goal:** Root cause analysis and granular diagnostic investigation.

*   **Aggregated Subprocess Rollups & Child Variations (Drilldown Bar Chart):**
    *   **Business Need:** Root cause decomposition without cluttering the top-level view.
    *   **How it Works:** Displays consolidated cycle times for large parent processes. When an anomaly or delay is spotted, analysts can interactively drill down into the parent block to reveal its child sub-nodes. This allows users to pinpoint exactly which micro-step (e.g., a specific compliance check or database commit) is driving the parent-level delay.

## Technical Architecture
- Built as a standalone, single-file HTML/JS/CSS deployment.
- Employs **Highcharts.js** (Core, More, Heatmap, and Drilldown modules) via `unpkg` CDNs.
- Adopts a modern enterprise dark aesthetic using pure CSS (no external styling frameworks required).
