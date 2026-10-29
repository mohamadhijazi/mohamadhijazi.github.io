/**
 * forms.js — Dynamic form renderer for EA Tool
 * Depends on: Utils, Storage, MetaModel, Records (loaded before this script)
 * Exposes window.Forms as a global namespace
 */
(function () {
  'use strict';

  // ── Helpers ────────────────────────────────────────────────────────────────

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') {
          node.className = attrs[k];
        } else if (k === 'style') {
          node.style.cssText = attrs[k];
        } else if (k.startsWith('on') && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    if (children) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(function (c) {
        if (c === null || c === undefined) return;
        if (typeof c === 'string') {
          node.appendChild(document.createTextNode(c));
        } else {
          node.appendChild(c);
        }
      });
    }
    return node;
  }

  function txt(str) { return document.createTextNode(String(str === null || str === undefined ? '' : str)); }

  function clearEl(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  function getClassCaption(classId) {
    try {
      var meta = MetaModel.getClass(classId);
      return (meta && meta.caption) ? meta.caption : classId;
    } catch (e) { return classId; }
  }

  function statusBadge(status) {
    var colorMap = {
      Active:   'background:#d1fae5;color:#065f46',
      Draft:    'background:#fef3c7;color:#92400e',
      Archived: 'background:#f3f4f6;color:#6b7280'
    };
    var s = el('span', {
      className: 'ea-badge',
      style: 'display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;' + (colorMap[status] || 'background:#e5e7eb;color:#374151')
    });
    s.textContent = status || '';
    return s;
  }

  var _debounceTimers = {};
  function debounceSearch(id, fn, delay) {
    clearTimeout(_debounceTimers[id]);
    _debounceTimers[id] = setTimeout(fn, delay || 300);
  }

  // ── renderList ─────────────────────────────────────────────────────────────

  function renderList(classId, container) {
    clearEl(container);

    var caption = getClassCaption(classId);
    var currentStatus = 'All';
    var currentSearch = '';

    function refresh() {
      clearEl(tableWrap);
      var records = Records.list(classId, { status: currentStatus, search: currentSearch });
      tableWrap.appendChild(buildTable(records));
    }

    // Header row
    var header = el('div', { style: 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px' });
    var title = el('h2', { style: 'margin:0;font-size:1.25rem;font-weight:700' });
    title.textContent = caption;
    var newBtn = el('button', {
      className: 'ea-btn ea-btn-primary',
      style: 'padding:8px 18px;border-radius:6px;background:#2563eb;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:600'
    });
    newBtn.textContent = '+ New ' + caption;
    newBtn.addEventListener('click', function () {
      renderForm(classId, null, container, function () { renderList(classId, container); }, function () { renderList(classId, container); });
    });
    header.appendChild(title);
    header.appendChild(newBtn);
    container.appendChild(header);

    // Search box
    var searchWrap = el('div', { style: 'margin-bottom:12px' });
    var searchInput = el('input', {
      type: 'search',
      placeholder: 'Search ' + caption + '…',
      style: 'width:100%;max-width:360px;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;box-sizing:border-box'
    });
    searchInput.addEventListener('input', function () {
      var val = searchInput.value;
      debounceSearch('list-' + classId, function () {
        currentSearch = val;
        refresh();
      });
    });
    searchWrap.appendChild(searchInput);
    container.appendChild(searchWrap);

    // Status filter buttons
    var filterBar = el('div', { style: 'display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap' });
    ['All', 'Active', 'Draft', 'Archived'].forEach(function (s) {
      var btn = el('button', {
        style: 'padding:5px 14px;border-radius:20px;border:1px solid #d1d5db;cursor:pointer;font-size:13px;background:' + (s === currentStatus ? '#2563eb' : '#fff') + ';color:' + (s === currentStatus ? '#fff' : '#374151')
      });
      btn.textContent = s;
      btn.addEventListener('click', function () {
        currentStatus = s;
        // Update active style
        Array.from(filterBar.children).forEach(function (b) {
          b.style.background = '#fff';
          b.style.color = '#374151';
        });
        btn.style.background = '#2563eb';
        btn.style.color = '#fff';
        refresh();
      });
      filterBar.appendChild(btn);
    });
    container.appendChild(filterBar);

    // Table wrapper
    var tableWrap = el('div');
    container.appendChild(tableWrap);

    // Build table function
    function buildTable(records) {
      if (!records || records.length === 0) {
        var empty = el('div', { style: 'text-align:center;padding:48px 16px;color:#9ca3af' });
        var emptyIcon = el('div', { style: 'font-size:48px;margin-bottom:12px' });
        emptyIcon.textContent = '📋';
        var emptyMsg = el('p', { style: 'margin:0;font-size:15px' });
        emptyMsg.textContent = 'No ' + caption + ' records found.';
        var emptyHint = el('p', { style: 'margin:4px 0 0;font-size:13px;color:#d1d5db' });
        emptyHint.textContent = 'Click "+ New ' + caption + '" to create one.';
        empty.appendChild(emptyIcon);
        empty.appendChild(emptyMsg);
        empty.appendChild(emptyHint);
        return empty;
      }

      var wrap = el('div', { style: 'overflow-x:auto' });
      var table = el('table', { style: 'width:100%;border-collapse:collapse;font-size:14px' });

      // Head
      var thead = el('thead');
      var hr = el('tr', { style: 'background:#f9fafb;border-bottom:2px solid #e5e7eb' });
      ['Name', 'Status', 'Created', 'Actions'].forEach(function (col) {
        var th = el('th', { style: 'text-align:left;padding:10px 14px;font-weight:600;color:#374151;white-space:nowrap' });
        th.textContent = col;
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      table.appendChild(thead);

      // Body
      var tbody = el('tbody');
      records.forEach(function (record, idx) {
        var tr = el('tr', { style: 'border-bottom:1px solid #e5e7eb;' + (idx % 2 === 0 ? '' : 'background:#f9fafb') });

        // Name cell
        var tdName = el('td', { style: 'padding:10px 14px;font-weight:500' });
        tdName.textContent = record.name || '(Unnamed)';
        tr.appendChild(tdName);

        // Status cell
        var tdStatus = el('td', { style: 'padding:10px 14px' });
        tdStatus.appendChild(statusBadge(record.status));
        tr.appendChild(tdStatus);

        // Created cell
        var tdCreated = el('td', { style: 'padding:10px 14px;color:#6b7280;white-space:nowrap' });
        tdCreated.textContent = Utils.formatDate(record.createdAt);
        tr.appendChild(tdCreated);

        // Actions cell
        var tdActions = el('td', { style: 'padding:10px 14px;white-space:nowrap' });

        var viewBtn = el('button', { style: 'margin-right:6px;padding:4px 10px;border-radius:4px;border:1px solid #d1d5db;cursor:pointer;background:#fff;font-size:12px' });
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', function () {
          renderDetail(classId, record.id, container);
        });

        var editBtn = el('button', { style: 'margin-right:6px;padding:4px 10px;border-radius:4px;border:1px solid #2563eb;cursor:pointer;background:#eff6ff;color:#2563eb;font-size:12px' });
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function () {
          renderForm(classId, record, container,
            function () { renderList(classId, container); },
            function () { renderList(classId, container); }
          );
        });

        var delBtn = el('button', { style: 'padding:4px 10px;border-radius:4px;border:1px solid #ef4444;cursor:pointer;background:#fef2f2;color:#ef4444;font-size:12px' });
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', function () {
          var confirmed = window.confirm('Delete "' + (record.name || 'this record') + '"? This cannot be undone.');
          if (confirmed) {
            try {
              Records['delete'](classId, record.id);
              Utils.showToast('Record deleted.', 'success');
              refresh();
            } catch (e) {
              Utils.showToast('Delete failed: ' + e.message, 'error');
            }
          }
        });

        tdActions.appendChild(viewBtn);
        tdActions.appendChild(editBtn);
        tdActions.appendChild(delBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      return wrap;
    }

    refresh();
  }

  // ── renderForm ─────────────────────────────────────────────────────────────

  function renderForm(classId, record, container, onSave, onCancel) {
    clearEl(container);

    var isEdit  = !!(record && record.id);
    var caption = getClassCaption(classId);

    // Header
    var header = el('div', { style: 'display:flex;align-items:center;gap:12px;margin-bottom:20px' });
    var backBtn = el('button', { style: 'padding:6px 14px;border-radius:6px;border:1px solid #d1d5db;cursor:pointer;background:#fff;font-size:14px' });
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', function () { if (onCancel) onCancel(); });
    var formTitle = el('h2', { style: 'margin:0;font-size:1.2rem;font-weight:700' });
    formTitle.textContent = (isEdit ? 'Edit ' : 'New ') + caption;
    header.appendChild(backBtn);
    header.appendChild(formTitle);
    container.appendChild(header);

    // Error banner (hidden initially)
    var errorBanner = el('div', { style: 'display:none;background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;padding:10px 14px;margin-bottom:14px;color:#b91c1c;font-size:14px' });
    container.appendChild(errorBanner);

    // Form element
    var form = el('form', { style: 'max-width:640px' });
    form.noValidate = true;

    // Helper to create a labelled field wrapper
    function fieldGroup(labelText, required) {
      var group = el('div', { style: 'margin-bottom:18px' });
      var lbl = el('label', { style: 'display:block;font-weight:600;font-size:14px;margin-bottom:6px;color:#374151' });
      lbl.textContent = labelText + (required ? ' *' : '');
      group.appendChild(lbl);
      return { group: group, label: lbl };
    }

    // ── Standard fields ──────────────────────────────────────────────────────

    // name
    var nameGroup = fieldGroup('Name', true);
    var nameInput = el('input', {
      type: 'text',
      name: 'name',
      placeholder: 'Enter name',
      style: 'width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;box-sizing:border-box'
    });
    nameInput.value = (record && record.name) ? record.name : '';
    nameGroup.group.appendChild(nameInput);
    form.appendChild(nameGroup.group);

    // description
    var descGroup = fieldGroup('Description', false);
    var descInput = el('textarea', {
      name: 'description',
      rows: '3',
      placeholder: 'Optional description',
      style: 'width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;resize:vertical;box-sizing:border-box'
    });
    descInput.value = (record && record.description) ? record.description : '';
    descGroup.group.appendChild(descInput);
    form.appendChild(descGroup.group);

    // status
    var statusGroup = fieldGroup('Status', false);
    var statusSelect = el('select', {
      name: 'status',
      style: 'width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;box-sizing:border-box;background:#fff'
    });
    ['Active', 'Draft', 'Archived'].forEach(function (opt) {
      var option = el('option');
      option.value = opt;
      option.textContent = opt;
      if (record && record.status === opt) option.selected = true;
      statusSelect.appendChild(option);
    });
    if (!record || !record.status) statusSelect.value = 'Draft';
    statusGroup.group.appendChild(statusSelect);
    form.appendChild(statusGroup.group);

    // ── Custom props ─────────────────────────────────────────────────────────
    var customProps = [];
    try { customProps = Storage.getCustomProps(classId) || []; } catch (e) {}

    var customInputs = {};
    customProps.forEach(function (prop) {
      var fg = fieldGroup(prop.label || prop.name, false);
      var input = _renderField(prop, record ? record[prop.key] : undefined);
      if (input) {
        fg.group.appendChild(input);
        form.appendChild(fg.group);
        customInputs[prop.key] = input;
      }
    });

    // ── Relation pickers ──────────────────────────────────────────────────────
    var relationDefs = [];
    try { relationDefs = MetaModel.getRelationsFrom(classId) || []; } catch (e) {}

    var relationInputs = {};
    relationDefs.forEach(function (rel) {
      var relLabel = rel.caption || rel.relation || rel.targetClass;
      var fg = fieldGroup('→ ' + relLabel, false);

      // Determine existing selection
      var existingRelations = [];
      if (record && record.id) {
        try {
          var allRels = Storage.getRelations(classId, record.id) || [];
          existingRelations = allRels.filter(function (r) { return r.relName === rel.relation || r.relation === rel.relation; }).map(function (r) { return r.targetId; });
        } catch (e) {}
      }

      var targetRecords = [];
      try { targetRecords = Storage.getRecords(rel.targetClass) || []; } catch (e) {}

      var isMulti = rel.cardinality && (rel.cardinality === '1-N' || rel.cardinality === 'N-N' || rel.cardinality === 'N-1');
      var select = el('select', {
        style: 'width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;box-sizing:border-box;background:#fff'
      });
      if (isMulti) select.multiple = true;
      if (isMulti) select.size = Math.min(5, targetRecords.length + 1);

      var noneOpt = el('option');
      noneOpt.value = '';
      noneOpt.textContent = '— None —';
      if (!isMulti) select.appendChild(noneOpt);

      targetRecords.forEach(function (tr) {
        var opt = el('option');
        opt.value = tr.id;
        opt.textContent = tr.name || tr.id;
        if (existingRelations.indexOf(tr.id) !== -1) opt.selected = true;
        select.appendChild(opt);
      });

      if (targetRecords.length === 0) {
        var hint = el('p', { style: 'margin:4px 0 0;font-size:12px;color:#9ca3af' });
        hint.textContent = 'No ' + (rel.targetClass || '') + ' records available.';
        fg.group.appendChild(hint);
      }

      fg.group.appendChild(select);
      form.appendChild(fg.group);
      relationInputs[rel.relation] = { select: select, rel: rel, isMulti: isMulti };
    });

    // ── Submit / Cancel buttons ───────────────────────────────────────────────
    var btnRow = el('div', { style: 'display:flex;gap:10px;margin-top:24px' });
    var submitBtn = el('button', {
      type: 'submit',
      style: 'padding:9px 22px;border-radius:6px;background:#2563eb;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:600'
    });
    submitBtn.textContent = isEdit ? 'Save Changes' : 'Create ' + caption;

    var cancelBtn = el('button', {
      type: 'button',
      style: 'padding:9px 22px;border-radius:6px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:14px'
    });
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', function () { if (onCancel) onCancel(); });

    btnRow.appendChild(submitBtn);
    btnRow.appendChild(cancelBtn);
    form.appendChild(btnRow);

    // ── Form submission ───────────────────────────────────────────────────────
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = {
        name:        nameInput.value.trim(),
        description: descInput.value.trim(),
        status:      statusSelect.value
      };

      // Collect custom props
      customProps.forEach(function (prop) {
        var input = customInputs[prop.key];
        if (!input) return;
        var val = (prop.type === 'number') ? (input.value !== '' ? Number(input.value) : null) : input.value;
        formData[prop.key] = val;
      });

      // Validate
      var errors = _validateForm(classId, formData);
      if (errors.length > 0) {
        errorBanner.style.display = 'block';
        errorBanner.textContent = errors.join(' · ');
        return;
      }
      errorBanner.style.display = 'none';

      // Save record
      var savedRecord;
      try {
        if (isEdit) {
          savedRecord = Records.update(classId, record.id, formData);
        } else {
          savedRecord = Records.create(classId, formData);
        }
      } catch (err) {
        errorBanner.style.display = 'block';
        errorBanner.textContent = 'Save failed: ' + err.message;
        return;
      }

      // Save relations
      var relKeys = Object.keys(relationInputs);
      for (var ri = 0; ri < relKeys.length; ri++) {
        var relKey = relKeys[ri];
        var relInput = relationInputs[relKey];
        var selectedIds = Array.from(relInput.select.options)
          .filter(function (o) { return o.selected && o.value; })
          .map(function (o) { return o.value; });

        // Remove old relations for this relName before writing new ones
        try {
          if (typeof Storage.deleteRelationsForRecord === 'function') {
            Storage.deleteRelationsForRecord(classId, savedRecord.id, relKey);
          }
        } catch (e) { /* Storage may not support deleteRelationsForRecord — skip gracefully */ }

        selectedIds.forEach(function (targetId) {
          try {
            Storage.saveRelation(classId, savedRecord.id, relKey, relInput.rel.targetClass, targetId);
          } catch (e) {}
        });
      }

      Utils.showToast((isEdit ? 'Record updated.' : 'Record created.'), 'success');
      if (onSave) onSave(savedRecord);
    });

    container.appendChild(form);
  }

  // ── renderDetail ───────────────────────────────────────────────────────────

  function renderDetail(classId, recordId, container) {
    clearEl(container);

    var caption = getClassCaption(classId);
    var result = Records.getWithRelations(classId, recordId);

    if (!result) {
      var notFound = el('div', { style: 'padding:32px;text-align:center;color:#9ca3af' });
      notFound.textContent = 'Record not found.';
      container.appendChild(notFound);
      return;
    }

    var record    = result.record;
    var relations = result.relations;

    // Header
    var header = el('div', { style: 'display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap' });
    var backBtn = el('button', { style: 'padding:6px 14px;border-radius:6px;border:1px solid #d1d5db;cursor:pointer;background:#fff;font-size:14px' });
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', function () { renderList(classId, container); });

    var titleWrap = el('div', { style: 'flex:1;min-width:0' });
    var recordTitle = el('h2', { style: 'margin:0 0 4px;font-size:1.3rem;font-weight:700;word-break:break-word' });
    recordTitle.textContent = record.name || '(Unnamed)';
    var metaLine = el('div', { style: 'display:flex;align-items:center;gap:10px;flex-wrap:wrap' });
    metaLine.appendChild(statusBadge(record.status));
    var createdSpan = el('span', { style: 'font-size:12px;color:#9ca3af' });
    createdSpan.textContent = 'Created ' + Utils.formatDate(record.createdAt);
    var updatedSpan = el('span', { style: 'font-size:12px;color:#9ca3af' });
    updatedSpan.textContent = '· Updated ' + Utils.formatRelativeTime(record.updatedAt);
    metaLine.appendChild(createdSpan);
    metaLine.appendChild(updatedSpan);
    titleWrap.appendChild(recordTitle);
    titleWrap.appendChild(metaLine);

    var editBtn = el('button', { style: 'padding:8px 18px;border-radius:6px;background:#2563eb;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:600' });
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function () {
      renderForm(classId, record, container,
        function (saved) { renderDetail(classId, saved.id, container); },
        function () { renderDetail(classId, recordId, container); }
      );
    });

    header.appendChild(backBtn);
    header.appendChild(titleWrap);
    header.appendChild(editBtn);
    container.appendChild(header);

    // ── Core fields DL ───────────────────────────────────────────────────────
    var section = el('div', { style: 'background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px' });
    var sectionTitle = el('h3', { style: 'margin:0 0 14px;font-size:1rem;font-weight:700;color:#374151' });
    sectionTitle.textContent = caption + ' Details';
    section.appendChild(sectionTitle);

    var dl = el('dl', { style: 'margin:0;display:grid;grid-template-columns:160px 1fr;gap:8px 16px' });

    function addDlRow(term, value) {
      var dt = el('dt', { style: 'font-weight:600;font-size:13px;color:#6b7280;padding:4px 0' });
      dt.textContent = term;
      var dd = el('dd', { style: 'margin:0;font-size:14px;color:#111827;padding:4px 0;word-break:break-word' });
      if (value instanceof Node) {
        dd.appendChild(value);
      } else {
        dd.textContent = (value !== null && value !== undefined && value !== '') ? String(value) : '—';
      }
      dl.appendChild(dt);
      dl.appendChild(dd);
    }

    addDlRow('Name', record.name);
    addDlRow('Description', record.description);
    addDlRow('Status', statusBadge(record.status));
    addDlRow('Created', Utils.formatDateTime(record.createdAt));
    addDlRow('Updated', Utils.formatDateTime(record.updatedAt));

    // Custom props
    var customProps = [];
    try { customProps = Storage.getCustomProps(classId) || []; } catch (e) {}
    customProps.forEach(function (prop) {
      var val = record[prop.key];
      if (prop.type === 'datetime' && val) val = Utils.formatDateTime(val);
      addDlRow(prop.label || prop.name, val);
    });

    section.appendChild(dl);
    container.appendChild(section);

    // ── Outgoing relations panel ──────────────────────────────────────────────
    if (relations.length > 0) {
      var relSection = el('div', { style: 'background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px' });
      var relTitle = el('h3', { style: 'margin:0 0 14px;font-size:1rem;font-weight:700;color:#374151' });
      relTitle.textContent = 'Related Records';
      relSection.appendChild(relTitle);

      var groupedRels = {};
      relations.forEach(function (r) {
        if (!groupedRels[r.relName]) groupedRels[r.relName] = [];
        groupedRels[r.relName].push(r);
      });

      Object.keys(groupedRels).forEach(function (relName) {
        var items = groupedRels[relName];
        var subTitle = el('h4', { style: 'margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em' });
        subTitle.textContent = relName;
        relSection.appendChild(subTitle);

        var list = el('ul', { style: 'margin:0 0 14px;padding-left:0;list-style:none;display:flex;flex-wrap:wrap;gap:8px' });
        items.forEach(function (item) {
          var li = el('li');
          if (item.targetRecord) {
            var link = el('button', { style: 'padding:4px 12px;border-radius:6px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;cursor:pointer;font-size:13px' });
            link.textContent = item.targetRecord.name || item.targetId;
            link.addEventListener('click', function () {
              if (window.App && App.route) {
                App.route('#/detail/' + item.targetClass + '/' + item.targetId);
              } else {
                renderDetail(item.targetClass, item.targetId, container);
              }
            });
            li.appendChild(link);
          } else {
            var ghost = el('span', { style: 'padding:4px 12px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#9ca3af;font-size:13px;font-style:italic' });
            ghost.textContent = '(deleted: ' + item.targetId + ')';
            li.appendChild(ghost);
          }
          list.appendChild(li);
        });
        relSection.appendChild(list);
      });

      container.appendChild(relSection);
    }

    // ── Incoming relations panel ──────────────────────────────────────────────
    var incomingRels = [];
    try {
      if (typeof Storage.getIncomingRelations === 'function') {
        incomingRels = Storage.getIncomingRelations(classId, recordId) || [];
      } else if (typeof Storage.getRelationsTo === 'function') {
        incomingRels = Storage.getRelationsTo(classId, recordId) || [];
      }
    } catch (e) {}
    if (incomingRels.length > 0) {
      var inSection = el('div', { style: 'background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px' });
      var inTitle = el('h3', { style: 'margin:0 0 14px;font-size:1rem;font-weight:700;color:#374151' });
      inTitle.textContent = 'Referenced By';
      inSection.appendChild(inTitle);

      incomingRels.forEach(function (rel) {
        var srcClass = rel.sourceClass || (rel.sourceKey ? rel.sourceKey.split('_')[0] : '');
        var srcId = rel.sourceId || (rel.sourceKey && rel.sourceKey.indexOf('_') >= 0 ? rel.sourceKey.substring(rel.sourceKey.indexOf('_') + 1) : '');
        var sourceRecord = null;
        try { if (srcClass && srcId) sourceRecord = Storage.getRecord(srcClass, srcId); } catch (e) {}
        var row = el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:8px' });
        var typeBadge = el('span', { style: 'font-size:12px;color:#6b7280;font-style:italic' });
        typeBadge.textContent = (srcClass || '') + ' → ' + (rel.relName || '');
        if (sourceRecord) {
          var link = el('button', { style: 'padding:4px 12px;border-radius:6px;border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;cursor:pointer;font-size:13px' });
          link.textContent = sourceRecord.name || srcId;
          link.addEventListener('click', function () {
            if (window.App && App.route) {
              App.route('#/detail/' + srcClass + '/' + srcId);
            } else {
              renderDetail(srcClass, srcId, container);
            }
          });
          row.appendChild(typeBadge);
          row.appendChild(link);
        } else {
          typeBadge.textContent += ' (deleted)';
          row.appendChild(typeBadge);
        }
        inSection.appendChild(row);
      });

      container.appendChild(inSection);
    }
  }

  // ── _renderField ───────────────────────────────────────────────────────────

  function _renderField(field, value) {
    var baseStyle = 'width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;box-sizing:border-box';
    var input;

    switch (field.type) {
      case 'text':
        input = el('input', { type: 'text', name: field.key, style: baseStyle });
        input.value = value !== undefined && value !== null ? String(value) : '';
        return input;

      case 'number':
        input = el('input', { type: 'number', name: field.key, style: baseStyle });
        input.value = value !== undefined && value !== null ? String(value) : '';
        return input;

      case 'datetime':
        input = el('input', { type: 'datetime-local', name: field.key, style: baseStyle });
        // Convert ISO string to datetime-local format (remove milliseconds and Z)
        if (value) {
          try { input.value = value.slice(0, 16); } catch (e) {}
        }
        return input;

      case 'lookup':
        input = el('select', { name: field.key, style: baseStyle + ';background:#fff' });
        var noneOpt = el('option');
        noneOpt.value = '';
        noneOpt.textContent = '— Select —';
        input.appendChild(noneOpt);

        if (field.options && Array.isArray(field.options)) {
          field.options.forEach(function (opt) {
            var o = el('option');
            o.value = opt;
            o.textContent = opt;
            if (value === opt) o.selected = true;
            input.appendChild(o);
          });
        } else if (field.targetClass) {
          var targetRecords = [];
          try { targetRecords = Storage.getRecords(field.targetClass) || []; } catch (e) {}
          targetRecords.forEach(function (tr) {
            var o = el('option');
            o.value = tr.id;
            o.textContent = tr.name || tr.id;
            if (value === tr.id) o.selected = true;
            input.appendChild(o);
          });
        }
        return input;

      default:
        // Fallback to text input
        input = el('input', { type: 'text', name: field.key, style: baseStyle });
        input.value = value !== undefined && value !== null ? String(value) : '';
        return input;
    }
  }

  // ── _validateForm ──────────────────────────────────────────────────────────

  function _validateForm(classId, formData) {
    var errors = [];
    if (!formData.name || !formData.name.trim()) {
      errors.push('Name is required.');
    }
    return errors;
  }

  // ── Expose ─────────────────────────────────────────────────────────────────
  window.Forms = {
    renderList:      renderList,
    renderForm:      renderForm,
    renderDetail:    renderDetail,
    _renderField:    _renderField,
    _validateForm:   _validateForm
  };

})();
