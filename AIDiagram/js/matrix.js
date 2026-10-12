/**
 * Matrix View Controller (Layer Responsibility Matrix & Team RACI)
 * Handles rendering the interactive matrix covering all 10 architecture layers,
 * team filters (AI, Product, Governance, Cyber Security), search, RACI badges,
 * and drill-down inspection.
 */

class MatrixView {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.activeTeamFilter = "all"; // 'all' or 'ai', 'product', 'governance', 'security'
    this.searchQuery = "";
    this.expandedRows = new Set(); // set of layer ids expanded
  }

  init() {
    this.render();
  }

  setTeamFilter(teamId) {
    this.activeTeamFilter = teamId;
    this.render();
  }

  setSearchQuery(query) {
    this.searchQuery = (query || "").toLowerCase().trim();
    this.render();
  }

  toggleRowExpand(layerId) {
    if (this.expandedRows.has(layerId)) {
      this.expandedRows.delete(layerId);
    } else {
      this.expandedRows.add(layerId);
    }
    this.render();
  }

  expandAll() {
    this.data.layers.forEach(l => this.expandedRows.add(l.id));
    this.render();
  }

  collapseAll() {
    this.expandedRows.clear();
    this.render();
  }

  filterLayers() {
    return this.data.layers.filter(layer => {
      // Search matching
      const matchesSearch = !this.searchQuery ||
        layer.name.toLowerCase().includes(this.searchQuery) ||
        layer.category.toLowerCase().includes(this.searchQuery) ||
        layer.description.toLowerCase().includes(this.searchQuery) ||
        layer.techStack.some(t => t.toLowerCase().includes(this.searchQuery)) ||
        layer.components.some(c => c.toLowerCase().includes(this.searchQuery));

      if (!matchesSearch) return false;

      // Team filter matching: if 'all', matches everything; else checks if team has R, A, C, or I
      if (this.activeTeamFilter === "all") return true;

      const teamRaci = layer.raci[this.activeTeamFilter];
      return teamRaci && (teamRaci.role.includes("R") || teamRaci.role.includes("A"));
    });
  }

  getRaciBadgeClass(role) {
    if (role.includes("A")) return "badge-raci raci-a"; // Accountable
    if (role.includes("R")) return "badge-raci raci-r"; // Responsible
    if (role.includes("C")) return "badge-raci raci-c"; // Consulted
    return "badge-raci raci-i"; // Informed
  }

  getRaciTooltip(role) {
    const map = {
      "R": "Responsible: Does the actual work to achieve the deliverable.",
      "A": "Accountable: Sole decision-maker with ultimate veto and sign-off authority.",
      "R/A": "Responsible & Accountable: Direct owner who both builds and signs off.",
      "C": "Consulted: Subject-matter expert providing inputs and requirements.",
      "I": "Informed: Kept updated on progress and changes."
    };
    return map[role] || role;
  }

  render() {
    if (!this.container) return;

    const filteredLayers = this.filterLayers();
    const teams = this.data.teams;

    // Team Summary Banner when a specific team is chosen
    let teamBannerHtml = "";
    if (this.activeTeamFilter !== "all" && teams[this.activeTeamFilter]) {
      const activeTeam = teams[this.activeTeamFilter];
      teamBannerHtml = `
        <div class="team-summary-banner" style="border-left: 4px solid ${activeTeam.color}; background: ${activeTeam.lightBg};">
          <div class="team-banner-header">
            <span class="team-indicator" style="background:${activeTeam.color}"></span>
            <h3 style="color:${activeTeam.color}">${activeTeam.name} Overview & Governance Scope</h3>
          </div>
          <p class="team-banner-desc">${activeTeam.roleDescription}</p>
          <div class="team-banner-meta">
            <span class="team-meta-item"><strong>Core Roles:</strong> ${activeTeam.coreMembers.join(", ")}</span>
            <span class="team-meta-item"><strong>Primary Ownership:</strong> ${filteredLayers.length} Layers (showing R & A roles)</span>
          </div>
        </div>
      `;
    }

    // Controls bar (Expand/Collapse all, count)
    const controlsHtml = `
      <div class="matrix-controls-bar">
        <div class="matrix-counter">
          Showing <strong>${filteredLayers.length}</strong> of ${this.data.layers.length} Architectural Layers
          ${this.activeTeamFilter !== "all" ? `(Filtered by: <span class="active-filter-tag">${teams[this.activeTeamFilter]?.short}</span>)` : ""}
          ${this.searchQuery ? `(Search: "<em>${this.searchQuery}</em>")` : ""}
        </div>
        <div class="matrix-actions">
          <button class="btn btn-sm btn-ghost" id="btn-matrix-expand-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            Expand All Details
          </button>
          <button class="btn btn-sm btn-ghost" id="btn-matrix-collapse-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>
            Collapse All
          </button>
        </div>
      </div>
    `;

    // Table markup
    let rowsHtml = "";
    if (filteredLayers.length === 0) {
      rowsHtml = `
        <tr>
          <td colspan="6" class="matrix-empty-state">
            <div class="empty-icon">🔍</div>
            <h4>No architectural layers matched your criteria</h4>
            <p>Try clearing your search query or switching back to "All Teams".</p>
          </td>
        </tr>
      `;
    } else {
      filteredLayers.forEach((layer, idx) => {
        const isExpanded = this.expandedRows.has(layer.id);
        const layerNumber = idx + 1;

        rowsHtml += `
          <tr class="matrix-row ${isExpanded ? "is-expanded" : ""}" data-layer-id="${layer.id}">
            <!-- Layer Info Column -->
            <td class="col-layer-info">
              <div class="layer-header-cell">
                <button class="btn-row-toggle" data-layer-id="${layer.id}" title="${isExpanded ? "Collapse details" : "Expand details"}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron-icon ${isExpanded ? "rotated" : ""}">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div class="layer-title-wrap">
                  <span class="layer-badge">${layer.category}</span>
                  <h4 class="layer-name" onclick="window.app.inspectLayer('${layer.id}')" title="Click to inspect">${layer.name}</h4>
                </div>
              </div>
              <p class="layer-desc">${layer.description}</p>
              
              <div class="tech-pills-wrap">
                ${layer.techStack.slice(0, 3).map(tech => `<span class="tech-pill">${tech}</span>`).join("")}
                ${layer.techStack.length > 3 ? `<span class="tech-pill-more" title="${layer.techStack.slice(3).join(', ')}">+${layer.techStack.length - 3} more</span>` : ""}
              </div>
            </td>

            <!-- AI Team RACI -->
            <td class="col-team ${this.activeTeamFilter === 'ai' ? 'col-highlighted' : ''}">
              <div class="raci-cell-wrap">
                <span class="${this.getRaciBadgeClass(layer.raci.ai.role)}" title="${this.getRaciTooltip(layer.raci.ai.role)}">
                  ${layer.raci.ai.role}
                </span>
                <p class="raci-summary-text">${layer.raci.ai.details}</p>
              </div>
            </td>

            <!-- Product Team RACI -->
            <td class="col-team ${this.activeTeamFilter === 'product' ? 'col-highlighted' : ''}">
              <div class="raci-cell-wrap">
                <span class="${this.getRaciBadgeClass(layer.raci.product.role)}" title="${this.getRaciTooltip(layer.raci.product.role)}">
                  ${layer.raci.product.role}
                </span>
                <p class="raci-summary-text">${layer.raci.product.details}</p>
              </div>
            </td>

            <!-- Governance Team RACI -->
            <td class="col-team ${this.activeTeamFilter === 'governance' ? 'col-highlighted' : ''}">
              <div class="raci-cell-wrap">
                <span class="${this.getRaciBadgeClass(layer.raci.governance.role)}" title="${this.getRaciTooltip(layer.raci.governance.role)}">
                  ${layer.raci.governance.role}
                </span>
                <p class="raci-summary-text">${layer.raci.governance.details}</p>
              </div>
            </td>

            <!-- Cyber Security Team RACI -->
            <td class="col-team ${this.activeTeamFilter === 'security' ? 'col-highlighted' : ''}">
              <div class="raci-cell-wrap">
                <span class="${this.getRaciBadgeClass(layer.raci.security.role)}" title="${this.getRaciTooltip(layer.raci.security.role)}">
                  ${layer.raci.security.role}
                </span>
                <p class="raci-summary-text">${layer.raci.security.details}</p>
              </div>
            </td>

            <!-- Actions / Inspect Column -->
            <td class="col-actions">
              <button class="btn btn-sm btn-outline-cyan" onclick="window.app.inspectLayer('${layer.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Deep Dive
              </button>
            </td>
          </tr>
        `;

        // Expandable Detail Row
        if (isExpanded) {
          rowsHtml += `
            <tr class="matrix-detail-row">
              <td colspan="6">
                <div class="detail-accordion-content">
                  <div class="detail-grid">
                    <div class="detail-card">
                      <div class="detail-card-header">
                        <span class="icon">📦</span>
                        <h5>Core Architecture Components</h5>
                      </div>
                      <ul class="detail-list">
                        ${layer.components.map(c => `<li><strong>${c}</strong></li>`).join("")}
                      </ul>
                    </div>

                    <div class="detail-card">
                      <div class="detail-card-header">
                        <span class="icon">⚖️</span>
                        <h5>Governance & Risk Checkpoints</h5>
                      </div>
                      <ul class="detail-list">
                        ${layer.governanceTouchpoints.map(g => `<li>${g}</li>`).join("")}
                      </ul>
                    </div>

                    <div class="detail-card">
                      <div class="detail-card-header">
                        <span class="icon">🛡️</span>
                        <h5>Security & Threat Controls</h5>
                      </div>
                      <ul class="detail-list">
                        ${layer.securityControls.map(s => `<li>${s}</li>`).join("")}
                      </ul>
                    </div>

                    <div class="detail-card">
                      <div class="detail-card-header">
                        <span class="icon">💰</span>
                        <h5>FinOps & Unit Cost Levers</h5>
                      </div>
                      <ul class="detail-list">
                        ${layer.finopsLevers.map(f => `<li>${f}</li>`).join("")}
                      </ul>
                    </div>

                    <div class="detail-card">
                      <div class="detail-card-header">
                        <span class="icon">📊</span>
                        <h5>AIOps & Observability Metrics</h5>
                      </div>
                      <ul class="detail-list">
                        ${layer.aiopsMetrics.map(m => `<li><code>${m}</code></li>`).join("")}
                      </ul>
                    </div>

                    <div class="detail-card">
                      <div class="detail-card-header">
                        <span class="icon">🚀</span>
                        <h5>Key Deliverables & Artifacts</h5>
                      </div>
                      <ul class="detail-list">
                        ${layer.keyDeliverables.map(d => `<li>${d}</li>`).join("")}
                      </ul>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          `;
        }
      });
    }

    const tableHtml = `
      <div class="matrix-table-container">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="th-layer" style="width: 26%;">
                <div class="th-content">
                  <span>Architecture Layer & Tech Stack</span>
                  <span class="th-sub">Scope & Sub-systems</span>
                </div>
              </th>
              <th class="th-team ${this.activeTeamFilter === 'ai' ? 'th-active' : ''}" style="width: 17%; border-top: 3px solid ${teams.ai.color};">
                <div class="th-content">
                  <span style="color: ${teams.ai.color};">AI & ML Team</span>
                  <span class="th-sub">Prompt, Models, RAG, Swarms</span>
                </div>
              </th>
              <th class="th-team ${this.activeTeamFilter === 'product' ? 'th-active' : ''}" style="width: 17%; border-top: 3px solid ${teams.product.color};">
                <div class="th-content">
                  <span style="color: ${teams.product.color};">Product Team</span>
                  <span class="th-sub">UX, Journeys, ROI, Unit Econ</span>
                </div>
              </th>
              <th class="th-team ${this.activeTeamFilter === 'governance' ? 'th-active' : ''}" style="width: 17%; border-top: 3px solid ${teams.governance.color};">
                <div class="th-content">
                  <span style="color: ${teams.governance.color};">Governance & Risk</span>
                  <span class="th-sub">EU AI Act, Ethics, Audits</span>
                </div>
              </th>
              <th class="th-team ${this.activeTeamFilter === 'security' ? 'th-active' : ''}" style="width: 17%; border-top: 3px solid ${teams.security.color};">
                <div class="th-content">
                  <span style="color: ${teams.security.color};">Cyber Security</span>
                  <span class="th-sub">Jailbreaks, PII, Zero-Trust</span>
                </div>
              </th>
              <th class="th-action" style="width: 6%;">
                <div class="th-content">
                  <span>Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Legend markup
    const legendHtml = `
      <div class="matrix-legend-card">
        <div class="legend-title">RACI Responsibility Legend</div>
        <div class="legend-items">
          <div class="legend-item">
            <span class="badge-raci raci-a">A</span>
            <div class="legend-text">
              <strong>Accountable:</strong> Ultimate decision maker and approver. Exactly one A per domain.
            </div>
          </div>
          <div class="legend-item">
            <span class="badge-raci raci-r">R</span>
            <div class="legend-text">
              <strong>Responsible:</strong> The "doer" who builds, configures, and delivers the layer.
            </div>
          </div>
          <div class="legend-item">
            <span class="badge-raci raci-c">C</span>
            <div class="legend-text">
              <strong>Consulted:</strong> Subject matter expert consulted for inputs and requirements.
            </div>
          </div>
          <div class="legend-item">
            <span class="badge-raci raci-i">I</span>
            <div class="legend-text">
              <strong>Informed:</strong> Stakeholder kept updated on progress, outages, and metrics.
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = `
      <div class="matrix-view-wrapper">
        ${teamBannerHtml}
        ${controlsHtml}
        ${tableHtml}
        ${legendHtml}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Expand / collapse all buttons
    const btnExpandAll = document.getElementById("btn-matrix-expand-all");
    const btnCollapseAll = document.getElementById("btn-matrix-collapse-all");

    if (btnExpandAll) {
      btnExpandAll.addEventListener("click", () => this.expandAll());
    }
    if (btnCollapseAll) {
      btnCollapseAll.addEventListener("click", () => this.collapseAll());
    }

    // Toggle individual row buttons
    const rowButtons = this.container.querySelectorAll(".btn-row-toggle");
    rowButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const layerId = btn.getAttribute("data-layer-id");
        this.toggleRowExpand(layerId);
      });
    });
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.MatrixView = MatrixView;
}

