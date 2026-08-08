/* ==========================================================================
   COMPONENT STUDIO — Universal Settings & Data Editor Drawer
   Features: Settings Form, Paired Data Table Editor, CSV/JSON Import/Export
   Author: Mohammad Hijazi | Version 2.2.0
   ========================================================================== */

window.ComponentStudio = (function() {

  let _drawerEl      = null;
  let _overlayEl     = null;
  let _currentConfig  = null;
  let _currentWsId    = null;
  let _currentPageId  = null;
  let _onSave         = null;
  let _activeTab      = 'settings';
  let _editableRows   = [];
  let _editableHeaders = [];

  // ── DOM CREATION ──────────────────────────────────────────────────────────

  function _create() {
    if (_drawerEl) return;

    // Overlay
    _overlayEl = document.createElement('div');
    _overlayEl.className = 'studio-drawer-overlay';
    _overlayEl.id = 'studioDrawerOverlay';
    _overlayEl.addEventListener('click', close);
    document.body.appendChild(_overlayEl);

    // Drawer
    _drawerEl = document.createElement('div');
    _drawerEl.className = 'studio-drawer';
    _drawerEl.id = 'studioDrawer';
    _drawerEl.innerHTML = `
      <div class="studio-drawer-header">
        <div class="studio-drawer-title">
          <i class="fa-solid fa-sliders"></i>
          <span id="studioDrawerTitleText">Component Studio</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.45rem;">
          <button class="comp-action-btn studio-fullscreen-btn" id="studioDrawerFullscreenBtn" title="Toggle fullscreen">
            <i class="fa-solid fa-expand"></i>
          </button>
          <button class="comp-action-btn" id="studioDrawerCloseBtn" title="Close Studio">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="studio-drawer-tabs">
        <button class="studio-tab-btn active" data-tab="settings"><i class="fa-solid fa-gear"></i> Settings</button>
        <button class="studio-tab-btn" data-tab="data"><i class="fa-solid fa-table"></i> Data Studio</button>
      </div>

      <!-- Settings Tab -->
      <div class="studio-tab-pane active" id="studioTabSettings"></div>

      <!-- Data Studio Tab -->
      <div class="studio-tab-pane" id="studioTabData">
        <div class="studio-data-toolbar">
          <div class="studio-io-group">
            <button class="btn btn-sm btn-secondary" id="studioAddRowBtn"><i class="fa-solid fa-plus"></i> Add Row</button>
            <button class="btn btn-sm btn-secondary" id="studioImportCsvBtn"><i class="fa-solid fa-file-csv"></i> Import CSV</button>
            <button class="btn btn-sm btn-secondary" id="studioImportJsonBtn"><i class="fa-solid fa-file-code"></i> Import JSON</button>
          </div>
          <div class="studio-io-group">
            <button class="btn btn-sm btn-outline" id="studioExportCsvBtn"><i class="fa-solid fa-download"></i> CSV</button>
            <button class="btn btn-sm btn-outline" id="studioExportJsonBtn"><i class="fa-solid fa-download"></i> JSON</button>
          </div>
        </div>
        <div style="font-size:0.75rem;color:#64748b;" id="studioDataDesc"></div>
        <div class="studio-data-table-wrapper">
          <table class="studio-data-table" id="studioDataTable">
            <thead id="studioDataTableHead"></thead>
            <tbody id="studioDataTableBody"></tbody>
          </table>
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
          <button class="btn btn-primary btn-sm" id="studioApplyDataBtn" style="flex:1;">
            <i class="fa-solid fa-circle-check"></i> Apply Data & Refresh
          </button>
        </div>
      </div>

      <!-- Hidden file inputs -->
      <input type="file" id="studioCsvFileInput"  accept=".csv"  style="display:none;">
      <input type="file" id="studioJsonFileInput" accept=".json" style="display:none;">

      <!-- Apply/Cancel Footer -->
      <div style="padding:0.75rem 1.1rem;border-top:1px solid var(--border-glass);display:flex;gap:0.5rem;">
        <button class="btn btn-primary btn-sm" id="studioSaveSettingsBtn" style="flex:1;">
          <i class="fa-solid fa-floppy-disk"></i> Save Settings
        </button>
        <button class="btn btn-secondary btn-sm" id="studioCancelBtn">Cancel</button>
      </div>`;

    document.body.appendChild(_drawerEl);

    // Wire tab switching
    _drawerEl.querySelectorAll('.studio-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _drawerEl.querySelectorAll('.studio-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _activeTab = btn.dataset.tab;
        document.getElementById('studioTabSettings').classList.toggle('active', _activeTab === 'settings');
        document.getElementById('studioTabData').classList.toggle('active', _activeTab === 'data');
      });
    });

    document.getElementById('studioDrawerCloseBtn').addEventListener('click', close);
    document.getElementById('studioDrawerFullscreenBtn').addEventListener('click', () => {
      if (!_drawerEl) return;
      _drawerEl.classList.toggle('fullscreen');
      const icon = _drawerEl.classList.contains('fullscreen') ? 'fa-compress' : 'fa-expand';
      const btn = document.getElementById('studioDrawerFullscreenBtn');
      if (btn) btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    });
    document.getElementById('studioCancelBtn').addEventListener('click', close);
    document.getElementById('studioSaveSettingsBtn').addEventListener('click', _onSaveSettings);
    document.getElementById('studioAddRowBtn').addEventListener('click', _addDataRow);
    document.getElementById('studioApplyDataBtn').addEventListener('click', _applyDataChanges);

    // Export
    document.getElementById('studioExportCsvBtn').addEventListener('click', _exportCsv);
    document.getElementById('studioExportJsonBtn').addEventListener('click', _exportJson);

    // Import
    document.getElementById('studioImportCsvBtn').addEventListener('click', () =>
      document.getElementById('studioCsvFileInput').click());
    document.getElementById('studioImportJsonBtn').addEventListener('click', () =>
      document.getElementById('studioJsonFileInput').click());

    document.getElementById('studioCsvFileInput').addEventListener('change', e => _importFile(e, 'csv'));
    document.getElementById('studioJsonFileInput').addEventListener('change', e => _importFile(e, 'json'));
  }

  // ── PUBLIC: OPEN ──────────────────────────────────────────────────────────

  function open(wsId, pageId, componentConfig, onSaveCb) {
    _create();
    _currentWsId   = wsId;
    _currentPageId = pageId;
    _currentConfig = JSON.parse(JSON.stringify(componentConfig)); // deep clone
    _onSave        = onSaveCb;
    _activeTab     = 'settings';

    document.getElementById('studioDrawerTitleText').textContent =
      `Component Studio — ${_currentConfig.title}`;

    // Reset tabs
    _drawerEl.querySelector('[data-tab="settings"]').classList.add('active');
    _drawerEl.querySelector('[data-tab="data"]').classList.remove('active');
    document.getElementById('studioTabSettings').classList.add('active');
    document.getElementById('studioTabData').classList.remove('active');

    _buildSettingsForm();
    _buildDataTable();

    _overlayEl.classList.add('active');
    _drawerEl.classList.add('active');
  }

  function close() {
    if (_drawerEl) {
      _drawerEl.classList.remove('active');
      _drawerEl.classList.remove('fullscreen');
      const btn = document.getElementById('studioDrawerFullscreenBtn');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
    if (_overlayEl) _overlayEl.classList.remove('active');
  }

  // ── SETTINGS FORM ─────────────────────────────────────────────────────────

  function _buildSettingsForm() {
    const pane  = document.getElementById('studioTabSettings');
    pane.innerHTML = '';
    const studio = _getComponentStudio();
    if (!studio) {
      pane.innerHTML = '<div style="padding:1rem;color:#64748b;">No settings available for this component type.</div>';
      return;
    }

    studio.settingsFields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'studio-form-group';

      const label = document.createElement('label');
      label.className = 'studio-form-label';
      label.textContent = field.label;
      group.appendChild(label);

      let input;
      if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'studio-form-select';
        (field.options || []).forEach(opt => {
          const o = document.createElement('option');
          o.value = opt;
          o.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
          if (opt === String(field.value)) o.selected = true;
          input.appendChild(o);
        });
      } else {
        input = document.createElement('input');
        input.className = 'studio-form-input';
        input.type = 'text';
        input.value = field.value != null ? String(field.value) : '';
      }
      input.dataset.settingsKey = field.key;
      group.appendChild(input);
      pane.appendChild(group);
    });

    const tagSection = document.createElement('div');
    tagSection.className = 'studio-form-group';
    tagSection.style.marginTop = '1rem';
    tagSection.innerHTML = `
      <label class="studio-form-label">Tag Management</label>
      <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.6rem;">
        <select class="studio-form-select" id="studioComponentTagSelect" style="flex:1;"></select>
        <button class="btn btn-sm btn-secondary" type="button" id="studioAddTagBtn"><i class="fa-solid fa-plus"></i> Add</button>
      </div>
      <div id="studioTagChipList" style="display:flex;flex-wrap:wrap;gap:0.45rem;"></div>
      <div style="font-size:0.72rem;color:#64748b;margin-top:0.5rem;">Business-tagged events automatically populate matching components when signal tags match.</div>
    `;
    pane.appendChild(tagSection);
    _renderTagSelector();
  }

  function _renderTagSelector() {
    const select = document.getElementById('studioComponentTagSelect');
    const chipList = document.getElementById('studioTagChipList');
    if (!select || !chipList) return;

    const tagCatalog = window.appState && typeof window.appState.getTagDefinitions === 'function'
      ? window.appState.getTagDefinitions()
      : [];
    const componentType = _currentConfig?.type || '';
    const applicable = tagCatalog.filter(def => (def.components || []).includes(componentType));
    const activeTags = Array.isArray(_currentConfig?.domainTags) ? _currentConfig.domainTags : [];
    const selectedValues = new Set(activeTags.map(tag => String(tag).trim()));

    select.innerHTML = '';
    const groups = {};
    applicable.forEach(def => {
      if (!groups[def.business]) groups[def.business] = [];
      groups[def.business].push(def);
    });

    Object.entries(groups).forEach(([business, defs]) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = business;
      defs.forEach(def => {
        const option = document.createElement('option');
        option.value = def.key;
        option.textContent = def.label;
        if (selectedValues.has(def.key) || selectedValues.has(def.label) || selectedValues.has(def.key.toLowerCase())) option.disabled = true;
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });

    chipList.innerHTML = '';
    const active = applicable.filter(def => selectedValues.has(def.key) || selectedValues.has(def.label) || selectedValues.has(def.key.toLowerCase()));
    active.forEach(def => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'domain-tag';
      chip.style.cursor = 'pointer';
      chip.dataset.tag = def.key;
      chip.innerHTML = `${def.label} <span style="margin-left:0.35rem;opacity:0.6;">×</span>`;
      chip.addEventListener('click', () => {
        const current = Array.isArray(_currentConfig.domainTags) ? _currentConfig.domainTags.filter(tag => String(tag) !== def.key && String(tag) !== def.label) : [];
        _currentConfig.domainTags = current;
        _renderTagSelector();
      });
      chipList.appendChild(chip);
    });

    const addBtn = document.getElementById('studioAddTagBtn');
    if (addBtn) {
      addBtn.onclick = () => {
        const nextTag = select.value;
        if (!nextTag) return;
        if (!Array.isArray(_currentConfig.domainTags)) _currentConfig.domainTags = [];
        if (_currentConfig.domainTags.includes(nextTag) || _currentConfig.domainTags.includes(nextTag.toLowerCase())) {
          return;
        }
        _currentConfig.domainTags.push(nextTag);
        _renderTagSelector();
      };
    }
  }

  function _onSaveSettings() {
    const pane = document.getElementById('studioTabSettings');
    const inputs = pane.querySelectorAll('[data-settings-key]');
    const updated = JSON.parse(JSON.stringify(_currentConfig));

    const tagValues = Array.isArray(updated.domainTags) ? updated.domainTags.map(tag => String(tag).trim()).filter(Boolean) : [];
    updated.domainTags = [...new Set(tagValues)];

    inputs.forEach(input => {
      const key = input.dataset.settingsKey;
      const val = input.value;
      // Support nested keys like "settings.chartType"
      const parts = key.split('.');
      let obj = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = val;
    });

    if (window.appState) {
      window.appState.updateComponent(_currentWsId, _currentPageId, updated.id, updated);
    }
    if (_onSave) _onSave(updated);
    _showToast('Settings saved!', 'success');
    close();
  }

  // ── DATA TABLE ────────────────────────────────────────────────────────────

  function _buildDataTable() {
    const studio = _getComponentStudio();
    if (!studio) return;

    document.getElementById('studioDataDesc').textContent = studio.dataDescription || '';

    // Get headers & rows from component studio
    _editableHeaders = studio.getTableHeaders(_currentConfig);
    _editableRows    = studio.getTableRows(_currentConfig).map(r => [...r]);

    _renderDataTable();
  }

  function _renderDataTable() {
    const head = document.getElementById('studioDataTableHead');
    const body = document.getElementById('studioDataTableBody');

    // If BPMN XML mode — render a real diagram editor instead of raw paste-only textarea
    const studio = _getComponentStudio();
    if (studio && studio.dataType === 'bpmn-xml') {
      head.innerHTML = '';
      body.innerHTML = '';

      const xmlVal = (_editableRows[0] && _editableRows[0][0]) || '';
      const model = (window.BpmnComponent && typeof window.BpmnComponent.parseXmlToModel === 'function')
        ? window.BpmnComponent.parseXmlToModel(xmlVal)
        : { processId: 'Process_1', elements: [], flows: [] };

      const state = {
        model,
        selectedId: model.elements[0]?.id || null
      };

      const editorShell = document.createElement('div');
      editorShell.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:0.8rem;align-items:start;';

      const editorPane = document.createElement('div');
      editorPane.style.cssText = 'background:rgba(15,23,42,0.42);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.5rem;';

      const toolbar = document.createElement('div');
      toolbar.style.cssText = 'display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;';
      ['Start','Task','End','Gateway'].forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-secondary';
        btn.textContent = `Add ${type}`;
        btn.addEventListener('click', () => {
          const prefix = type === 'Start' ? 'startEvent' : type === 'End' ? 'endEvent' : type === 'Gateway' ? 'gateway' : 'task';
          const letter = type === 'Start' ? 'S' : type === 'End' ? 'E' : type === 'Gateway' ? 'G' : 'T';
          const nextId = `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,5)}`;
          const base = {
            id: nextId,
            type: prefix,
            name: `${type === 'Task' ? 'Task' : type === 'Gateway' ? 'Gateway' : type} ${model.elements.length + 1}`,
            x: 180 + (model.elements.length * 90),
            y: 120 + (model.elements.length % 2) * 70,
            width: prefix === 'startEvent' || prefix === 'endEvent' ? 36 : 120,
            height: prefix === 'startEvent' || prefix === 'endEvent' ? 36 : 80
          };
          model.elements.push(base);
          if (model.elements.length > 1 && prefix !== 'startEvent' && prefix !== 'endEvent') {
            const source = model.elements[model.elements.length - 2]?.id;
            const target = base.id;
            if (source && !model.flows.some(flow => flow.source === source && flow.target === target)) {
              model.flows.push({ id: `Flow_${Date.now().toString(36)}`, source, target });
            }
          }
          state.selectedId = base.id;
          _renderCustomBpmnEditor(model, editorPane, state, toolbar, inspector, onUpdate);
        });
        toolbar.appendChild(btn);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-secondary';
      deleteBtn.textContent = 'Delete Selected';
      deleteBtn.addEventListener('click', () => {
        if (!state.selectedId) return;
        model.elements = model.elements.filter(el => el.id !== state.selectedId);
        model.flows = model.flows.filter(flow => flow.source !== state.selectedId && flow.target !== state.selectedId);
        state.selectedId = model.elements[0]?.id || null;
        _renderCustomBpmnEditor(model, editorPane, state, toolbar, inspector, onUpdate);
      });
      toolbar.appendChild(deleteBtn);

      const inspector = document.createElement('div');
      inspector.style.cssText = 'background:rgba(15,23,42,0.42);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem;';

      function onUpdate() {
        const xml = window.BpmnComponent && typeof window.BpmnComponent.generateXmlFromModel === 'function'
          ? window.BpmnComponent.generateXmlFromModel(model)
          : '';
        _editableRows = [[xml]];
        _renderCustomBpmnEditor(model, editorPane, state, toolbar, inspector, onUpdate);
      }

      function _renderCustomBpmnEditor(currentModel, host, currentState, currentToolbar, inspectorPane, updateFn) {
        const xml = window.BpmnComponent && typeof window.BpmnComponent.generateXmlFromModel === 'function'
          ? window.BpmnComponent.generateXmlFromModel(currentModel)
          : '';

        host.innerHTML = '';
        const previewWrap = document.createElement('div');
        previewWrap.style.cssText = 'width:100%;min-height:260px;border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.18);';
        host.appendChild(previewWrap);

        if (typeof BpmnJS !== 'undefined') {
          const viewer = new BpmnJS({ container: previewWrap });
          viewer.importXML(xml).then(() => {
            viewer.get('canvas').zoom('fit-viewport');
            viewer.get('eventBus').on('element.click', (event) => {
              if (event && event.element && event.element.id) {
                currentState.selectedId = event.element.id;
                _renderInspector(currentState, currentModel, inspectorPane, updateFn);
              }
            });
          }).catch(() => {
            previewWrap.innerHTML = '<div style="padding:1rem;color:#ff9100;font-size:0.8rem;">BPMN could not be rendered. Check diagram structure.</div>';
          });
        } else {
          previewWrap.innerHTML = '<div style="padding:1rem;color:#94a3b8;font-size:0.72rem;"><i class="fa-solid fa-diagram-project"></i> BPMN preview unavailable. XML editing remains available via Apply.</div>';
        }

        _renderInspector(currentState, currentModel, inspectorPane, updateFn);
      }

      function _renderInspector(currentState, currentModel, inspectorPane, updateFn) {
        inspectorPane.innerHTML = '';
        const selected = currentModel.elements.find(el => el.id === currentState.selectedId);

        if (!selected) {
          inspectorPane.innerHTML = '<div style="font-size:0.75rem;color:#64748b;">Select a BPMN element to edit its name and type.</div>';
          return;
        }

        const fieldSet = document.createElement('div');
        fieldSet.style.cssText = 'display:grid;gap:0.6rem;';

        const nameLabel = document.createElement('label');
        nameLabel.className = 'studio-form-label';
        nameLabel.textContent = 'Element Name';
        fieldSet.appendChild(nameLabel);

        const nameInput = document.createElement('input');
        nameInput.className = 'studio-form-input';
        nameInput.value = selected.name || '';
        nameInput.addEventListener('input', (e) => {
          selected.name = e.target.value;
          updateFn();
        });
        fieldSet.appendChild(nameInput);

        const typeLabel = document.createElement('label');
        typeLabel.className = 'studio-form-label';
        typeLabel.textContent = 'Element Type';
        fieldSet.appendChild(typeLabel);

        const typeSelect = document.createElement('select');
        typeSelect.className = 'studio-form-select';
        ['task', 'startEvent', 'endEvent', 'gateway'].forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (opt === selected.type) option.selected = true;
          typeSelect.appendChild(option);
        });
        typeSelect.addEventListener('change', (e) => {
          selected.type = e.target.value;
          if (selected.type === 'startEvent' || selected.type === 'endEvent') {
            selected.width = 36;
            selected.height = 36;
          } else if (selected.type === 'gateway') {
            selected.width = 60;
            selected.height = 60;
          } else {
            selected.width = selected.width || 120;
            selected.height = selected.height || 80;
          }
          updateFn();
        });
        fieldSet.appendChild(typeSelect);

        const posWrap = document.createElement('div');
        posWrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;';

        const xInput = document.createElement('input');
        xInput.className = 'studio-form-input';
        xInput.type = 'number';
        xInput.value = Math.round(selected.x || 0);
        xInput.placeholder = 'X';
        xInput.addEventListener('input', (e) => { selected.x = Number(e.target.value || 0); updateFn(); });

        const yInput = document.createElement('input');
        yInput.className = 'studio-form-input';
        yInput.type = 'number';
        yInput.value = Math.round(selected.y || 0);
        yInput.placeholder = 'Y';
        yInput.addEventListener('input', (e) => { selected.y = Number(e.target.value || 0); updateFn(); });

        posWrap.appendChild(xInput);
        posWrap.appendChild(yInput);
        fieldSet.appendChild(posWrap);
        inspectorPane.appendChild(fieldSet);
      }

      editorPane.appendChild(toolbar);
      editorShell.appendChild(editorPane);
      editorShell.appendChild(inspector);
      body.appendChild(editorShell);
      _renderCustomBpmnEditor(model, editorPane, state, toolbar, inspector, onUpdate);

      document.getElementById('studioApplyDataBtn').onclick = () => {
        const xml = window.BpmnComponent && typeof window.BpmnComponent.generateXmlFromModel === 'function'
          ? window.BpmnComponent.generateXmlFromModel(model)
          : '';
        _editableRows = [[xml]];
        _applyDataChanges();
      };
      return;
    }

    if (studio && studio.dataType === 'rooms') {
      head.innerHTML = '';
      body.innerHTML = '';

      const roomState = {
        rooms: (_editableRows || []).filter(row => row && row[0]).map((row, idx) => ({
          id: `room_${idx}_${Math.random().toString(36).slice(2,6)}`,
          name: row[0] || `Room ${idx + 1}`,
          width: row[1] || '4',
          length: row[2] || '5',
          assets: row[3] || ''
        })),
        selectedId: null
      };
      if (roomState.rooms.length) roomState.selectedId = roomState.rooms[0].id;

      const editorShell = document.createElement('div');
      editorShell.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:0.8rem;align-items:start;';

      const editorPane = document.createElement('div');
      editorPane.style.cssText = 'background:rgba(15,23,42,0.42);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.5rem;';

      const toolbar = document.createElement('div');
      toolbar.style.cssText = 'display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;';

      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn-sm btn-secondary';
      addBtn.textContent = 'Add Room';
      addBtn.addEventListener('click', () => {
        const nextIndex = roomState.rooms.length + 1;
        const room = { id: `room_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, name: `Room ${nextIndex}`, width: '4', length: '5', assets: 'Workstation, chair, storage' };
        roomState.rooms.push(room);
        roomState.selectedId = room.id;
        renderRoomEditor();
      });
      toolbar.appendChild(addBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-secondary';
      deleteBtn.textContent = 'Delete Selected';
      deleteBtn.addEventListener('click', () => {
        if (!roomState.selectedId) return;
        roomState.rooms = roomState.rooms.filter(room => room.id !== roomState.selectedId);
        roomState.selectedId = roomState.rooms[0]?.id || null;
        renderRoomEditor();
      });
      toolbar.appendChild(deleteBtn);

      const inspector = document.createElement('div');
      inspector.style.cssText = 'background:rgba(15,23,42,0.42);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem;';

      function syncRows() {
        _editableRows = roomState.rooms.map(room => [room.name, room.width, room.length, room.assets]);
      }

      function renderRoomEditor() {
        syncRows();
        editorPane.innerHTML = '';
        const previewWrap = document.createElement('div');
        previewWrap.style.cssText = 'width:100%;min-height:280px;border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.18);';
        editorPane.appendChild(toolbar);
        editorPane.appendChild(previewWrap);

        if (typeof THREE !== 'undefined') {
          const canvas = document.createElement('canvas');
          canvas.style.cssText = 'width:100%;height:280px;display:block;';
          previewWrap.appendChild(canvas);

          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          renderer.setSize(previewWrap.clientWidth || 420, 280);
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.setClearColor(0x000000, 0);

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(45, (previewWrap.clientWidth || 420) / 280, 0.1, 1000);
          camera.position.set(10, 9, 12);
          camera.lookAt(0, 0, 0);
          scene.add(new THREE.AmbientLight(0x88aaff, 2));
          const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
          dirLight.position.set(5, 8, 5);
          scene.add(dirLight);
          scene.add(new THREE.GridHelper(26, 26, 0x24364d, 0x1a2639));

          const colors = [0x00f2fe, 0x7f00ff, 0x00e676, 0xff9100, 0x4facfe];
          let offsetX = -7;

          roomState.rooms.forEach((room, index) => {
            const width = Number(room.width) || 4;
            const length = Number(room.length) || 5;
            const geometry = new THREE.BoxGeometry(width * 0.75, 2.4, length * 0.75);
            const material = new THREE.MeshPhongMaterial({
              color: colors[index % colors.length],
              transparent: true,
              opacity: 0.8,
              emissive: colors[index % colors.length],
              emissiveIntensity: 0.12
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(offsetX, 1.2, 0);
            scene.add(mesh);

            const edges = new THREE.EdgesGeometry(geometry);
            const lineMat = new THREE.LineBasicMaterial({ color: colors[index % colors.length], opacity: 0.95, transparent: true });
            const wire = new THREE.LineSegments(edges, lineMat);
            wire.position.copy(mesh.position);
            scene.add(wire);

            offsetX += width * 0.9 + 1.2;
          });

          const animate = () => {
            requestAnimationFrame(animate);
            scene.rotation.y += 0.006;
            renderer.render(scene, camera);
          };
          animate();
        } else {
          const fallback = document.createElement('div');
          fallback.style.cssText = 'padding:0.5rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.5rem;';
          roomState.rooms.forEach(room => {
            const card = document.createElement('div');
            card.className = 'room-card';
            card.innerHTML = `<div class="room-card-name">${room.name}</div><div class="room-card-dim"><i class="fa-solid fa-vector-square"></i> ${room.width} × ${room.length}</div><div class="room-card-assets"><i class="fa-solid fa-boxes-stacked"></i> ${room.assets || 'No assets registered'}</div>`;
            fallback.appendChild(card);
          });
          previewWrap.appendChild(fallback);
        }

        renderInspector();
      }

      function renderInspector() {
        inspector.innerHTML = '';
        const selected = roomState.rooms.find(room => room.id === roomState.selectedId);
        if (!selected) {
          inspector.innerHTML = '<div style="font-size:0.75rem;color:#64748b;">Add or select a room to edit.</div>';
          return;
        }

        const fieldSet = document.createElement('div');
        fieldSet.style.cssText = 'display:grid;gap:0.6rem;';

        const nameLabel = document.createElement('label');
        nameLabel.className = 'studio-form-label';
        nameLabel.textContent = 'Room Name';
        fieldSet.appendChild(nameLabel);

        const nameInput = document.createElement('input');
        nameInput.className = 'studio-form-input';
        nameInput.value = selected.name || '';
        nameInput.addEventListener('input', (e) => {
          selected.name = e.target.value || 'Room';
          renderRoomEditor();
        });
        fieldSet.appendChild(nameInput);

        const dims = document.createElement('div');
        dims.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;';

        const widthInput = document.createElement('input');
        widthInput.className = 'studio-form-input';
        widthInput.type = 'number';
        widthInput.value = Number(selected.width) || 4;
        widthInput.placeholder = 'Width';
        widthInput.addEventListener('input', (e) => {
          selected.width = e.target.value || '4';
          renderRoomEditor();
        });

        const lengthInput = document.createElement('input');
        lengthInput.className = 'studio-form-input';
        lengthInput.type = 'number';
        lengthInput.value = Number(selected.length) || 5;
        lengthInput.placeholder = 'Length';
        lengthInput.addEventListener('input', (e) => {
          selected.length = e.target.value || '5';
          renderRoomEditor();
        });

        dims.appendChild(widthInput);
        dims.appendChild(lengthInput);
        fieldSet.appendChild(dims);

        const notesLabel = document.createElement('label');
        notesLabel.className = 'studio-form-label';
        notesLabel.textContent = 'Assets / Notes';
        fieldSet.appendChild(notesLabel);

        const notesInput = document.createElement('textarea');
        notesInput.className = 'studio-form-input';
        notesInput.rows = 4;
        notesInput.value = selected.assets || '';
        notesInput.addEventListener('input', (e) => {
          selected.assets = e.target.value;
          renderRoomEditor();
        });
        fieldSet.appendChild(notesInput);

        inspector.appendChild(fieldSet);
      }

      editorShell.appendChild(editorPane);
      editorShell.appendChild(inspector);
      body.appendChild(editorShell);
      renderRoomEditor();

      document.getElementById('studioApplyDataBtn').onclick = () => {
        syncRows();
        _applyDataChanges();
      };
      return;
    }

    // Normal table
    head.innerHTML = `<tr>${_editableHeaders.map(h => `<th>${h}</th>`).join('')}<th style="width:28px;"></th></tr>`;

    body.innerHTML = '';
    _editableRows.forEach((row, rowIdx) => {
      const tr = document.createElement('tr');
      _editableHeaders.forEach((_, colIdx) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.value = row[colIdx] != null ? String(row[colIdx]) : '';
        input.addEventListener('input', e => { _editableRows[rowIdx][colIdx] = e.target.value; });
        td.appendChild(input);
        tr.appendChild(td);
      });
      // Delete row button
      const delTd = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.className = 'row-del-btn';
      delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      delBtn.addEventListener('click', () => {
        _editableRows.splice(rowIdx, 1);
        _renderDataTable();
      });
      delTd.appendChild(delBtn);
      tr.appendChild(delTd);
      body.appendChild(tr);
    });
  }

  function _addDataRow() {
    const emptyRow = _editableHeaders.map(() => '');
    _editableRows.push(emptyRow);
    _renderDataTable();
  }

  function _applyDataChanges() {
    const studio = _getComponentStudio();
    if (!studio) return;

    const parsedData = studio.parseTableData(_editableRows, _editableHeaders, _currentConfig);
    const updated = Object.assign({}, _currentConfig, { data: parsedData });

    if (window.appState) {
      window.appState.updateComponent(_currentWsId, _currentPageId, updated.id, updated);
    }
    if (_onSave) _onSave(updated);
    _showToast('Data updated!', 'success');
    close();
  }

  // ── EXPORT ────────────────────────────────────────────────────────────────

  function _exportCsv() {
    const headers = _editableHeaders;
    const rows    = _editableRows;
    const lines   = [headers.map(h => `"${h}"`).join(',')];
    rows.forEach(r => lines.push(r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    _downloadBlob(blob, `studio_${_currentConfig.id}.csv`);
    _showToast('CSV exported!', 'info');
  }

  function _exportJson() {
    const payload = {
      component: _currentConfig.title,
      type: _currentConfig.type,
      exportedAt: new Date().toISOString(),
      headers: _editableHeaders,
      rows: _editableRows
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    _downloadBlob(blob, `studio_${_currentConfig.id}.json`);
    _showToast('JSON exported!', 'info');
  }

  function _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ── IMPORT ────────────────────────────────────────────────────────────────

  function _importFile(e, fmt) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      if (fmt === 'csv') {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) { _showToast('CSV must have header + data rows', 'error'); return; }
        _editableHeaders = _parseCSVLine(lines[0]);
        _editableRows    = lines.slice(1).map(_parseCSVLine);
      } else {
        try {
          const json = JSON.parse(text);
          if (json.headers && json.rows) {
            _editableHeaders = json.headers;
            _editableRows    = json.rows;
          } else {
            _showToast('Invalid JSON format: expected {headers, rows}', 'error');
            return;
          }
        } catch { _showToast('Invalid JSON', 'error'); return; }
      }
      _renderDataTable();
      _showToast('Data imported!', 'success');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function _parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  // ── COMPONENT STUDIO LOOKUP ───────────────────────────────────────────────

  function _getComponentStudio() {
    const type = _currentConfig?.type;
    const componentMap = {
      'highcharts':  window.HighchartsComponent,
      'calendar':    window.FullCalendarComponent,
      'map':         window.OpenMapComponent,
      'bpmn':        window.BpmnComponent,
      'jqtable':     window.JqTableComponent,
      'kanban':      window.KanbanGanttComponent,
      'gantt':       window.KanbanGanttComponent,
      'capabilities': window.EntityToolsComponent,
      'risk':        window.EntityToolsComponent,
      'maturity':    window.EntityToolsComponent,
      '3dspatial':   window.Spatial3DComponent,
    };
    const comp = componentMap[type];
    return comp?.getStudioConfig ? comp.getStudioConfig(_currentConfig) : null;
  }

  // ── TOAST NOTIFICATIONS ───────────────────────────────────────────────────

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
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
  }

  return { open, close };

})();
