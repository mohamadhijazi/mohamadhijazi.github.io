/**
 * Main Application Controller (App Orchestrator)
 * Manages view switching, global team filters, search, inspector drawer,
 * and diagram export/print capabilities.
 */

class App {
  constructor() {
    this.data = window.ARCHITECTURE_DATA;
    this.currentView = "matrix"; // 'matrix', 'c4-context', 'c4-container', 'c4-component', 'flow'
    this.activeTeam = "all"; // 'all', 'ai', 'product', 'governance', 'security'
    this.searchQuery = "";

    // Sub-controllers
    this.matrixView = null;
    this.c4Renderer = null;
    this.simulationView = null;
  }

  init() {
    // Instantiate sub-controllers
    this.matrixView = new window.MatrixView("matrix-view-container", this.data);
    this.c4Renderer = new window.C4Renderer("c4-canvas-container", this.data);
    this.simulationView = new window.DynamicSimulationView("simulation-view-container", this.data);

    // Initialize initial view
    this.matrixView.init();
    this.c4Renderer.init();
    this.simulationView.init();

    this.bindEvents();
    this.switchView(this.currentView);
  }

  bindEvents() {
    // View navigation tabs
    const navTabs = document.querySelectorAll(".nav-tab-btn");
    navTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        this.switchView(view);
      });
    });

    // Team Filter buttons
    const teamFilters = document.querySelectorAll(".team-filter-pill");
    teamFilters.forEach(pill => {
      pill.addEventListener("click", () => {
        const teamId = pill.getAttribute("data-team");
        this.setTeamFilter(teamId);
      });
    });

    // Global Search Bar
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.setSearch(e.target.value);
      });
    }

    // Zoom Controls for C4 View
    const btnZoomIn = document.getElementById("btn-zoom-in");
    const btnZoomOut = document.getElementById("btn-zoom-out");
    const btnZoomReset = document.getElementById("btn-zoom-reset");
    if (btnZoomIn) btnZoomIn.addEventListener("click", () => this.c4Renderer.zoomIn());
    if (btnZoomOut) btnZoomOut.addEventListener("click", () => this.c4Renderer.zoomOut());
    if (btnZoomReset) btnZoomReset.addEventListener("click", () => this.c4Renderer.resetZoom());

    const componentLayerSelect = document.getElementById("c4-component-layer");
    if (componentLayerSelect) {
      componentLayerSelect.addEventListener("change", (e) => this.c4Renderer.setComponentLayer(e.target.value));
    }

    // Drawer Close Buttons
    const drawerOverlay = document.getElementById("drawer-overlay");
    const drawerCloseBtn = document.getElementById("btn-drawer-close");
    if (drawerOverlay) drawerOverlay.addEventListener("click", () => this.closeInspector());
    if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", () => this.closeInspector());

    // Export SVG button
    const btnExportSvg = document.getElementById("btn-export-svg");
    if (btnExportSvg) {
      btnExportSvg.addEventListener("click", () => this.exportCurrentDiagram());
    }

    // Print button
    const btnPrint = document.getElementById("btn-print-view");
    if (btnPrint) {
      btnPrint.addEventListener("click", () => window.print());
    }

    // Keyboard shortcuts (Escape to close drawer)
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeInspector();
      }
    });
  }

  switchView(viewKey) {
    this.currentView = viewKey;

    // Update active tab buttons
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-view") === viewKey);
    });

    // Section containers
    const matrixSection = document.getElementById("view-section-matrix");
    const c4Section = document.getElementById("view-section-c4");
    const simSection = document.getElementById("view-section-sim");

    if (viewKey === "matrix") {
      matrixSection.style.display = "block";
      c4Section.style.display = "none";
      simSection.style.display = "none";
      this.matrixView.render();
    } else if (viewKey.startsWith("c4-")) {
      matrixSection.style.display = "none";
      c4Section.style.display = "block";
      simSection.style.display = "none";
      this.c4Renderer.setView(viewKey);
      const componentLayerWrap = document.getElementById("c4-component-layer-wrap");
      if (componentLayerWrap) componentLayerWrap.style.display = viewKey === "c4-component" ? "flex" : "none";
    } else if (viewKey === "flow") {
      matrixSection.style.display = "none";
      c4Section.style.display = "none";
      simSection.style.display = "block";
      this.simulationView.render();
    }
  }

  setTeamFilter(teamId) {
    this.activeTeam = teamId;

    // Update UI active class
    document.querySelectorAll(".team-filter-pill").forEach(pill => {
      pill.classList.toggle("active", pill.getAttribute("data-team") === teamId);
    });

    // Notify active controllers
    this.matrixView.setTeamFilter(teamId);
    this.c4Renderer.setTeamFilter(teamId);
  }

  setSearch(query) {
    this.searchQuery = query;
    this.matrixView.setSearchQuery(query);
  }

  // --- INSPECTION DRAWER ---
  openInspector() {
    const drawer = document.getElementById("inspector-drawer");
    const overlay = document.getElementById("drawer-overlay");
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }

  closeInspector() {
    const drawer = document.getElementById("inspector-drawer");
    const overlay = document.getElementById("drawer-overlay");
    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }

  inspectLayer(layerId) {
    const layer = this.data.layers.find(l => l.id === layerId);
    if (!layer) return;

    const titleEl = document.getElementById("drawer-title");
    const subEl = document.getElementById("drawer-subtitle");
    const bodyEl = document.getElementById("drawer-body");
    const teams = this.data.teams;

    titleEl.textContent = layer.name;
    subEl.textContent = `${layer.category} Layer • RACI & Architecture Spec`;

    let html = `
      <div class="drawer-section">
        <p class="drawer-lead-desc">${layer.description}</p>
        <div class="drawer-tech-tags">
          ${layer.techStack.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
      </div>

      <!-- RACI Governance Responsibility Matrix Breakdown -->
      <div class="drawer-section">
        <h4 class="drawer-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Team Ownership & RACI Responsibility
        </h4>
        <div class="drawer-raci-grid">
          ${Object.entries(layer.raci).map(([tId, info]) => {
            const team = teams[tId];
            return `
              <div class="drawer-raci-card" style="border-left: 3px solid ${team.color}">
                <div class="drawer-raci-header">
                  <span class="drawer-team-name" style="color: ${team.color}">${team.name}</span>
                  <span class="badge-raci ${this.matrixView.getRaciBadgeClass(info.role)}">${info.role}</span>
                </div>
                <p class="drawer-raci-detail">${info.details}</p>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Core Architecture Components -->
      <div class="drawer-section">
        <h4 class="drawer-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          Core Architectural Components
        </h4>
        <ul class="drawer-bullet-list">
          ${layer.components.map(c => `<li><strong>${c}</strong></li>`).join("")}
        </ul>
      </div>

      <!-- Security Controls & Threat Mitigations -->
      <div class="drawer-section">
        <h4 class="drawer-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Cyber Security & AppSec Mitigations
        </h4>
        <ul class="drawer-bullet-list">
          ${layer.securityControls.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>

      <!-- Governance Touchpoints & Regulatory Compliance -->
      <div class="drawer-section">
        <h4 class="drawer-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Governance & Regulatory Alignment (EU AI Act, NIST AI RMF)
        </h4>
        <ul class="drawer-bullet-list">
          ${layer.governanceTouchpoints.map(g => `<li>${g}</li>`).join("")}
        </ul>
      </div>

      <!-- FinOps & Unit Economics Levers -->
      <div class="drawer-section">
        <h4 class="drawer-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          FinOps & Cost Optimization Levers
        </h4>
        <ul class="drawer-bullet-list">
          ${layer.finopsLevers.map(f => `<li>${f}</li>`).join("")}
        </ul>
      </div>

      <!-- AIOps Metrics & Production Benchmarks -->
      <div class="drawer-section">
        <h4 class="drawer-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          AIOps Observability & SLA Benchmarks
        </h4>
        <ul class="drawer-bullet-list code-bullets">
          ${layer.aiopsMetrics.map(m => `<li><code>${m}</code></li>`).join("")}
        </ul>
      </div>
    `;

    bodyEl.innerHTML = html;
    this.openInspector();
  }

  inspectC4Item(itemId, c4Type) {
    // Check if itemId matches a container
    if (c4Type === "container") {
      const cnt = this.data.c4.contextL2.containers.find(c => c.id === itemId);
      if (cnt) {
        const layerId = cnt.layerIds?.[0];
        this.inspectLayer(layerId);
        const mappedLayers = (cnt.layerIds || []).map(id => this.data.layers.find(layer => layer.id === id)).filter(Boolean);
        if (mappedLayers.length > 1) {
          const layerLinks = mappedLayers.map(layer => `
            <li><button class="btn btn-ghost" onclick="window.app.inspectLayer('${layer.id}')">${layer.name}</button></li>
          `).join("");
          document.getElementById("drawer-body").insertAdjacentHTML("afterbegin", `
            <div class="drawer-section">
              <h4 class="drawer-section-title">All mapped architecture layers</h4>
              <ul class="drawer-bullet-list">${layerLinks}</ul>
            </div>
          `);
        }
        return;
      }
    }

    if (c4Type === "component") {
      const cmp = this.data.c4.contextL3.components.find(c => c.id === itemId);
      if (cmp) {
        const team = this.data.teams[cmp.team];
        const titleEl = document.getElementById("drawer-title");
        const subEl = document.getElementById("drawer-subtitle");
        const bodyEl = document.getElementById("drawer-body");

        titleEl.textContent = cmp.name;
        subEl.textContent = `C4 Component • [${cmp.tech}]`;

        bodyEl.innerHTML = `
          <div class="drawer-section">
            <span class="sim-team-tag" style="background: ${team.lightBg}; color: ${team.color}; border: 1px solid ${team.border};">
              Owner: ${team.name}
            </span>
            <p class="drawer-lead-desc" style="margin-top:12px;">${cmp.desc}</p>
          </div>
          <div class="drawer-section">
            <h4 class="drawer-section-title">Technology & Implementation</h4>
            <p><strong>Stack:</strong> <code>${cmp.tech}</code></p>
            <p>Runs as part of the stateful Agentic Orchestrator runtime container, maintaining event loops, scratchpad state, and tool invocation hooks.</p>
          </div>
          <div class="drawer-section">
            <button class="btn btn-outline-cyan btn-block" onclick="window.app.inspectLayer('orchestrator')">
              View Parent Architectural Layer (Agentic Orchestrator) →
            </button>
          </div>
        `;
        this.openInspector();
        return;
      }
    }

    if (c4Type === "context") {
      const node = this.data.c4.context.nodes.find(n => n.id === itemId);
      if (node) {
        const titleEl = document.getElementById("drawer-title");
        const subEl = document.getElementById("drawer-subtitle");
        const bodyEl = document.getElementById("drawer-body");

        titleEl.textContent = node.label;
        subEl.textContent = `C4 System Context Element • ${node.type.toUpperCase()}`;

        bodyEl.innerHTML = `
          <div class="drawer-section">
            <p class="drawer-lead-desc">${node.desc}</p>
          </div>
          <div class="drawer-section">
            <h4 class="drawer-section-title">Architectural Role</h4>
            <p>In the Enterprise AI Platform Context, this entity represents an external boundary interaction point with mutual TLS authentication and cryptographic audit trails.</p>
          </div>
        `;
        this.openInspector();
        return;
      }
    }
  }

  inspectEdge(fromId, toId, labelEncoded, fromNameEncoded, toNameEncoded, teamId) {
    const label = decodeURIComponent(labelEncoded);
    const fromName = decodeURIComponent(fromNameEncoded);
    const toName = decodeURIComponent(toNameEncoded);
    const team = this.data.teams[teamId] || { name: "System", color: "#64748b", lightBg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.4)" };

    const titleEl = document.getElementById("drawer-title");
    const subEl = document.getElementById("drawer-subtitle");
    const bodyEl = document.getElementById("drawer-body");

    titleEl.textContent = `Data Flow: ${fromName} → ${toName}`;
    subEl.textContent = `Inter-Container Communication Protocol • ${team.name}`;

    bodyEl.innerHTML = `
      <div class="drawer-section">
        <span class="sim-team-tag" style="background: ${team.lightBg}; color: ${team.color}; border: 1px solid ${team.border};">
          Governing Team: ${team.name}
        </span>
        <div style="margin-top: 12px; padding: 12px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <strong style="color: var(--text-bright); display: block; margin-bottom: 4px;">Payload & Transaction:</strong>
          <span style="font-size: 0.9rem; color: #38bdf8; font-family: monospace;">${label}</span>
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">Security & Protocol Guarantees</h4>
        <ul class="drawer-bullet-list">
          <li><strong>Transport Security:</strong> Strict mutual TLS 1.3 (mTLS) with ephemeral per-session certificate validation.</li>
          <li><strong>Authentication & Authorization:</strong> JWT Bearer token propagation with fine-grained claim scopes (OAuth2 / OIDC).</li>
          <li><strong>Data Sanitization:</strong> Ingress/Egress inspection hooks ensure no unredacted PII or secret credentials traverse container boundaries.</li>
          <li><strong>Reliability:</strong> Async backoff retry policy with circuit breaker tripping after 3 consecutive failures.</li>
        </ul>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">Telemetry & Observability Spans</h4>
        <ul class="drawer-bullet-list code-bullets">
          <li><code>traceparent</code> W3C distributed tracing context propagation injected in request headers.</li>
          <li>OpenTelemetry GenAI span records: duration, token size, byte payload, HTTP status code.</li>
        </ul>
      </div>
    `;
    this.openInspector();
  }

  highlightContainerOnC4(containerId) {
    this.switchView("c4-container");
    setTimeout(() => {
      const containerNode = document.getElementById(containerId);
      if (containerNode) {
        containerNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        containerNode.classList.add('node-pulse');
        setTimeout(() => containerNode.classList.remove('node-pulse'), 3000);
      }
    }, 150);
  }

  exportCurrentDiagram() {
    const svgEl = document.querySelector(".c4-svg-canvas");
    if (!svgEl) {
      alert("Please switch to one of the C4 diagram views to export SVG.");
      return;
    }

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);

    // Add namespaces
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `Enterprise_AI_Architecture_${this.currentView}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  }
}

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
  window.app.init();
});
