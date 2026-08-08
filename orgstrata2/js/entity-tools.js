/* ==========================================================================
   DIGITAL TWIN WORKSPACE - UNIVERSAL ENTITY TOOLS ENGINE
   Kanban/Gantt, Capabilities Canvas, Risk Matrix & 5-point Likert Assistant
   ========================================================================== */

class UniversalEntityTools {
  constructor() {
    this.activeTool = "kanban";
  }

  init() {
    this.bindToolTabs();
    this.renderActiveTools();
  }

  bindToolTabs() {
    const tabs = document.querySelectorAll(".tool-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.activeTool = tab.getAttribute("data-tool");
        this.renderActiveTools();
      });
    });
  }

  renderActiveTools(nodeName = null) {
    const container = document.getElementById("entityToolsContentArea");
    if (!container) return;

    const targetNode = nodeName || (window.activeSelectedNode ? window.activeSelectedNode.label : "Active Entity Workspace Node");

    switch (this.activeTool) {
      case "kanban":
        this.renderKanban(container, targetNode);
        break;
      case "capabilities":
        this.renderCapabilities(container, targetNode);
        break;
      case "risk":
        this.renderRiskMatrix(container, targetNode);
        break;
      case "maturity":
        this.renderMaturityAssistant(container, targetNode);
        break;
    }
  }

  renderKanban(container, targetNode) {
    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.5rem;">
          📌 Kanban Workflow Task Management: ${targetNode}
        </div>
        <div class="kanban-grid">
          <div class="kanban-col">
            <div class="kanban-header">Backlog</div>
            <div class="kanban-card">Assess schema migration criteria</div>
            <div class="kanban-card">Update SignalR tag mappings</div>
          </div>
          <div class="kanban-col">
            <div class="kanban-header">In Progress</div>
            <div class="kanban-card">Optimize PWA ServiceWorker cache</div>
          </div>
          <div class="kanban-col">
            <div class="kanban-header">Review</div>
            <div class="kanban-card">BPMN event dynamic color test</div>
          </div>
          <div class="kanban-col">
            <div class="kanban-header">Done</div>
            <div class="kanban-card">Initialize local storage partitions</div>
          </div>
        </div>
      </div>
    `;
  }

  renderCapabilities(container, targetNode) {
    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; gap:0.75rem;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-cyan);">
          🎯 Strategic Capabilities Canvas: ${targetNode}
        </div>
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1rem;">
          <div class="glass-panel" style="padding:0.75rem;">
            <div style="font-size:0.78rem; color:var(--text-muted);">Data Sovereignty</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--accent-green);">9.5 / 10</div>
          </div>
          <div class="glass-panel" style="padding:0.75rem;">
            <div style="font-size:0.78rem; color:var(--text-muted);">Real-Time Latency</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--accent-cyan);">9.8 / 10</div>
          </div>
          <div class="glass-panel" style="padding:0.75rem;">
            <div style="font-size:0.78rem; color:var(--text-muted);">Process Resilience</div>
            <div style="font-size:1.4rem; font-weight:800; color:#c084fc;">8.7 / 10</div>
          </div>
          <div class="glass-panel" style="padding:0.75rem;">
            <div style="font-size:0.78rem; color:var(--text-muted);">Offline Autonomy</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--accent-orange);">10.0 / 10</div>
          </div>
        </div>
      </div>
    `;
  }

  renderRiskMatrix(container, targetNode) {
    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; gap:0.5rem;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-red);">
          ⚠️ Structured Threat & Risk Scoring Log: ${targetNode}
        </div>
        <table class="data-table-custom" style="font-size:0.78rem;">
          <thead>
            <tr>
              <th>Identified Risk Threat</th>
              <th>Category Tag</th>
              <th>Impact (1-5)</th>
              <th>Likelihood (1-5)</th>
              <th>Risk Score</th>
              <th>Mitigation Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SaaS License Expiration (SAP)</td>
              <td>Applications</td>
              <td>4</td>
              <td>3</td>
              <td><span class="badge badge-red">12 (High)</span></td>
              <td>Execute license auto-renewal notification hook</td>
            </tr>
            <tr>
              <td>Data Schema Corruption</td>
              <td>Data</td>
              <td>5</td>
              <td>1</td>
              <td><span class="badge badge-orange">5 (Medium)</span></td>
              <td>Schema versioning validator & fallback backup</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  renderMaturityAssistant(container, targetNode) {
    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; gap:0.75rem;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-cyan);">
          📈 5-Point Likert Scale Maturity Assistant: ${targetNode}
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.03); padding:0.75rem 1rem; border-radius:8px; border:1px solid var(--border-glass);">
          <div style="display:flex; gap:0.6rem; align-items:center;">
            <span class="badge badge-purple">Level 4: Managed & Quantitative</span>
            <span style="font-size:0.85rem; color:var(--text-muted);">Overall Process Score: 4.2 / 5.0</span>
          </div>
          <button class="btn btn-sm btn-primary" onclick="alert('Maturity Assessment Updated!')">Submit Re-Score</button>
        </div>
      </div>
    `;
  }
}

window.entityTools = new UniversalEntityTools();
