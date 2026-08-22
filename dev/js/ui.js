/**
 * Impact360 Command Center - UI Renderer Component
 * Comprehensive UI renderer with full CRUD capabilities across all modules:
 * - Executive Dashboard & KPIs
 * - Spatial Hierarchy (Locations -> Buildings -> Floors -> Rooms) & MetaModel
 * - Routines & Recurring Operations (Daily, Weekly, Monthly, Shopping Lists, Trips)
 * - Projects Portfolio & Smart Schedule Recommendations
 * - Strategic Objectives & Health Status
 * - External Events Center & Disruption Impact
 * - Innovation Marketplace (Kanban CRUD)
 * - Employee Ownership Portal & Gamification
 * - Interactive OpenStreetMap (Leaflet.js) GIS Command Map
 */

const UI = (function () {
  let activeMapInstance = null;
  let activeMapMarkers = [];
  let activeMapFilter = 'all'; // 'all', 'projects', 'events', 'facilities', 'high_risk'
  let activeHeatmapViewMode = 'map'; // 'map' or 'grid'

  let activeSpatialLocationId = null;
  let activeSpatialBuildingId = null;
  let activeSpatialFloorId = null;
  let activeSpatialMetaModelTag = 'ALL';

  let activeRoutineFrequency = 'ALL'; // 'ALL', 'Daily', 'Weekly', 'Monthly'
  let activeRoutineCategory = 'ALL';  // 'ALL', 'Trips & Field Visits', 'Shopping & Procurement', 'Operations & Audits'

  // ==========================================
  // 1. Toast Notification System
  // ==========================================
  function showToast(message, type = 'success') {
    const icon = type === 'success' ? '✅' : (type === 'danger' ? '⚠️' : 'ℹ️');
    const toast = $(`
      <div class="toast toast-${type}">
        <span>${icon}</span>
        <div>${message}</div>
      </div>
    `);

    $('#toast-container').append(toast);
    setTimeout(() => {
      toast.addClass('toast-fadeout');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // 2. Global Modal & Drawer Helpers
  // ==========================================
  function closeModal() {
    $('#modal-overlay').removeClass('active');
    $('#modal-box').empty();
  }

  function closeDrawer() {
    $('#drawer-panel').removeClass('active');
    $('#drawer-overlay').removeClass('active');
    $('#drawer-panel').empty();
  }

  function toggleQuickAddMenu(e) {
    if (e) e.stopPropagation();
    $('#quick-add-dropdown').toggleClass('active');
  }

  function hideQuickAddMenu() {
    $('#quick-add-dropdown').removeClass('active');
  }

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.quick-add-container').length) {
      hideQuickAddMenu();
    }
  });

  function confirmAction(title, message, onConfirm) {
    const html = `
      <div class="modal-header">
        <span class="modal-title">${title}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div style="padding: 10px 0;">
        <p style="font-size: 14px; color: var(--text-dark); margin-bottom: 20px;">${message}</p>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="button" class="btn btn-danger" id="btn-confirm-delete">Confirm Delete</button>
        </div>
      </div>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');

    $('#btn-confirm-delete').on('click', function () {
      UI.closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    });
  }

  function resetDemoData() {
    confirmAction(
      'Reset All Data to Demo State?',
      'This will clear all custom edits, facilities, routines, and projects from local storage and restore default factory dataset.',
      () => {
        ImpactData.resetToDemoData();
        App.refreshCurrentView();
        showToast('All data has been restored to default demo state.', 'success');
      }
    );
  }

  // ==========================================
  // 3. View: Executive Dashboard
  // ==========================================
  function renderExecutiveDashboard() {
    const data = ImpactData.getState();
    const globalRisk = RiskEngine.calculateGlobalRiskIndex(data.projects, data.events);
    const activeEventsCount = (data.events || []).filter(e => e.status === 'Active').length;

    const totalProjects = (data.projects || []).length;
    const totalObjectives = (data.objectives || []).length;
    const totalEmployees = (data.employees || []).length;
    const citizenSat = 91; // %
    const totalInnovations = (data.innovations || []).length;
    const totalEvents = (data.events || []).length;
    const totalLocations = (data.locations || []).length;
    const totalRooms = (data.rooms || []).length;
    const totalRoutines = (data.routines || []).length;

    const ownershipIndex = totalEmployees > 0 
      ? Math.round(data.employees.reduce((acc, e) => acc + e.ownershipScore, 0) / totalEmployees)
      : 0;

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Command Center</h1>
          <p class="page-subtitle">Real-time outcome measurement, spatial facilities & recurring operational routines</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-secondary" onclick="App.navigateTo('routines')">📋 Routines (${totalRoutines})</button>
          <button class="btn btn-secondary" onclick="App.navigateTo('facilities')">🏢 Facilities (${totalLocations})</button>
          <button class="btn btn-secondary" onclick="App.navigateTo('heatmap')">🗺️ Open Map View</button>
          <button class="btn btn-primary" onclick="UI.openProjectModal()">+ New Project</button>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-success" onclick="App.navigateTo('projects')" style="cursor:pointer;" title="View Projects Portfolio">
          <div class="kpi-top">
            <span class="kpi-label">Active Projects</span>
            <div class="kpi-icon">📁</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${totalProjects}</span>
            <span class="kpi-change up">CRUD Enabled</span>
          </div>
          <div class="kpi-footer">Click to manage portfolio</div>
        </div>

        <div class="kpi-card kpi-success" onclick="App.navigateTo('routines')" style="cursor:pointer;" title="View Routines & Tasks">
          <div class="kpi-top">
            <span class="kpi-label">Recurring Routines</span>
            <div class="kpi-icon">📋</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${totalRoutines}</span>
            <span class="kpi-change up">Daily/Weekly/Monthly</span>
          </div>
          <div class="kpi-footer">Trips, shopping & maintenance</div>
        </div>

        <div class="kpi-card" onclick="App.navigateTo('facilities')" style="cursor:pointer;" title="View Facilities & Spatial Assets">
          <div class="kpi-top">
            <span class="kpi-label">Spatial Assets</span>
            <div class="kpi-icon">🏢</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${totalLocations}</span>
            <span class="kpi-change up">${totalRooms} Rooms</span>
          </div>
          <div class="kpi-footer">Connected to MetaModel</div>
        </div>

        <div class="kpi-card kpi-success" onclick="App.navigateTo('citizen')" style="cursor:pointer;">
          <div class="kpi-top">
            <span class="kpi-label">Citizen Satisfaction</span>
            <div class="kpi-icon">⭐</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${citizenSat}%</span>
            <span class="kpi-change up">↑ 7% vs Q2</span>
          </div>
          <div class="kpi-footer">Public service feedback</div>
        </div>

        <div class="kpi-card" onclick="App.navigateTo('innovation')" style="cursor:pointer;" title="View Innovation Kanban">
          <div class="kpi-top">
            <span class="kpi-label">Innovation Ideas</span>
            <div class="kpi-icon">💡</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${totalInnovations}</span>
            <span class="kpi-change up">Kanban Pipeline</span>
          </div>
          <div class="kpi-footer">Crowdsourced initiatives</div>
        </div>

        <div class="kpi-card kpi-warning" onclick="App.navigateTo('events')" style="cursor:pointer;" title="View Events Stream">
          <div class="kpi-top">
            <span class="kpi-label">External Events</span>
            <div class="kpi-icon">⚡</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${totalEvents}</span>
            <span class="kpi-change down">${activeEventsCount} Active</span>
          </div>
          <div class="kpi-footer">Contextual risk triggers</div>
        </div>

        <div class="kpi-card kpi-success">
          <div class="kpi-top">
            <span class="kpi-label">Ownership Index</span>
            <div class="kpi-icon">🏆</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${ownershipIndex}</span>
            <span class="kpi-change up">Score / 100</span>
          </div>
          <div class="kpi-footer">Context-aware baseline</div>
        </div>
      </div>

      <!-- AI Insights Panel -->
      <div class="ai-insights-panel">
        <div class="ai-header">
          <span class="ai-badge">MetaModel AI Intelligence</span>
          <span class="ai-title">Contextual Impact, Spatial Risk & Decision Insights</span>
        </div>
        <div class="ai-insight-list">
          <div class="ai-insight-item">
            <span class="ai-insight-bullet">📋</span>
            <div><strong>Routine Execution Streaks:</strong> Data Center Daily Walkthrough is on a 14-day completion streak. Port logistics inspection routine scheduled for Thursday.</div>
          </div>
          <div class="ai-insight-item">
            <span class="ai-insight-bullet">🏢</span>
            <div><strong>Spatial MetaModel Status:</strong> ${totalLocations} Geo Campuses, ${(data.buildings || []).length} Buildings, and ${totalRooms} Rooms mapped to Cyber (#cyberattack), Weather (#sandstorm), and Port (#supply_chain) MetaModel tags.</div>
          </div>
          <div class="ai-insight-item">
            <span class="ai-insight-bullet">⚡</span>
            <div><strong>Supply Chain Risk Alert:</strong> Regional transit initiatives are actively monitored for port congestion (#ports).</div>
          </div>
        </div>
      </div>

      <!-- Executive Sections Grid -->
      <div class="dashboard-sections-grid">
        <!-- Top Projects Overview -->
        <div class="section-card">
          <div class="section-title-bar">
            <span class="section-title">Critical Projects at Risk</span>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-primary" onclick="UI.openProjectModal()">+ Add Project</button>
              <button class="btn btn-sm btn-secondary" onclick="App.navigateTo('projects')">View All</button>
            </div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Region</th>
                  <th>Progress</th>
                  <th>Risk Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${(data.projects || []).slice(0, 5).map(p => {
                  const riskObj = RiskEngine.calculateProjectRisk(p, data.events);
                  const badgeClass = riskObj.totalRisk > 60 ? 'badge-red' : (riskObj.totalRisk > 35 ? 'badge-amber' : 'badge-green');
                  return `
                    <tr>
                      <td>
                        <strong>${p.name}</strong><br>
                        <span style="font-size:11px; color:var(--text-muted);">${p.owner} • ${p.department}</span>
                      </td>
                      <td><span class="tag-pill">${p.region || 'Central'}</span></td>
                      <td>
                        <div class="progress-bar-container" style="width: 100px;">
                          <div class="progress-bar-fill" style="width: ${p.progress}%"></div>
                        </div>
                        <span style="font-size:11px;">${p.progress}%</span>
                      </td>
                      <td><span class="badge ${badgeClass}">${riskObj.totalRisk} / 100</span></td>
                      <td>
                        <div class="table-actions">
                          <button class="btn btn-sm btn-primary" onclick="UI.showScheduleModal('${p.id}')">Analyze</button>
                          <button class="btn-icon btn-edit" onclick="UI.openProjectModal('${p.id}')" title="Edit Project">✏️</button>
                          <button class="btn-icon btn-delete" onclick="UI.deleteProject('${p.id}')" title="Delete Project">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Recognitions Feed -->
        <div class="section-card">
          <div class="section-title-bar">
            <span class="section-title">Peer Recognition Feed</span>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-primary" onclick="UI.openRecognitionModal()">+ Send</button>
              <button class="btn btn-sm btn-secondary" onclick="App.navigateTo('employees')">View All</button>
            </div>
          </div>
          <div class="recognition-timeline">
            ${(data.recognitions || []).slice(0, 4).map(r => `
              <div class="recognition-card">
                <div class="recognition-sender-avatar">${(r.senderName || 'U').charAt(0)}</div>
                <div class="recognition-body" style="width:100%;">
                  <div class="recognition-header">
                    <span class="recognition-sender">${r.senderName} ➔ ${r.receiverName}</span>
                    <span class="recognition-time">${r.date}</span>
                  </div>
                  <div class="recognition-text">"${r.message}"</div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                    <div class="recognition-badge">🏅 ${r.badge}</div>
                    <button class="btn-icon btn-delete" onclick="UI.deleteRecognition('${r.id}')" title="Delete recognition">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    $('#view-executive').html(html);
  }

  // =========================================================================
  // 4. View: Routines & Recurring Tasks (Daily, Weekly, Monthly, Trips, Shopping)
  // =========================================================================
  function renderRoutinesModule(frequencyFilter = null, categoryFilter = null) {
    if (frequencyFilter !== null) activeRoutineFrequency = frequencyFilter;
    if (categoryFilter !== null) activeRoutineCategory = categoryFilter;

    const routines = ImpactData.getRoutines();
    const frequencies = ['ALL', 'Daily', 'Weekly', 'Monthly'];
    const categories = ['ALL', 'Trips & Field Visits', 'Shopping & Procurement', 'Operations & Audits', 'Facility Maintenance'];

    let filtered = routines;
    if (activeRoutineFrequency !== 'ALL') {
      filtered = filtered.filter(r => r.frequency === activeRoutineFrequency);
    }
    if (activeRoutineCategory !== 'ALL') {
      filtered = filtered.filter(r => r.category === activeRoutineCategory);
    }

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Operational Routines & Recurring Checklists</h1>
          <p class="page-subtitle">Manage recurring schedules: Daily, Weekly, and Monthly field trips, shopping lists & audits</p>
        </div>
        <button class="btn btn-primary" onclick="UI.openRoutineModal()">+ Create New Routine</button>
      </div>

      <!-- Frequency Tabs Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div class="heatmap-view-toggle">
          ${frequencies.map(f => `
            <button class="view-toggle-btn ${activeRoutineFrequency === f ? 'active' : ''}" onclick="UI.renderRoutinesModule('${f}', null)">
              ${f === 'ALL' ? 'All Frequencies' : (f === 'Daily' ? '📅 Daily' : (f === 'Weekly' ? '🗓️ Weekly' : '📆 Monthly'))}
            </button>
          `).join('')}
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${categories.map(c => `
            <button class="btn btn-sm ${activeRoutineCategory === c ? 'btn-primary' : 'btn-secondary'}" onclick="UI.renderRoutinesModule(null, '${c}')">
              ${c === 'ALL' ? 'All Categories' : (c === 'Trips & Field Visits' ? '🚗 Trips' : (c === 'Shopping & Procurement' ? '🛒 Shopping' : (c === 'Operations & Audits' ? '📋 Audits' : '🔧 Maintenance')))}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="cards-grid">
        ${filtered.length > 0 ? filtered.map(r => {
          const completedCount = (r.items || []).filter(i => i.completed).length;
          const totalCount = (r.items || []).length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const freqClass = r.frequency === 'Daily' ? 'routine-daily' : (r.frequency === 'Weekly' ? 'routine-weekly' : 'routine-monthly');
          const isDone = r.status === 'Completed' || (totalCount > 0 && completedCount === totalCount);

          return `
            <div class="routine-card ${freqClass}">
              <div>
                <div class="routine-header">
                  <div>
                    <span class="badge ${r.frequency === 'Daily' ? 'badge-blue' : (r.frequency === 'Weekly' ? 'badge-amber' : 'badge-green')}">${r.frequency}</span>
                    <span class="badge ${r.priority === 'High' ? 'badge-red' : 'badge-green'}" style="margin-left:4px;">${r.priority}</span>
                    <div class="routine-title" style="margin-top:6px;">${r.title}</div>
                    <div class="routine-meta">
                      🕒 ${r.scheduleTime} • Lead: <strong>${r.assignedTo}</strong>
                    </div>
                  </div>
                  <span class="routine-streak-badge" title="Consecutive routine completion streak">
                    🔥 ${r.streak || 0} Streak
                  </span>
                </div>
              </div>

              <!-- Checklist / Shopping Items -->
              <div>
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                  <span style="font-weight:600; color:var(--text-dark);">
                    ${r.category === 'Shopping & Procurement' ? '🛒 Shopping Items' : '📋 Task Checklist'} (${completedCount}/${totalCount})
                  </span>
                  <span style="font-weight:700; color:var(--primary-navy);">${pct}%</span>
                </div>
                <div class="progress-bar-container" style="margin-bottom:10px;">
                  <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                </div>

                <div class="routine-checklist-container">
                  ${(r.items || []).map(item => `
                    <div class="routine-item-row">
                      <label class="routine-item-left">
                        <input type="checkbox" class="routine-item-checkbox" ${item.completed ? 'checked' : ''} onchange="UI.toggleRoutineChecklistItem('${r.id}', '${item.id}')">
                        <span class="routine-item-text ${item.completed ? 'completed' : ''}">${item.text}</span>
                      </label>
                      ${item.quantity ? `<span class="routine-item-quantity">${item.quantity}</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- MetaModel Tags -->
              <div>
                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                  ${(r.metamodelTags || []).map(t => `<span class="tag-pill">${t}</span>`).join(' ')}
                </div>
              </div>

              <!-- Action Footer -->
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                <button class="btn btn-sm ${isDone ? 'btn-secondary' : 'btn-primary'}" onclick="UI.completeRoutine('${r.id}')">
                  ${isDone ? '✅ Completed' : 'Mark Routine Complete'}
                </button>
                <div class="table-actions">
                  <button class="btn-icon btn-edit" onclick="UI.openRoutineModal('${r.id}')" title="Edit Routine">✏️</button>
                  <button class="btn-icon btn-delete" onclick="UI.deleteRoutine('${r.id}')" title="Delete Routine">🗑️</button>
                </div>
              </div>
            </div>
          `;
        }).join('') : `
          <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 36px; margin-bottom: 8px;">📋</div>
            <h3 style="font-size: 16px; font-weight: 700; color: var(--primary-navy-dark);">No routines found in this filter</h3>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Create daily inspection trips, weekly shopping lists, or monthly audit checklists.</p>
            <button class="btn btn-primary" style="margin-top: 16px;" onclick="UI.openRoutineModal()">+ Create New Routine</button>
          </div>
        `}
      </div>
    `;

    $('#view-routines').html(html);
  }

  function openRoutineModal(routineId = null) {
    const isEdit = !!routineId;
    const routine = isEdit ? ImpactData.getRoutineById(routineId) : null;
    const employees = ImpactData.getEmployees();
    const locations = ImpactData.getLocations();
    const allTags = ImpactData.ALL_METAMODEL_TAGS;

    const initialItems = (routine && Array.isArray(routine.items) && routine.items.length > 0)
      ? routine.items
      : [
          { id: 'it_new_1', text: 'Inspect main perimeter security sensors', quantity: 'Sensors 1-8' },
          { id: 'it_new_2', text: 'Verify temperature logs and backup inverter', quantity: 'NOC Level' }
        ];

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Routine / Shopping List' : 'Create New Routine / List'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveRoutine(event, '${routineId || ''}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Routine Title *</label>
            <input type="text" id="rou-title" class="form-control" required value="${routine ? routine.title : ''}" placeholder="e.g. Weekly IT Hardware Procurement List">
          </div>
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select id="rou-cat" class="form-select" required>
              <option ${routine && routine.category === 'Trips & Field Visits' ? 'selected' : ''}>Trips & Field Visits</option>
              <option ${routine && routine.category === 'Shopping & Procurement' ? 'selected' : ''}>Shopping & Procurement</option>
              <option ${routine && routine.category === 'Operations & Audits' ? 'selected' : ''}>Operations & Audits</option>
              <option ${routine && routine.category === 'Facility Maintenance' ? 'selected' : ''}>Facility Maintenance</option>
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Recurrence Frequency *</label>
            <select id="rou-freq" class="form-select" required>
              <option value="Daily" ${routine && routine.frequency === 'Daily' ? 'selected' : ''}>Daily</option>
              <option value="Weekly" ${routine && routine.frequency === 'Weekly' ? 'selected' : ''}>Weekly</option>
              <option value="Monthly" ${routine && routine.frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Schedule Detail *</label>
            <input type="text" id="rou-schedule" class="form-control" required value="${routine ? routine.scheduleTime : 'Daily at 08:30 AM'}" placeholder="e.g. Every Monday & Thursday">
          </div>
          <div class="form-group">
            <label class="form-label">Priority</label>
            <select id="rou-priority" class="form-select">
              <option value="High" ${routine && routine.priority === 'High' ? 'selected' : ''}>High</option>
              <option value="Medium" ${routine && routine.priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="Low" ${routine && routine.priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Assigned Lead / Staff *</label>
            <select id="rou-lead" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.name}" ${routine && routine.assignedTo === e.name ? 'selected' : ''}>${e.name} (${e.department})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Facility / Campus Location</label>
            <select id="rou-loc" class="form-select">
              <option value="">-- No Specific Facility Link --</option>
              ${locations.map(l => `
                <option value="${l.id}" ${routine && routine.locationId === l.id ? 'selected' : ''}>${l.name} (${l.code})</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Dynamic Checklist / Shopping Item Builder -->
        <div class="form-group">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <label class="form-label" style="margin-bottom:0;">Checklist Items / Shopping Line Items *</label>
            <button type="button" class="btn btn-sm btn-secondary" onclick="UI.addRoutineBuilderItem()">+ Add Line Item</button>
          </div>
          <div id="routine-items-builder" class="dynamic-item-builder">
            ${initialItems.map(item => `
              <div class="builder-item-row">
                <input type="text" class="form-control item-text-input" placeholder="Task description or shopping item..." value="${item.text}" required>
                <input type="text" class="form-control item-qty-input" placeholder="Qty / Notes" value="${item.quantity || ''}">
                <button type="button" class="btn-icon btn-delete" onclick="UI.removeRoutineBuilderItem(this)" title="Remove item">✕</button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">MetaModel Tags (Hold Ctrl to select multiple)</label>
          <select id="rou-tags" class="form-select" multiple style="height: 80px;">
            ${allTags.map(tag => {
              const isSelected = routine && routine.metamodelTags && routine.metamodelTags.includes(tag);
              return `<option value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</option>`;
            }).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Routine' : 'Create Routine'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function addRoutineBuilderItem(text = '', qty = '') {
    const row = $(`
      <div class="builder-item-row">
        <input type="text" class="form-control item-text-input" placeholder="Task description or shopping item..." value="${text}" required>
        <input type="text" class="form-control item-qty-input" placeholder="Qty / Notes" value="${qty}">
        <button type="button" class="btn-icon btn-delete" onclick="UI.removeRoutineBuilderItem(this)" title="Remove item">✕</button>
      </div>
    `);
    $('#routine-items-builder').append(row);
  }

  function removeRoutineBuilderItem(buttonElem) {
    if ($('#routine-items-builder .builder-item-row').length > 1) {
      $(buttonElem).closest('.builder-item-row').remove();
    } else {
      showToast('A routine must contain at least one item.', 'warning');
    }
  }

  function saveRoutine(event, routineId) {
    event.preventDefault();
    const items = [];
    $('#routine-items-builder .builder-item-row').each(function (idx) {
      const text = $(this).find('.item-text-input').val().trim();
      const qty = $(this).find('.item-qty-input').val().trim();
      if (text) {
        items.push({
          id: `item_${Date.now()}_${idx}`,
          text: text,
          quantity: qty,
          completed: false
        });
      }
    });

    const tags = $('#rou-tags').val() || ['#smart_facility'];

    const routineData = {
      title: $('#rou-title').val().trim(),
      category: $('#rou-cat').val(),
      frequency: $('#rou-freq').val(),
      scheduleTime: $('#rou-schedule').val().trim(),
      priority: $('#rou-priority').val(),
      assignedTo: $('#rou-lead').val(),
      locationId: $('#rou-loc').val() || null,
      items: items,
      metamodelTags: tags
    };

    if (routineId) {
      ImpactData.updateRoutine(routineId, routineData);
      showToast(`Routine "${routineData.title}" updated!`, 'success');
    } else {
      ImpactData.createRoutine(routineData);
      showToast(`New ${routineData.frequency} routine created!`, 'success');
    }

    closeModal();
    renderRoutinesModule();
  }

  function deleteRoutine(routineId) {
    const routine = ImpactData.getRoutineById(routineId);
    if (!routine) return;

    confirmAction(
      `Delete Routine "${routine.title}"?`,
      'Are you sure you want to remove this recurring routine schedule?',
      () => {
        ImpactData.deleteRoutine(routineId);
        showToast('Routine deleted.', 'danger');
        renderRoutinesModule();
      }
    );
  }

  function toggleRoutineChecklistItem(routineId, itemId) {
    const res = ImpactData.toggleRoutineItem(routineId, itemId);
    if (res) {
      renderRoutinesModule();
    }
  }

  function completeRoutine(routineId) {
    const r = ImpactData.completeRoutine(routineId);
    if (r) {
      showToast(`🎉 Routine "${r.title}" completed! Streak is now 🔥 ${r.streak}!`, 'success');
      renderRoutinesModule();
    }
  }

  // =========================================================================
  // 5. View: Facilities & Spatial Hierarchy (Locations -> Buildings -> Floors -> Rooms)
  // =========================================================================
  function renderFacilitiesModule(locationId = null, buildingId = null, floorId = null) {
    const data = ImpactData.getState();
    const locations = data.locations || [];
    const buildings = data.buildings || [];
    const floors = data.floors || [];
    const rooms = data.rooms || [];

    if (locationId !== null) activeSpatialLocationId = locationId;
    if (buildingId !== null) activeSpatialBuildingId = buildingId;
    if (floorId !== null) activeSpatialFloorId = floorId;

    const currentLoc = locations.find(l => l.id === activeSpatialLocationId);
    const locBuildings = currentLoc ? buildings.filter(b => b.locationId === currentLoc.id) : [];

    let currentBld = locBuildings.find(b => b.id === activeSpatialBuildingId);
    if (!currentBld && locBuildings.length > 0) {
      currentBld = locBuildings[0];
      activeSpatialBuildingId = currentBld.id;
    }

    const bldFloors = currentBld ? floors.filter(f => f.buildingId === currentBld.id) : [];
    let currentFlr = bldFloors.find(f => f.id === activeSpatialFloorId);
    if (!currentFlr && bldFloors.length > 0) {
      currentFlr = bldFloors[0];
      activeSpatialFloorId = currentFlr.id;
    }

    const flrRooms = currentFlr ? rooms.filter(r => r.floorId === currentFlr.id) : [];
    const displayedRooms = activeSpatialMetaModelTag === 'ALL'
      ? flrRooms
      : flrRooms.filter(r => r.metamodelTags && r.metamodelTags.includes(activeSpatialMetaModelTag));

    const allTags = ['ALL', '#datacenter', '#critical_infrastructure', '#cyberattack', '#power_grid', '#ports', '#supply_chain', '#security', '#smart_facility', '#budget', '#clean_energy'];

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Facilities & Spatial Hierarchy Management</h1>
          <p class="page-subtitle">Geo Locations ➔ Buildings ➔ Floors ➔ Rooms & Zones connected to Impact360 MetaModel</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary" onclick="UI.openLocationModal()">+ Add Geo Location</button>
          ${currentLoc ? `<button class="btn btn-primary" onclick="UI.openBuildingModal(null, '${currentLoc.id}')">+ Add Building</button>` : ''}
          ${currentBld ? `<button class="btn btn-primary" onclick="UI.openFloorModal(null, '${currentBld.id}')">+ Add Floor</button>` : ''}
          ${currentFlr ? `<button class="btn btn-primary" onclick="UI.openRoomModal(null, '${currentFlr.id}')">+ Add Room</button>` : ''}
        </div>
      </div>

      <!-- MetaModel Filter Chips Bar -->
      <div class="metamodel-filter-bar">
        <div class="metamodel-filter-title">
          <span>🏷️ MetaModel Tag Explorer & Spatial Risk Linkage</span>
          <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">Click tag to scan matching operational zones</span>
        </div>
        <div class="metamodel-tag-chips">
          ${allTags.map(tag => `
            <span class="metamodel-tag-chip ${activeSpatialMetaModelTag === tag ? 'active' : ''}" onclick="UI.filterFacilitiesByMetaModelTag('${tag}')">
              ${tag}
            </span>
          `).join('')}
        </div>
      </div>

      ${!currentLoc ? `
        <!-- LEVEL 1: GEO LOCATIONS / CAMPUSES OVERVIEW -->
        <div class="cards-grid">
          ${locations.map(loc => {
            const bldCount = buildings.filter(b => b.locationId === loc.id).length;
            const locFloors = floors.filter(f => buildings.filter(b => b.locationId === loc.id).map(b => b.id).includes(f.buildingId));
            const locRooms = rooms.filter(r => locFloors.map(f => f.id).includes(r.floorId));

            return `
              <div class="location-card">
                <div>
                  <div class="location-card-header">
                    <div>
                      <div class="location-card-title">${loc.name}</div>
                      <div class="location-card-code">${loc.code} • ${loc.region} Region</div>
                    </div>
                    <span class="badge badge-green">${loc.status}</span>
                  </div>
                  <p style="font-size:12px; color:var(--text-muted); margin: 8px 0 12px 0;">${loc.description || loc.address}</p>
                </div>

                <div class="location-stat-grid">
                  <div class="location-stat-item">
                    <div class="location-stat-label">Buildings</div>
                    <div class="location-stat-value">${bldCount}</div>
                  </div>
                  <div class="location-stat-item">
                    <div class="location-stat-label">Floors</div>
                    <div class="location-stat-value">${locFloors.length}</div>
                  </div>
                  <div class="location-stat-item">
                    <div class="location-stat-label">Rooms</div>
                    <div class="location-stat-value">${locRooms.length}</div>
                  </div>
                </div>

                <div>
                  <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px;">MetaModel Tags:</div>
                  <div style="display:flex; flex-wrap:wrap; gap:4px;">
                    ${(loc.metamodelTags || []).map(t => `<span class="tag-pill">${t}</span>`).join(' ')}
                  </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                  <button class="btn btn-sm btn-primary" onclick="UI.renderFacilitiesModule('${loc.id}')">
                    Inspect Buildings & Floors ➔
                  </button>
                  <div class="table-actions">
                    <button class="btn-icon btn-edit" onclick="UI.openLocationModal('${loc.id}')" title="Edit Location">✏️</button>
                    <button class="btn-icon btn-delete" onclick="UI.deleteLocation('${loc.id}')" title="Delete Location">🗑️</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- LEVEL 2, 3, 4: LOCATION DRILL-DOWN -->
        <div class="spatial-breadcrumb">
          <span class="breadcrumb-crumb" onclick="UI.renderFacilitiesModule(null)">🏢 All Geo Campuses</span>
          <span class="breadcrumb-separator">➔</span>
          <span class="breadcrumb-crumb" onclick="UI.renderFacilitiesModule('${currentLoc.id}')">📍 ${currentLoc.name} (${currentLoc.code})</span>
          ${currentBld ? `
            <span class="breadcrumb-separator">➔</span>
            <span class="breadcrumb-crumb" onclick="UI.renderFacilitiesModule('${currentLoc.id}', '${currentBld.id}')">🏛️ ${currentBld.name}</span>
          ` : ''}
          ${currentFlr ? `
            <span class="breadcrumb-separator">➔</span>
            <span class="breadcrumb-active">🪜 ${currentFlr.name}</span>
          ` : ''}
        </div>

        <div style="margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="font-size:15px; font-weight:700; color:var(--primary-navy-dark);">
              Buildings in ${currentLoc.name} (${locBuildings.length})
            </h3>
            <button class="btn btn-sm btn-primary" onclick="UI.openBuildingModal(null, '${currentLoc.id}')">+ Add Building</button>
          </div>

          <div class="building-selector-grid">
            ${locBuildings.map(bld => `
              <div class="building-card ${currentBld && currentBld.id === bld.id ? 'active' : ''}" onclick="UI.renderFacilitiesModule('${currentLoc.id}', '${bld.id}')">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <div class="building-card-title">${bld.name}</div>
                  <span class="badge ${bld.status === 'Operational' ? 'badge-green' : 'badge-amber'}">${bld.status}</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted);">
                  Code: <strong>${bld.code}</strong> • Floors: <strong>${bld.floorsCount}</strong> • Capacity: <strong>${bld.occupancyCapacity}</strong>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                  ${(bld.metamodelTags || []).map(t => `<span class="room-tag-pill" style="background:#E2E8F0; color:var(--text-dark);">${t}</span>`).join(' ')}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; border-top:1px solid #E2E8F0; padding-top:6px;">
                  <span style="font-size:11px; color:var(--primary-navy); font-weight:600;">Lead: ${bld.contactLead}</span>
                  <div class="table-actions" onclick="event.stopPropagation();">
                    <button class="btn-icon btn-edit" onclick="UI.openBuildingModal('${bld.id}', '${currentLoc.id}')" title="Edit Building">✏️</button>
                    <button class="btn-icon btn-delete" onclick="UI.deleteBuilding('${bld.id}')" title="Delete Building">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${currentBld ? `
          <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-size:15px; font-weight:700; color:var(--primary-navy-dark);">
              Floor Levels for ${currentBld.name}
            </h3>
            <button class="btn btn-sm btn-primary" onclick="UI.openFloorModal(null, '${currentBld.id}')">+ Add Floor Level</button>
          </div>

          <div class="floor-tabs-bar">
            ${bldFloors.map(flr => `
              <button class="floor-tab-btn ${currentFlr && currentFlr.id === flr.id ? 'active' : ''}" onclick="UI.renderFacilitiesModule('${currentLoc.id}', '${currentBld.id}', '${flr.id}')">
                <span>Level ${flr.floorNumber}: ${flr.name}</span>
                <span style="font-size:11px; opacity:0.8;">(${rooms.filter(r => r.floorId === flr.id).length} rooms)</span>
              </button>
            `).join('')}
          </div>

          ${currentFlr ? `
            <div class="floor-plan-viewport">
              <div class="floor-plan-header">
                <div>
                  <div class="floor-plan-title">
                    <span>🚪</span> Interactive Floor Plan: ${currentFlr.name} (Level ${currentFlr.floorNumber})
                  </div>
                  <div style="font-size:12px; color:#94A3B8; margin-top:2px;">
                    Gross Area: ${currentFlr.areaSqm} sqm • Rooms: ${displayedRooms.length} of ${flrRooms.length} • Building: ${currentBld.name}
                  </div>
                </div>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-sm btn-secondary" onclick="UI.openFloorModal('${currentFlr.id}', '${currentBld.id}')">✏️ Edit Floor</button>
                  <button class="btn btn-sm btn-primary" onclick="UI.openRoomModal(null, '${currentFlr.id}')">+ Add Room to Floor</button>
                </div>
              </div>

              <div class="floor-plan-grid">
                ${displayedRooms.length > 0 ? displayedRooms.map(rm => {
                  const statusClass = rm.status === 'Critical' ? 'status-critical' : (rm.status === 'Warning' ? 'status-alert' : '');
                  const occupancyPct = rm.capacity > 0 ? Math.round((rm.occupancy / rm.capacity) * 100) : 0;

                  return `
                    <div class="room-card ${statusClass}">
                      <div>
                        <div class="room-header">
                          <span class="room-number">${rm.roomNumber}</span>
                          <span class="badge ${rm.status === 'Critical' ? 'badge-red' : (rm.status === 'Warning' ? 'badge-amber' : 'badge-green')}">${rm.status}</span>
                        </div>
                        <div class="room-name">${rm.name}</div>
                        <div class="room-type-tag">Type: ${rm.type} • Lead: ${rm.leadOwner}</div>
                      </div>

                      <div class="room-telemetry-row">
                        <div class="room-telemetry-item">
                          <span>🌡️</span> ${rm.temperatureC}°C
                        </div>
                        <div class="room-telemetry-item">
                          <span>⚡</span> ${rm.powerStatus.split(' ')[0]}
                        </div>
                        <div class="room-telemetry-item">
                          <span>👥</span> ${rm.occupancy}/${rm.capacity} (${occupancyPct}%)
                        </div>
                      </div>

                      <div>
                        <div style="font-size:10px; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">MetaModel Tags:</div>
                        <div class="room-metamodel-tags">
                          ${(rm.metamodelTags || []).map(t => `<span class="room-tag-pill">${t}</span>`).join(' ')}
                        </div>
                      </div>

                      <div class="room-actions">
                        <button class="btn btn-sm btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="UI.showRoomDetails('${rm.id}')">
                          Telemetrics & Events ➔
                        </button>
                        <div class="table-actions">
                          <button class="btn-icon btn-edit" style="background:#334155; color:#F8FAFC;" onclick="UI.openRoomModal('${rm.id}', '${currentFlr.id}')" title="Edit Room">✏️</button>
                          <button class="btn-icon btn-delete" style="background:#334155; color:#FCA5A5;" onclick="UI.deleteRoom('${rm.id}')" title="Delete Room">🗑️</button>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('') : `
                  <div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: #94A3B8;">
                    No rooms found on this floor matching filter "${activeSpatialMetaModelTag}".<br>
                    <button class="btn btn-sm btn-primary" style="margin-top: 12px;" onclick="UI.openRoomModal(null, '${currentFlr.id}')">+ Add First Room</button>
                  </div>
                `}
              </div>
            </div>
          ` : ''}
        ` : ''}
      `}
    `;

    $('#view-facilities').html(html);
  }

  function filterFacilitiesByMetaModelTag(tag) {
    activeSpatialMetaModelTag = tag;
    renderFacilitiesModule();
    showToast(`MetaModel tag filter: ${tag}`, 'info');
  }

  // --- Spatial Modals ---
  function openLocationModal(locationId = null) {
    const isEdit = !!locationId;
    const loc = isEdit ? ImpactData.getLocationById(locationId) : null;
    const regions = ImpactData.getRegions();
    const allTags = ImpactData.ALL_METAMODEL_TAGS;

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Geo Location / Campus' : 'Create New Geo Location / Campus'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveLocation(event, '${locationId || ''}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Campus / Location Name *</label>
            <input type="text" id="loc-name" class="form-control" required value="${loc ? loc.name : ''}" placeholder="e.g. Riyadh Digital Command Campus">
          </div>
          <div class="form-group">
            <label class="form-label">Code / Identifier *</label>
            <input type="text" id="loc-code" class="form-control" required value="${loc ? loc.code : 'RUH-HQ'}" placeholder="e.g. RUH-HQ">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Region *</label>
            <select id="loc-region" class="form-select" onchange="UI.onLocationRegionChange(this.value)">
              ${regions.map(r => `
                <option value="${r.name}" ${loc && loc.region === r.name ? 'selected' : ''}>${r.name} Region</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Facility Classification *</label>
            <input type="text" id="loc-type" class="form-control" required value="${loc ? loc.type : 'Command HQ & Data Center'}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Physical Address / Corridor *</label>
          <input type="text" id="loc-address" class="form-control" required value="${loc ? loc.address : 'Digital City Sector'}">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Latitude (OSM Coord)</label>
            <input type="number" id="loc-lat" step="0.0001" class="form-control" value="${loc ? loc.lat : 24.7136}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Longitude (OSM Coord)</label>
            <input type="number" id="loc-lng" step="0.0001" class="form-control" value="${loc ? loc.lng : 46.6753}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">MetaModel Tags (Hold Ctrl to select multiple)</label>
          <select id="loc-tags" class="form-select" multiple style="height: 90px;">
            ${allTags.map(tag => {
              const isSelected = loc && loc.metamodelTags && loc.metamodelTags.includes(tag);
              return `<option value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</option>`;
            }).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Location' : 'Create Location'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function onLocationRegionChange(regionName) {
    const regions = ImpactData.getRegions();
    const r = regions.find(item => item.name === regionName);
    if (r) {
      $('#loc-lat').val(r.centerLat);
      $('#loc-lng').val(r.centerLng);
    }
  }

  function saveLocation(event, locationId) {
    event.preventDefault();
    const tags = $('#loc-tags').val() || ['#critical_infrastructure'];

    const locData = {
      name: $('#loc-name').val().trim(),
      code: $('#loc-code').val().trim(),
      region: $('#loc-region').val(),
      type: $('#loc-type').val().trim(),
      address: $('#loc-address').val().trim(),
      lat: parseFloat($('#loc-lat').val()),
      lng: parseFloat($('#loc-lng').val()),
      metamodelTags: tags,
      status: 'Operational'
    };

    if (locationId) {
      ImpactData.updateLocation(locationId, locData);
      showToast(`Location "${locData.name}" updated!`, 'success');
    } else {
      ImpactData.createLocation(locData);
      showToast(`Geo Location "${locData.name}" created!`, 'success');
    }

    closeModal();
    renderFacilitiesModule();
  }

  function deleteLocation(locationId) {
    const loc = ImpactData.getLocationById(locationId);
    if (!loc) return;

    confirmAction(
      `Delete Campus "${loc.name}"?`,
      'Deleting this Geo Location will also delete all associated buildings, floors, and rooms.',
      () => {
        ImpactData.deleteLocation(locationId);
        showToast(`Campus "${loc.name}" deleted.`, 'danger');
        renderFacilitiesModule(null);
      }
    );
  }

  function openBuildingModal(buildingId = null, defaultLocationId = null) {
    const isEdit = !!buildingId;
    const bld = isEdit ? ImpactData.getBuildingById(buildingId) : null;
    const locations = ImpactData.getLocations();
    const employees = ImpactData.getEmployees();
    const allTags = ImpactData.ALL_METAMODEL_TAGS;

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Building Asset' : 'Add New Building'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveBuilding(event, '${buildingId || ''}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Building Name *</label>
            <input type="text" id="bld-name" class="form-control" required value="${bld ? bld.name : ''}" placeholder="e.g. Tower Alpha - Command Center">
          </div>
          <div class="form-group">
            <label class="form-label">Building Code *</label>
            <input type="text" id="bld-code" class="form-control" required value="${bld ? bld.code : 'TWR-A'}" placeholder="e.g. TWR-A">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Parent Geo Campus *</label>
            <select id="bld-loc" class="form-select" required>
              ${locations.map(l => `
                <option value="${l.id}" ${(bld && bld.locationId === l.id) || (!bld && defaultLocationId === l.id) ? 'selected' : ''}>
                  ${l.name} (${l.code})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Facility Contact Lead *</label>
            <select id="bld-lead" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.name}" ${bld && bld.contactLead === e.name ? 'selected' : ''}>${e.name}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Total Floors</label>
            <input type="number" id="bld-floors" min="1" max="50" class="form-control" value="${bld ? bld.floorsCount : 3}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Gross Area (sqm)</label>
            <input type="number" id="bld-area" min="100" class="form-control" value="${bld ? bld.grossAreaSqm : 10000}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Occupancy Capacity</label>
            <input type="number" id="bld-capacity" min="10" class="form-control" value="${bld ? bld.occupancyCapacity : 400}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">MetaModel Tags (Hold Ctrl to select multiple)</label>
          <select id="bld-tags" class="form-select" multiple style="height: 80px;">
            ${allTags.map(tag => {
              const isSelected = bld && bld.metamodelTags && bld.metamodelTags.includes(tag);
              return `<option value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</option>`;
            }).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Building' : 'Create Building'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveBuilding(event, buildingId) {
    event.preventDefault();
    const locId = $('#bld-loc').val();
    const tags = $('#bld-tags').val() || ['#smart_facility'];

    const bldData = {
      name: $('#bld-name').val().trim(),
      code: $('#bld-code').val().trim(),
      locationId: locId,
      contactLead: $('#bld-lead').val(),
      floorsCount: parseInt($('#bld-floors').val(), 10),
      grossAreaSqm: parseInt($('#bld-area').val(), 10),
      occupancyCapacity: parseInt($('#bld-capacity').val(), 10),
      status: 'Operational',
      metamodelTags: tags
    };

    if (buildingId) {
      ImpactData.updateBuilding(buildingId, bldData);
      showToast(`Building "${bldData.name}" updated!`, 'success');
      closeModal();
      renderFacilitiesModule(locId, buildingId);
    } else {
      const created = ImpactData.createBuilding(bldData);
      showToast(`Building "${bldData.name}" created!`, 'success');
      closeModal();
      renderFacilitiesModule(locId, created.id);
    }
  }

  function deleteBuilding(buildingId) {
    const bld = ImpactData.getBuildingById(buildingId);
    if (!bld) return;

    confirmAction(
      `Delete Building "${bld.name}"?`,
      'Deleting this building will also delete all associated floors and rooms.',
      () => {
        const locId = bld.locationId;
        ImpactData.deleteBuilding(buildingId);
        showToast(`Building deleted.`, 'danger');
        renderFacilitiesModule(locId);
      }
    );
  }

  function openFloorModal(floorId = null, defaultBuildingId = null) {
    const isEdit = !!floorId;
    const flr = isEdit ? ImpactData.getFloorById(floorId) : null;
    const buildings = ImpactData.getBuildings();
    const allTags = ImpactData.ALL_METAMODEL_TAGS;

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Floor Level' : 'Add Floor Level'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveFloor(event, '${floorId || ''}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Floor Number / Identifier *</label>
            <input type="text" id="flr-number" class="form-control" required value="${flr ? flr.floorNumber : '1'}" placeholder="e.g. G, 1, 2, B1">
          </div>
          <div class="form-group">
            <label class="form-label">Floor Title / Zone Name *</label>
            <input type="text" id="flr-name" class="form-control" required value="${flr ? flr.name : ''}" placeholder="e.g. Level 1 - National Operations & NOC">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Parent Building *</label>
            <select id="flr-bld" class="form-select" required>
              ${buildings.map(b => `
                <option value="${b.id}" ${(flr && flr.buildingId === b.id) || (!flr && defaultBuildingId === b.id) ? 'selected' : ''}>
                  ${b.name} (${b.code})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Gross Area (sqm) *</label>
            <input type="number" id="flr-area" class="form-control" value="${flr ? flr.areaSqm : 4000}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">MetaModel Tags (Hold Ctrl to select multiple)</label>
          <select id="flr-tags" class="form-select" multiple style="height: 80px;">
            ${allTags.map(tag => {
              const isSelected = flr && flr.metamodelTags && flr.metamodelTags.includes(tag);
              return `<option value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</option>`;
            }).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Floor' : 'Create Floor'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveFloor(event, floorId) {
    event.preventDefault();
    const bldId = $('#flr-bld').val();
    const bld = ImpactData.getBuildingById(bldId);
    const tags = $('#flr-tags').val() || ['#smart_facility'];

    const flrData = {
      floorNumber: $('#flr-number').val().trim(),
      name: $('#flr-name').val().trim(),
      buildingId: bldId,
      areaSqm: parseInt($('#flr-area').val(), 10),
      status: 'Operational',
      metamodelTags: tags
    };

    if (floorId) {
      ImpactData.updateFloor(floorId, flrData);
      showToast(`Floor updated!`, 'success');
      closeModal();
      renderFacilitiesModule(bld ? bld.locationId : null, bldId, floorId);
    } else {
      const created = ImpactData.createFloor(flrData);
      showToast(`Floor created!`, 'success');
      closeModal();
      renderFacilitiesModule(bld ? bld.locationId : null, bldId, created.id);
    }
  }

  function deleteFloor(floorId) {
    const flr = ImpactData.getFloorById(floorId);
    if (!flr) return;

    confirmAction(
      `Delete Floor "${flr.name}"?`,
      'Deleting this floor will also delete all rooms on this level.',
      () => {
        const bld = ImpactData.getBuildingById(flr.buildingId);
        ImpactData.deleteFloor(floorId);
        showToast('Floor level removed.', 'danger');
        renderFacilitiesModule(bld ? bld.locationId : null, bld ? bld.id : null);
      }
    );
  }

  function openRoomModal(roomId = null, defaultFloorId = null) {
    const isEdit = !!roomId;
    const rm = isEdit ? ImpactData.getRoomById(roomId) : null;
    const floors = ImpactData.getFloors();
    const buildings = ImpactData.getBuildings();
    const employees = ImpactData.getEmployees();
    const allTags = ImpactData.ALL_METAMODEL_TAGS;

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Room / Operational Zone' : 'Add Room / Zone to Floor'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveRoom(event, '${roomId || ''}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Room Number / ID *</label>
            <input type="text" id="rm-number" class="form-control" required value="${rm ? rm.roomNumber : ''}" placeholder="e.g. NOC-201, DC-101">
          </div>
          <div class="form-group">
            <label class="form-label">Room / Zone Name *</label>
            <input type="text" id="rm-name" class="form-control" required value="${rm ? rm.name : ''}" placeholder="e.g. Cyber Threat Operations Room">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Floor Location *</label>
            <select id="rm-floor" class="form-select" required>
              ${floors.map(f => {
                const b = buildings.find(bld => bld.id === f.buildingId);
                return `
                  <option value="${f.id}" ${(rm && rm.floorId === f.id) || (!rm && defaultFloorId === f.id) ? 'selected' : ''}>
                    ${b ? b.name : ''} - Level ${f.floorNumber} (${f.name})
                  </option>
                `;
              }).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Zone Type *</label>
            <select id="rm-type" class="form-select" required>
              <option ${rm && rm.type === 'Command Center' ? 'selected' : ''}>Command Center</option>
              <option ${rm && rm.type === 'Server Room' ? 'selected' : ''}>Server Room</option>
              <option ${rm && rm.type === 'Meeting Hall' ? 'selected' : ''}>Meeting Hall</option>
              <option ${rm && rm.type === 'Office' ? 'selected' : ''}>Office</option>
              <option ${rm && rm.type === 'Lab / Inspection' ? 'selected' : ''}>Lab / Inspection</option>
              <option ${rm && rm.type === 'Citizen Service' ? 'selected' : ''}>Citizen Service</option>
              <option ${rm && rm.type === 'Operations' ? 'selected' : ''}>Operations</option>
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Max Capacity</label>
            <input type="number" id="rm-cap" class="form-control" min="1" value="${rm ? rm.capacity : 30}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Current Occupancy</label>
            <input type="number" id="rm-occ" class="form-control" min="0" value="${rm ? rm.occupancy : 12}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Status Health</label>
            <select id="rm-status" class="form-select" required>
              <option value="Normal" ${rm && rm.status === 'Normal' ? 'selected' : ''}>Normal (Green)</option>
              <option value="Warning" ${rm && rm.status === 'Warning' ? 'selected' : ''}>Warning (Amber)</option>
              <option value="Critical" ${rm && rm.status === 'Critical' ? 'selected' : ''}>Critical (Red)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Lead Owner *</label>
            <select id="rm-lead" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.name}" ${rm && rm.leadOwner === e.name ? 'selected' : ''}>${e.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Temperature Telemetry (°C)</label>
            <input type="number" id="rm-temp" step="0.1" class="form-control" value="${rm ? rm.temperatureC : 21.5}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">MetaModel Tags (Hold Ctrl to select multiple)</label>
          <select id="rm-tags" class="form-select" multiple style="height: 80px;">
            ${allTags.map(tag => {
              const isSelected = rm && rm.metamodelTags && rm.metamodelTags.includes(tag);
              return `<option value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</option>`;
            }).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Room' : 'Create Room'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveRoom(event, roomId) {
    event.preventDefault();
    const flrId = $('#rm-floor').val();
    const flr = ImpactData.getFloorById(flrId);
    const bld = flr ? ImpactData.getBuildingById(flr.buildingId) : null;
    const tags = $('#rm-tags').val() || ['#smart_facility'];

    const roomData = {
      roomNumber: $('#rm-number').val().trim(),
      name: $('#rm-name').val().trim(),
      floorId: flrId,
      type: $('#rm-type').val(),
      capacity: parseInt($('#rm-cap').val(), 10),
      occupancy: parseInt($('#rm-occ').val(), 10),
      status: $('#rm-status').val(),
      leadOwner: $('#rm-lead').val(),
      temperatureC: parseFloat($('#rm-temp').val()),
      powerStatus: 'Normal Grid + Redundancy',
      metamodelTags: tags
    };

    if (roomId) {
      ImpactData.updateRoom(roomId, roomData);
      showToast(`Room "${roomData.roomNumber}" updated!`, 'success');
      closeModal();
      renderFacilitiesModule(bld ? bld.locationId : null, bld ? bld.id : null, flrId);
    } else {
      ImpactData.createRoom(roomData);
      showToast(`Room "${roomData.roomNumber}" created!`, 'success');
      closeModal();
      renderFacilitiesModule(bld ? bld.locationId : null, bld ? bld.id : null, flrId);
    }
  }

  function deleteRoom(roomId) {
    const rm = ImpactData.getRoomById(roomId);
    if (!rm) return;

    confirmAction(
      `Delete Room "${rm.roomNumber}: ${rm.name}"?`,
      'Are you sure you want to remove this zone from the floor layout?',
      () => {
        const flr = ImpactData.getFloorById(rm.floorId);
        const bld = flr ? ImpactData.getBuildingById(flr.buildingId) : null;
        ImpactData.deleteRoom(roomId);
        showToast('Room deleted.', 'danger');
        renderFacilitiesModule(bld ? bld.locationId : null, bld ? bld.id : null, flr ? flr.id : null);
      }
    );
  }

  function showRoomDetails(roomId) {
    const rm = ImpactData.getRoomById(roomId);
    if (!rm) return;

    const flr = ImpactData.getFloorById(rm.floorId);
    const bld = flr ? ImpactData.getBuildingById(flr.buildingId) : null;
    const loc = bld ? ImpactData.getLocationById(bld.locationId) : null;
    const projects = ImpactData.getProjects();
    const events = ImpactData.getEvents();

    const linkedProjs = projects.filter(p => rm.linkedProjects && rm.linkedProjects.includes(p.id));
    const linkedEvs = events.filter(e => rm.linkedEvents && rm.linkedEvents.includes(e.id));

    const html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div>
          <span class="room-number">${rm.roomNumber}</span>
          <h2 style="font-size:18px; font-weight:800; color:var(--primary-navy-dark); margin-top:4px;">${rm.name}</h2>
        </div>
        <button onclick="UI.closeDrawer()" style="background:none; border:none; font-size:20px; cursor:pointer;">✕</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="background:#F8FAFC; padding:14px; border-radius:var(--radius-md); border:1px solid #E2E8F0; font-size:12px;">
          <div><strong>Campus:</strong> ${loc ? loc.name : '--'}</div>
          <div><strong>Building:</strong> ${bld ? bld.name : '--'}</div>
          <div><strong>Floor:</strong> ${flr ? flr.name : '--'}</div>
          <div><strong>Lead Owner:</strong> ${rm.leadOwner}</div>
          <div><strong>Zone Type:</strong> ${rm.type}</div>
        </div>

        <div>
          <h4 style="font-size:13px; font-weight:700; margin-bottom:8px;">Live IoT Telemetry:</h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div style="background:#EFF6FF; padding:10px; border-radius:6px; border:1px solid #BFDBFE; font-size:12px;">
              <div style="color:#1D4ED8; font-weight:600;">🌡️ Climate Control</div>
              <strong style="font-size:15px;">${rm.temperatureC} °C</strong>
            </div>
            <div style="background:#F0FDF4; padding:10px; border-radius:6px; border:1px solid #BBF7D0; font-size:12px;">
              <div style="color:#15803D; font-weight:600;">⚡ Power Grid</div>
              <strong style="font-size:13px;">${rm.powerStatus}</strong>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:13px; font-weight:700; margin-bottom:8px;">MetaModel Classification:</h4>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${(rm.metamodelTags || []).map(t => `<span class="tag-pill" style="background:#DBEAFE; color:#1E40AF;">${t}</span>`).join(' ')}
          </div>
        </div>

        <div>
          <h4 style="font-size:13px; font-weight:700; margin-bottom:8px;">Linked Strategic Initiatives (${linkedProjs.length}):</h4>
          ${linkedProjs.length > 0 ? linkedProjs.map(p => `
            <div style="padding:8px 12px; background:#F1F5F9; border-radius:6px; margin-bottom:6px; font-size:12px;">
              <strong>${p.name}</strong> (${p.progress}% progress)
            </div>
          `).join('') : '<p style="font-size:12px; color:var(--text-muted);">No direct projects mapped.</p>'}
        </div>

        <div>
          <h4 style="font-size:13px; font-weight:700; margin-bottom:8px;">Linked Disruption Alerts (${linkedEvs.length}):</h4>
          ${linkedEvs.length > 0 ? linkedEvs.map(e => `
            <div style="padding:8px 12px; background:#FEFCE8; border:1px solid #FDE047; border-radius:6px; margin-bottom:6px; font-size:12px;">
              <strong>${e.title}</strong> (Severity Level ${e.severity})
            </div>
          `).join('') : '<p style="font-size:12px; color:var(--text-muted);">No active macro alerts affecting this room.</p>'}
        </div>

        <div style="margin-top:12px; display:flex; gap:8px;">
          <button class="btn btn-primary" style="flex:1;" onclick="UI.openRoomModal('${rm.id}', '${rm.floorId}'); UI.closeDrawer();">
            ✏️ Edit Room Parameters
          </button>
        </div>
      </div>
    `;

    $('#drawer-panel').html(html).addClass('active');
    $('#drawer-overlay').addClass('active');
  }

  // ==========================================
  // 6. View: Projects Module
  // ==========================================
  function renderProjectsModule() {
    const projects = ImpactData.getProjects();
    const events = ImpactData.getEvents();

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Project Portfolio</h1>
          <p class="page-subtitle">Contextual risk score analysis, schedule predictions, and full CRUD control</p>
        </div>
        <button class="btn btn-primary" onclick="UI.openProjectModal()">+ Create Project</button>
      </div>

      <div class="cards-grid">
        ${projects.map(p => {
          const riskObj = RiskEngine.calculateProjectRisk(p, events);
          const recObj = EventEngine.recommendNewDate(p, events);
          const riskBadgeClass = riskObj.totalRisk > 60 ? 'badge-red' : (riskObj.totalRisk > 35 ? 'badge-amber' : 'badge-green');

          return `
            <div class="project-card">
              <div>
                <div class="project-card-header">
                  <div>
                    <span class="project-card-title">${p.name}</span>
                    <div class="project-card-owner">Lead: ${p.owner} • ${p.department}</div>
                  </div>
                  <span class="badge ${riskBadgeClass}">Risk: ${riskObj.totalRisk}</span>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Progress</span>
                  <strong>${p.progress}%</strong>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill" style="width: ${p.progress}%"></div>
                </div>
              </div>

              <div style="font-size: 12px; background: #F8FAFC; padding: 10px; border-radius: var(--radius-sm); border: 1px solid #E2E8F0;">
                <div><strong>Planned End:</strong> ${p.plannedEndDate}</div>
                <div style="color: var(--primary-navy); margin-top: 2px;"><strong>Rec. End Date:</strong> ${recObj.recommendedEndDate}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                  Region: <strong>${p.region || 'Central'}</strong> • Lat: ${p.lat}, Lng: ${p.lng}
                </div>
              </div>

              <div>
                <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px;">Linked Events:</div>
                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                  ${(p.relatedEvents && p.relatedEvents.length > 0)
                    ? p.relatedEvents.map(e => `<span class="tag-pill">${e}</span>`).join(' ')
                    : '<span style="font-size:11px; color:#94A3B8;">No linked external events</span>'}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 12px;">
                <button class="btn btn-sm btn-primary" onclick="UI.showScheduleModal('${p.id}')">Analyze Schedule</button>
                <div class="table-actions">
                  <button class="btn-icon btn-edit" onclick="UI.openProjectModal('${p.id}')" title="Edit Project">✏️</button>
                  <button class="btn-icon btn-delete" onclick="UI.deleteProject('${p.id}')" title="Delete Project">🗑️</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    $('#view-projects').html(html);
  }

  function openProjectModal(projectId = null, defaultLat = null, defaultLng = null) {
    const isEdit = !!projectId;
    const project = isEdit ? ImpactData.getProjectById(projectId) : null;
    const employees = ImpactData.getEmployees();
    const events = ImpactData.getEvents();
    const departments = ImpactData.DEPARTMENTS;
    const regions = ImpactData.getRegions();

    const currentLat = project ? project.lat : (defaultLat !== null ? defaultLat : 24.7136);
    const currentLng = project ? project.lng : (defaultLng !== null ? defaultLng : 46.6753);
    const currentRegion = project ? project.region : 'Central';

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Project Initiative' : 'Create New Project'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveProject(event, '${projectId || ''}')">
        <div class="form-group">
          <label class="form-label">Project Name *</label>
          <input type="text" id="proj-name" class="form-control" required value="${project ? project.name : ''}" placeholder="e.g. Smart Transport Management Hub">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Project Owner / Lead *</label>
            <select id="proj-owner" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.name}" ${project && project.owner === e.name ? 'selected' : ''}>${e.name} (${e.department})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Department *</label>
            <select id="proj-dept" class="form-select" required>
              ${departments.map(d => `
                <option value="${d}" ${project && project.department === d ? 'selected' : ''}>${d}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Progress (%): <span id="proj-progress-label">${project ? project.progress : 25}%</span></label>
            <input type="range" id="proj-progress" min="0" max="100" class="form-control" value="${project ? project.progress : 25}" oninput="$('#proj-progress-label').text(this.value + '%')">
          </div>
          <div class="form-group">
            <label class="form-label">Internal Risk (pts)</label>
            <input type="number" id="proj-risk" class="form-control" min="0" max="100" value="${project ? project.internalRisk : 20}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Budget ($M USD)</label>
            <input type="number" id="proj-budget" class="form-control" step="0.1" value="${project ? project.budgetUsdM : 15.0}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Planned End Date *</label>
            <input type="date" id="proj-date" class="form-control" value="${project ? project.plannedEndDate : '2027-12-31'}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Strategic Region *</label>
            <select id="proj-region" class="form-select" onchange="UI.onProjectRegionChange(this.value)">
              ${regions.map(r => `
                <option value="${r.name}" ${currentRegion === r.name ? 'selected' : ''}>${r.name} Region</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Latitude (OSM Coord)</label>
            <input type="number" id="proj-lat" step="0.0001" class="form-control" value="${currentLat}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Longitude (OSM Coord)</label>
            <input type="number" id="proj-lng" step="0.0001" class="form-control" value="${currentLng}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Linked External Events (Hold Ctrl to select multiple)</label>
          <select id="proj-events" class="form-select" multiple style="height: 90px;">
            ${events.map(ev => {
              const isSelected = project && project.relatedEvents && project.relatedEvents.includes(ev.id);
              return `<option value="${ev.id}" ${isSelected ? 'selected' : ''}>${ev.id} - ${ev.title} (${ev.category})</option>`;
            }).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Project'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function onProjectRegionChange(regionName) {
    const regions = ImpactData.getRegions();
    const r = regions.find(item => item.name === regionName);
    if (r) {
      $('#proj-lat').val(r.centerLat);
      $('#proj-lng').val(r.centerLng);
    }
  }

  function saveProject(event, projectId) {
    event.preventDefault();
    const selectedEvents = $('#proj-events').val() || [];

    const projectData = {
      name: $('#proj-name').val().trim(),
      owner: $('#proj-owner').val(),
      department: $('#proj-dept').val(),
      progress: parseInt($('#proj-progress').val(), 10),
      internalRisk: parseInt($('#proj-risk').val(), 10),
      budgetUsdM: $('#proj-budget').val(),
      plannedEndDate: $('#proj-date').val(),
      region: $('#proj-region').val(),
      lat: parseFloat($('#proj-lat').val()),
      lng: parseFloat($('#proj-lng').val()),
      relatedEvents: selectedEvents
    };

    if (projectId) {
      ImpactData.updateProject(projectId, projectData);
      showToast(`Project "${projectData.name}" updated successfully!`, 'success');
    } else {
      ImpactData.createProject(projectData);
      showToast(`New project "${projectData.name}" created!`, 'success');
    }

    closeModal();
    App.refreshCurrentView();
  }

  function deleteProject(projectId) {
    const p = ImpactData.getProjectById(projectId);
    if (!p) return;

    confirmAction(
      `Delete Project "${p.name}"?`,
      'Are you sure you want to delete this project? This will remove it from the portfolio and recalculate global risk.',
      () => {
        ImpactData.deleteProject(projectId);
        showToast(`Project "${p.name}" deleted.`, 'danger');
        App.refreshCurrentView();
      }
    );
  }

  // ==========================================
  // 7. View: Strategic Objectives Module
  // ==========================================
  function renderObjectivesModule() {
    const objectives = ImpactData.getObjectives();

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Strategic Objectives</h1>
          <p class="page-subtitle">Track organizational performance targets linked to active disruption events</p>
        </div>
        <button class="btn btn-primary" onclick="UI.openObjectiveModal()">+ Add Objective</button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Objective Title</th>
              <th>Owner & Department</th>
              <th>Progress</th>
              <th>Target Date</th>
              <th>Status</th>
              <th>Linked Events</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${objectives.map(o => {
              const statusBadge = o.status === 'Green' ? 'badge-green' : (o.status === 'Amber' ? 'badge-amber' : 'badge-red');
              return `
                <tr>
                  <td><strong>${o.id}</strong></td>
                  <td><strong>${o.title}</strong></td>
                  <td>${o.owner}<br><span style="font-size:11px; color:var(--text-muted);">${o.department}</span></td>
                  <td>
                    <div class="progress-bar-container" style="width: 110px;">
                      <div class="progress-bar-fill" style="width: ${o.progress}%"></div>
                    </div>
                    <span style="font-size:11px;">${o.progress}%</span>
                  </td>
                  <td>${o.targetDate}</td>
                  <td><span class="badge ${statusBadge}">${o.status}</span></td>
                  <td>
                    ${(o.relatedEvents && o.relatedEvents.length > 0)
                      ? o.relatedEvents.map(e => `<span class="tag-pill">${e}</span>`).join(' ')
                      : '<span style="font-size:11px; color:#94A3B8;">None</span>'}
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-icon btn-edit" onclick="UI.openObjectiveModal('${o.id}')" title="Edit Objective">✏️</button>
                      <button class="btn-icon btn-delete" onclick="UI.deleteObjective('${o.id}')" title="Delete Objective">🗑️</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    $('#view-objectives').html(html);
  }

  function openObjectiveModal(objectiveId = null) {
    const isEdit = !!objectiveId;
    const obj = isEdit ? ImpactData.getObjectiveById(objectiveId) : null;
    const employees = ImpactData.getEmployees();
    const events = ImpactData.getEvents();
    const departments = ImpactData.DEPARTMENTS;

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Strategic Objective' : 'Add New Strategic Objective'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveObjective(event, '${objectiveId || ''}')">
        <div class="form-group">
          <label class="form-label">Objective Title *</label>
          <input type="text" id="obj-title" class="form-control" required value="${obj ? obj.title : ''}" placeholder="e.g. Reduce Municipal Processing Latency by 40%">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Owner *</label>
            <select id="obj-owner" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.name}" ${obj && obj.owner === e.name ? 'selected' : ''}>${e.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Department *</label>
            <select id="obj-dept" class="form-select" required>
              ${departments.map(d => `
                <option value="${d}" ${obj && obj.department === d ? 'selected' : ''}>${d}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Progress (%): <span id="obj-progress-label">${obj ? obj.progress : 50}%</span></label>
            <input type="range" id="obj-progress" min="0" max="100" class="form-control" value="${obj ? obj.progress : 50}" oninput="$('#obj-progress-label').text(this.value + '%')">
          </div>
          <div class="form-group">
            <label class="form-label">Target Date *</label>
            <input type="date" id="obj-date" class="form-control" value="${obj ? obj.targetDate : '2027-11-30'}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Status Health *</label>
            <select id="obj-status" class="form-select" required>
              <option value="Green" ${obj && obj.status === 'Green' ? 'selected' : ''}>Green (On Track)</option>
              <option value="Amber" ${obj && obj.status === 'Amber' ? 'selected' : ''}>Amber (Attention)</option>
              <option value="Red" ${obj && obj.status === 'Red' ? 'selected' : ''}>Red (Critical)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Linked Disruption Event</label>
          <select id="obj-event" class="form-select">
            <option value="">-- No Linked Event --</option>
            ${events.map(ev => `
              <option value="${ev.id}" ${obj && obj.relatedEvents && obj.relatedEvents.includes(ev.id) ? 'selected' : ''}>
                ${ev.id} - ${ev.title} (${ev.category})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Objective' : 'Create Objective'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveObjective(event, objectiveId) {
    event.preventDefault();
    const linkedEvent = $('#obj-event').val();

    const objData = {
      title: $('#obj-title').val().trim(),
      owner: $('#obj-owner').val(),
      department: $('#obj-dept').val(),
      progress: parseInt($('#obj-progress').val(), 10),
      targetDate: $('#obj-date').val(),
      status: $('#obj-status').val(),
      relatedEvents: linkedEvent ? [linkedEvent] : []
    };

    if (objectiveId) {
      ImpactData.updateObjective(objectiveId, objData);
      showToast(`Objective updated successfully!`, 'success');
    } else {
      ImpactData.createObjective(objData);
      showToast(`New objective "${objData.title}" created!`, 'success');
    }

    closeModal();
    App.refreshCurrentView();
  }

  function deleteObjective(objectiveId) {
    const o = ImpactData.getObjectiveById(objectiveId);
    if (!o) return;

    confirmAction(
      `Delete Objective "${o.title}"?`,
      'Are you sure you want to remove this strategic objective target?',
      () => {
        ImpactData.deleteObjective(objectiveId);
        showToast(`Objective removed.`, 'danger');
        App.refreshCurrentView();
      }
    );
  }

  // ==========================================
  // 8. View: External Events Center
  // ==========================================
  function renderEventsCenter(filterCat = 'ALL') {
    const events = ImpactData.getEvents();
    const categories = ['ALL', 'Economic', 'OPEC', 'UN', 'WHO', 'Market', 'Weather', 'Cyber', 'Transportation', 'Geopolitical', 'Government Policy'];

    const filteredEvents = filterCat === 'ALL' ? events : events.filter(e => e.category === filterCat);

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">External Events Intelligence Center</h1>
          <p class="page-subtitle">Real-time macro, geopolitical, weather & economic event stream</p>
        </div>
        <button class="btn btn-primary" onclick="UI.openEventModal()">+ Log Event Alert</button>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
        ${categories.map(c => `
          <button class="btn btn-sm ${filterCat === c ? 'btn-primary' : 'btn-secondary'}" onclick="UI.renderEventsCenter('${c}')">
            ${c}
          </button>
        `).join('')}
      </div>

      <div class="cards-grid">
        ${filteredEvents.map(e => `
          <div class="project-card">
            <div>
              <div class="project-card-header">
                <span class="project-card-title">${e.title}</span>
                <span class="badge ${e.status === 'Active' ? 'badge-amber' : 'badge-green'}">${e.status}</span>
              </div>
              <div class="project-card-owner">Source: ${e.source} • Category: ${e.category}</div>
            </div>

            <div style="display: flex; gap: 12px; font-size: 12px; background: #F8FAFC; padding: 8px 12px; border-radius: var(--radius-sm);">
              <div>Severity: <strong>Level ${e.severity}/5</strong></div>
              <div>Probability: <strong>${Math.round(e.probability * 100)}%</strong></div>
              <div>Region: <strong>${e.region || 'Central'}</strong></div>
            </div>

            <div>
              ${(e.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join(' ')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 12px;">
              <button class="btn btn-sm btn-primary" onclick="UI.showEventImpact('${e.id}')">View Impact</button>
              <div class="table-actions">
                <button class="btn-icon btn-edit" onclick="UI.openEventModal('${e.id}')" title="Edit Event">✏️</button>
                <button class="btn-icon btn-delete" onclick="UI.deleteEvent('${e.id}')" title="Delete Event">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    $('#view-events').html(html);
  }

  function openEventModal(eventId = null, defaultLat = null, defaultLng = null) {
    const isEdit = !!eventId;
    const event = isEdit ? ImpactData.getEventById(eventId) : null;
    const categories = ['Economic', 'OPEC', 'UN', 'WHO', 'Market', 'Weather', 'Cyber', 'Transportation', 'Geopolitical', 'Government Policy'];
    const regions = ImpactData.getRegions();

    const currentLat = event ? event.lat : (defaultLat !== null ? defaultLat : 24.7136);
    const currentLng = event ? event.lng : (defaultLng !== null ? defaultLng : 46.6753);
    const currentRegion = event ? event.region : 'Central';

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Event Disruption Alert' : 'Log New External Event'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveEvent(event, '${eventId || ''}')">
        <div class="form-group">
          <label class="form-label">Event Title *</label>
          <input type="text" id="ev-title" class="form-control" required value="${event ? event.title : ''}" placeholder="e.g. Critical Port Logistics Bottleneck">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select id="ev-cat" class="form-select" required>
              ${categories.map(c => `
                <option value="${c}" ${event && event.category === c ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Source Agency *</label>
            <input type="text" id="ev-source" class="form-control" required value="${event ? event.source : 'National Agency'}" placeholder="e.g. Port Authority">
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Severity Level (1-5)</label>
            <input type="number" id="ev-severity" min="1" max="5" class="form-control" value="${event ? event.severity : 3}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Probability (0.1 - 1.0)</label>
            <input type="number" id="ev-prob" min="0.1" max="1.0" step="0.05" class="form-control" value="${event ? event.probability : 0.75}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Status *</label>
            <select id="ev-status" class="form-select" required>
              <option value="Active" ${event && event.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Resolved" ${event && event.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Region *</label>
            <select id="ev-region" class="form-select" onchange="UI.onEventRegionChange(this.value)">
              ${regions.map(r => `
                <option value="${r.name}" ${currentRegion === r.name ? 'selected' : ''}>${r.name} Region</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Meta Tags (comma separated)</label>
            <input type="text" id="ev-tags" class="form-control" value="${event && event.tags ? event.tags.join(', ') : '#ports, #supply_chain'}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Latitude (OSM Coord)</label>
            <input type="number" id="ev-lat" step="0.0001" class="form-control" value="${currentLat}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Longitude (OSM Coord)</label>
            <input type="number" id="ev-lng" step="0.0001" class="form-control" value="${currentLng}" required>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Alert' : 'Publish Alert'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function onEventRegionChange(regionName) {
    const regions = ImpactData.getRegions();
    const r = regions.find(item => item.name === regionName);
    if (r) {
      $('#ev-lat').val(r.centerLat);
      $('#ev-lng').val(r.centerLng);
    }
  }

  function saveEvent(event, eventId) {
    event.preventDefault();
    const tagString = $('#ev-tags').val() || '';
    const tags = tagString.split(',').map(t => {
      t = t.trim();
      return t.startsWith('#') ? t : `#${t}`;
    }).filter(t => t.length > 1);

    const eventData = {
      title: $('#ev-title').val().trim(),
      category: $('#ev-cat').val(),
      source: $('#ev-source').val().trim(),
      severity: parseInt($('#ev-severity').val(), 10),
      probability: parseFloat($('#ev-prob').val()),
      status: $('#ev-status').val(),
      region: $('#ev-region').val(),
      tags: tags,
      lat: parseFloat($('#ev-lat').val()),
      lng: parseFloat($('#ev-lng').val())
    };

    if (eventId) {
      ImpactData.updateEvent(eventId, eventData);
      showToast(`Event "${eventData.title}" updated!`, 'success');
    } else {
      ImpactData.createEvent(eventData);
      showToast(`New event "${eventData.title}" logged!`, 'success');
    }

    closeModal();
    App.refreshCurrentView();
  }

  function deleteEvent(eventId) {
    const ev = ImpactData.getEventById(eventId);
    if (!ev) return;

    confirmAction(
      `Delete Event Alert "${ev.title}"?`,
      'Are you sure? This will unlink it from all projects and objectives.',
      () => {
        ImpactData.deleteEvent(eventId);
        showToast(`Event alert deleted.`, 'danger');
        App.refreshCurrentView();
      }
    );
  }

  // ==========================================
  // 9. View: Innovation Marketplace
  // ==========================================
  function renderInnovationMarketplace() {
    const innovations = ImpactData.getInnovations();
    const columns = ['Submitted', 'Review', 'Pilot', 'Approved', 'Implemented'];

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Innovation Marketplace</h1>
          <p class="page-subtitle">Crowdsourced public sector ideas & execution pipeline (Full Kanban CRUD)</p>
        </div>
        <button class="btn btn-primary" onclick="UI.openIdeaModal()">+ Submit New Idea</button>
      </div>

      <div class="kanban-board">
        ${columns.map(col => {
          const colIdeas = innovations.filter(i => i.status === col);
          return `
            <div class="kanban-column">
              <div class="kanban-column-header">
                <span class="kanban-column-title">${col}</span>
                <span class="kanban-count">${colIdeas.length}</span>
              </div>

              ${colIdeas.map(idea => `
                <div class="kanban-card">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div class="kanban-card-title">${idea.title}</div>
                    <div class="table-actions">
                      <button class="btn-icon btn-edit" style="padding:3px 5px; font-size:11px;" onclick="UI.openIdeaModal('${idea.id}')" title="Edit Idea">✏️</button>
                      <button class="btn-icon btn-delete" style="padding:3px 5px; font-size:11px;" onclick="UI.deleteIdea('${idea.id}')" title="Delete Idea">🗑️</button>
                    </div>
                  </div>
                  
                  <div class="kanban-card-desc">${idea.description}</div>
                  
                  <div style="font-size: 11px; font-weight: 700; color: var(--success-green);">
                    💰 ${idea.costSaving} • <span style="color:var(--primary-navy);">${idea.category}</span>
                  </div>
                  
                  <div class="kanban-card-meta">
                    <span>By ${idea.owner}</span>
                    <span style="cursor:pointer;" onclick="UI.upvoteIdea('${idea.id}')" title="Upvote">👍 ${idea.votes}</span>
                  </div>

                  <div class="kanban-actions">
                    <button class="btn btn-sm btn-secondary" style="width:100%; font-size:11px;" onclick="UI.moveIdea('${idea.id}')">
                      Move Stage ➔
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </div>
    `;

    $('#view-innovation').html(html);
  }

  function openIdeaModal(ideaId = null) {
    const isEdit = !!ideaId;
    const idea = isEdit ? ImpactData.getInnovationById(ideaId) : null;
    const employees = ImpactData.getEmployees();
    const categories = ['Digital Automation', 'Process Optimization', 'Citizen Engagement', 'Green Energy', 'Cost Savings'];
    const stages = ['Submitted', 'Review', 'Pilot', 'Approved', 'Implemented'];

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Innovation Proposal' : 'Submit New Innovation Idea'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveIdea(event, '${ideaId || ''}')">
        <div class="form-group">
          <label class="form-label">Idea Title *</label>
          <input type="text" id="idea-title" class="form-control" required value="${idea ? idea.title : ''}" placeholder="e.g. AI-driven Permit Verification Engine">
        </div>

        <div class="form-group">
          <label class="form-label">Detailed Description *</label>
          <textarea id="idea-desc" class="form-textarea" required placeholder="Describe the outcome, mechanism, and process improvements...">${idea ? idea.description : ''}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Expected Cost Savings / Year *</label>
            <input type="text" id="idea-savings" class="form-control" required value="${idea ? idea.costSaving : '$250K / Year'}" placeholder="e.g. $450K / Year">
          </div>
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select id="idea-cat" class="form-select" required>
              ${categories.map(c => `
                <option value="${c}" ${idea && idea.category === c ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Innovator / Owner *</label>
            <select id="idea-owner" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.name}" ${idea && idea.owner === e.name ? 'selected' : ''}>${e.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Kanban Stage *</label>
            <select id="idea-stage" class="form-select" required>
              ${stages.map(s => `
                <option value="${s}" ${idea && idea.status === s ? 'selected' : ''}>${s}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Submit to Kanban'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveIdea(event, ideaId) {
    event.preventDefault();
    const ideaData = {
      title: $('#idea-title').val().trim(),
      description: $('#idea-desc').val().trim(),
      costSaving: $('#idea-savings').val().trim(),
      category: $('#idea-cat').val(),
      owner: $('#idea-owner').val(),
      status: $('#idea-stage').val(),
      expectedImpact: 'High Efficiency Gain'
    };

    if (ideaId) {
      ImpactData.updateInnovation(ideaId, ideaData);
      showToast(`Innovation "${ideaData.title}" updated!`, 'success');
    } else {
      ImpactData.createInnovation(ideaData);
      showToast(`New idea "${ideaData.title}" submitted!`, 'success');
    }

    closeModal();
    App.refreshCurrentView();
  }

  function deleteIdea(ideaId) {
    const idea = ImpactData.getInnovationById(ideaId);
    if (!idea) return;

    confirmAction(
      `Delete Innovation "${idea.title}"?`,
      'Are you sure you want to remove this proposal from the marketplace?',
      () => {
        ImpactData.deleteInnovation(ideaId);
        showToast(`Idea removed.`, 'danger');
        App.refreshCurrentView();
      }
    );
  }

  function upvoteIdea(ideaId) {
    const idea = ImpactData.getInnovationById(ideaId);
    if (!idea) return;
    ImpactData.updateInnovation(ideaId, { votes: idea.votes + 1 });
    renderInnovationMarketplace();
    showToast(`Upvoted "${idea.title}"!`, 'success');
  }

  function moveIdea(ideaId) {
    const idea = ImpactData.getInnovationById(ideaId);
    if (!idea) return;

    const stages = ['Submitted', 'Review', 'Pilot', 'Approved', 'Implemented'];
    const currentIdx = stages.indexOf(idea.status);
    if (currentIdx < stages.length - 1) {
      const nextStage = stages[currentIdx + 1];
      ImpactData.updateInnovation(ideaId, { status: nextStage });
      renderInnovationMarketplace();
      showToast(`Idea promoted to "${nextStage}"!`, 'success');
    } else {
      showToast(`Idea is already in final stage (${idea.status}).`, 'info');
    }
  }

  // ==========================================
  // 10. View: Employee Dashboard & Recognitions
  // ==========================================
  function renderEmployeeDashboard(selectedEmpId = null) {
    const employees = ImpactData.getEmployees();
    if (employees.length === 0) {
      $('#view-employees').html(`
        <div class="page-header">
          <h1 class="page-title">Employee Portal</h1>
          <button class="btn btn-primary" onclick="UI.openEmployeeModal()">+ Add Employee</button>
        </div>
        <p>No employees in database.</p>
      `);
      return;
    }

    const activeEmp = selectedEmpId 
      ? employees.find(e => e.id === selectedEmpId) || employees[0]
      : employees[0];

    const data = ImpactData.getState();
    const empRecognitions = (data.recognitions || []).filter(r => r.receiverId === activeEmp.id || r.senderId === activeEmp.id || r.receiverName === activeEmp.name);

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Employee Ownership Portal</h1>
          <p class="page-subtitle">Personal contribution, badges, and recognition showcase (Full CRUD)</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary" onclick="UI.openEmployeeModal('${activeEmp.id}')">✏️ Edit Profile</button>
          <button class="btn btn-outline-danger" onclick="UI.deleteEmployee('${activeEmp.id}')">🗑️ Delete Staff</button>
          <button class="btn btn-primary" onclick="UI.openEmployeeModal()">+ Add Staff</button>
          <button class="btn btn-primary" onclick="UI.openRecognitionModal('${activeEmp.id}')">🏅 Send Recognition</button>
        </div>
      </div>

      <div class="employee-selector-bar" style="display:flex; align-items:center; gap:12px; background:var(--bg-card); padding:12px 18px; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:20px;">
        <label style="font-size:13px; font-weight:600; color: var(--text-muted);">Switch Employee Profile:</label>
        <select class="form-select" style="max-width:340px;" onchange="UI.renderEmployeeDashboard(this.value)">
          ${employees.map(e => `
            <option value="${e.id}" ${e.id === activeEmp.id ? 'selected' : ''}>
              ${e.name} (${e.department})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="employee-header-card">
        <div class="employee-large-avatar">${activeEmp.avatar || 'EX'}</div>
        <div class="employee-details">
          <div class="employee-name">${activeEmp.name}</div>
          <div class="employee-meta">${activeEmp.title} • ${activeEmp.department}</div>
          <span class="employee-level-pill">Level: ${activeEmp.level}</span>
        </div>
      </div>

      <div class="personal-scores-grid">
        <div class="score-card">
          <div class="score-label">Ownership Score</div>
          <div class="score-value">${activeEmp.ownershipScore}</div>
        </div>
        <div class="score-card">
          <div class="score-label">Collaboration Score</div>
          <div class="score-value" style="color: var(--success-green);">${activeEmp.collaborationScore}</div>
        </div>
        <div class="score-card">
          <div class="score-label">Innovation Score</div>
          <div class="score-value" style="color: var(--warning-amber);">${activeEmp.innovationScore}</div>
        </div>
        <div class="score-card">
          <div class="score-label">Citizen Impact</div>
          <div class="score-value" style="color: #6366F1;">${activeEmp.citizenImpactScore}</div>
        </div>
      </div>

      <div class="dashboard-sections-grid">
        <div class="section-card">
          <div class="section-title-bar">
            <span class="section-title">Earned Badges & Distinctions</span>
          </div>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            ${(activeEmp.badges || []).map(b => `
              <div style="background: #F1F5F9; border: 1px solid #E2E8F0; padding: 16px 20px; border-radius: var(--radius-md); text-align: center; width: 180px;">
                <div style="font-size: 32px; margin-bottom: 6px;">🎖️</div>
                <div style="font-weight: 700; font-size: 13px; color: var(--primary-navy);">${b}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Verified Outcome</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section-card">
          <div class="section-title-bar">
            <span class="section-title">Personal Recognitions Feed (${empRecognitions.length})</span>
            <button class="btn btn-sm btn-primary" onclick="UI.openRecognitionModal('${activeEmp.id}')">+ New</button>
          </div>
          <div class="recognition-timeline">
            ${empRecognitions.length > 0 ? empRecognitions.map(r => `
              <div class="recognition-card">
                <div class="recognition-sender-avatar">${(r.senderName || 'U').charAt(0)}</div>
                <div class="recognition-body" style="width:100%;">
                  <div class="recognition-header">
                    <span class="recognition-sender">${r.senderName} ➔ ${r.receiverName}</span>
                    <span class="recognition-time">${r.date}</span>
                  </div>
                  <div class="recognition-text">"${r.message}"</div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                    <div class="recognition-badge">🏅 ${r.badge}</div>
                    <button class="btn-icon btn-delete" onclick="UI.deleteRecognition('${r.id}')" title="Delete recognition">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('') : '<p style="font-size:13px; color: var(--text-muted);">No recognitions logged yet for this employee.</p>'}
          </div>
        </div>
      </div>
    `;

    $('#view-employees').html(html);
  }

  function openEmployeeModal(employeeId = null) {
    const isEdit = !!employeeId;
    const emp = isEdit ? ImpactData.getEmployeeById(employeeId) : null;
    const departments = ImpactData.DEPARTMENTS;
    const levels = ImpactData.GAMIFICATION_LEVELS;
    const badges = ImpactData.BADGES;

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Employee Profile' : 'Add New Staff Member'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveEmployee(event, '${employeeId || ''}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="emp-name" class="form-control" required value="${emp ? emp.name : ''}" placeholder="e.g. Tariq Al-Mansoor">
          </div>
          <div class="form-group">
            <label class="form-label">Job Title *</label>
            <input type="text" id="emp-title" class="form-control" required value="${emp ? emp.title : 'Senior Project Lead'}" placeholder="e.g. Director of Infrastructure">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department *</label>
            <select id="emp-dept" class="form-select" required>
              ${departments.map(d => `
                <option value="${d}" ${emp && emp.department === d ? 'selected' : ''}>${d}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Gamification Level *</label>
            <select id="emp-level" class="form-select" required>
              ${levels.map(l => `
                <option value="${l}" ${emp && emp.level === l ? 'selected' : ''}>${l}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Ownership Score (0-100)</label>
            <input type="number" id="emp-ownership" min="0" max="100" class="form-control" value="${emp ? emp.ownershipScore : 88}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Collaboration (0-100)</label>
            <input type="number" id="emp-collab" min="0" max="100" class="form-control" value="${emp ? emp.collaborationScore : 85}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Innovation (0-100)</label>
            <input type="number" id="emp-innov" min="0" max="100" class="form-control" value="${emp ? emp.innovationScore : 80}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Badges (Hold Ctrl to select multiple)</label>
          <select id="emp-badges" class="form-select" multiple style="height: 80px;">
            ${badges.map(b => `
              <option value="${b}" ${emp && emp.badges && emp.badges.includes(b) ? 'selected' : ''}>${b}</option>
            `).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Staff Member'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveEmployee(event, employeeId) {
    event.preventDefault();
    const badges = $('#emp-badges').val() || [ImpactData.BADGES[0]];

    const empData = {
      name: $('#emp-name').val().trim(),
      title: $('#emp-title').val().trim(),
      department: $('#emp-dept').val(),
      level: $('#emp-level').val(),
      ownershipScore: parseInt($('#emp-ownership').val(), 10),
      collaborationScore: parseInt($('#emp-collab').val(), 10),
      innovationScore: parseInt($('#emp-innov').val(), 10),
      citizenImpactScore: 88,
      badges: badges
    };

    if (employeeId) {
      ImpactData.updateEmployee(employeeId, empData);
      showToast(`Employee "${empData.name}" updated!`, 'success');
      closeModal();
      renderEmployeeDashboard(employeeId);
    } else {
      const created = ImpactData.createEmployee(empData);
      showToast(`Staff member "${empData.name}" created!`, 'success');
      closeModal();
      renderEmployeeDashboard(created.id);
    }
  }

  function deleteEmployee(employeeId) {
    const emp = ImpactData.getEmployeeById(employeeId);
    if (!emp) return;

    confirmAction(
      `Delete Employee "${emp.name}"?`,
      'Are you sure you want to remove this employee profile?',
      () => {
        ImpactData.deleteEmployee(employeeId);
        showToast(`Employee profile deleted.`, 'danger');
        renderEmployeeDashboard();
      }
    );
  }

  // ==========================================
  // 11. Recognition Modal & CRUD
  // ==========================================
  function openRecognitionModal(defaultReceiverId = null) {
    const employees = ImpactData.getEmployees();
    const badges = ImpactData.BADGES;

    const html = `
      <div class="modal-header">
        <span class="modal-title">Send Peer Recognition</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveRecognition(event)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Sender *</label>
            <select id="rec-sender" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.id}">${e.name} (${e.department})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Recipient *</label>
            <select id="rec-receiver" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.id}" ${defaultReceiverId === e.id ? 'selected' : ''}>${e.name} (${e.department})</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Award Badge *</label>
          <select id="rec-badge" class="form-select" required>
            ${badges.map(b => `<option value="${b}">${b}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Appreciation Message *</label>
          <textarea id="rec-msg" class="form-textarea" required placeholder="Highlight their contribution and citizen outcome impact..."></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Recognition</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveRecognition(event) {
    event.preventDefault();
    const senderId = $('#rec-sender').val();
    const receiverId = $('#rec-receiver').val();
    const sender = ImpactData.getEmployeeById(senderId);
    const receiver = ImpactData.getEmployeeById(receiverId);

    const recData = {
      senderId: senderId,
      senderName: sender ? sender.name : 'Leadership',
      receiverId: receiverId,
      receiverName: receiver ? receiver.name : 'Staff Member',
      badge: $('#rec-badge').val(),
      message: $('#rec-msg').val().trim(),
      date: new Date().toISOString().split('T')[0]
    };

    ImpactData.createRecognition(recData);
    showToast(`Recognition sent to ${recData.receiverName}!`, 'success');
    closeModal();
    App.refreshCurrentView();
  }

  function deleteRecognition(recId) {
    confirmAction(
      'Delete Recognition?',
      'Are you sure you want to remove this peer recognition entry?',
      () => {
        ImpactData.deleteRecognition(recId);
        showToast('Recognition entry removed.', 'danger');
        App.refreshCurrentView();
      }
    );
  }

  // ==========================================
  // 12. View: Risk Center
  // ==========================================
  function renderRiskCenter() {
    const data = ImpactData.getState();
    const globalRisk = RiskEngine.calculateGlobalRiskIndex(data.projects, data.events);

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Risk Management Center</h1>
          <p class="page-subtitle">Dynamic multi-factor risk engine: Internal + External + Dependency</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary" onclick="App.navigateTo('heatmap')">🗺️ View on GIS Map</button>
          <button class="btn btn-primary" onclick="UI.openProjectModal()">+ Add Project</button>
        </div>
      </div>

      <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="kpi-card kpi-danger">
          <div class="kpi-top">
            <span class="kpi-label">Global Risk Index</span>
            <div class="kpi-icon">🛡️</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${globalRisk} / 100</span>
          </div>
          <div class="kpi-footer">Aggregate portfolio exposure</div>
        </div>

        <div class="kpi-card kpi-warning">
          <div class="kpi-top">
            <span class="kpi-label">High Risk Initiatives</span>
            <div class="kpi-icon">⚠️</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${(data.projects || []).filter(p => RiskEngine.calculateProjectRisk(p, data.events).totalRisk > 50).length}</span>
          </div>
          <div class="kpi-footer">Requires mitigation plan</div>
        </div>

        <div class="kpi-card kpi-success">
          <div class="kpi-top">
            <span class="kpi-label">Active Events Linkage</span>
            <div class="kpi-icon">🔗</div>
          </div>
          <div class="kpi-value-container">
            <span class="kpi-value">${(data.events || []).filter(e => e.status === 'Active').length}</span>
          </div>
          <div class="kpi-footer">Live tracking</div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Internal Risk</th>
              <th>External Risk</th>
              <th>Dependency Risk</th>
              <th>Total Calculated Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${(data.projects || []).map(p => {
              const r = RiskEngine.calculateProjectRisk(p, data.events);
              const badgeClass = r.totalRisk > 60 ? 'badge-red' : (r.totalRisk > 35 ? 'badge-amber' : 'badge-green');
              return `
                <tr>
                  <td>
                    <strong>${p.name}</strong><br>
                    <span style="font-size:11px; color:var(--text-muted);">${p.owner} • ${p.region || 'Central'}</span>
                  </td>
                  <td>${r.internalRisk} pts</td>
                  <td>${r.externalRisk} pts</td>
                  <td>${r.dependencyRisk} pts</td>
                  <td><span class="badge ${badgeClass}">${r.totalRisk} / 100</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-sm btn-primary" onclick="UI.showScheduleModal('${p.id}')">Analyze</button>
                      <button class="btn-icon btn-edit" onclick="UI.openProjectModal('${p.id}')" title="Edit Project">✏️</button>
                      <button class="btn-icon btn-delete" onclick="UI.deleteProject('${p.id}')" title="Delete Project">🗑️</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    $('#view-risk').html(html);
  }

  // ==========================================
  // 13. View: Citizen Impact Module
  // ==========================================
  function renderCitizenImpactModule() {
    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Citizen Impact Matrix</h1>
          <p class="page-subtitle">Mapping internal improvements to direct citizen outcomes</p>
        </div>
      </div>

      <div class="impact-chain-container">
        <div class="impact-chain-item">
          <div class="impact-step">
            <div class="impact-step-title">Internal Improvement</div>
            <div class="impact-step-value">Permit Automation Engine</div>
          </div>
          <div class="impact-arrow">➔</div>
          <div class="impact-step">
            <div class="impact-step-title">Service Improvement</div>
            <div class="impact-step-value">25% Faster License Processing</div>
          </div>
          <div class="impact-arrow">➔</div>
          <div class="impact-step">
            <div class="impact-step-title">Citizen Outcome</div>
            <div class="impact-step-value">12% Satisfaction Increase</div>
          </div>
        </div>

        <div class="impact-chain-item">
          <div class="impact-step">
            <div class="impact-step-title">Internal Improvement</div>
            <div class="impact-step-value">Port AI Customs Scanner</div>
          </div>
          <div class="impact-arrow">➔</div>
          <div class="impact-step">
            <div class="impact-step-title">Service Improvement</div>
            <div class="impact-step-value">40% Reduced Cargo Dwell Time</div>
          </div>
          <div class="impact-arrow">➔</div>
          <div class="impact-step">
            <div class="impact-step-title">Citizen Outcome</div>
            <div class="impact-step-value">$4.2M Supply Cost Reduction</div>
          </div>
        </div>

        <div class="impact-chain-item">
          <div class="impact-step">
            <div class="impact-step-title">Internal Improvement</div>
            <div class="impact-step-value">Smart Grid Battery Storage</div>
          </div>
          <div class="impact-arrow">➔</div>
          <div class="impact-step">
            <div class="impact-step-title">Service Improvement</div>
            <div class="impact-step-value">99.9% Power Resilience in Storms</div>
          </div>
          <div class="impact-arrow">➔</div>
          <div class="impact-step">
            <div class="impact-step-title">Citizen Outcome</div>
            <div class="impact-step-value">Zero Blackouts in Western Region</div>
          </div>
        </div>
      </div>
    `;

    $('#view-citizen').html(html);
  }

  // ==========================================
  // 14. View: OpenStreetMap (OSM) & Strategic Heatmap
  // ==========================================
  function renderStrategicHeatmap() {
    const data = ImpactData.getState();
    const projects = data.projects || [];
    const events = data.events || [];
    const locations = data.locations || [];
    const regions = ImpactData.getRegions();

    const regionalStats = regions.map(r => {
      const regProjects = projects.filter(p => p.region === r.name);
      let avgRisk = r.defaultRisk;
      if (regProjects.length > 0) {
        const sumRisk = regProjects.reduce((acc, p) => acc + RiskEngine.calculateProjectRisk(p, events).totalRisk, 0);
        avgRisk = Math.round(sumRisk / regProjects.length);
      }
      const regEvents = events.filter(e => e.region === r.name && e.status === 'Active');
      const exposure = Math.min(100, Math.round(regEvents.length * 18 + avgRisk * 0.4));
      const status = avgRisk > 60 ? 'critical' : (avgRisk > 40 ? 'attention' : 'healthy');

      return {
        ...r,
        risk: avgRisk,
        projects: regProjects.length,
        satisfaction: `${Math.max(78, 98 - Math.round(avgRisk * 0.2))}%`,
        exposure: exposure,
        status: status
      };
    });

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Regional Strategic Heatmap & OpenStreetMap</h1>
          <p class="page-subtitle">Live GIS geospatial mapping, contextual risk pins, and regional command zones</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary" onclick="UI.openProjectModal()">+ Add Project Pin</button>
          <button class="btn btn-primary" onclick="UI.openEventModal()">+ Add Event Pin</button>
          <button class="btn btn-primary" onclick="UI.openLocationModal()">+ Add Campus Pin</button>
        </div>
      </div>

      <div class="heatmap-container">
        <div class="heatmap-controls">
          <div class="heatmap-left-controls">
            <div class="heatmap-view-toggle">
              <button class="view-toggle-btn ${activeHeatmapViewMode === 'map' ? 'active' : ''}" onclick="UI.switchHeatmapMode('map')">
                🗺️ Interactive Map
              </button>
              <button class="view-toggle-btn ${activeHeatmapViewMode === 'grid' ? 'active' : ''}" onclick="UI.switchHeatmapMode('grid')">
                📊 Regional Matrix
              </button>
            </div>

            <div class="map-filter-group" id="map-filter-controls" style="${activeHeatmapViewMode === 'map' ? 'display:flex;' : 'display:none;'}">
              <button class="btn btn-sm ${activeMapFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="UI.filterMapMarkers('all')">
                All Items (${projects.length + events.length + locations.length})
              </button>
              <button class="btn btn-sm ${activeMapFilter === 'projects' ? 'btn-primary' : 'btn-secondary'}" onclick="UI.filterMapMarkers('projects')">
                📁 Projects (${projects.length})
              </button>
              <button class="btn btn-sm ${activeMapFilter === 'facilities' ? 'btn-primary' : 'btn-secondary'}" onclick="UI.filterMapMarkers('facilities')">
                🏢 Facilities (${locations.length})
              </button>
              <button class="btn btn-sm ${activeMapFilter === 'events' ? 'btn-primary' : 'btn-secondary'}" onclick="UI.filterMapMarkers('events')">
                ⚡ Events (${events.length})
              </button>
              <button class="btn btn-sm ${activeMapFilter === 'high_risk' ? 'btn-primary' : 'btn-secondary'}" onclick="UI.filterMapMarkers('high_risk')">
                ⚠️ High Risk
              </button>
            </div>
          </div>

          <div class="heatmap-legend">
            <div class="legend-item"><div class="legend-box legend-green"></div> Low Risk (&lt;35)</div>
            <div class="legend-item"><div class="legend-box legend-amber"></div> Med Risk (36-60)</div>
            <div class="legend-item"><div class="legend-box legend-red"></div> High Risk (&gt;60)</div>
            <div class="legend-item"><div class="legend-box" style="background:#4F46E5;"></div> Facility Campus</div>
            <div class="legend-item"><div class="legend-box legend-blue"></div> External Event</div>
          </div>
        </div>

        <div id="heatmap-map-section" style="${activeHeatmapViewMode === 'map' ? 'display:block;' : 'display:none;'}">
          <div class="osm-map-wrapper">
            <div id="osm-map-container" class="osm-map-container"></div>
            
            <div class="osm-map-overlay-card">
              <div class="osm-map-overlay-title">
                <span>📍</span> OpenStreetMap GIS Live
              </div>
              <div class="osm-map-hint">
                • <strong>Click anywhere on map</strong> to drop a pin & create a Project, Event, or Campus.<br>
                • <strong>Click pins</strong> for real-time risk details, schedule analysis, and floor plan drilldown.
              </div>
            </div>
          </div>
        </div>

        <div id="heatmap-grid-section" class="heatmap-grid" style="${activeHeatmapViewMode === 'grid' ? 'display:grid;' : 'display:none;'}">
          ${regionalStats.map(r => `
            <div class="region-card ${r.status}" onclick="UI.focusMapOnRegion('${r.name}', ${r.centerLat}, ${r.centerLng})">
              <div class="region-header">
                <span class="region-name">${r.name} Region</span>
                <span class="region-status-tag">${r.status}</span>
              </div>

              <div class="region-stats">
                <div class="region-stat-item">
                  <div class="region-stat-label">Calculated Risk</div>
                  <div class="region-stat-value">${r.risk} / 100</div>
                </div>
                <div class="region-stat-item">
                  <div class="region-stat-label">Projects Active</div>
                  <div class="region-stat-value">${r.projects}</div>
                </div>
                <div class="region-stat-item">
                  <div class="region-stat-label">Satisfaction</div>
                  <div class="region-stat-value">${r.satisfaction}</div>
                </div>
                <div class="region-stat-item">
                  <div class="region-stat-label">Event Exposure</div>
                  <div class="region-stat-value">${r.exposure}%</div>
                </div>
              </div>

              <div>
                <div style="font-size:11px; color: var(--text-muted); display:flex; justify-content:space-between;">
                  <span>Risk Exposure Meter</span>
                  <span>${r.exposure}%</span>
                </div>
                <div class="region-exposure-bar">
                  <div class="region-exposure-fill" style="width: ${r.exposure}%; background-color: ${r.status === 'healthy' ? '#2E7D32' : (r.status === 'attention' ? '#F9A825' : '#C62828')};"></div>
                </div>
              </div>

              <div style="font-size:11px; color:var(--primary-navy); font-weight:600; text-align:right;">
                Click to inspect on map ➔
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    $('#view-heatmap').html(html);

    if (activeHeatmapViewMode === 'map') {
      setTimeout(() => initOpenStreetMap(regionalStats), 50);
    }
  }

  function switchHeatmapMode(mode) {
    activeHeatmapViewMode = mode;
    $('.view-toggle-btn').removeClass('active');
    $(`.view-toggle-btn:contains(${mode === 'map' ? 'Map' : 'Matrix'})`).addClass('active');

    if (mode === 'map') {
      $('#heatmap-map-section').show();
      $('#heatmap-grid-section').hide();
      $('#map-filter-controls').css('display', 'flex');
      setTimeout(() => {
        if (!activeMapInstance) {
          renderStrategicHeatmap();
        } else {
          activeMapInstance.invalidateSize();
        }
      }, 50);
    } else {
      $('#heatmap-map-section').hide();
      $('#heatmap-grid-section').css('display', 'grid');
      $('#map-filter-controls').hide();
    }
  }

  function focusMapOnRegion(regionName, lat, lng) {
    switchHeatmapMode('map');
    if (activeMapInstance) {
      activeMapInstance.setView([lat, lng], 8, { animate: true });
      showToast(`Focused map on ${regionName} Region`, 'info');
    }
  }

  function initOpenStreetMap(regionalStats) {
    const mapElement = document.getElementById('osm-map-container');
    if (!mapElement) return;

    if (activeMapInstance) {
      try {
        activeMapInstance.remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
      activeMapInstance = null;
    }
    activeMapMarkers = [];

    const map = L.map('osm-map-container', {
      center: [24.2, 45.0],
      zoom: 6,
      scrollWheelZoom: true
    });

    activeMapInstance = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    if (regionalStats && Array.isArray(regionalStats)) {
      regionalStats.forEach(r => {
        const color = r.status === 'healthy' ? '#2E7D32' : (r.status === 'attention' ? '#F9A825' : '#C62828');
        
        const circle = L.circle([r.centerLat, r.centerLng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          radius: r.radius || 170000,
          weight: 2,
          dashArray: '4, 4'
        }).addTo(map);

        circle.bindTooltip(`<strong>${r.name} Region</strong><br>Risk: ${r.risk}/100 • Status: ${r.status}`, {
          permanent: false,
          direction: 'top'
        });
      });
    }

    populateMapMarkers();

    map.on('click', function (e) {
      const lat = parseFloat(e.latlng.lat.toFixed(4));
      const lng = parseFloat(e.latlng.lng.toFixed(4));

      const popupContent = `
        <div class="map-popup-card" style="text-align:center;">
          <div class="map-popup-title" style="margin-bottom:6px;">📍 Coordinates Selected</div>
          <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
            Lat: ${lat}, Lng: ${lng}
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <button class="btn btn-sm btn-primary" onclick="UI.openProjectModal(null, ${lat}, ${lng})">
              📁 Add Project Here
            </button>
            <button class="btn btn-sm btn-secondary" onclick="UI.openLocationModal(null)">
              🏢 Add Campus Here
            </button>
            <button class="btn btn-sm btn-secondary" onclick="UI.openEventModal(null, ${lat}, ${lng})">
              ⚡ Add Event Alert Here
            </button>
          </div>
        </div>
      `;

      L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);
    });
  }

  function populateMapMarkers() {
    if (!activeMapInstance) return;

    activeMapMarkers.forEach(m => activeMapInstance.removeLayer(m));
    activeMapMarkers = [];

    const data = ImpactData.getState();
    const projects = data.projects || [];
    const events = data.events || [];
    const locations = data.locations || [];

    if (activeMapFilter === 'all' || activeMapFilter === 'projects' || activeMapFilter === 'high_risk') {
      projects.forEach(p => {
        if (!p.lat || !p.lng) return;
        const riskObj = RiskEngine.calculateProjectRisk(p, events);
        
        if (activeMapFilter === 'high_risk' && riskObj.totalRisk <= 50) {
          return;
        }

        const pinClass = riskObj.totalRisk > 60 ? 'pin-project-red' : (riskObj.totalRisk > 35 ? 'pin-project-amber' : 'pin-project-green');
        const iconHtml = `<div class="custom-map-pin ${pinClass}" title="${p.name}">📁</div>`;
        
        const customIcon = L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const recObj = EventEngine.recommendNewDate(p, events);

        const popupHtml = `
          <div class="map-popup-card">
            <div class="map-popup-header">
              <div class="map-popup-title">${p.name}</div>
              <span class="badge ${riskObj.totalRisk > 60 ? 'badge-red' : (riskObj.totalRisk > 35 ? 'badge-amber' : 'badge-green')}">
                Risk ${riskObj.totalRisk}
              </span>
            </div>
            <div class="map-popup-meta">${p.owner} • ${p.department}</div>
            
            <div class="map-popup-stat-row">
              <span>Progress:</span>
              <strong>${p.progress}%</strong>
            </div>
            <div class="map-popup-stat-row">
              <span>Planned End:</span>
              <strong>${p.plannedEndDate}</strong>
            </div>
            <div class="map-popup-stat-row" style="color:var(--primary-navy);">
              <span>Rec. End Date:</span>
              <strong>${recObj.recommendedEndDate}</strong>
            </div>
            <div class="map-popup-stat-row">
              <span>Region:</span>
              <strong>${p.region || 'Central'}</strong>
            </div>

            <div class="map-popup-actions">
              <button class="btn btn-sm btn-primary" style="flex:1;" onclick="UI.showScheduleModal('${p.id}')">Analyze</button>
              <button class="btn-icon btn-edit" onclick="UI.openProjectModal('${p.id}')" title="Edit">✏️</button>
              <button class="btn-icon btn-delete" onclick="UI.deleteProject('${p.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        `;

        const marker = L.marker([p.lat, p.lng], { icon: customIcon }).addTo(activeMapInstance);
        marker.bindPopup(popupHtml);
        activeMapMarkers.push(marker);
      });
    }

    if (activeMapFilter === 'all' || activeMapFilter === 'facilities') {
      locations.forEach(loc => {
        if (!loc.lat || !loc.lng) return;

        const iconHtml = `<div class="custom-map-pin" style="background:#4F46E5; border-color:#C7D2FE;" title="${loc.name}">🏢</div>`;
        const customIcon = L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const locBuildings = (data.buildings || []).filter(b => b.locationId === loc.id);

        const popupHtml = `
          <div class="map-popup-card">
            <div class="map-popup-header">
              <div class="map-popup-title">${loc.name}</div>
              <span class="badge badge-blue">${loc.code}</span>
            </div>
            <div class="map-popup-meta">${loc.type} • ${loc.region} Region</div>
            
            <div class="map-popup-stat-row">
              <span>Buildings:</span>
              <strong>${locBuildings.length} Facilities</strong>
            </div>
            <div class="map-popup-stat-row">
              <span>Address:</span>
              <strong>${loc.address}</strong>
            </div>

            <div style="margin-top:6px;">
              ${(loc.metamodelTags || []).map(t => `<span class="room-tag-pill" style="background:#E2E8F0; color:var(--text-dark);">${t}</span>`).join(' ')}
            </div>

            <div class="map-popup-actions">
              <button class="btn btn-sm btn-primary" style="flex:1;" onclick="App.navigateTo('facilities'); setTimeout(() => UI.renderFacilitiesModule('${loc.id}'), 100);">
                Inspect Floor Plans ➔
              </button>
              <button class="btn-icon btn-edit" onclick="UI.openLocationModal('${loc.id}')" title="Edit">✏️</button>
            </div>
          </div>
        `;

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(activeMapInstance);
        marker.bindPopup(popupHtml);
        activeMapMarkers.push(marker);
      });
    }

    if (activeMapFilter === 'all' || activeMapFilter === 'events' || (activeMapFilter === 'high_risk')) {
      events.forEach(e => {
        if (!e.lat || !e.lng) return;
        if (activeMapFilter === 'high_risk' && e.severity < 4) {
          return;
        }

        const iconHtml = `<div class="custom-map-pin pin-event" title="${e.title}">${e.icon || '⚡'}</div>`;
        
        const customIcon = L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const affected = EventEngine.getAffectedProjects(e, projects);

        const popupHtml = `
          <div class="map-popup-card">
            <div class="map-popup-header">
              <div class="map-popup-title">${e.title}</div>
              <span class="badge ${e.status === 'Active' ? 'badge-amber' : 'badge-green'}">
                ${e.status}
              </span>
            </div>
            <div class="map-popup-meta">${e.source} • Category: ${e.category}</div>
            
            <div class="map-popup-stat-row">
              <span>Severity:</span>
              <strong>Level ${e.severity} / 5</strong>
            </div>
            <div class="map-popup-stat-row">
              <span>Probability:</span>
              <strong>${Math.round(e.probability * 100)}%</strong>
            </div>
            <div class="map-popup-stat-row">
              <span>Affected Projects:</span>
              <strong>${affected.length} initiatives</strong>
            </div>

            <div class="map-popup-actions">
              <button class="btn btn-sm btn-primary" style="flex:1;" onclick="UI.showEventImpact('${e.id}')">Impact</button>
              <button class="btn-icon btn-edit" onclick="UI.openEventModal('${e.id}')" title="Edit">✏️</button>
              <button class="btn-icon btn-delete" onclick="UI.deleteEvent('${e.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        `;

        const marker = L.marker([e.lat, e.lng], { icon: customIcon }).addTo(activeMapInstance);
        marker.bindPopup(popupHtml);
        activeMapMarkers.push(marker);
      });
    }
  }

  function filterMapMarkers(filterType) {
    activeMapFilter = filterType;
    $('.map-filter-group .btn').removeClass('btn-primary').addClass('btn-secondary');
    $(`.map-filter-group .btn:contains(${filterType === 'all' ? 'All' : (filterType === 'projects' ? 'Projects' : (filterType === 'facilities' ? 'Facilities' : (filterType === 'events' ? 'Events' : 'High')))})`)
      .removeClass('btn-secondary').addClass('btn-primary');

    populateMapMarkers();
    showToast(`Map filtered: ${filterType.replace('_', ' ').toUpperCase()}`, 'info');
  }

  // ==========================================
  // 15. Smart Schedule Drawer & Event Impact
  // ==========================================
  function showScheduleModal(projectId) {
    const projects = ImpactData.getProjects();
    const events = ImpactData.getEvents();
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const recObj = EventEngine.recommendNewDate(project, events);

    const html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="font-size:18px; font-weight:800; color:var(--primary-navy-dark);">Smart Schedule Recommendation</h2>
        <button onclick="UI.closeDrawer()" style="background:none; border:none; font-size:20px; cursor:pointer;">✕</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <strong>Project:</strong> ${project.name}<br>
          <span style="font-size:12px; color:var(--text-muted);">Lead: ${project.owner} • ${project.department}</span>
        </div>

        <div style="background:#F8FAFC; padding:16px; border-radius:var(--radius-md); border:1px solid #E2E8F0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Current End Date:</span>
            <strong>${recObj.currentEndDate}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:var(--danger-crimson);">
            <span>Predicted Event Delay:</span>
            <strong>+${recObj.totalPredictedDelayDays} Days</strong>
          </div>
          <hr style="border:none; border-top:1px solid #E2E8F0; margin:10px 0;">
          <div style="display:flex; justify-content:space-between; color:var(--primary-navy); font-size:15px;">
            <span>Recommended Date:</span>
            <strong>${recObj.recommendedEndDate}</strong>
          </div>
        </div>

        <div>
          <h4 style="font-size:13px; font-weight:700; margin-bottom:8px;">Linked External Disruptions:</h4>
          ${(project.relatedEvents && project.relatedEvents.length > 0) ? project.relatedEvents.map(eId => {
            const ev = events.find(e => e.id === eId);
            return ev ? `
              <div style="padding:10px; background:#FEFCE8; border:1px solid #FDE047; border-radius:var(--radius-sm); margin-bottom:6px; font-size:12px;">
                <strong>${ev.title}</strong> (${ev.category})<br>
                Severity Level ${ev.severity} • Delay contrib: +${EventEngine.calculateDelay(ev)} days
              </div>
            ` : '';
          }).join('') : '<p style="font-size:12px; color:#94A3B8;">No external events currently affecting this project.</p>'}
        </div>

        <div style="margin-top:12px;">
          <button class="btn btn-secondary" style="width:100%;" onclick="UI.openProjectModal('${project.id}'); UI.closeDrawer();">
            ✏️ Edit Project Parameters
          </button>
        </div>
      </div>
    `;

    $('#drawer-panel').html(html).addClass('active');
    $('#drawer-overlay').addClass('active');
  }

  function showEventImpact(eventId) {
    const events = ImpactData.getEvents();
    const projects = ImpactData.getProjects();
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const affected = EventEngine.getAffectedProjects(event, projects);

    const html = `
      <div class="modal-header">
        <span class="modal-title">Event Impact Assessment</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div>
        <h3>${event.title}</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px;">
          Source: ${event.source} • Severity Level ${event.severity}/5 • Region: ${event.region || 'Central'}
        </p>
        
        <h4 style="font-size:14px; font-weight:700; margin-bottom:8px;">Affected Projects (${affected.length}):</h4>
        ${affected.length > 0 ? affected.map(p => `
          <div style="padding:10px; background:#F1F5F9; border-radius:6px; margin-bottom:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>${p.name}</strong><br>
              <span style="font-size:11px; color:var(--text-muted);">${p.owner} • Progress: ${p.progress}%</span>
            </div>
            <button class="btn btn-sm btn-primary" onclick="UI.closeModal(); UI.showScheduleModal('${p.id}');">Analyze</button>
          </div>
        `).join('') : '<p style="font-size:13px; color:var(--text-muted);">No direct projects linked to this event alert.</p>'}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="UI.closeModal()">Close</button>
        <button class="btn btn-primary" onclick="UI.openEventModal('${event.id}')">Edit Event</button>
      </div>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  // ==========================================
  // 16. View: Financial Command across MetaModel (Income, Spendings, Assets, Liabilities)
  // ==========================================
  let activeFinancialTypeFilter = 'ALL';
  let activeFinancialMetaModelTag = 'ALL';

  function renderFinancialsModule(typeFilter = null, tagFilter = null) {
    if (typeFilter !== null) activeFinancialTypeFilter = typeFilter;
    if (tagFilter !== null) activeFinancialMetaModelTag = tagFilter;

    const summary = ImpactData.getFinancialSummary();
    const financials = ImpactData.getFinancials();
    const locations = ImpactData.getLocations();
    const projects = ImpactData.getProjects();

    const types = ['ALL', 'Income', 'Spending', 'Asset', 'Liability'];
    const metaTags = ['ALL', '#budget', '#oil_price', '#inflation', '#interest_rates', '#ports', '#datacenter', '#clean_energy', '#power_grid', '#security', '#smart_facility', '#trade_restrictions'];

    let filtered = financials;
    if (activeFinancialTypeFilter !== 'ALL') {
      filtered = filtered.filter(f => f.type === activeFinancialTypeFilter);
    }
    if (activeFinancialMetaModelTag !== 'ALL') {
      filtered = filtered.filter(f => f.metamodelTags && f.metamodelTags.includes(activeFinancialMetaModelTag));
    }

    const totalBalanceSheet = (summary.totalAssets + summary.totalLiabilities) || 1;
    const assetPct = Math.round((summary.totalAssets / totalBalanceSheet) * 100);
    const liabilityPct = 100 - assetPct;

    const totalCashflow = (summary.totalIncome + summary.totalSpendings) || 1;
    const incomePct = Math.round((summary.totalIncome / totalCashflow) * 100);
    const spendingPct = 100 - incomePct;

    const html = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Unified Financial Command Center</h1>
          <p class="page-subtitle">Manage public sector Income, Spendings, Capital Assets & Liabilities across the MetaModel</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary" onclick="UI.openFinancialModal(null, 'Income')">+ Add Income</button>
          <button class="btn btn-primary" onclick="UI.openFinancialModal(null, 'Spending')">+ Add Spending</button>
          <button class="btn btn-primary" onclick="UI.openFinancialModal(null, 'Asset')">+ Add Asset</button>
          <button class="btn btn-primary" onclick="UI.openFinancialModal(null, 'Liability')">+ Add Liability</button>
        </div>
      </div>

      <!-- Financial Summary KPI Grid -->
      <div class="financial-summary-grid">
        <div class="fin-card fin-networth">
          <div class="fin-header">
            <span class="fin-label">Balance Sheet Net Worth</span>
            <div class="kpi-icon" style="font-size:18px;">🏛️</div>
          </div>
          <div class="fin-amount" style="color:var(--primary-navy);">$${summary.netWorth}M</div>
          <div class="fin-footer">Assets ($${summary.totalAssets}M) - Liabilities ($${summary.totalLiabilities}M)</div>
        </div>

        <div class="fin-card fin-income">
          <div class="fin-header">
            <span class="fin-label">Net Fiscal Margin</span>
            <div class="kpi-icon" style="font-size:18px;">📈</div>
          </div>
          <div class="fin-amount" style="color:${summary.netFiscalMargin >= 0 ? 'var(--success-green)' : 'var(--danger-crimson)'};">
            ${summary.netFiscalMargin >= 0 ? '+' : ''}$${summary.netFiscalMargin}M
          </div>
          <div class="fin-footer">Income ($${summary.totalIncome}M) - Spendings ($${summary.totalSpendings}M)</div>
        </div>

        <div class="fin-card fin-asset">
          <div class="fin-header">
            <span class="fin-label">Total Capital Assets</span>
            <div class="kpi-icon" style="font-size:18px;">🏢</div>
          </div>
          <div class="fin-amount" style="color:#2563EB;">$${summary.totalAssets}M</div>
          <div class="fin-footer">Hardware, Land, Plants & Software IP</div>
        </div>

        <div class="fin-card fin-liability">
          <div class="fin-header">
            <span class="fin-label">Total Liabilities & Bonds</span>
            <div class="kpi-icon" style="font-size:18px;">⚖️</div>
          </div>
          <div class="fin-amount" style="color:#D97706;">$${summary.totalLiabilities}M</div>
          <div class="fin-footer">Green Bonds, Loans & Supplier Commitments</div>
        </div>

        <div class="fin-card fin-income">
          <div class="fin-header">
            <span class="fin-label">Total Revenue Streams</span>
            <div class="kpi-icon" style="font-size:18px;">💵</div>
          </div>
          <div class="fin-amount" style="color:#059669;">$${summary.totalIncome}M</div>
          <div class="fin-footer">Tariffs, Municipal Fees & Grants</div>
        </div>

        <div class="fin-card fin-spending">
          <div class="fin-header">
            <span class="fin-label">Total Expenditures (CapEx/OpEx)</span>
            <div class="kpi-icon" style="font-size:18px;">💳</div>
          </div>
          <div class="fin-amount" style="color:#DC2626;">$${summary.totalSpendings}M</div>
          <div class="fin-footer">Infrastructure, Maintenance & Cyber Reserves</div>
        </div>
      </div>

      <!-- Balance Sheet & Cashflow Visual Proportion Bars -->
      <div class="balance-comparison-box">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700;">
              <span style="color:#2563EB;">🏛️ Capital Assets: $${summary.totalAssets}M (${assetPct}%)</span>
              <span style="color:#D97706;">⚖️ Liabilities: $${summary.totalLiabilities}M (${liabilityPct}%)</span>
            </div>
            <div class="balance-bar-row">
              <div class="balance-bar-assets" style="width: ${assetPct}%;"></div>
              <div class="balance-bar-liabilities" style="width: ${liabilityPct}%;"></div>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">Solvency Ratio: Assets exceed obligations by $${summary.netWorth}M</div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700;">
              <span style="color:#059669;">💵 Income: $${summary.totalIncome}M (${incomePct}%)</span>
              <span style="color:#DC2626;">💳 Spendings: $${summary.totalSpendings}M (${spendingPct}%)</span>
            </div>
            <div class="balance-bar-row">
              <div class="balance-bar-income" style="width: ${incomePct}%;"></div>
              <div class="balance-bar-spending" style="width: ${spendingPct}%;"></div>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">Fiscal Operating Margin: ${summary.netFiscalMargin >= 0 ? 'Surplus' : 'Deficit'} of $${summary.netFiscalMargin}M</div>
          </div>
        </div>
      </div>

      <!-- MetaModel Tag Filter Chips Bar -->
      <div class="metamodel-filter-bar" style="margin-bottom:16px;">
        <div class="metamodel-filter-title">
          <span>🏷️ MetaModel Macro Financial Sensitivity Explorer</span>
          <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">Filter balance sheet items by external macro triggers</span>
        </div>
        <div class="metamodel-tag-chips">
          ${metaTags.map(tag => `
            <span class="metamodel-tag-chip ${activeFinancialMetaModelTag === tag ? 'active' : ''}" onclick="UI.renderFinancialsModule(null, '${tag}')">
              ${tag}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Type Filter Tabs Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div class="heatmap-view-toggle">
          ${types.map(t => `
            <button class="view-toggle-btn ${activeFinancialTypeFilter === t ? 'active' : ''}" onclick="UI.renderFinancialsModule('${t}', null)">
              ${t === 'ALL' ? 'All Financials' : (t === 'Income' ? '💵 Income' : (t === 'Spending' ? '💳 Spendings' : (t === 'Asset' ? '🏛️ Assets' : '⚖️ Liabilities')))}
            </button>
          `).join('')}
        </div>
        <span style="font-size:12px; color:var(--text-muted);">Showing <strong>${filtered.length}</strong> ledger records</span>
      </div>

      <!-- Financial Ledger Records Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Financial Title & Description</th>
              <th>Type</th>
              <th>Valuation / Amount</th>
              <th>Recurrence</th>
              <th>Department & Lead</th>
              <th>Linked Asset / Initiative</th>
              <th>MetaModel Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length > 0 ? filtered.map(f => {
              let badgeClass = 'badge-blue';
              if (f.type === 'Income') badgeClass = 'badge-income';
              else if (f.type === 'Spending') badgeClass = 'badge-spending';
              else if (f.type === 'Asset') badgeClass = 'badge-asset';
              else if (f.type === 'Liability') badgeClass = 'badge-liability';

              const linkedLoc = locations.find(l => l.id === f.locationId);
              const linkedProj = projects.find(p => p.id === f.projectId);

              return `
                <tr>
                  <td><strong>${f.id}</strong></td>
                  <td>
                    <strong>${f.title}</strong><br>
                    <span style="font-size:11px; color:var(--text-muted);">${f.description || ''}</span>
                  </td>
                  <td><span class="badge ${badgeClass}">${f.type}</span></td>
                  <td>
                    <strong style="font-size:14px; color:${f.type === 'Income' || f.type === 'Asset' ? '#059669' : '#DC2626'};">
                      $${f.amountUsdM}M
                    </strong>
                  </td>
                  <td><span style="font-size:12px;">${f.frequency}</span></td>
                  <td>
                    ${f.owner}<br>
                    <span style="font-size:11px; color:var(--text-muted);">${f.department}</span>
                  </td>
                  <td>
                    ${linkedLoc ? `<span class="room-tag-pill" style="background:#EEF2FF; color:#3730A3;">🏢 ${linkedLoc.code}</span><br>` : ''}
                    ${linkedProj ? `<span class="room-tag-pill" style="background:#F0FDF4; color:#166534;">📁 ${linkedProj.name.substring(0, 16)}...</span>` : (!linkedLoc ? '<span style="font-size:11px; color:#94A3B8;">Direct Portfolio</span>' : '')}
                  </td>
                  <td>
                    <div style="display:flex; flex-wrap:wrap; gap:3px;">
                      ${(f.metamodelTags || []).map(t => `<span class="tag-pill" style="font-size:10px;">${t}</span>`).join(' ')}
                    </div>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-icon btn-edit" onclick="UI.openFinancialModal('${f.id}')" title="Edit Record">✏️</button>
                      <button class="btn-icon btn-delete" onclick="UI.deleteFinancial('${f.id}')" title="Delete Record">🗑️</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="9" style="text-align:center; padding:32px; color:var(--text-muted);">
                  No financial records found matching the active filters.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;

    $('#view-financials').html(html);
  }

  function openFinancialModal(recordId = null, defaultType = 'Income') {
    const isEdit = !!recordId;
    const fin = isEdit ? ImpactData.getFinancialRecordById(recordId) : null;
    const employees = ImpactData.getEmployees();
    const departments = ImpactData.DEPARTMENTS;
    const locations = ImpactData.getLocations();
    const projects = ImpactData.getProjects();
    const allTags = ImpactData.ALL_METAMODEL_TAGS;

    const currentType = fin ? fin.type : defaultType;

    const html = `
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'Edit Financial Record' : 'Add Financial Ledger Record'}</span>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <form onsubmit="UI.saveFinancial(event, '${recordId || ''}')">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Financial Title *</label>
            <input type="text" id="fin-title" class="form-control" required value="${fin ? fin.title : ''}" placeholder="e.g. Maritime Port Tariffs, Sovereign Bond 2030">
          </div>
          <div class="form-group">
            <label class="form-label">Financial Dimension (Type) *</label>
            <select id="fin-type" class="form-select" required>
              <option value="Income" ${currentType === 'Income' ? 'selected' : ''}>💵 Income (Revenue Stream)</option>
              <option value="Spending" ${currentType === 'Spending' ? 'selected' : ''}>💳 Spending (CapEx / OpEx)</option>
              <option value="Asset" ${currentType === 'Asset' ? 'selected' : ''}>🏛️ Capital Asset (Valuation)</option>
              <option value="Liability" ${currentType === 'Liability' ? 'selected' : ''}>⚖️ Liability (Debt / Bond / Payables)</option>
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Amount ($M USD) *</label>
            <input type="number" id="fin-amount" step="0.1" min="0.1" class="form-control" required value="${fin ? fin.amountUsdM : 50.0}">
          </div>
          <div class="form-group">
            <label class="form-label">Frequency / Term *</label>
            <select id="fin-freq" class="form-select" required>
              <option ${fin && fin.frequency === 'Annual' ? 'selected' : ''}>Annual</option>
              <option ${fin && fin.frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
              <option ${fin && fin.frequency === 'Quarterly' ? 'selected' : ''}>Quarterly</option>
              <option ${fin && fin.frequency === 'One-Time Asset' ? 'selected' : ''}>One-Time Asset</option>
              <option ${fin && fin.frequency === 'Long-Term Liability' ? 'selected' : ''}>Long-Term Liability</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Risk Sensitivity</label>
            <select id="fin-risk" class="form-select">
              <option value="Low" ${fin && fin.riskSensitivity === 'Low' ? 'selected' : ''}>Low Sensitivity</option>
              <option value="Medium" ${fin && fin.riskSensitivity === 'Medium' ? 'selected' : ''}>Medium Sensitivity</option>
              <option value="High" ${fin && fin.riskSensitivity === 'High' ? 'selected' : ''}>High (Inflation/Oil Shock)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Lead Controller / Owner *</label>
            <select id="fin-owner" class="form-select" required>
              ${employees.map(e => `
                <option value="${e.name}" ${fin && fin.owner === e.name ? 'selected' : ''}>${e.name} (${e.department})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Department *</label>
            <select id="fin-dept" class="form-select" required>
              ${departments.map(d => `
                <option value="${d}" ${fin && fin.department === d ? 'selected' : ''}>${d}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Linked Geo Location / Campus</label>
            <select id="fin-loc" class="form-select">
              <option value="">-- No Direct Campus Link --</option>
              ${locations.map(l => `
                <option value="${l.id}" ${fin && fin.locationId === l.id ? 'selected' : ''}>${l.name} (${l.code})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Linked Strategic Initiative</label>
            <select id="fin-proj" class="form-select">
              <option value="">-- No Direct Project Link --</option>
              ${projects.map(p => `
                <option value="${p.id}" ${fin && fin.projectId === p.id ? 'selected' : ''}>${p.id} - ${p.name}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description & Rationale</label>
          <textarea id="fin-desc" class="form-textarea" placeholder="Explain the revenue model, CapEx justification, asset valuation, or debt covenant...">${fin ? fin.description : ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">MetaModel Tags (Hold Ctrl to select multiple)</label>
          <select id="fin-tags" class="form-select" multiple style="height: 80px;">
            ${allTags.map(tag => {
              const isSelected = fin && fin.metamodelTags && fin.metamodelTags.includes(tag);
              return `<option value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</option>`;
            }).join('')}
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Financial Record' : 'Create Record'}</button>
        </div>
      </form>
    `;

    $('#modal-box').html(html);
    $('#modal-overlay').addClass('active');
  }

  function saveFinancial(event, recordId) {
    event.preventDefault();
    const tags = $('#fin-tags').val() || ['#budget'];

    const finData = {
      title: $('#fin-title').val().trim(),
      type: $('#fin-type').val(),
      amountUsdM: parseFloat($('#fin-amount').val()),
      frequency: $('#fin-freq').val(),
      riskSensitivity: $('#fin-risk').val(),
      owner: $('#fin-owner').val(),
      department: $('#fin-dept').val(),
      locationId: $('#fin-loc').val() || null,
      projectId: $('#fin-proj').val() || null,
      description: $('#fin-desc').val().trim(),
      status: 'Active',
      metamodelTags: tags
    };

    if (recordId) {
      ImpactData.updateFinancialRecord(recordId, finData);
      showToast(`Financial record "${finData.title}" updated!`, 'success');
    } else {
      ImpactData.createFinancialRecord(finData);
      showToast(`New ${finData.type} record "$${finData.amountUsdM}M" added!`, 'success');
    }

    closeModal();
    renderFinancialsModule();
  }

  function deleteFinancial(recordId) {
    const fin = ImpactData.getFinancialRecordById(recordId);
    if (!fin) return;

    confirmAction(
      `Delete Financial Record "${fin.title}"?`,
      `Are you sure you want to remove this ${fin.type} entry ($${fin.amountUsdM}M)?`,
      () => {
        ImpactData.deleteFinancialRecord(recordId);
        showToast('Financial record deleted.', 'danger');
        renderFinancialsModule();
      }
    );
  }

  return {
    showToast: showToast,
    closeModal: closeModal,
    closeDrawer: closeDrawer,
    toggleQuickAddMenu: toggleQuickAddMenu,
    hideQuickAddMenu: hideQuickAddMenu,
    resetDemoData: resetDemoData,

    // View Renderers
    renderExecutiveDashboard: renderExecutiveDashboard,
    renderFinancialsModule: renderFinancialsModule,
    renderRoutinesModule: renderRoutinesModule,
    renderFacilitiesModule: renderFacilitiesModule,
    renderEmployeeDashboard: renderEmployeeDashboard,
    renderObjectivesModule: renderObjectivesModule,
    renderProjectsModule: renderProjectsModule,
    renderInnovationMarketplace: renderInnovationMarketplace,
    renderEventsCenter: renderEventsCenter,
    renderRiskCenter: renderRiskCenter,
    renderCitizenImpactModule: renderCitizenImpactModule,
    renderStrategicHeatmap: renderStrategicHeatmap,

    // Financial CRUD
    openFinancialModal: openFinancialModal,
    saveFinancial: saveFinancial,
    deleteFinancial: deleteFinancial,

    // Routines CRUD & Checklists
    openRoutineModal: openRoutineModal,
    addRoutineBuilderItem: addRoutineBuilderItem,
    removeRoutineBuilderItem: removeRoutineBuilderItem,
    saveRoutine: saveRoutine,
    deleteRoutine: deleteRoutine,
    toggleRoutineChecklistItem: toggleRoutineChecklistItem,
    completeRoutine: completeRoutine,

    // Facilities & Spatial CRUD
    filterFacilitiesByMetaModelTag: filterFacilitiesByMetaModelTag,
    openLocationModal: openLocationModal,
    onLocationRegionChange: onLocationRegionChange,
    saveLocation: saveLocation,
    deleteLocation: deleteLocation,

    openBuildingModal: openBuildingModal,
    saveBuilding: saveBuilding,
    deleteBuilding: deleteBuilding,

    openFloorModal: openFloorModal,
    saveFloor: saveFloor,
    deleteFloor: deleteFloor,

    openRoomModal: openRoomModal,
    saveRoom: saveRoom,
    deleteRoom: deleteRoom,
    showRoomDetails: showRoomDetails,

    // CRUD Projects
    openProjectModal: openProjectModal,
    onProjectRegionChange: onProjectRegionChange,
    saveProject: saveProject,
    deleteProject: deleteProject,

    // CRUD Objectives
    openObjectiveModal: openObjectiveModal,
    saveObjective: saveObjective,
    deleteObjective: deleteObjective,

    // CRUD Events
    openEventModal: openEventModal,
    onEventRegionChange: onEventRegionChange,
    saveEvent: saveEvent,
    deleteEvent: deleteEvent,
    showEventImpact: showEventImpact,

    // CRUD Innovation
    openIdeaModal: openIdeaModal,
    saveIdea: saveIdea,
    deleteIdea: deleteIdea,
    upvoteIdea: upvoteIdea,
    moveIdea: moveIdea,

    // CRUD Employees
    openEmployeeModal: openEmployeeModal,
    saveEmployee: saveEmployee,
    deleteEmployee: deleteEmployee,

    // CRUD Recognitions
    openRecognitionModal: openRecognitionModal,
    saveRecognition: saveRecognition,
    deleteRecognition: deleteRecognition,

    // Drawers & Schedule
    showScheduleModal: showScheduleModal,

    // OpenStreetMap Helpers
    switchHeatmapMode: switchHeatmapMode,
    filterMapMarkers: filterMapMarkers,
    focusMapOnRegion: focusMapOnRegion
  };
})();
