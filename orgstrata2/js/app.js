/* ==========================================================================
   THEME MANAGER — Light & Dark with White & Gold Color Scheme
   Persists to localStorage, syncs across toggle buttons
   Author: Mohammad Hijazi
   ========================================================================== */

window.ThemeManager = (function() {
  const THEME_KEY = 'orgstrata_theme';
  const VALID_THEMES = ['dark', 'light'];

  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (VALID_THEMES.includes(saved)) return saved;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    _updateToggleIcons(theme);
    _updateMetaThemeColor(theme);
    _reflowHighcharts();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
  }

  function _updateToggleIcons(theme) {
    const icon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
    document.querySelectorAll('#btnThemeToggleNav i, #btnThemeToggleWs i').forEach(el => {
      el.className = `fa-solid ${icon}`;
    });
  }

  function _updateMetaThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#d4af37' : '#070a12');
    }
  }

  function _reflowHighcharts() {
    if (window.Highcharts) {
      setTimeout(() => {
        document.querySelectorAll('.comp-render-area').forEach(area => {
          const chartId = area.id;
          if (chartId && window.Highcharts.charts) {
            window.Highcharts.charts.forEach(c => {
              if (c && c.renderTo && c.renderTo.id === chartId) {
                try { c.reflow(); } catch(e) {}
              }
            });
          }
        });
      }, 50);
    }
  }

  function bindToggles() {
    ['btnThemeToggleNav', 'btnThemeToggleWs'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn && !btn.dataset.themeBound) {
        btn.addEventListener('click', toggleTheme);
        btn.dataset.themeBound = '1';
      }
    });
  }

  function init() {
    applyTheme(getSavedTheme());
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindToggles);
    } else {
      bindToggles();
    }
  }

  return { init, applyTheme, toggleTheme, getSavedTheme };
})();

window.ThemeManager.init();

/* ==========================================================================
   PWA INSTALL MANAGER — BeforeInstallPrompt + appinstalled tracking
   Author: Mohammad Hijazi
   ========================================================================== */

window.PwaInstallManager = (function() {
  let deferredPrompt = null;
  let isInstalled = false;

  function _showButtons(show) {
    const ids = ['btnInstallPwaNav', 'btnInstallPwaWs'];
    ids.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.style.display = show ? 'inline-flex' : 'none';
    });
  }

  async function _doInstall() {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        _showButtons(false);
        if (window.AppOrchestrator && typeof window.AppOrchestrator._showToast === 'function') {
          window.AppOrchestrator._showToast('PWA installed! Launch from your desktop/home screen.', 'success');
        }
      }
      deferredPrompt = null;
    } catch(e) {
      console.warn('PWA install prompt failed:', e);
    }
  }

  function bindButtons() {
    ['btnInstallPwaNav', 'btnInstallPwaWs'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn && !btn.dataset.pwaBound) {
        btn.addEventListener('click', _doInstall);
        btn.dataset.pwaBound = '1';
      }
    });
  }

  function init() {
    const checkInstalled = () => {
      const standAlone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
        || (window.navigator.standalone === true)
        || document.referrer.includes('android-app://');
      if (standAlone) {
        isInstalled = true;
        _showButtons(false);
      }
    };

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      checkInstalled();
      if (!isInstalled) _showButtons(true);
    });

    window.addEventListener('appinstalled', () => {
      isInstalled = true;
      deferredPrompt = null;
      _showButtons(false);
    });

    checkInstalled();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindButtons);
    } else {
      bindButtons();
    }
  }

  return { init };
})();

window.PwaInstallManager.init();

/* ==========================================================================
   APP ORCHESTRATOR — Digital Twin Universal Workspace v2.3.0
   Manages: Workspace Tabs, Pages Sidebar, Component Canvas, CRUD actions
   Author: Mohammad Hijazi
   ========================================================================== */

window.AppOrchestrator = (function() {

  const COMPONENT_TYPES = [
    { type: 'highcharts',   label: 'Chart',         icon: 'fa-chart-line',        defaultData: { categories: ['A','B','C'], series: [{ name:'Series 1', data:[10,20,30] }] }, defaultSettings: { chartType:'line' } },
    { type: 'calendar',     label: 'Calendar',      icon: 'fa-calendar-days',     defaultData: { events: [] }, defaultSettings: { defaultView:'dayGridMonth' } },
    { type: 'map',          label: 'Map',            icon: 'fa-map-location-dot',  defaultData: { markers: [] }, defaultSettings: { centerLat:24.7136, centerLng:46.6753, zoom:12 } },
    { type: 'bpmn',         label: 'BPMN',           icon: 'fa-diagram-project',   defaultData: { bpmnXml: '' }, defaultSettings: {} },
    { type: 'jqtable',      label: 'Data Table',     icon: 'fa-table',             defaultData: { columns:['Name','Value'], rows:[] }, defaultSettings: { pageLength:5 } },
    { type: 'kanban',       label: 'Kanban',         icon: 'fa-list-check',        defaultData: { columns:[{id:'backlog',title:'Backlog',color:'#64748b'},{id:'inprogress',title:'In Progress',color:'#00f2fe'},{id:'done',title:'Done',color:'#00e676'}], tasks:[] }, defaultSettings: {} },
    { type: 'gantt',        label: 'Gantt',          icon: 'fa-bars-progress',     defaultData: { columns:[{id:'backlog',title:'Backlog',color:'#64748b'},{id:'inprogress',title:'In Progress',color:'#00f2fe'},{id:'done',title:'Done',color:'#00e676'}], tasks:[] }, defaultSettings: {} },
    { type: 'capabilities', label: 'Capabilities',  icon: 'fa-bullseye',          defaultData: { dimensions:[] }, defaultSettings: {} },
    { type: 'risk',         label: 'Risk Matrix',    icon: 'fa-triangle-exclamation', defaultData: { risks:[] }, defaultSettings: {} },
    { type: 'maturity',     label: 'Maturity',       icon: 'fa-chart-simple',      defaultData: { dimensions:[] }, defaultSettings: {} },
    { type: '3dspatial',    label: '3D Floor Plan',  icon: 'fa-cube',              defaultData: { rooms:[] }, defaultSettings: {} },
  ];

  // ── COMPONENT RENDER REGISTRY ─────────────────────────────────────────────
  const RENDERERS = {
    'highcharts':   () => window.HighchartsComponent,
    'calendar':     () => window.FullCalendarComponent,
    'map':          () => window.OpenMapComponent,
    'bpmn':         () => window.BpmnComponent,
    'jqtable':      () => window.JqTableComponent,
    'kanban':       () => window.KanbanGanttComponent,
    'gantt':        () => window.KanbanGanttComponent,
    'capabilities': () => window.EntityToolsComponent,
    'risk':         () => window.EntityToolsComponent,
    'maturity':     () => window.EntityToolsComponent,
    '3dspatial':    () => window.Spatial3DComponent,
  };

  const SPAN_CLASS = {
    'full':       'comp-span-full',
    'half':       'comp-span-half',
    'two-thirds': 'comp-span-two-thirds',
    'third':      'comp-span-third'
  };

  const PaymentSmsIntake = {
    normalizeRecord(raw) {
      const body = String(raw?.body || '').trim();
      const amountMatch = body.match(/(SAR|AED|USD|QAR|EUR|GBP|EGP)\s*([0-9][0-9,]*(?:\.\d{1,2})?)|([0-9][0-9,]*(?:\.\d{1,2})?)\s*(SAR|AED|USD|QAR|EUR|GBP|EGP)/i);
      const currencyMatch = body.match(/SAR|AED|USD|QAR|EUR|GBP|EGP/i);
      const amount = Number((amountMatch?.[2] || amountMatch?.[3] || raw?.amount || 0).toString().replace(/,/g, ''));
      const currency = (currencyMatch ? currencyMatch[0].toUpperCase() : (raw?.currency || 'USD')).toUpperCase();
      const merchant = raw?.merchant || raw?.sender || body.match(/to\s+([A-Za-z0-9&\s.-]+)/i)?.[1] || 'Unknown Merchant';
      return {
        id: raw?.id || `sms_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        source: raw?.source || 'sms',
        sender: raw?.sender || 'SMS',
        body,
        receivedAt: raw?.receivedAt || new Date().toISOString(),
        merchant: merchant.trim(),
        amount: Number.isFinite(amount) ? amount : 0,
        currency,
        paymentType: raw?.paymentType || 'unknown',
        status: raw?.status || 'review',
        matchedExpenseId: raw?.matchedExpenseId || '',
        notes: raw?.notes || 'Payment SMS intake'
      };
    },
    readPaymentMessages(messages) {
      const items = Array.isArray(messages) ? messages : [];
      return items
        .filter(msg => /payment|charged|paid|invoice|transaction|approved|successful|purchase/i.test(msg?.body || ''))
        .map(item => this.normalizeRecord(item));
    }
  };

  // ── INIT ──────────────────────────────────────────────────────────────────

  function init() {
    _bindLaunchButtons();
    _bindExitButton();
    _bindWorkspaceActions();
    _bindAddComponentModal();
    _bindImportModal();
    _initSignalR();

    // Register SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  // ── LAUNCH / EXIT ─────────────────────────────────────────────────────────

  function _bindLaunchButtons() {
    document.querySelectorAll('.btn-launch-workspace').forEach(btn => {
      btn.addEventListener('click', launchApp);
    });
  }

  function launchApp() {
    document.getElementById('workspaceAppContainer').classList.add('active');
    document.body.style.overflow = 'hidden';
    _renderWorkspaceTabs();
    _renderActivePage();
    if (window.appState && window.appState.activeWorkspaceId === 'company_of_200') {
      const added = window.appState.reconcilePaymentSmsToCostTable(window.appState.activeWorkspaceId);
      if (added.length) {
        refreshWorkspaceView();
      }
    }
  }

  function _bindExitButton() {
    const btn = document.getElementById('btnExitWorkspace');
    if (btn) btn.addEventListener('click', () => {
      document.getElementById('workspaceAppContainer').classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // ── WORKSPACE TABS ────────────────────────────────────────────────────────

  function _renderWorkspaceTabs() {
    const bar = document.getElementById('workspaceTabsBar');
    if (!bar) return;

    const ids = window.appState.getAllWorkspaceIds();
    const activeId = window.appState.activeWorkspaceId;

    bar.innerHTML = '';
    ids.forEach(id => {
      const ws = window.appState.getWorkspace(id);
      if (!ws) return;
      const tab = document.createElement('button');
      tab.className = 'ws-tab' + (id === activeId ? ' active' : '');
      tab.dataset.wsId = id;
      tab.innerHTML = `<i class="fa-solid fa-${ws.type === 'personal' ? 'house' : ws.type === 'enterprise' ? 'building' : 'layer-group'}"></i>
                       <span>${ws.name}</span>
                       <span class="tab-close" data-close-ws="${id}" title="Delete workspace"><i class="fa-solid fa-xmark"></i></span>`;
      tab.addEventListener('click', (e) => {
        if (e.target.closest('.tab-close')) return;
        _switchWorkspace(id);
      });
      tab.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        _confirmDeleteWorkspace(id, ws.name);
      });
      bar.appendChild(tab);
    });

    // Add / Clone button
    const addBtn = document.createElement('button');
    addBtn.className = 'ws-tab-add-btn';
    addBtn.id = 'btnAddWorkspace';
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Create or Clone';
    addBtn.addEventListener('click', () => _openWorkspaceModal());
    bar.appendChild(addBtn);
  }

  function _switchWorkspace(id) {
    window.appState.setActiveWorkspace(id);
    _renderWorkspaceTabs();
    _renderActivePage();
  }

  function _confirmDeleteWorkspace(id, name) {
    const ids = window.appState.getAllWorkspaceIds();
    if (ids.length <= 1) { _showToast('Cannot delete the last workspace', 'error'); return; }
    if (confirm(`Delete workspace "${name}"? This cannot be undone.`)) {
      window.appState.deleteWorkspace(id);
      _renderWorkspaceTabs();
      _renderActivePage();
      _showToast(`Workspace "${name}" deleted`, 'info');
    }
  }

  // ── WORKSPACE CREATE / CLONE MODAL ────────────────────────────────────────

  function _openWorkspaceModal() {
    let modal = document.getElementById('wsCreateModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'wsCreateModal';
      modal.className = 'ws-modal-overlay active';
      const ids = window.appState.getAllWorkspaceIds();
      const cloneOptions = ids.map(id => {
        const ws = window.appState.getWorkspace(id);
        return `<option value="${id}">${ws?.name || id}</option>`;
      }).join('');

      modal.innerHTML = `
        <div class="ws-modal">
          <h3><i class="fa-solid fa-layer-group"></i> Create or Clone Workspace</h3>
          <div class="studio-form-group">
            <label class="studio-form-label">Workspace Name</label>
            <input class="studio-form-input" id="wsNewName" placeholder="My New Workspace" type="text">
          </div>
          <div class="studio-form-group" style="margin-top:0.75rem;">
            <label class="studio-form-label">Type</label>
            <select class="studio-form-select" id="wsNewType">
              <option value="custom">Custom</option>
              <option value="personal">Personal Twin</option>
              <option value="enterprise">Enterprise Twin</option>
            </select>
          </div>
          <div class="studio-form-group" style="margin-top:0.75rem;">
            <label class="studio-form-label">Clone From (optional)</label>
            <select class="studio-form-select" id="wsCloneSource">
              <option value="">— Start Empty —</option>
              ${cloneOptions}
            </select>
          </div>
          <div class="ws-modal-footer">
            <button class="btn btn-secondary btn-sm" id="btnCancelCreateWs">Cancel</button>
            <button class="btn btn-primary btn-sm" id="btnConfirmCreateWs"><i class="fa-solid fa-plus"></i> Create Workspace</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      document.getElementById('btnCancelCreateWs').addEventListener('click', () => modal.remove());
      document.getElementById('btnConfirmCreateWs').addEventListener('click', () => {
        const name   = document.getElementById('wsNewName').value.trim() || 'New Workspace';
        const type   = document.getElementById('wsNewType').value;
        const cloneId = document.getElementById('wsCloneSource').value;
        if (cloneId) {
          window.appState.cloneWorkspace(cloneId, name);
          _showToast(`Cloned workspace: "${name}"`, 'success');
        } else {
          window.appState.createWorkspace(name, type);
          _showToast(`Created workspace: "${name}"`, 'success');
        }
        modal.remove();
        _renderWorkspaceTabs();
      });
    }
  }

  // ── PAGES SIDEBAR ─────────────────────────────────────────────────────────

  function _renderPagesSidebar() {
    const list = document.getElementById('pagesList');
    if (!list) return;

    const wsId = window.appState.activeWorkspaceId;
    const ws   = window.appState.getActiveWorkspace();
    if (!ws) { list.innerHTML = ''; return; }

    const pages    = ws.pages || [];
    const activeId = ws.activePageId;
    list.innerHTML  = '';

    pages.forEach(page => {
      const item = document.createElement('div');
      item.className = 'page-item' + (page.id === activeId ? ' active' : '');
      item.dataset.pageId = page.id;
      item.innerHTML = `
        <span class="page-icon"><i class="${page.icon || 'fa-solid fa-file'}"></i></span>
        <span class="page-title">${page.title}</span>
        <div class="page-actions">
          <button class="page-action-btn rename-page" title="Rename page" data-pid="${page.id}"><i class="fa-solid fa-pencil"></i></button>
          <button class="page-action-btn del" title="Delete page" data-pid="${page.id}"><i class="fa-solid fa-trash"></i></button>
        </div>`;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.page-actions')) return;
        window.appState.setActivePage(wsId, page.id);
        _renderPagesSidebar();
        _renderComponentCanvas();
      });
      item.querySelector('.rename-page').addEventListener('click', e => {
        e.stopPropagation();
        const newTitle = prompt('Rename page:', page.title);
        if (newTitle?.trim()) {
          window.appState.renamePage(wsId, page.id, newTitle.trim());
          _renderPagesSidebar();
          _renderComponentCanvas();
        }
      });
      item.querySelector('.del').addEventListener('click', e => {
        e.stopPropagation();
        if (pages.length <= 1) { _showToast('Cannot delete the last page', 'error'); return; }
        if (confirm(`Delete page "${page.title}"?`)) {
          window.appState.deletePage(wsId, page.id);
          _renderPagesSidebar();
          _renderComponentCanvas();
          _showToast(`Page "${page.title}" deleted`, 'info');
        }
      });
      list.appendChild(item);
    });

    // Search filter
    const searchInput = document.getElementById('pagesSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        list.querySelectorAll('.page-item').forEach(item => {
          item.style.display = item.querySelector('.page-title').textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }
  }

  // ── COMPONENT CANVAS ──────────────────────────────────────────────────────

  function _renderActivePage() {
    _renderPagesSidebar();
    _renderComponentCanvas();
    _updateCanvasTitle();
  }

  function _updateCanvasTitle() {
    const titleEl = document.getElementById('canvasPageTitle');
    if (!titleEl) return;
    const ws = window.appState.getActiveWorkspace();
    const page = window.appState.getActivePage(ws?.id);
    if (ws && page) {
      titleEl.innerHTML = `<i class="${page.icon || 'fa-solid fa-file'}"></i> ${ws.name} / ${page.title}`;
    }
  }

  function _renderComponentCanvas() {
    _updateCanvasTitle();
    const canvas = document.getElementById('componentGrid');
    const canvasEl = document.getElementById('componentCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';

    const ws   = window.appState.getActiveWorkspace();
    const page = window.appState.getActivePage(ws?.id);

    // Apply layout type classes to canvas
    if (canvasEl) {
      canvasEl.classList.remove('layout-grid-flexible', 'layout-dashboard', 'layout-single-canvas');
      canvasEl.classList.add('layout-' + (page?.layoutType || 'grid-flexible'));
    }
    canvas.classList.remove('grid-dashboard', 'grid-single');
    if (page?.layoutType === 'dashboard') canvas.classList.add('grid-dashboard');
    if (page?.layoutType === 'single-canvas') canvas.classList.add('grid-single');

    if (!page || !page.components || page.components.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'canvas-empty-state comp-span-full';
      empty.innerHTML = `<i class="fa-solid fa-cubes"></i>
                         <div style="font-weight:700;color:var(--text-muted);">No components yet</div>
                         <div style="font-size:0.82rem;">Click "+ Add Component" to get started</div>`;
      canvas.appendChild(empty);
      _appendAddComponentCard(canvas, ws?.id, page?.id);
      return;
    }

    page.components.forEach(comp => {
      const card = _createComponentCard(comp, ws.id, page.id);
      canvas.appendChild(card);
      // Render the component into its body after append
      requestAnimationFrame(() => {
        const renderArea = card.querySelector('.comp-render-area');
        if (renderArea) _renderComponentInArea(renderArea, comp);
      });
    });

    // Add Component button
    _appendAddComponentCard(canvas, ws.id, page.id);
  }

  function _createComponentCard(comp, wsId, pageId) {
    const spanClass = SPAN_CLASS[comp.columnSpan] || 'comp-span-half';
    const card = document.createElement('div');
    card.className = `component-card ${spanClass}`;
    card.dataset.compId = comp.id;

    const domainTagsHtml = (comp.domainTags || []).map(t => `<span class="domain-tag">${t}</span>`).join('');

    card.innerHTML = `
      <div class="component-card-header">
        <div class="component-card-header-left">
          <div class="component-card-title">${comp.title}</div>
          ${comp.subtitle ? `<div class="component-card-subtitle">${comp.subtitle}</div>` : ''}
        </div>
        <div class="component-card-actions">
          <button class="comp-action-btn studio-btn" title="Component Studio" data-comp-id="${comp.id}">
            <i class="fa-solid fa-sliders"></i>
          </button>
          <button class="comp-action-btn" title="Expand (Full Width)" data-expand="${comp.id}">
            <i class="fa-solid fa-expand"></i>
          </button>
          <button class="comp-action-btn delete-btn" title="Remove Component" data-del-comp="${comp.id}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div class="component-card-body">
        <div class="comp-render-area" id="render_${comp.id}"></div>
      </div>
      ${domainTagsHtml ? `<div class="domain-tags">${domainTagsHtml}</div>` : ''}`;

    // Studio button
    card.querySelector('.studio-btn').addEventListener('click', () => {
      window.ComponentStudio.open(wsId, pageId, comp, (updatedComp) => {
        _renderComponentCanvas();
      });
    });

    // Expand button (toggle full/current)
    card.querySelector('[data-expand]').addEventListener('click', () => {
      const isFull = card.classList.contains('comp-span-full');
      card.classList.remove('comp-span-full','comp-span-half','comp-span-two-thirds','comp-span-third');
      card.classList.add(isFull ? 'comp-span-half' : 'comp-span-full');
    });

    // Delete button
    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Remove component "${comp.title}"?`)) {
        window.appState.removeComponent(wsId, pageId, comp.id);
        _renderComponentCanvas();
        _showToast(`Component "${comp.title}" removed`, 'info');
      }
    });

    return card;
  }

  function _renderComponentInArea(area, comp) {
    const renderer = RENDERERS[comp.type]?.();
    if (renderer?.render) {
      try { renderer.render(area, comp); }
      catch(e) { area.innerHTML = `<div style="padding:1rem;color:#ff9100;font-size:0.78rem;">Render error: ${e.message}</div>`; }
    } else {
      area.innerHTML = `<div style="padding:1rem;color:#64748b;font-size:0.82rem;text-align:center;">
        <i class="fa-solid fa-puzzle-piece" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:0.5rem;"></i>
        Component type: <strong>${comp.type}</strong></div>`;
    }
  }

  function _appendAddComponentCard(canvas, wsId, pageId) {
    const btn = document.createElement('button');
    btn.className = 'add-component-card';
    btn.innerHTML = `<div class="add-component-inner">
      <i class="fa-solid fa-plus"></i>
      <span>Add Component</span>
    </div>`;
    btn.addEventListener('click', () => _openAddComponentModal(wsId, pageId));
    canvas.appendChild(btn);
  }

  // ── ADD COMPONENT MODAL ───────────────────────────────────────────────────

  function _bindAddComponentModal() {
    const btn = document.getElementById('btnAddComponent');
    if (btn) btn.addEventListener('click', () => {
      const ws = window.appState.getActiveWorkspace();
      const page = window.appState.getActivePage(ws?.id);
      if (ws && page) _openAddComponentModal(ws.id, page.id);
    });
  }

  function _openAddComponentModal(wsId, pageId) {
    let modal = document.getElementById('addCompModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'addCompModal';
    modal.className = 'ws-modal-overlay active';

    const typesHtml = COMPONENT_TYPES.map(t =>
      `<div class="comp-type-option" data-type="${t.type}" title="${t.label}">
         <i class="fa-solid ${t.icon}"></i>
         <span>${t.label}</span>
       </div>`
    ).join('');

    modal.innerHTML = `
      <div class="ws-modal">
        <h3><i class="fa-solid fa-puzzle-piece"></i> Add Component</h3>
        <div class="studio-form-group">
          <label class="studio-form-label">Component Title</label>
          <input class="studio-form-input" id="newCompTitle" placeholder="My Component" type="text">
        </div>
        <label class="studio-form-label" style="margin-top:0.75rem;display:block;">Choose Type</label>
        <div class="comp-type-grid" id="compTypeGrid">${typesHtml}</div>
        <div class="studio-form-group" style="margin-top:0.75rem;">
          <label class="studio-form-label">Column Span</label>
          <select class="studio-form-select" id="newCompSpan">
            <option value="half">Half Width (Default)</option>
            <option value="full">Full Width</option>
            <option value="two-thirds">Two Thirds</option>
            <option value="third">One Third</option>
          </select>
        </div>
        <div class="ws-modal-footer">
          <button class="btn btn-secondary btn-sm" id="btnCancelAddComp">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btnConfirmAddComp"><i class="fa-solid fa-plus"></i> Add to Page</button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    let selectedType = 'highcharts';
    modal.querySelector('[data-type="highcharts"]')?.classList.add('selected');

    modal.querySelectorAll('.comp-type-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('.comp-type-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedType = opt.dataset.type;
      });
    });

    document.getElementById('btnCancelAddComp').addEventListener('click', () => modal.remove());
    document.getElementById('btnConfirmAddComp').addEventListener('click', () => {
      const title = document.getElementById('newCompTitle').value.trim() || COMPONENT_TYPES.find(t => t.type === selectedType)?.label || 'Component';
      const span  = document.getElementById('newCompSpan').value;
      const def   = COMPONENT_TYPES.find(t => t.type === selectedType) || COMPONENT_TYPES[0];

      window.appState.addComponent(wsId, pageId, {
        type: selectedType,
        title,
        columnSpan: span,
        domainTags: [],
        settings: Object.assign({}, def.defaultSettings),
        data: JSON.parse(JSON.stringify(def.defaultData))
      });

      modal.remove();
      _renderComponentCanvas();
      _showToast(`"${title}" added!`, 'success');
    });
  }

  // ── ADD PAGE BUTTON ───────────────────────────────────────────────────────

  const PAGE_ICON_CHOICES = [
    'fa-solid fa-file', 'fa-solid fa-chart-line', 'fa-solid fa-calendar-days',
    'fa-solid fa-map-location-dot', 'fa-solid fa-diagram-project', 'fa-solid fa-table',
    'fa-solid fa-list-check', 'fa-solid fa-bars-progress', 'fa-solid fa-bullseye',
    'fa-solid fa-triangle-exclamation', 'fa-solid fa-chart-simple', 'fa-solid fa-cube',
    'fa-solid fa-house', 'fa-solid fa-building', 'fa-solid fa-users', 'fa-solid fa-server',
    'fa-solid fa-robot', 'fa-solid fa-shield-halved'
  ];

  const LAYOUT_TYPES = [
    { id: 'grid-flexible',  label: 'Flexible Grid',  icon: 'fa-grip' },
    { id: 'dashboard',      label: 'Dashboard',      icon: 'fa-gauge-high' },
    { id: 'single-canvas',  label: 'Single Canvas',  icon: 'fa-maximize' }
  ];

  function _openCreatePageModal() {
    const existingModal = document.getElementById('createPageModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'createPageModal';
    modal.className = 'ws-modal-overlay active';

    const iconsHtml = PAGE_ICON_CHOICES.map((ic, i) =>
      `<div class="page-icon-option ${i === 0 ? 'selected' : ''}" data-icon="${ic}" title="${ic.replace('fa-solid fa-','')}">
        <i class="${ic}"></i>
      </div>`).join('');

    const layoutsHtml = LAYOUT_TYPES.map((lt, i) =>
      `<div class="layout-type-option ${i === 0 ? 'selected' : ''}" data-layout="${lt.id}">
        <i class="fa-solid ${lt.icon}"></i>
        <span>${lt.label}</span>
      </div>`).join('');

    modal.innerHTML = `
      <div class="ws-modal">
        <h3><i class="fa-solid fa-file-circle-plus"></i> Create New Page</h3>
        <div class="studio-form-group">
          <label class="studio-form-label">Page Title</label>
          <input class="studio-form-input" id="newPageTitle" placeholder="e.g. Executive Overview" type="text" autofocus>
        </div>
        <label class="studio-form-label" style="margin-top:0.85rem;display:block;">Choose Icon</label>
        <div class="page-icon-grid" id="pageIconGrid">${iconsHtml}</div>
        <label class="studio-form-label" style="margin-top:0.85rem;display:block;">Layout Type</label>
        <div class="layout-type-grid" id="layoutTypeGrid">${layoutsHtml}</div>
        <div class="ws-modal-footer">
          <button class="btn btn-secondary btn-sm" id="btnCancelCreatePage"><i class="fa-solid fa-xmark"></i> Cancel</button>
          <button class="btn btn-primary btn-sm" id="btnConfirmCreatePage"><i class="fa-solid fa-plus"></i> Create Page</button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    let selectedIcon = PAGE_ICON_CHOICES[0];
    let selectedLayout = LAYOUT_TYPES[0].id;

    modal.querySelectorAll('.page-icon-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('.page-icon-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedIcon = opt.dataset.icon;
      });
    });

    modal.querySelectorAll('.layout-type-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('.layout-type-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedLayout = opt.dataset.layout;
      });
    });

    document.getElementById('btnCancelCreatePage').addEventListener('click', () => modal.remove());
    const titleInput = document.getElementById('newPageTitle');
    titleInput.focus();
    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btnConfirmCreatePage').click();
    });

    document.getElementById('btnConfirmCreatePage').addEventListener('click', () => {
      const title = titleInput.value.trim();
      if (!title) {
        _showToast('Please enter a page title', 'error');
        titleInput.focus();
        return;
      }
      const wsId = window.appState.activeWorkspaceId;
      const page = window.appState.createPage(wsId, title, selectedIcon);
      if (page) {
        const ws = window.appState.getWorkspace(wsId);
        if (ws) {
          ws.pages = ws.pages || [];
          const last = ws.pages[ws.pages.length - 1];
          if (last) { last.layoutType = selectedLayout; window.appState.saveWorkspace(wsId, ws); }
        }
        window.appState.setActivePage(wsId, page.id);
      }
      _renderPagesSidebar();
      _renderComponentCanvas();
      modal.remove();
      _showToast(`Page "${title}" created!`, 'success');
    });
  }

  function _openPageSettingsModal() {
    const ws = window.appState.getActiveWorkspace();
    if (!ws) return;
    const page = window.appState.getActivePage(ws.id);
    if (!page) return;

    const existingModal = document.getElementById('pageSettingsModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'pageSettingsModal';
    modal.className = 'ws-modal-overlay active';

    const iconsHtml = PAGE_ICON_CHOICES.map(ic =>
      `<div class="page-icon-option ${page.icon === ic ? 'selected' : ''}" data-icon="${ic}">
        <i class="${ic}"></i>
      </div>`).join('');

    const layoutsHtml = LAYOUT_TYPES.map(lt =>
      `<div class="layout-type-option ${(page.layoutType || 'grid-flexible') === lt.id ? 'selected' : ''}" data-layout="${lt.id}">
        <i class="fa-solid ${lt.icon}"></i>
        <span>${lt.label}</span>
      </div>`).join('');

    const compCount = (page.components || []).length;

    modal.innerHTML = `
      <div class="ws-modal">
        <h3><i class="fa-solid fa-gear"></i> Page Settings</h3>
        <div class="studio-form-group">
          <label class="studio-form-label">Page Title</label>
          <input class="studio-form-input" id="pageSettingsTitle" value="${page.title.replace(/"/g,'&quot;')}" type="text">
        </div>
        <label class="studio-form-label" style="margin-top:0.85rem;display:block;">Page Icon</label>
        <div class="page-icon-grid" id="pageIconGridSettings">${iconsHtml}</div>
        <label class="studio-form-label" style="margin-top:0.85rem;display:block;">Layout Type</label>
        <div class="layout-type-grid" id="layoutTypeGridSettings">${layoutsHtml}</div>
        <div style="margin-top:0.85rem;padding:0.6rem 0.8rem;border-radius:8px;background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);font-size:0.8rem;color:var(--text-muted);">
          <i class="fa-solid fa-layer-group" style="color:var(--accent-gold);margin-right:0.35rem;"></i>
          <strong style="color:var(--text-main);">Components:</strong> ${compCount}
          &nbsp;&nbsp;•&nbsp;&nbsp; <strong style="color:var(--text-main);">Workspace:</strong> ${ws.name}
        </div>
        <div class="ws-modal-footer">
          <button class="btn btn-secondary btn-sm" id="btnCancelPageSettings"><i class="fa-solid fa-xmark"></i> Close</button>
          <button class="btn btn-primary btn-sm" id="btnSavePageSettings"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    let selectedIcon = page.icon || PAGE_ICON_CHOICES[0];
    let selectedLayout = page.layoutType || 'grid-flexible';

    modal.querySelectorAll('#pageIconGridSettings .page-icon-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('#pageIconGridSettings .page-icon-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedIcon = opt.dataset.icon;
      });
    });

    modal.querySelectorAll('#layoutTypeGridSettings .layout-type-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('#layoutTypeGridSettings .layout-type-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedLayout = opt.dataset.layout;
      });
    });

    document.getElementById('btnCancelPageSettings').addEventListener('click', () => modal.remove());
    document.getElementById('btnSavePageSettings').addEventListener('click', () => {
      const newTitle = document.getElementById('pageSettingsTitle').value.trim();
      if (!newTitle) { _showToast('Page title cannot be empty', 'error'); return; }
      const wsId = ws.id;
      const pageId = page.id;
      window.appState.renamePage(wsId, pageId, newTitle);
      const latest = window.appState.getWorkspace(wsId);
      const target = (latest?.pages || []).find(p => p.id === pageId);
      if (target) {
        target.icon = selectedIcon;
        target.layoutType = selectedLayout;
        window.appState.saveWorkspace(wsId, latest);
      }
      _renderPagesSidebar();
      _renderComponentCanvas();
      modal.remove();
      _showToast('Page settings saved', 'success');
    });
  }

  function _bindWorkspaceActions() {
    // Add Page button (opens modal)
    const addPageBtn = document.getElementById('btnAddPage');
    if (addPageBtn) addPageBtn.addEventListener('click', _openCreatePageModal);

    // Page Settings button
    const pageSettingsBtn = document.getElementById('btnPageSettings');
    if (pageSettingsBtn) pageSettingsBtn.addEventListener('click', _openPageSettingsModal);

    // Payment SMS intake and cost reconciliation
    const readSmsBtn = document.getElementById('btnReadPaymentSms');
    if (readSmsBtn) readSmsBtn.addEventListener('click', () => {
      const wsId = window.appState.activeWorkspaceId;
      const rawRecords = window.appState.getPaymentSmsRecords(wsId);
      const records = window.PaymentSmsIntake ? window.PaymentSmsIntake.readPaymentMessages(rawRecords) : rawRecords;
      window.appState.setPaymentSmsRecords(wsId, records);
      const intoText = records.length ? `${records.length} payment SMS records loaded.` : 'No payment SMS records available for this workspace.';
      _showToast(intoText, records.length ? 'success' : 'info');
    });

    const reconcileBtn = document.getElementById('btnReconcileCosts');
    if (reconcileBtn) reconcileBtn.addEventListener('click', () => {
      const wsId = window.appState.activeWorkspaceId;
      const paymentRecords = window.appState.getPaymentSmsRecords(wsId);
      const items = window.PaymentSmsIntake ? window.PaymentSmsIntake.readPaymentMessages(paymentRecords) : paymentRecords;
      window.appState.setPaymentSmsRecords(wsId, items);
      const added = window.appState.reconcilePaymentSmsToCostTable(wsId);
      _showToast(added.length ? `Matched ${added.length} SMS payment rows into the cost ledger.` : 'No new SMS costs to reconcile.', added.length ? 'success' : 'info');
      if (typeof refreshWorkspaceView === 'function') refreshWorkspaceView();
    });

    // Export button
    const exportBtn = document.getElementById('btnExportWs');
    if (exportBtn) exportBtn.addEventListener('click', () => {
      window.appState.exportWorkspaceJSON();
      _showToast('Workspace exported!', 'success');
    });

    // Global settings modal
    const settingsBtn = document.getElementById('btnGlobalSettings');
    if (settingsBtn) settingsBtn.addEventListener('click', _openGlobalSettingsModal);
  }

  function refreshWorkspaceView() {
    _renderWorkspaceTabs();
    _renderActivePage();
  }

  function _openGlobalSettingsModal() {
    const existing = document.getElementById('globalSettingsModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'globalSettingsModal';
    modal.className = 'ws-modal-overlay active';

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const wsIds = window.appState.getAllWorkspaceIds();
    const wsCount = wsIds.length;
    let totalPages = 0;
    let totalComponents = 0;
    wsIds.forEach(id => {
      const ws = window.appState.getWorkspace(id);
      if (ws) {
        totalPages += (ws.pages || []).length;
        (ws.pages || []).forEach(p => totalComponents += (p.components || []).length);
      }
    });

    modal.innerHTML = `
      <div class="ws-modal">
        <h3><i class="fa-solid fa-sliders"></i> Global Settings</h3>
        <div class="studio-form-group">
          <label class="studio-form-label">Appearance Theme</label>
          <div class="layout-type-grid" id="gsThemeGrid">
            <div class="layout-type-option ${currentTheme === 'dark' ? 'selected' : ''}" data-theme="dark">
              <i class="fa-solid fa-moon"></i><span>Dark Mode</span>
            </div>
            <div class="layout-type-option ${currentTheme === 'light' ? 'selected' : ''}" data-theme="light">
              <i class="fa-solid fa-sun"></i><span>Light Mode</span>
            </div>
            <div class="layout-type-option" id="gsThemeAuto" style="opacity:0.7;">
              <i class="fa-solid fa-circle-half-stroke"></i><span>Auto Install</span>
            </div>
          </div>
        </div>

        <div class="studio-form-group" style="margin-top:0.85rem;">
          <label class="studio-form-label">Install & Offline PWA</label>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
            <button class="btn btn-sm btn-primary" id="gsBtnInstall"><i class="fa-solid fa-download"></i> Download &amp; Install App</button>
            <span class="pwa-install-hint" id="gsInstallHint" style="display:none;"><i class="fa-solid fa-circle-check"></i> Install when prompt appears</span>
          </div>
          <div style="margin-top:0.4rem;font-size:0.75rem;color:var(--text-muted);">
            Installs to desktop/home screen — runs 100% offline with cached vendor assets.
          </div>
        </div>

        <div style="margin-top:0.85rem;padding:0.75rem 0.9rem;border-radius:8px;background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);">
          <div style="font-weight:700;color:var(--accent-gold);margin-bottom:0.35rem;"><i class="fa-solid fa-database"></i> Local Storage Stats</div>
          <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.7;">
            <div><strong style="color:var(--text-main);">Workspaces:</strong> ${wsCount}</div>
            <div><strong style="color:var(--text-main);">Total Pages:</strong> ${totalPages}</div>
            <div><strong style="color:var(--text-main);">Total Components:</strong> ${totalComponents}</div>
          </div>
        </div>

        <div class="studio-form-group" style="margin-top:0.85rem;">
          <label class="studio-form-label">Danger Zone</label>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" id="gsClearAllData"><i class="fa-solid fa-trash-can"></i> Reset All Workspaces</button>
          </div>
        </div>

        <div class="ws-modal-footer">
          <button class="btn btn-secondary btn-sm" id="btnCloseGlobalSettings"><i class="fa-solid fa-xmark"></i> Close</button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    modal.querySelectorAll('#gsThemeGrid .layout-type-option[data-theme]').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('#gsThemeGrid .layout-type-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const theme = opt.dataset.theme;
        if (window.ThemeManager?.applyTheme) window.ThemeManager.applyTheme(theme);
      });
    });

    document.getElementById('gsBtnInstall').addEventListener('click', () => {
      const hint = document.getElementById('gsInstallHint');
      if (hint) hint.style.display = 'inline-flex';
      const navBtn = document.getElementById('btnInstallPwaNav');
      const wsBtn  = document.getElementById('btnInstallPwaWs');
      if (navBtn && navBtn.style.display !== 'none') navBtn.click();
      else if (wsBtn && wsBtn.style.display !== 'none') wsBtn.click();
      else {
        _showToast('PWA install not available in this environment. Use Chrome/Edge and serve over HTTP.', 'info');
      }
    });

    document.getElementById('gsClearAllData').addEventListener('click', () => {
      if (confirm('Reset ALL workspaces, pages, and components back to defaults? This CANNOT be undone.')) {
        const prefix = 'orgstrata_';
        Object.keys(localStorage).filter(k => k.startsWith(prefix)).forEach(k => localStorage.removeItem(k));
        location.reload();
      }
    });

    document.getElementById('btnCloseGlobalSettings').addEventListener('click', () => modal.remove());
  }

  // ── IMPORT MODAL ──────────────────────────────────────────────────────────

  function _bindImportModal() {
    const importBtn = document.getElementById('btnImportJsonModal');
    const overlay   = document.getElementById('importModalOverlay');
    const closeBtn  = document.getElementById('btnCloseImportModal');
    const submitBtn = document.getElementById('btnSubmitImportJson');

    if (importBtn) importBtn.addEventListener('click', () => overlay?.classList.add('active'));
    if (closeBtn)  closeBtn.addEventListener('click',  () => overlay?.classList.remove('active'));
    if (submitBtn) submitBtn.addEventListener('click',  () => {
      const json = document.getElementById('jsonImportTextArea').value;
      const result = window.appState.importWorkspaceJSON(json);
      if (result.success) {
        overlay.classList.remove('active');
        _renderWorkspaceTabs();
        _renderActivePage();
        _showToast('Workspace imported!', 'success');
      } else {
        _showToast('Import failed: ' + result.error, 'error');
      }
    });
  }

  // ── SIGNALR MOCK TICKER ───────────────────────────────────────────────────

  function _initSignalR() {
    const events = [
      'SAP S/4HANA License expiring in 60 days — Action Required',
      'Nvidia DGX cluster utilization at 94% — Scale threshold reached',
      'Gartner AI Trend: 73% enterprises deploying Digital Twins by 2027',
      'Oracle Cloud OCI uptime: 99.99% SLA achieved Q3 2026',
      'SOC Threat Intelligence: 2 new CVE advisories from CERT — Severity: High',
      'Family Passport Renewal: 90 days remaining — Gov Portal Alert',
      'Reuters: OPEC forecasts 3.8% GDP growth for GCC region 2026',
      'Microsoft M365 Co-Pilot integration milestone: 86% adoption across 200 seats',
      'FullCalendar event: Child 1 University enrollment deadline in 14 days',
      'BPMN Value Chain: AI Production Schedule running 12% ahead of forecast'
    ];

    let idx = 0;
    const tickerEl = document.getElementById('signalTickerText');
    if (tickerEl) {
      setInterval(() => {
        tickerEl.textContent = events[idx % events.length];
        tickerEl.style.color = 'var(--text-muted)';
        setTimeout(() => { if(tickerEl) tickerEl.style.color = 'var(--accent-gold)'; }, 300);
        setTimeout(() => { if(tickerEl) tickerEl.style.color = 'var(--text-muted)'; }, 900);
        idx++;
      }, 4500);
    }

    // Simulate signal button
    const simBtn = document.getElementById('btnSimulateSignal');
    if (simBtn) simBtn.addEventListener('click', () => {
      if (tickerEl) {
        tickerEl.textContent = `🔴 LIVE SIGNAL: ${events[Math.floor(Math.random() * events.length)]}`;
        tickerEl.style.color = 'var(--accent-orange)';
        setTimeout(() => { if(tickerEl) tickerEl.style.color = 'var(--text-muted)'; }, 5000);
      }
      _showToast('Signal simulated!', 'info');
    });
  }

  // ── UPDATE COMPONENT DATA (called by Kanban inline add) ───────────────────

  function updateComponentData(comp, newData) {
    const ws = window.appState.getActiveWorkspace();
    const page = window.appState.getActivePage(ws?.id);
    if (ws && page) {
      window.appState.updateComponent(ws.id, page.id, comp.id, { data: newData });
    }
  }

  // ── TOAST ─────────────────────────────────────────────────────────────────

  function _showToast(msg, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity 0.3s'; setTimeout(()=>toast.remove(),300); }, 3000);
  }

  // ── EXPOSE ────────────────────────────────────────────────────────────────
  window.PaymentSmsIntake = PaymentSmsIntake;
  return { init, launchApp, updateComponentData, refreshWorkspaceView };

})();

// ── BOOT ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.AppOrchestrator.init();
});
