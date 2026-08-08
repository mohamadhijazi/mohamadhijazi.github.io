/* ==========================================================================
   DIGITAL TWIN WORKSPACE — STATE MANAGEMENT ENGINE v2.2.0
   Full CRUD: Workspaces, Pages, Components
   Local-First Sovereignty via LocalStorage Partitioning
   Author: Mohammad Hijazi
   ========================================================================== */

const SCHEMA_VERSION = "2.3.0";
const STORAGE_PREFIX  = "orgstrata_ws_";
const ACTIVE_WS_KEY   = "orgstrata_active_ws";
const WS_INDEX_KEY    = "orgstrata_ws_index"; // Stores list of all workspace IDs
const TAG_DEFINITIONS = [
  { key: 'webinar', label: 'Webinars', business: 'Marketing & Events', components: ['calendar','jqtable','kanban'] },
  { key: 'renewal', label: 'Renewals', business: 'Finance & Operations', components: ['calendar','jqtable','kanban'] },
  { key: 'compliance', label: 'Compliance', business: 'Risk & Governance', components: ['calendar','jqtable','risk','kanban'] },
  { key: 'security', label: 'Security', business: 'Technology & Risk', components: ['calendar','jqtable','risk','map','kanban'] },
  { key: 'travel', label: 'Travel', business: 'Operations', components: ['calendar','map','jqtable','kanban'] },
  { key: 'cloud', label: 'Cloud', business: 'Technology', components: ['calendar','jqtable','map'] },
  { key: 'saaS', label: 'SaaS', business: 'Applications', components: ['jqtable','calendar','kanban'] },
  { key: 'ai', label: 'AI', business: 'Technology', components: ['calendar','jqtable','kanban','highcharts'] },
  { key: 'operations', label: 'Operations', business: 'Operations', components: ['calendar','map','jqtable','kanban','highcharts'] },
  { key: 'finance', label: 'Finance', business: 'Finance', components: ['calendar','jqtable','highcharts','kanban'] },
  { key: 'strategy', label: 'Strategy', business: 'Leadership', components: ['calendar','jqtable','kanban','highcharts'] },
  { key: 'logistics', label: 'Logistics', business: 'Operations', components: ['calendar','map','jqtable','kanban'] }
];
const PAYMENT_SMS_SEED = [
  {
    sender: 'STC',
    body: 'Your payment of SAR 399.00 to STC Telecom was successful. Ref: 234861.',
    receivedAt: '2026-08-05T19:40:00Z',
    merchant: 'STC Telecom',
    amount: 399,
    currency: 'SAR',
    paymentType: 'bank',
    status: 'matched',
    notes: 'Telecom service renewal'
  },
  {
    sender: 'AWS',
    body: 'Your card ending 4242 was charged USD 1,280.20 for Amazon Web Services.',
    receivedAt: '2026-08-04T12:05:00Z',
    merchant: 'Amazon Web Services',
    amount: 1280.2,
    currency: 'USD',
    paymentType: 'card',
    status: 'matched',
    notes: 'Cloud infrastructure'
  },
  {
    sender: 'Oracle',
    body: 'Invoice paid: USD 84,500.00 for Oracle Cloud Infrastructure. Ref: OCI-8142',
    receivedAt: '2026-08-03T09:15:00Z',
    merchant: 'Oracle Cloud Infrastructure',
    amount: 84500,
    currency: 'USD',
    paymentType: 'bank',
    status: 'matched',
    notes: 'IaaS renewal'
  },
  {
    sender: 'NAYAT',
    body: 'Transaction of AED 1,250.00 to NAYAT Home was approved.',
    receivedAt: '2026-08-02T14:10:00Z',
    merchant: 'NAYAT Home',
    amount: 1250,
    currency: 'AED',
    paymentType: 'card',
    status: 'review',
    notes: 'Facilities purchase'
  }
];

class WorkspaceStateManager {

  constructor() {
    this._initIndex();
    this.activeWorkspaceId = localStorage.getItem(ACTIVE_WS_KEY) || "family_of_4";
    this._seedDefaults();
  }

  // ─── PRIVATE: Index of all workspace IDs ─────────────────────────────────

  _initIndex() {
    if (!localStorage.getItem(WS_INDEX_KEY)) {
      localStorage.setItem(WS_INDEX_KEY, JSON.stringify(["family_of_4","company_of_200"]));
    }
  }

  _getIndex() {
    try { return JSON.parse(localStorage.getItem(WS_INDEX_KEY)) || []; }
    catch { return []; }
  }

  _saveIndex(ids) {
    localStorage.setItem(WS_INDEX_KEY, JSON.stringify(ids));
  }

  _addToIndex(id) {
    const ids = this._getIndex();
    if (!ids.includes(id)) { ids.push(id); this._saveIndex(ids); }
  }

  _removeFromIndex(id) {
    const ids = this._getIndex().filter(i => i !== id);
    this._saveIndex(ids);
  }

  // ─── PRIVATE: Seed default workspaces ────────────────────────────────────

  _seedDefaults() {
    ["family_of_4", "company_of_200"].forEach(id => {
      if (!localStorage.getItem(STORAGE_PREFIX + id)) {
        this._saveWorkspaceRaw(id, MOCK_DATASETS[id]);
      }
      const ws = this.getWorkspace(id);
      if (ws && !ws.paymentSmsRecords) {
        ws.paymentSmsRecords = id === 'company_of_200' ? PAYMENT_SMS_SEED.map(item => ({ ...item })) : [];
        this.saveWorkspace(id, ws);
      }
    });
  }

  // ─── WORKSPACE READ / WRITE ───────────────────────────────────────────────

  getAllWorkspaceIds() {
    return this._getIndex();
  }

  getWorkspace(id) {
    id = id || this.activeWorkspaceId;
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return null;
    try {
      const ws = JSON.parse(raw);
      const migratedTags = this._normalizeComponentTags(ws);
      // Schema migration
      if (ws.schemaVersion !== SCHEMA_VERSION || migratedTags) {
        ws.schemaVersion = SCHEMA_VERSION;
        this._saveWorkspaceRaw(id, ws);
      }
      return ws;
    } catch(e) {
      console.error("Corrupted workspace data:", e);
      return null;
    }
  }

  getActiveWorkspace() {
    return this.getWorkspace(this.activeWorkspaceId);
  }

  _normalizeComponentTags(workspace) {
    if (!workspace || !Array.isArray(workspace.pages)) return false;
    const defaultsByType = {
      calendar: ['webinar', 'renewal', 'strategy', 'operations'],
      jqtable: ['finance', 'operations', 'applications', 'webinar'],
      map: ['operations', 'logistics'],
      kanban: ['strategy', 'operations', 'webinar'],
      highcharts: ['finance', 'strategy', 'operations'],
      risk: ['security', 'compliance'],
      capabilities: ['strategy', 'capability'],
      maturity: ['strategy'],
      bpmn: ['operations', 'strategy'],
      "3dspatial": ['operations', 'logistics'],
    };

    let changed = false;
    workspace.pages.forEach(page => {
      (page.components || []).forEach(comp => {
        const defaults = defaultsByType[comp.type] || [];
        const tags = Array.isArray(comp.domainTags) ? comp.domainTags.map(tag => String(tag).trim()).filter(Boolean) : [];
        const merged = [...new Set([...tags, ...defaults])];
        if (JSON.stringify(tags) !== JSON.stringify(merged)) {
          comp.domainTags = merged;
          changed = true;
        }
      });
    });
    return changed;
  }

  normalizeTag(tag) {
    if (!tag && tag !== 0) return '';
    return String(tag)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+s\b/g, '')
      .replace(/\s+$/, '')
      .replace(/\b(webinars?|events?)\b/g, 'event')
      .replace(/\s+/g, '');
  }

  getTagDefinitions() {
    return TAG_DEFINITIONS.map(def => ({ ...def }));
  }

  getTagsForComponentType(componentType) {
    const type = String(componentType || '').toLowerCase();
    return this.getTagDefinitions().filter(def => (def.components || []).includes(type));
  }

  matchesComponentTags(component, signalTags = []) {
    if (!component) return false;
    const catalogTags = this.getTagsForComponentType(component.type).map(tag => this.normalizeTag(tag.key));
    const componentTags = Array.from(new Set([
      ...((component.domainTags || []).map(tag => this.normalizeTag(tag)).filter(Boolean)),
      ...catalogTags
    ]));
    const eventTags = (signalTags || []).map(tag => this.normalizeTag(tag)).filter(Boolean);
    if (!eventTags.length) return false;
    return eventTags.some(tag => componentTags.includes(tag) || componentTags.some(existing => existing === tag || existing.startsWith(tag) || tag.startsWith(existing)));
  }

  applySignalEventToWorkspace(eventPayload = {}) {
    const ws = this.getWorkspace(this.activeWorkspaceId);
    if (!ws) return [];
    const signalTags = Array.isArray(eventPayload.tags) ? eventPayload.tags : [];
    const added = [];

    (ws.pages || []).forEach(page => {
      (page.components || []).forEach(comp => {
        if (!this.matchesComponentTags(comp, signalTags)) return;
        const result = this._applySignalEventToComponent(comp, eventPayload);
        if (result) added.push({ componentId: comp.id, pageId: page.id, event: result });
      });
    });

    if (added.length) this.saveWorkspace(ws.id, ws);
    return added;
  }

  _applySignalEventToComponent(comp, eventPayload) {
    const event = {
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: eventPayload.title || 'Signal Event',
      source: eventPayload.source || 'SignalR',
      start: eventPayload.date_start || new Date().toISOString(),
      end: eventPayload.date_end || undefined,
      tags: Array.isArray(eventPayload.tags) ? eventPayload.tags : [],
      color: '#00f2fe'
    };

    const normalizedTags = event.tags.map(tag => this.normalizeTag(tag));
    const matchesTag = normalizedTags.some(tag => (comp.domainTags || []).map(item => this.normalizeTag(item)).includes(tag));
    if (!matchesTag) return null;

    const data = comp.data || {};

    if (comp.type === 'calendar') {
      const list = Array.isArray(data.events) ? data.events : [];
      const duplicate = list.some(item => item.title === event.title && item.start === event.start);
      if (duplicate) return null;
      data.events = [...list, {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.color,
        tags: event.tags,
        source: event.source,
        extendedProps: { tags: event.tags }
      }];
      comp.data = data;
      return event;
    }

    if (comp.type === 'jqtable') {
      const columns = Array.isArray(data.columns) ? data.columns : ['Tag', 'Title', 'Source', 'Date', 'Status'];
      if (!data.columns && columns.length) data.columns = columns;
      const list = Array.isArray(data.rows) ? data.rows : [];
      const row = [event.tags[0] || 'signal', event.title, event.source || 'SignalR', event.start.slice(0, 10), 'New'];
      const duplicate = list.some(item => item[1] === event.title && item[2] === event.source);
      if (duplicate) return null;
      data.rows = [...list, row];
      comp.data = data;
      return event;
    }

    if (comp.type === 'kanban') {
      const tasks = Array.isArray(data.tasks) ? data.tasks : [];
      const duplicate = tasks.some(item => item.title === event.title);
      if (duplicate) return null;
      data.tasks = [...tasks, { id: event.id, title: event.title, column: 'backlog', priority: 'Medium', tags: event.tags }];
      comp.data = data;
      return event;
    }

    if (comp.type === 'map') {
      if (!data.markers || !Array.isArray(data.markers)) return null;
      const marker = { name: event.title, lat: (data.markers[0]?.lat ?? 24.7136), lng: (data.markers[0]?.lng ?? 46.6753), type: 'Signal', status: 'Live', color: '#00f2fe', tags: event.tags };
      data.markers = [...data.markers, marker];
      comp.data = data;
      return event;
    }

    if (comp.type === 'risk') {
      if (!data.risks || !Array.isArray(data.risks)) return null;
      data.risks = [...data.risks, { name: event.title, probability: 2, impact: 3, owner: 'SignalR', status: 'Open', tags: event.tags }];
      comp.data = data;
      return event;
    }

    return null;
  }

  _saveWorkspaceRaw(id, data) {
    data.id = id;
    data.schemaVersion = SCHEMA_VERSION;
    data.lastUpdated = new Date().toISOString();
    if (!data.pages) data.pages = [];
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(data));
    this._addToIndex(id);
  }

  saveWorkspace(id, data) {
    this._saveWorkspaceRaw(id || data.id, data);
    this._emit('workspaceUpdated', { id });
  }

  setActiveWorkspace(id) {
    this.activeWorkspaceId = id;
    localStorage.setItem(ACTIVE_WS_KEY, id);
    this._emit('activeWorkspaceChanged', { id });
  }

  // ─── WORKSPACE CRUD ───────────────────────────────────────────────────────

  createWorkspace(name, type = 'custom') {
    const id = `ws_${Date.now()}`;
    const ws = {
      id,
      name: name || `New Workspace`,
      type,
      description: '',
      activePageId: '',
      pages: []
    };
    this._saveWorkspaceRaw(id, ws);
    this._emit('workspaceCreated', { id, ws });
    return ws;
  }

  cloneWorkspace(sourceId, newName) {
    const source = this.getWorkspace(sourceId);
    if (!source) return null;
    const id = `ws_clone_${Date.now()}`;
    const clone = JSON.parse(JSON.stringify(source));
    clone.id = id;
    clone.name = newName || `${source.name} (Clone)`;
    clone.isCloned = true;
    clone.clonedFromId = sourceId;
    // Re-assign all IDs in clone to avoid collisions
    clone.pages = (clone.pages || []).map(p => {
      const newPid = `p_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
      p.id = newPid;
      p.components = (p.components || []).map(c => {
        c.id = `c_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
        return c;
      });
      return p;
    });
    clone.activePageId = clone.pages[0]?.id || '';
    this._saveWorkspaceRaw(id, clone);
    this._emit('workspaceCreated', { id, ws: clone });
    return clone;
  }

  deleteWorkspace(id) {
    localStorage.removeItem(STORAGE_PREFIX + id);
    this._removeFromIndex(id);
    if (this.activeWorkspaceId === id) {
      const remaining = this._getIndex();
      const fallback = remaining[0] || 'family_of_4';
      this.setActiveWorkspace(fallback);
    }
    this._emit('workspaceDeleted', { id });
  }

  renameWorkspace(id, newName) {
    const ws = this.getWorkspace(id);
    if (!ws) return;
    ws.name = newName;
    this.saveWorkspace(id, ws);
  }

  // ─── PAGE CRUD ────────────────────────────────────────────────────────────

  getPages(workspaceId) {
    const ws = this.getWorkspace(workspaceId || this.activeWorkspaceId);
    return ws ? (ws.pages || []) : [];
  }

  createPage(workspaceId, title, icon) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws) return null;
    const id = `page_${Date.now()}`;
    const page = {
      id,
      title: title || 'New Page',
      icon: icon || 'fa-solid fa-file',
      layoutType: 'grid-flexible',
      components: []
    };
    ws.pages = ws.pages || [];
    ws.pages.push(page);
    if (!ws.activePageId) ws.activePageId = id;
    this.saveWorkspace(workspaceId, ws);
    this._emit('pageCreated', { workspaceId, page });
    return page;
  }

  deletePage(workspaceId, pageId) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws) return;
    ws.pages = (ws.pages || []).filter(p => p.id !== pageId);
    if (ws.activePageId === pageId) {
      ws.activePageId = ws.pages[0]?.id || '';
    }
    this.saveWorkspace(workspaceId, ws);
    this._emit('pageDeleted', { workspaceId, pageId });
  }

  renamePage(workspaceId, pageId, newTitle) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws) return;
    const page = (ws.pages||[]).find(p => p.id === pageId);
    if (page) { page.title = newTitle; this.saveWorkspace(workspaceId, ws); }
  }

  setActivePage(workspaceId, pageId) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws) return;
    ws.activePageId = pageId;
    this.saveWorkspace(workspaceId, ws);
    this._emit('activePageChanged', { workspaceId, pageId });
  }

  getActivePage(workspaceId) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws || !ws.pages) return null;
    return ws.pages.find(p => p.id === ws.activePageId) || ws.pages[0] || null;
  }

  getPaymentSmsRecords(workspaceId) {
    const ws = this.getWorkspace(workspaceId || this.activeWorkspaceId);
    if (!ws) return [];
    if (!ws.paymentSmsRecords) ws.paymentSmsRecords = [];
    return ws.paymentSmsRecords;
  }

  setPaymentSmsRecords(workspaceId, records) {
    const ws = this.getWorkspace(workspaceId || this.activeWorkspaceId);
    if (!ws) return [];
    ws.paymentSmsRecords = Array.isArray(records) ? records : [];
    this.saveWorkspace(workspaceId || this.activeWorkspaceId, ws);
    return ws.paymentSmsRecords;
  }

  reconcilePaymentSmsToCostTable(workspaceId) {
    const ws = this.getWorkspace(workspaceId || this.activeWorkspaceId);
    if (!ws) return [];

    const records = this.getPaymentSmsRecords(ws.id);
    const categoryMap = [
      { keywords: ['oracle', 'sap', 'microsoft', 'aws', 'amazon', 'salesforce', 'nvidia', 'cloud', 'license', 'software'], category: 'Software & SaaS' },
      { keywords: ['stc', 'telecom', 'internet', 'fiber', 'zain', 'du', 'mobily'], category: 'Telecom & Connectivity' },
      { keywords: ['nayat', 'home', 'furniture', 'office', 'facilities'], category: 'Facilities & Office' },
      { keywords: ['visa', 'bank', 'transfer', 'payment'], category: 'Payment Processing' }
    ];

    const costTable = (ws.pages || []).flatMap(page => page.components || []).find(comp =>
      comp.type === 'jqtable' && /cost management|payments reconciliation|finance/i.test(comp.title || '')
    );

    if (!costTable) return records;

    const existingRows = Array.isArray(costTable.data?.rows) ? costTable.data.rows.map(row => row.slice()) : [];
    const seen = new Set(existingRows.map(row => `${row[7] || ''}|${row[2] || ''}|${row[3] || ''}`));
    const normalizedRows = [];

    records.forEach(record => {
      const lowerBody = `${record.sender || ''} ${record.body || ''}`.toLowerCase();
      const category = (categoryMap.find(entry =>
        entry.keywords.some(keyword => lowerBody.includes(keyword))
      ) || { category: 'General Expense' }).category;

      const key = `${record.sender || ''}|${record.merchant || ''}|${record.amount || 0}`;
      if (seen.has(key)) return;

      const row = [
        category,
        record.merchant || record.sender || 'Unknown Vendor',
        record.notes || `Payment via ${record.paymentType || 'unknown'}`,
        Number(record.amount || 0).toFixed(2),
        record.currency || 'USD',
        new Date(record.receivedAt || Date.now()).toISOString().slice(0, 10),
        record.paymentType || 'unknown',
        record.sender || 'SMS',
        record.status === 'review' ? 'Review' : 'Paid'
      ];
      normalizedRows.push(row);
      seen.add(key);
    });

    costTable.data = costTable.data || {};
    costTable.data.rows = existingRows.concat(normalizedRows);
    this.saveWorkspace(ws.id, ws);
    return normalizedRows;
  }

  // ─── COMPONENT CRUD ───────────────────────────────────────────────────────

  addComponent(workspaceId, pageId, componentConfig) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws) return null;
    const page = (ws.pages||[]).find(p => p.id === pageId);
    if (!page) return null;
    const id = `comp_${Date.now()}`;
    const component = Object.assign({
      id, type: 'highcharts', title: 'New Component',
      columnSpan: 'half', domainTags: [], settings: {}, data: {}
    }, componentConfig, { id });
    page.components = page.components || [];
    page.components.push(component);
    this.saveWorkspace(workspaceId, ws);
    this._emit('componentAdded', { workspaceId, pageId, component });
    return component;
  }

  updateComponent(workspaceId, pageId, componentId, updates) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws) return;
    const page = (ws.pages||[]).find(p => p.id === pageId);
    if (!page) return;
    const idx = (page.components||[]).findIndex(c => c.id === componentId);
    if (idx === -1) return;
    page.components[idx] = Object.assign({}, page.components[idx], updates);
    this.saveWorkspace(workspaceId, ws);
    this._emit('componentUpdated', { workspaceId, pageId, componentId });
    return page.components[idx];
  }

  removeComponent(workspaceId, pageId, componentId) {
    const ws = this.getWorkspace(workspaceId);
    if (!ws) return;
    const page = (ws.pages||[]).find(p => p.id === pageId);
    if (!page) return;
    page.components = (page.components||[]).filter(c => c.id !== componentId);
    this.saveWorkspace(workspaceId, ws);
    this._emit('componentRemoved', { workspaceId, pageId, componentId });
  }

  // ─── EXPORT / IMPORT ─────────────────────────────────────────────────────

  exportWorkspaceJSON(id) {
    const ws = this.getWorkspace(id || this.activeWorkspaceId);
    const payload = {
      app: "Digital Twin Universal Workspace",
      author: "Mohammad Hijazi",
      exportedAt: new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION,
      workspace: ws
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `orgstrata_export_${id || this.activeWorkspaceId}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  importWorkspaceJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const ws = parsed.workspace;
      if (!ws || !ws.id) throw new Error("Invalid schema: missing workspace payload");
      ws.schemaVersion = SCHEMA_VERSION;
      this._saveWorkspaceRaw(ws.id, ws);
      this.setActiveWorkspace(ws.id);
      return { success: true, workspaceId: ws.id };
    } catch(err) {
      console.error("Import failed:", err);
      return { success: false, error: err.message };
    }
  }

  // ─── EVENT BUS (Pub/Sub) ─────────────────────────────────────────────────

  _listeners = {};

  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter(f => f !== fn);
    }
  }

  _emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
  }
}

// Global singleton
window.appState = new WorkspaceStateManager();
