/* ==========================================================================
   DIGITAL TWIN WORKSPACE - MULTI-VIEWPORT CANVAS RENDERER & MANAGER
   Handles BPMN, FullCalendar, Highcharts, OpenMap, 3D Spatial, & Data Tables
   ========================================================================== */

class ViewportManager {
  constructor() {
    this.activeTab = "bpmn";
    this.leafletMap = null;
  }

  init() {
    this.bindTabControls();
    this.renderActiveViewport();
  }

  bindTabControls() {
    const tabs = document.querySelectorAll(".viewport-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        tabs.forEach(t => t.classList.remove("active"));
        const selected = tab.getAttribute("data-viewport");
        tab.classList.add("active");
        this.switchViewport(selected);
      });
    });
  }

  switchViewport(viewportId) {
    this.activeTab = viewportId;
    document.querySelectorAll(".viewport-pane").forEach(pane => {
      pane.classList.remove("active");
    });

    const targetPane = document.getElementById(`pane-${viewportId}`);
    if (targetPane) {
      targetPane.classList.add("active");
    }

    this.renderActiveViewport();
  }

  renderActiveViewport() {
    const ws = window.appState.getWorkspace();

    switch (this.activeTab) {
      case "bpmn":
        this.renderBPMNViewport(ws);
        break;
      case "calendar":
        this.renderCalendarViewport(ws);
        break;
      case "charts":
        this.renderHighchartsViewport(ws);
        break;
      case "map":
        this.renderOpenMapViewport(ws);
        break;
      case "spatial3d":
        this.renderSpatial3DViewport(ws);
        break;
      case "table":
        this.renderTableViewport(ws);
        break;
    }
  }

  // 1. BPMN Viewport
  renderBPMNViewport(ws) {
    const container = document.getElementById("bpmnCanvasContainer");
    if (!container) return;

    const model = ws.bpmnModel || { title: "Standard Workflow Process", nodes: [] };

    let nodesHtml = model.nodes.map(node => `
      <div class="bpmn-node-item glass-panel" data-tag="${node.tag || ''}" style="padding:1.2rem; min-width:200px; text-align:center; border:1px solid rgba(0,242,254,0.3); position:relative; transition: all 0.3s ease;">
        <span class="badge ${node.status === 'OK' ? 'badge-cyan' : 'badge-orange'}" style="position:absolute; top:8px; right:8px;">${node.status}</span>
        <div style="font-size:1.6rem; margin-bottom:0.4rem;">⚙️</div>
        <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.25rem;">${node.name}</div>
        <div style="font-size:0.75rem; color:var(--accent-cyan);">Tag: ${node.tag || 'General'}</div>
      </div>
    `).join('<div style="font-size:1.5rem; color:var(--accent-cyan); font-weight:bold;">➔</div>');

    container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column;">
        <div style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-glass); display:flex; justify-content:space-between; align-items:center;">
          <h4 style="color:var(--text-main); font-weight:700;">BPMN Process Modeling: ${model.title}</h4>
          <span class="badge badge-purple">Real-Time Signal Dynamic Highlights Enabled</span>
        </div>
        <div style="flex:1; display:flex; align-items:center; justify-content:center; gap:1.25rem; padding:2rem; overflow-x:auto;">
          ${nodesHtml}
        </div>
      </div>
    `;
  }

  // 2. FullCalendar 5-Year Horizon Viewport
  renderCalendarViewport(ws) {
    const container = document.getElementById("calendarCanvasContainer");
    if (!container) return;

    const events = ws.calendarEvents || [];

    let eventsListHtml = events.map(ev => `
      <div class="glass-panel" style="padding:0.85rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; font-size:0.92rem; color:var(--text-main);">${ev.title}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${ev.start} ${ev.end ? 'to ' + ev.end : ''} &bull; <span style="color:var(--accent-cyan);">${ev.category}</span></div>
        </div>
        <span class="badge badge-cyan">${(ev.tags || []).join(", ")}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="padding:1rem; height:100%; display:flex; flex-direction:column;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h4 style="font-weight:700;">5-Year Strategic Horizon Calendar (2026 – 2031)</h4>
          <span class="badge badge-green">Offline Local Storage Sync</span>
        </div>
        <div style="flex:1; overflow-y:auto;">
          ${eventsListHtml}
        </div>
      </div>
    `;
  }

  // 3. Highcharts Analytics Engine Viewport
  renderHighchartsViewport(ws) {
    const container = document.getElementById("chartsCanvasContainer");
    if (!container) return;

    const analytics = ws.analytics || { months: [], flightData: [], utilityExpenses: [] };

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.25rem; height:100%;">
        <div class="glass-panel" style="padding:1.25rem; display:flex; flex-direction:column;">
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:1rem; color:var(--accent-cyan);">📊 5-Year Travel & Flight Frequency Trajectory</h4>
          <div style="flex:1; display:flex; align-items:flex-end; gap:0.75rem; padding-bottom:1rem; border-bottom:1px solid var(--border-glass);">
            ${analytics.flightData.map((val, idx) => `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:0.4rem;">
                <span style="font-size:0.75rem; font-weight:700; color:var(--accent-cyan);">${val}</span>
                <div style="width:100%; height:${val * 3}px; background:var(--grad-primary); border-radius:4px;"></div>
                <span style="font-size:0.7rem; color:var(--text-muted);">${analytics.months[idx] || 'T'+idx}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="glass-panel" style="padding:1.25rem; display:flex; flex-direction:column;">
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:1rem; color:var(--accent-purple);">💰 Household & Operational Expense Trends</h4>
          <div style="flex:1; display:flex; align-items:flex-end; gap:0.75rem; padding-bottom:1rem; border-bottom:1px solid var(--border-glass);">
            ${analytics.utilityExpenses.map((val, idx) => `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:0.4rem;">
                <span style="font-size:0.72rem; font-weight:700; color:#c084fc;">$${(val/1000).toFixed(1)}k</span>
                <div style="width:100%; height:${Math.min(val/200, 160)}px; background:var(--grad-accent); border-radius:4px;"></div>
                <span style="font-size:0.7rem; color:var(--text-muted);">${analytics.months[idx] || 'M'+idx}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 4. OpenMap Geo Tracking Viewport
  renderOpenMapViewport(ws) {
    const container = document.getElementById("mapCanvasContainer");
    if (!container) return;

    const locations = ws.mapLocations || [];

    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column;">
        <div style="padding:0.6rem 1rem; background:#090d17; border-bottom:1px solid var(--border-glass); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; font-size:0.9rem;">📍 OpenMap Geo-Spatial Twin Tracking</span>
          <span class="badge badge-cyan">${locations.length} Active Spatial Pins</span>
        </div>
        <div id="leafletMapInner" style="flex:1; width:100%; background:#050810; display:flex; flex-direction:column; padding:1rem; gap:0.75rem; overflow-y:auto;">
          ${locations.map(loc => `
            <div class="glass-panel" style="padding:1rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">${loc.name}</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Coordinates: Lat ${loc.lat}, Lng ${loc.lng}</div>
              </div>
              <span class="badge badge-purple">${loc.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. 3D Spatial Layout Viewport
  renderSpatial3DViewport(ws) {
    const container = document.getElementById("spatial3dCanvasContainer");
    if (!container) return;

    const spatial = ws.spatial3D || { floorName: "Default Twin Layout", rooms: [] };

    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; padding:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h4 style="font-weight:700; font-size:1.1rem; color:var(--accent-cyan);">📐 Blueprint3D Spatial Layout: ${spatial.floorName}</h4>
          <span class="badge badge-green">3D Sensor Engine Active</span>
        </div>
        <div style="flex:1; display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
          ${spatial.rooms.map(room => `
            <div class="glass-panel" style="padding:1.25rem; border:1px solid rgba(0,242,254,0.25); display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="font-size:1.8rem; margin-bottom:0.5rem;">🏬</div>
                <h5 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:0.3rem;">${room.name}</h5>
                <p style="font-size:0.8rem; color:var(--text-muted);">Dimensions: ${room.width} x ${room.length}</p>
              </div>
              <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border-glass); font-size:0.78rem; color:var(--accent-cyan);">
                Assets: ${room.assets}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 6. jqTable Data Grid Viewport
  renderTableViewport(ws) {
    const container = document.getElementById("tableCanvasContainer");
    if (!container) return;

    const rows = ws.tables || [];

    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; padding:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h4 style="font-weight:700; font-size:1.05rem;">📋 jqTable Structured Data & License Renewals</h4>
          <button class="btn btn-sm btn-outline" onclick="window.appState.exportWorkspaceJSON()">Export JSON</button>
        </div>
        <div style="flex:1; overflow-y:auto;">
          <table class="data-table-custom">
            <thead>
              <tr>
                <th>Item / Contract</th>
                <th>Provider / Entity</th>
                <th>Amount / Fee</th>
                <th>Renewal / Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  <td style="font-weight:600; color:var(--text-main);">${row.item}</td>
                  <td>${row.provider}</td>
                  <td style="color:var(--accent-cyan); font-weight:700;">${row.amount}</td>
                  <td>${row.dueDate}</td>
                  <td><span class="badge ${row.status.includes('Warning') ? 'badge-orange' : 'badge-green'}">${row.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

window.viewportManager = new ViewportManager();
