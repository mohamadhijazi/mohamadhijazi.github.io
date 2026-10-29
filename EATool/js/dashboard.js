/**
 * dashboard.js — Dashboard view for EA Tool
 * Exposes window.Dashboard as a global namespace (no ES modules)
 * Depends on: Utils, Storage, MetaModel, Records, Forms, Charts
 */
(function () {
  'use strict';

  // ── Domain colour palette (matches domain nav sections) ───────────────────
  var DOMAIN_COLORS = {
    Organization: '#6366f1',
    Strategy:     '#8b5cf6',
    Processes:    '#f59e0b',
    Solutions:    '#10b981',
    Applications: '#3b82f6',
    Integrations: '#06b6d4',
    Technology:   '#64748b',
    Other:        '#94a3b8'
  };

  // KPI classes with associated icons
  var KPI_CLASSES = [
    { id: 'Application',      icon: '🖥️'  },
    { id: 'BusinessProcess',  icon: '⚙️'  },
    { id: 'OrgaUnit',         icon: '🏢'  },
    { id: 'Technology',       icon: '🔧'  },
    { id: 'Domain',           icon: '🗂️'  },
    { id: 'InformationFlow',  icon: '🔀'  },
    { id: 'SolutionComponent',icon: '🧩'  },
    { id: 'Component',        icon: '📦'  }
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────

  function _el(tag, cls, attrs) {
    var elem = document.createElement(tag);
    if (cls) elem.className = cls;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        elem.setAttribute(k, attrs[k]);
      });
    }
    return elem;
  }

  function _allRecords() {
    var all = [];
    MetaModel.getAllClasses().forEach(function (cls) {
      var recs = Storage.getRecords(cls.id);
      recs.forEach(function (r) {
        all.push({ record: r, cls: cls });
      });
    });
    return all;
  }

  // ── Dashboard.render ──────────────────────────────────────────────────────

  function render(container) {
    container.innerHTML = '';

    // Page header
    var header = _el('div', 'page-header');
    var titleWrap = _el('div');
    var title = _el('h1', 'page-title');
    title.textContent = 'Dashboard';
    var subtitle = _el('p', 'page-subtitle');
    subtitle.textContent = 'Enterprise Architecture Overview';
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);
    header.appendChild(titleWrap);
    container.appendChild(header);

    // KPI cards row
    var kpiSection = _el('div');
    _renderKPICards(kpiSection);
    container.appendChild(kpiSection);

    // Check if there are any records at all
    var allRecs = _allRecords();
    var hasData = allRecs.length > 0;

    if (!hasData) {
      // Empty state
      var empty = _el('div', 'empty-state');
      empty.style.cssText = 'text-align:center;padding:64px 24px;';
      var emptyIcon = _el('div');
      emptyIcon.style.cssText = 'font-size:4rem;margin-bottom:16px;';
      emptyIcon.textContent = '🏗️';
      var emptyTitle = _el('h3');
      emptyTitle.style.cssText = 'font-size:1.25rem;font-weight:600;color:#374151;margin-bottom:8px;';
      emptyTitle.textContent = 'No records yet';
      var emptyMsg = _el('p');
      emptyMsg.style.cssText = 'color:#6b7280;font-size:0.875rem;margin-bottom:24px;';
      emptyMsg.textContent = 'Get started by creating your first records';
      var emptyBtn = _el('a', 'btn btn-primary');
      emptyBtn.href = '#/studio';
      emptyBtn.textContent = 'Open Studio';
      empty.appendChild(emptyIcon);
      empty.appendChild(emptyTitle);
      empty.appendChild(emptyMsg);
      empty.appendChild(emptyBtn);
      container.appendChild(empty);
      return;
    }

    // Two-column widget grid
    var widgetGrid = _el('div');
    widgetGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;';

    var activityCol = _el('div');
    _renderActivityFeed(activityCol);
    widgetGrid.appendChild(activityCol);

    var chartCol = _el('div');
    _renderStatusChart(chartCol);
    widgetGrid.appendChild(chartCol);

    container.appendChild(widgetGrid);

    // Saved charts panel
    var chartsSection = _el('div');
    _renderChartsPanel(chartsSection);
    container.appendChild(chartsSection);
  }

  // ── Dashboard._renderKPICards ─────────────────────────────────────────────

  function _renderKPICards(container) {
    var grid = _el('div');
    grid.style.cssText = [
      'display:grid',
      'grid-template-columns:repeat(auto-fill,minmax(180px,1fr))',
      'gap:16px',
      'margin-bottom:24px'
    ].join(';');

    var hasAny = false;

    KPI_CLASSES.forEach(function (def) {
      var cls = MetaModel.getClass(def.id);
      var label = cls ? cls.caption : def.id;
      var count = Storage.getRecords(def.id).length;
      if (count > 0) hasAny = true;

      var domain = MetaModel.getDomain(def.id);
      var color  = DOMAIN_COLORS[domain] || DOMAIN_COLORS.Other;

      var card = _el('div');
      card.style.cssText = [
        'background:#fff',
        'border-radius:10px',
        'box-shadow:0 1px 3px rgba(0,0,0,.05),0 1px 2px rgba(0,0,0,.03)',
        'padding:18px 16px',
        'border:1px solid #e5e7eb',
        'border-left:4px solid ' + color,
        'display:flex',
        'flex-direction:column',
        'gap:8px',
        'cursor:pointer',
        'transition:all 0.2s ease'
      ].join(';');
      card.addEventListener('mouseenter', function () {
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)';
        card.style.transform = 'translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.boxShadow = '0 1px 3px rgba(0,0,0,.05),0 1px 2px rgba(0,0,0,.03)';
        card.style.transform = 'translateY(0)';
      });
      card.addEventListener('click', function () {
        var path = domain.toLowerCase() + '/' + def.id;
        if (window.App && App.navigate) App.navigate(path);
      });

      var topRow = _el('div');
      topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';

      var iconEl = _el('div');
      iconEl.style.cssText = 'font-size:1.5rem;line-height:1;';
      iconEl.textContent = def.icon;

      var countEl = _el('div');
      countEl.style.cssText = 'font-size:2rem;font-weight:700;color:#111827;line-height:1.1;';
      countEl.textContent = count;

      topRow.appendChild(iconEl);

      var labelEl = _el('div');
      labelEl.style.cssText = 'font-size:0.8125rem;color:#6b7280;font-weight:500;';
      labelEl.textContent = label;

      card.appendChild(topRow);
      card.appendChild(countEl);
      card.appendChild(labelEl);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  // ── Dashboard._renderActivityFeed ─────────────────────────────────────────

  function _renderActivityFeed(container) {
    var card = _el('div');
    card.style.cssText = [
      'background:#fff',
      'border-radius:10px',
      'box-shadow:0 1px 4px rgba(0,0,0,.08)',
      'padding:20px',
      'height:100%'
    ].join(';');

    var heading = _el('h3');
    heading.style.cssText = 'font-size:1rem;font-weight:600;color:#111827;margin-bottom:16px;';
    heading.textContent = 'Recent Activity';
    card.appendChild(heading);

    // Collect and sort all records
    var flat = _allRecords();
    if (flat.length === 0) {
      var empty = _el('div');
      empty.style.cssText = 'text-align:center;padding:32px 0;color:#9ca3af;font-size:0.875rem;';
      empty.textContent = 'No activity yet. Create your first record to get started.';
      card.appendChild(empty);
      container.appendChild(card);
      return;
    }

    flat.sort(function (a, b) {
      var ta = a.record.updatedAt || a.record.createdAt || '';
      var tb = b.record.updatedAt || b.record.createdAt || '';
      return tb.localeCompare(ta);
    });

    var top10 = flat.slice(0, 10);
    var list = _el('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:0;';

    top10.forEach(function (item, idx) {
      var row = _el('div');
      row.style.cssText = [
        'display:flex',
        'align-items:flex-start',
        'gap:12px',
        'padding:10px 0',
        idx < top10.length - 1 ? 'border-bottom:1px solid #f3f4f6' : ''
      ].join(';');

      var domain = MetaModel.getDomain(item.cls.id);
      var color  = DOMAIN_COLORS[domain] || DOMAIN_COLORS.Other;
      var dot = _el('div');
      dot.style.cssText = [
        'width:8px;height:8px;border-radius:50%',
        'background:' + color,
        'margin-top:5px;flex-shrink:0'
      ].join(';');

      var info = _el('div');
      info.style.cssText = 'flex:1;min-width:0;';

      var name = _el('div');
      name.style.cssText = 'font-size:0.875rem;font-weight:500;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      name.textContent = Utils.escapeHtml(item.record.name || item.record.id || '(unnamed)');

      var meta = _el('div');
      meta.style.cssText = 'font-size:0.75rem;color:#9ca3af;margin-top:1px;';
      var rel = Utils.formatRelativeTime(item.record.updatedAt || item.record.createdAt);
      meta.textContent = item.cls.caption + ' · ' + rel;

      info.appendChild(name);
      info.appendChild(meta);
      row.appendChild(dot);
      row.appendChild(info);
      list.appendChild(row);
    });

    card.appendChild(list);
    container.appendChild(card);
  }

  // ── Dashboard._renderStatusChart ──────────────────────────────────────────

  function _renderStatusChart(container) {
    var card = _el('div');
    card.style.cssText = [
      'background:#fff',
      'border-radius:10px',
      'box-shadow:0 1px 4px rgba(0,0,0,.08)',
      'padding:20px'
    ].join(';');

    var heading = _el('h3');
    heading.style.cssText = 'font-size:1rem;font-weight:600;color:#111827;margin-bottom:16px;';
    heading.textContent = 'Status Distribution';
    card.appendChild(heading);

    var flat = _allRecords();
    if (flat.length === 0) {
      var empty = _el('div');
      empty.style.cssText = 'text-align:center;padding:32px 0;color:#9ca3af;font-size:0.875rem;';
      empty.textContent = 'No data to display.';
      card.appendChild(empty);
      container.appendChild(card);
      return;
    }

    // Group by status
    var groups = { Active: 0, Draft: 0, Archived: 0, Unknown: 0 };
    flat.forEach(function (item) {
      var s = item.record.status;
      if (s === 'Active' || s === 'Draft' || s === 'Archived') {
        groups[s]++;
      } else {
        groups.Unknown++;
      }
    });

    var chartData = [
      { label: 'Active',   value: groups.Active,   color: '#22c55e' },
      { label: 'Draft',    value: groups.Draft,     color: '#f59e0b' },
      { label: 'Archived', value: groups.Archived,  color: '#64748b' },
      { label: 'Unknown',  value: groups.Unknown,   color: '#d1d5db' }
    ].filter(function (d) { return d.value > 0; });

    // Render using Charts.donut if available, else fallback
    var chartContainer = _el('div');
    chartContainer.style.cssText = 'display:flex;align-items:center;gap:24px;';

    var donutWrap = _el('div');
    donutWrap.style.cssText = 'flex-shrink:0;';

    if (window.Charts && typeof Charts.donut === 'function') {
      Charts.donut(donutWrap, chartData, { size: 140 });
    } else {
      _fallbackDonut(donutWrap, chartData, 140);
    }

    var legend = _el('div');
    legend.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    chartData.forEach(function (d) {
      var row = _el('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:0.8rem;';
      var swatch = _el('div');
      swatch.style.cssText = 'width:10px;height:10px;border-radius:2px;background:' + d.color + ';flex-shrink:0;';
      var label = _el('span');
      label.style.cssText = 'color:#6b7280;';
      label.textContent = d.label;
      var count = _el('span');
      count.style.cssText = 'font-weight:600;color:#374151;margin-left:auto;';
      count.textContent = d.value;
      row.appendChild(swatch);
      row.appendChild(label);
      row.appendChild(count);
      legend.appendChild(row);
    });

    chartContainer.appendChild(donutWrap);
    chartContainer.appendChild(legend);
    card.appendChild(chartContainer);
    container.appendChild(card);
  }

  // SVG-based fallback donut when Charts.donut is unavailable
  function _fallbackDonut(container, data, size) {
    if (!Array.isArray(data)) data = [];
    var total = 0;
    try {
      total = data.reduce(function (s, d) { return s + (Number(d.value) || 0); }, 0);
    } catch (e) {
      total = 0;
      for (var i = 0; i < data.length; i++) total += Number(data[i] && data[i].value) || 0;
    }
    if (total === 0) {
      var msg = _el('div');
      msg.style.cssText = 'color:#9ca3af;font-size:0.8rem;';
      msg.textContent = 'No data';
      container.appendChild(msg);
      return;
    }

    var r = size / 2;
    var inner = r * 0.55;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);

    var angle = -Math.PI / 2;
    data.forEach(function (d) {
      if (d.value === 0) return;
      var sweep = (d.value / total) * 2 * Math.PI;
      var x1 = r + r * Math.cos(angle);
      var y1 = r + r * Math.sin(angle);
      angle += sweep;
      var x2 = r + r * Math.cos(angle);
      var y2 = r + r * Math.sin(angle);
      var largeArc = sweep > Math.PI ? 1 : 0;

      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var d_attr = [
        'M', r, r,
        'L', x1, y1,
        'A', r, r, 0, largeArc, 1, x2, y2,
        'Z'
      ].join(' ');
      path.setAttribute('d', d_attr);
      path.setAttribute('fill', d.color);
      svg.appendChild(path);
    });

    // Inner circle for donut hole
    var hole = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hole.setAttribute('cx', r);
    hole.setAttribute('cy', r);
    hole.setAttribute('r', inner);
    hole.setAttribute('fill', '#fff');
    svg.appendChild(hole);

    // Center count text
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', r);
    text.setAttribute('y', r + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '1.1rem');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', '#374151');
    text.textContent = total;
    svg.appendChild(text);

    container.appendChild(svg);
  }

  // ── Dashboard._renderChartsPanel ──────────────────────────────────────────

  function _renderChartsPanel(container) {
    var charts = Storage.getCharts();
    var ids = Object.keys(charts);

    var section = _el('div');
    section.style.cssText = 'margin-top:8px;';

    var heading = _el('h3');
    heading.style.cssText = 'font-size:1rem;font-weight:600;color:#111827;margin-bottom:16px;';
    heading.textContent = 'Saved Charts';
    section.appendChild(heading);

    if (ids.length === 0) {
      var info = _el('div');
      info.style.cssText = [
        'background:#f8fafc',
        'border:1px dashed #cbd5e1',
        'border-radius:10px',
        'padding:32px',
        'text-align:center',
        'color:#94a3b8',
        'font-size:0.875rem'
      ].join(';');
      info.textContent = 'Create charts in Studio > Charts tab';
      section.appendChild(info);
      container.appendChild(section);
      return;
    }

    var grid = _el('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;';

    ids.forEach(function (id) {
      var def = charts[id];
      var card = _el('div');
      card.style.cssText = [
        'background:#fff',
        'border-radius:10px',
        'box-shadow:0 1px 4px rgba(0,0,0,.08)',
        'padding:20px'
      ].join(';');

      var chartTitle = _el('h4');
      chartTitle.style.cssText = 'font-size:0.9rem;font-weight:600;color:#374151;margin-bottom:12px;';
      chartTitle.textContent = Utils.escapeHtml(def.title || def.name || 'Untitled Chart');
      card.appendChild(chartTitle);

      // Compute data from records for this chart def
      var chartEl = _el('div');
      chartEl.style.cssText = 'min-height:120px;';

      if (window.Charts && def.classId && def.type) {
        try {
          var records = Storage.getRecords(def.classId);
          if (records.length === 0) {
            chartEl.style.cssText += 'display:flex;align-items:center;justify-content:center;';
            chartEl.style.color = '#9ca3af';
            chartEl.style.fontSize = '0.8rem';
            chartEl.textContent = 'No records for ' + Utils.escapeHtml(def.classId);
          } else {
            _renderSavedChart(chartEl, def, records);
          }
        } catch (e) {
          chartEl.style.color = '#ef4444';
          chartEl.style.fontSize = '0.8rem';
          chartEl.textContent = 'Chart render error';
          console.error('[Dashboard] Chart render error', e);
        }
      } else {
        chartEl.style.cssText += 'display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:0.8rem;';
        chartEl.textContent = 'Chart configuration incomplete';
      }

      card.appendChild(chartEl);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  }

  function _renderSavedChart(container, def, records) {
    // Build data array from records grouped by def.groupBy field or status
    var groupField = def.groupBy || 'status';
    var groups = {};
    records.forEach(function (r) {
      var key = r[groupField] || '(none)';
      groups[key] = (groups[key] || 0) + 1;
    });

    var data = Object.keys(groups).map(function (k, i) {
      var palette = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#64748b'];
      return { label: k, value: groups[k], color: palette[i % palette.length] };
    });

    if (!window.Charts) {
      _fallbackDonut(container, data, 120);
      return;
    }

    var type = (def.type || 'bar').toLowerCase();
    if (type === 'donut' || type === 'pie') {
      Charts.donut(container, data, { size: 120 });
    } else if (type === 'bar') {
      Charts.bar(container, data, { height: 160 });
    } else if (type === 'line') {
      Charts.line(container, data, { height: 160 });
    } else {
      _fallbackDonut(container, data, 120);
    }
  }

  // ── Expose ────────────────────────────────────────────────────────────────
  window.Dashboard = {
    render:              render,
    _renderKPICards:     _renderKPICards,
    _renderActivityFeed: _renderActivityFeed,
    _renderStatusChart:  _renderStatusChart,
    _renderChartsPanel:  _renderChartsPanel
  };

})();
