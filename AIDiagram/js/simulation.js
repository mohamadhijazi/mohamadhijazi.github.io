/**
 * Dynamic Flow / Request Simulator Controller
 * Interactive step-by-step trace of an enterprise query through:
 * Channels -> Guardrails -> FinOps -> Orchestrator -> Multi-Agent -> Decisions -> MCPs -> Multi-LLM -> AIOps.
 */

class DynamicSimulationView {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.timer = null;
    this.playSpeedMs = 2800;
    this.activeScenarioId = "success";
  }

  getActiveScenario() {
    return this.activeScenarioId === "identity-denied-recovery"
      ? this.data.simulation.failureScenario
      : this.data.simulation;
  }

  getSteps() {
    return this.getActiveScenario().steps;
  }

  selectScenario(scenarioId) {
    this.pause();
    this.activeScenarioId = scenarioId === "identity-denied-recovery" ? scenarioId : "success";
    this.currentStepIndex = 0;
    this.render();
  }

  init() {
    this.render();
  }

  goToStep(index) {
    const steps = this.getSteps();
    if (index >= 0 && index < steps.length) {
      this.currentStepIndex = index;
      this.render();
    }
  }

  nextStep() {
    const steps = this.getSteps();
    if (this.currentStepIndex < steps.length - 1) {
      this.currentStepIndex++;
      this.render();
    } else {
      this.pause();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.render();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // If at the end, restart
    if (this.currentStepIndex >= this.getSteps().length - 1) {
      this.currentStepIndex = 0;
      this.render();
    }

    this.timer = setInterval(() => {
      if (this.currentStepIndex < this.getSteps().length - 1) {
        this.nextStep();
      } else {
        this.pause();
      }
    }, this.playSpeedMs);

    this.updateControls();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.updateControls();
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.render();
  }

  updateControls() {
    const playBtn = document.getElementById("sim-btn-play");
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ? `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        Pause Trace
      ` : `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Play Auto-Trace
      `;
    }
  }

  render() {
    if (!this.container) return;

    const sim = this.getActiveScenario();
    const steps = sim.steps;
    const current = steps[this.currentStepIndex];
    const team = this.data.teams[current.team] || { name: "System", color: "#64748b" };

    // Stepper dots / timeline
    let timelineDotsHtml = "";
    steps.forEach((step, idx) => {
      const isPast = idx < this.currentStepIndex;
      const isCurrent = idx === this.currentStepIndex;
      const stepTeam = this.data.teams[step.team] || { color: "#64748b" };

      timelineDotsHtml += `
        <div class="sim-timeline-node ${isCurrent ? 'active' : ''} ${isPast ? 'completed' : ''}" 
             onclick="window.app.simulationView.goToStep(${idx})" title="Step ${step.step}: ${step.name}">
          <div class="sim-dot" style="${isCurrent ? `border-color: ${stepTeam.color}; box-shadow: 0 0 12px ${stepTeam.color};` : ''}">
            ${isPast ? '✓' : step.step}
          </div>
          <span class="sim-node-label">${step.step}. ${step.name.split(" ")[0]}</span>
        </div>
      `;
    });

    // Step detail card
    const stepDetailHtml = `
      <div class="sim-current-step-card" style="border-left: 4px solid ${team.color};">
        <div class="sim-card-header">
          <div class="sim-header-left">
            <span class="sim-step-badge">Step ${current.step} of ${steps.length}</span>
            <span class="sim-team-tag" style="background: ${team.lightBg}; color: ${team.color}; border: 1px solid ${team.border};">
              Lead: ${team.name}
            </span>
            <h3 class="sim-step-title">${current.name}</h3>
          </div>
          <div class="sim-header-right" style="display:flex; gap:8px;">
            <button class="btn btn-sm btn-outline-cyan" onclick="window.app.highlightContainerOnC4('${current.containerId}')" title="Switch to C4 Container diagram and highlight this container">
              Spotlight on C4 (L2) 📦
            </button>
            <button class="btn btn-sm btn-ghost" onclick="window.app.inspectLayer('${current.layerId}')">
              View Architectural Layer →
            </button>
          </div>
        </div>

        <p class="sim-step-summary">${current.summary}</p>

        <div class="sim-meta-grid">
          ${Object.entries(current.details).map(([key, val]) => `
            <div class="sim-meta-item">
              <span class="sim-meta-key">${key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
              <span class="sim-meta-val">${val}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    // Visual sequence diagram representation
    let sequenceListHtml = "";
    steps.forEach((step, idx) => {
      const isCurrent = idx === this.currentStepIndex;
      const isPast = idx < this.currentStepIndex;
      const sTeam = this.data.teams[step.team] || { color: "#64748b" };

      sequenceListHtml += `
        <div class="sim-seq-row ${isCurrent ? 'row-active' : ''} ${isPast ? 'row-done' : ''}" onclick="window.app.simulationView.goToStep(${idx})">
          <div class="seq-col-num" style="color: ${isCurrent ? sTeam.color : '#94a3b8'}">${step.step}</div>
          <div class="seq-col-team">
            <span class="badge-dot" style="background: ${sTeam.color}"></span>
            ${sTeam.short}
          </div>
          <div class="seq-col-name">
            <strong>${step.name}</strong>
            <span class="seq-sub">${step.summary.slice(0, 95)}...</span>
          </div>
          <div class="seq-col-status">
            ${step.outcome === "denied" ? `<span class="badge-denied">DENIED</span>` : (isCurrent ? `<span class="badge-pulse" style="background: ${sTeam.lightBg}; color: ${sTeam.color}">EXECUTING</span>` : (isPast ? `<span class="badge-done">COMPLETED</span>` : `<span class="badge-pending">PENDING</span>`))}
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="simulation-view-wrapper">
        <!-- Scenario Banner -->
        <div class="sim-scenario-banner">
          <div class="scenario-icon">⚡</div>
          <div class="scenario-text">
            <div class="scenario-label">${sim.label || "Successful request"} · ILLUSTRATIVE EXECUTION TRACE</div>
            <div class="scenario-query">"${sim.scenario}"</div>
          </div>
          <label class="sim-scenario-picker">
            <span>Scenario</span>
            <select aria-label="Select execution trace scenario" onchange="window.app.simulationView.selectScenario(this.value)">
              <option value="success" ${this.activeScenarioId === "success" ? "selected" : ""}>Successful request</option>
              <option value="identity-denied-recovery" ${this.activeScenarioId === "identity-denied-recovery" ? "selected" : ""}>Expired identity: denial and recovery</option>
            </select>
          </label>
          <div class="sim-control-buttons">
            <button class="btn btn-sm btn-ghost" id="sim-btn-prev" onclick="window.app.simulationView.prevStep()" ${this.currentStepIndex === 0 ? 'disabled' : ''}>
              ◀ Prev
            </button>
            <button class="btn btn-sm btn-primary" id="sim-btn-play" onclick="window.app.simulationView.isPlaying ? window.app.simulationView.pause() : window.app.simulationView.play()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Play Auto-Trace
            </button>
            <button class="btn btn-sm btn-ghost" id="sim-btn-next" onclick="window.app.simulationView.nextStep()" ${this.currentStepIndex === steps.length - 1 ? 'disabled' : ''}>
              Next ▶
            </button>
            <button class="btn btn-sm btn-outline-cyan" onclick="window.app.simulationView.reset()">
              Reset
            </button>
          </div>
        </div>

        <!-- Progress Timeline Bar -->
        <div class="sim-timeline-container">
          <div class="sim-timeline-track">
            <div class="sim-timeline-progress" style="width: ${(this.currentStepIndex / (steps.length - 1)) * 100}%"></div>
          </div>
          <div class="sim-timeline-nodes">
            ${timelineDotsHtml}
          </div>
        </div>

        <!-- Current Step Drilldown -->
        ${stepDetailHtml}

        <!-- Full Sequence Table -->
        <div class="sim-sequence-wrapper">
          <div class="sim-seq-header">
            <h4>Execution Trace (${steps.length} steps)</h4>
            <span class="sim-seq-hint">Click any row to jump immediately to that stage in the execution trace</span>
          </div>
          <div class="sim-seq-table">
            ${sequenceListHtml}
          </div>
        </div>
      </div>
    `;

    this.updateControls();
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.DynamicSimulationView = DynamicSimulationView;
}
