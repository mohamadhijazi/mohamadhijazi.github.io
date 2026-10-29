/**
 * charts.js — Pure SVG chart library (no canvas, no external dependencies)
 * Global: window.Charts
 */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  /* ─────────────────────────────────────────────
     Internal helpers
  ───────────────────────────────────────────── */
  function svgEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    }
    return e;
  }

  function svgText(content, attrs) {
    const t = svgEl('text', attrs);
    t.textContent = content;
    return t;
  }

  function svgLine(attrs) { return svgEl('line', attrs); }
  function svgRect(attrs) { return svgEl('rect', attrs); }
  function svgCircle(attrs) { return svgEl('circle', attrs); }

  /**
   * Returns a <div> wrapping a placeholder message for empty data.
   * @param {string} message
   * @returns {HTMLElement}
   */
  function _emptyState(message) {
    const d = document.createElement('div');
    d.className = 'chart-empty-state';
    d.setAttribute('role', 'status');
    d.setAttribute('aria-label', message);
    d.textContent = message;
    d.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:2rem;color:#6b7280;font-size:.875rem;border:1px dashed #d1d5db;border-radius:.5rem;';
    return d;
  }

  /**
   * Creates an SVG root element with viewBox and 100% width.
   * @param {number} width
   * @param {number} height
   * @returns {SVGElement}
   */
  function _createSVG(width, height) {
    const svg = svgEl('svg', {
      xmlns: NS,
      viewBox: '0 0 ' + width + ' ' + height,
      width: '100%',
      height: 'auto',
      style: 'max-width:' + width + 'px;display:block;'
    });
    return svg;
  }

  const _colors = [
    '#1a56db', '#0e9f6e', '#d97706', '#e02424',
    '#7c3aed', '#db2777', '#059669', '#b45309',
    '#0891b2', '#dc2626', '#65a30d', '#9333ea'
  ];

  function getColor(idx, override) {
    return override || _colors[idx % _colors.length];
  }

  function maxVal(data) {
    return Math.max(...data.map(d => d.value), 0);
  }

  /* ─────────────────────────────────────────────
     BAR CHART
  ───────────────────────────────────────────── */
  function bar(data, options) {
    options = options || {};
    if (!Array.isArray(data) || data.length === 0) return _emptyState('No data available');

    const W = options.width || 400;
    const H = options.height || 300;
    const title = options.title || '';
    const showValues = options.showValues !== false;

    const PADDING = { top: title ? 40 : 20, right: 20, bottom: 60, left: 50 };
    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    const svg = _createSVG(W, H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', title || 'Bar chart');

    if (title) {
      svg.appendChild(svgText(title, {
        x: W / 2,
        y: 22,
        'text-anchor': 'middle',
        'font-size': '14',
        'font-weight': 'bold',
        fill: '#111827'
      }));
    }

    const mv = maxVal(data);
    const yMax = mv === 0 ? 1 : mv * 1.15;
    const barCount = data.length;
    const barW = Math.max(4, (chartW / barCount) * 0.6);
    const gap = chartW / barCount;

    // Y-axis ticks & grid lines
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      const tickVal = (yMax / tickCount) * i;
      const y = PADDING.top + chartH - (tickVal / yMax) * chartH;
      // grid line
      svg.appendChild(svgLine({
        x1: PADDING.left, y1: y,
        x2: PADDING.left + chartW, y2: y,
        stroke: '#e5e7eb', 'stroke-width': '1'
      }));
      // tick label
      svg.appendChild(svgText(Math.round(tickVal), {
        x: PADDING.left - 6,
        y: y + 4,
        'text-anchor': 'end',
        'font-size': '10',
        fill: '#6b7280'
      }));
    }

    // Axes
    svg.appendChild(svgLine({
      x1: PADDING.left, y1: PADDING.top,
      x2: PADDING.left, y2: PADDING.top + chartH,
      stroke: '#374151', 'stroke-width': '1.5'
    }));
    svg.appendChild(svgLine({
      x1: PADDING.left, y1: PADDING.top + chartH,
      x2: PADDING.left + chartW, y2: PADDING.top + chartH,
      stroke: '#374151', 'stroke-width': '1.5'
    }));

    // Bars
    data.forEach((d, idx) => {
      const barH = yMax > 0 ? (d.value / yMax) * chartH : 0;
      const cx = PADDING.left + gap * idx + gap / 2;
      const x = cx - barW / 2;
      const y = PADDING.top + chartH - barH;

      const rect = svgRect({
        x: x.toFixed(1), y: y.toFixed(1),
        width: barW.toFixed(1), height: Math.max(0, barH).toFixed(1),
        fill: getColor(idx, d.color),
        rx: '3'
      });
      rect.appendChild(svgEl('title', null));
      rect.querySelector('title').textContent = d.label + ': ' + d.value;
      svg.appendChild(rect);

      // Value label above bar
      if (showValues && barH > 0) {
        svg.appendChild(svgText(d.value, {
          x: cx.toFixed(1),
          y: (y - 4).toFixed(1),
          'text-anchor': 'middle',
          'font-size': '10',
          fill: '#374151'
        }));
      }

      // X-axis label
      const labelEl = svgEl('text', {
        x: cx.toFixed(1),
        y: (PADDING.top + chartH + 14).toFixed(1),
        'text-anchor': 'middle',
        'font-size': '10',
        fill: '#6b7280',
        transform: 'rotate(-30,' + cx.toFixed(1) + ',' + (PADDING.top + chartH + 14).toFixed(1) + ')'
      });
      labelEl.textContent = d.label.length > 12 ? d.label.slice(0, 11) + '…' : d.label;
      svg.appendChild(labelEl);
    });

    return svg;
  }

  /* ─────────────────────────────────────────────
     PIE helpers
  ───────────────────────────────────────────── */
  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(cx, cy, r, startAngle, endAngle, innerR) {
    const largeArc = (endAngle - startAngle > 180) ? 1 : 0;
    const s = polarToCartesian(cx, cy, r, startAngle);
    const e = polarToCartesian(cx, cy, r, endAngle);
    if (innerR > 0) {
      const si = polarToCartesian(cx, cy, innerR, endAngle);
      const ei = polarToCartesian(cx, cy, innerR, startAngle);
      return [
        'M', s.x.toFixed(2), s.y.toFixed(2),
        'A', r, r, 0, largeArc, 1, e.x.toFixed(2), e.y.toFixed(2),
        'L', si.x.toFixed(2), si.y.toFixed(2),
        'A', innerR, innerR, 0, largeArc, 0, ei.x.toFixed(2), ei.y.toFixed(2),
        'Z'
      ].join(' ');
    }
    return [
      'M', cx.toFixed(2), cy.toFixed(2),
      'L', s.x.toFixed(2), s.y.toFixed(2),
      'A', r, r, 0, largeArc, 1, e.x.toFixed(2), e.y.toFixed(2),
      'Z'
    ].join(' ');
  }

  function buildPieOrDonut(data, options, isDonut) {
    if (!Array.isArray(data) || data.length === 0) return _emptyState('No data available');
    options = options || {};

    const W = options.width || 400;
    const LEGEND_H = Math.ceil(data.length / 2) * 22 + 16;
    const H = (options.height || 300) + LEGEND_H;
    const title = options.title || '';
    const TITLE_H = title ? 30 : 0;
    const cx = W / 2;
    const cy = TITLE_H + (H - LEGEND_H - TITLE_H) / 2;
    const R = Math.min(W / 2, (H - LEGEND_H - TITLE_H) / 2) - 16;
    const innerR = isDonut ? R * 0.6 : 0;

    let total = 0;
    try {
      total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);
    } catch (e) {
      total = 0;
      for (var i = 0; i < data.length; i++) total += Number(data[i] && data[i].value) || 0;
    }
    if (total === 0) return _emptyState('No data available');

    const svg = _createSVG(W, H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', title || (isDonut ? 'Donut chart' : 'Pie chart'));

    if (title) {
      svg.appendChild(svgText(title, {
        x: W / 2, y: 20,
        'text-anchor': 'middle',
        'font-size': '14',
        'font-weight': 'bold',
        fill: '#111827'
      }));
    }

    let startAngle = 0;
    data.forEach((d, idx) => {
      const sweep = (d.value / total) * 360;
      const endAngle = startAngle + sweep;
      const path = svgEl('path', {
        d: arcPath(cx, cy, R, startAngle, endAngle - 0.3, innerR),
        fill: getColor(idx, d.color)
      });
      const titleEl = svgEl('title');
      titleEl.textContent = d.label + ': ' + d.value + ' (' + ((d.value / total) * 100).toFixed(1) + '%)';
      path.appendChild(titleEl);
      svg.appendChild(path);
      startAngle = endAngle;
    });

    // Donut center text
    if (isDonut) {
      svg.appendChild(svgText(total, {
        x: cx.toFixed(1), y: (cy - 6).toFixed(1),
        'text-anchor': 'middle',
        'font-size': '22',
        'font-weight': 'bold',
        fill: '#111827'
      }));
      svg.appendChild(svgText('total', {
        x: cx.toFixed(1), y: (cy + 14).toFixed(1),
        'text-anchor': 'middle',
        'font-size': '11',
        fill: '#6b7280'
      }));
    }

    // Legend
    const legendY = H - LEGEND_H + 8;
    data.forEach((d, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const lx = col === 0 ? 16 : W / 2 + 8;
      const ly = legendY + row * 22;

      svg.appendChild(svgRect({ x: lx, y: ly, width: 12, height: 12, fill: getColor(idx, d.color), rx: '2' }));
      const pct = ((d.value / total) * 100).toFixed(1) + '%';
      const labelEl = svgEl('text', {
        x: lx + 16, y: ly + 10,
        'font-size': '11',
        fill: '#374151'
      });
      labelEl.textContent = d.label + ' (' + pct + ')';
      svg.appendChild(labelEl);
    });

    return svg;
  }

  /* ─────────────────────────────────────────────
     PIE CHART
  ───────────────────────────────────────────── */
  function pie(data, options) {
    if (!Array.isArray(data)) return _emptyState('No data available');
    return buildPieOrDonut(data, options, false);
  }

  /* ─────────────────────────────────────────────
     DONUT CHART
  ───────────────────────────────────────────── */
  function donut(data, options) {
    if (!Array.isArray(data)) return _emptyState('No data available');
    return buildPieOrDonut(data, options, true);
  }

  /* ─────────────────────────────────────────────
     LINE CHART
  ───────────────────────────────────────────── */
  function line(data, options) {
    if (!Array.isArray(data) || data.length === 0) return _emptyState('No data available');
    options = options || {};

    const W = options.width || 400;
    const H = options.height || 300;
    const title = options.title || '';

    const PADDING = { top: title ? 40 : 20, right: 20, bottom: 50, left: 50 };
    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    // Detect multi-series: [{label, values: [...]}] or single [{label, value}]
    const isMultiSeries = data[0] && Array.isArray(data[0].values);

    let series = []; // [{color, points: [{x,y,label,val}]}]
    if (isMultiSeries) {
      const seriesCount = data[0].values.length;
      for (let s = 0; s < seriesCount; s++) {
        series.push({ color: getColor(s), points: data.map((d, i) => ({ i, label: d.label, val: d.values[s] })) });
      }
    } else {
      series = [{ color: getColor(0), points: data.map((d, i) => ({ i, label: d.label, val: d.value })) }];
    }

    const allVals = series.flatMap(s => s.points.map(p => p.val));
    const vMin = 0;
    const vMax = Math.max(...allVals, 0) * 1.15 || 1;
    const xCount = data.length;

    const svg = _createSVG(W, H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', title || 'Line chart');

    if (title) {
      svg.appendChild(svgText(title, {
        x: W / 2, y: 22,
        'text-anchor': 'middle',
        'font-size': '14',
        'font-weight': 'bold',
        fill: '#111827'
      }));
    }

    // Grid + Y axis ticks
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      const tv = vMin + (vMax - vMin) / tickCount * i;
      const ty = PADDING.top + chartH - ((tv - vMin) / (vMax - vMin)) * chartH;
      svg.appendChild(svgLine({
        x1: PADDING.left, y1: ty.toFixed(1),
        x2: PADDING.left + chartW, y2: ty.toFixed(1),
        stroke: '#e5e7eb', 'stroke-width': '1'
      }));
      svg.appendChild(svgText(Math.round(tv), {
        x: PADDING.left - 6, y: (ty + 4).toFixed(1),
        'text-anchor': 'end', 'font-size': '10', fill: '#6b7280'
      }));
    }

    // Axes
    svg.appendChild(svgLine({
      x1: PADDING.left, y1: PADDING.top,
      x2: PADDING.left, y2: PADDING.top + chartH,
      stroke: '#374151', 'stroke-width': '1.5'
    }));
    svg.appendChild(svgLine({
      x1: PADDING.left, y1: PADDING.top + chartH,
      x2: PADDING.left + chartW, y2: PADDING.top + chartH,
      stroke: '#374151', 'stroke-width': '1.5'
    }));

    // X-axis labels
    data.forEach((d, i) => {
      const x = PADDING.left + (xCount === 1 ? chartW / 2 : (i / (xCount - 1)) * chartW);
      const labelEl = svgEl('text', {
        x: x.toFixed(1),
        y: (PADDING.top + chartH + 14).toFixed(1),
        'text-anchor': 'middle',
        'font-size': '10',
        fill: '#6b7280',
        transform: 'rotate(-30,' + x.toFixed(1) + ',' + (PADDING.top + chartH + 14).toFixed(1) + ')'
      });
      labelEl.textContent = d.label.length > 10 ? d.label.slice(0, 9) + '…' : d.label;
      svg.appendChild(labelEl);
    });

    // Lines and dots per series
    series.forEach(sr => {
      const ptCoords = sr.points.map((p, i) => {
        const x = PADDING.left + (xCount === 1 ? chartW / 2 : (i / (xCount - 1)) * chartW);
        const y = PADDING.top + chartH - ((p.val - vMin) / (vMax - vMin)) * chartH;
        return { x, y, label: p.label, val: p.val };
      });

      // polyline
      const pointsStr = ptCoords.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
      svg.appendChild(svgEl('polyline', {
        points: pointsStr,
        fill: 'none',
        stroke: sr.color,
        'stroke-width': '2',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round'
      }));

      // dots
      ptCoords.forEach(p => {
        const c = svgCircle({ cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: '4', fill: sr.color, stroke: '#fff', 'stroke-width': '1.5' });
        const titleEl = svgEl('title');
        titleEl.textContent = p.label + ': ' + p.val;
        c.appendChild(titleEl);
        svg.appendChild(c);
      });
    });

    return svg;
  }

  /* ─────────────────────────────────────────────
     TIMELINE CHART (Gantt-style)
  ───────────────────────────────────────────── */
  function timeline(items, options) {
    if (!Array.isArray(items) || items.length === 0) return _emptyState('No data available');
    options = options || {};

    const LABEL_W = 140;
    const ROW_H = 32;
    const PADDING = { top: 40, right: 20, bottom: 30 };
    const W = options.width || 600;
    const title = options.title || '';
    const TITLE_H = title ? 30 : 0;
    const H = TITLE_H + PADDING.top + items.length * ROW_H + PADDING.bottom;
    const BAR_AREA_W = W - LABEL_W - PADDING.right;

    // Parse dates
    const toMs = v => {
      if (!v) return 0;
      if (typeof v === 'number') return v;
      return new Date(v).getTime() || 0;
    };

    const minMs = Math.min(...items.map(it => toMs(it.startDate)));
    const maxMs = Math.max(...items.map(it => toMs(it.endDate)));
    const span = maxMs - minMs || 1;

    const svg = _createSVG(W, H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', title || 'Timeline chart');

    if (title) {
      svg.appendChild(svgText(title, {
        x: W / 2, y: 20,
        'text-anchor': 'middle',
        'font-size': '14',
        'font-weight': 'bold',
        fill: '#111827'
      }));
    }

    // Header row labels
    const headerY = TITLE_H + 20;
    svg.appendChild(svgText('Task', {
      x: 8, y: headerY,
      'font-size': '11', 'font-weight': 'bold', fill: '#374151'
    }));
    svg.appendChild(svgText('Timeline', {
      x: LABEL_W + BAR_AREA_W / 2, y: headerY,
      'text-anchor': 'middle',
      'font-size': '11', 'font-weight': 'bold', fill: '#374151'
    }));

    // Divider
    svg.appendChild(svgLine({
      x1: 0, y1: TITLE_H + 28,
      x2: W, y2: TITLE_H + 28,
      stroke: '#e5e7eb', 'stroke-width': '1'
    }));

    items.forEach((item, idx) => {
      const y = TITLE_H + PADDING.top + idx * ROW_H;
      const rowY = y + ROW_H / 2;

      // Alternate row background
      if (idx % 2 === 0) {
        svg.appendChild(svgRect({ x: 0, y: y, width: W, height: ROW_H, fill: '#f9fafb' }));
      }

      // Label
      const labelEl = svgEl('text', {
        x: 8, y: rowY + 4,
        'font-size': '11', fill: '#374151'
      });
      const lbl = (item.label || '').length > 18 ? item.label.slice(0, 17) + '…' : (item.label || '');
      labelEl.textContent = lbl;
      svg.appendChild(labelEl);

      // Bar
      const sMs = toMs(item.startDate);
      const eMs = toMs(item.endDate);
      if (sMs && eMs && eMs >= sMs) {
        const bx = LABEL_W + ((sMs - minMs) / span) * BAR_AREA_W;
        const bw = Math.max(4, ((eMs - sMs) / span) * BAR_AREA_W);
        const barEl = svgRect({
          x: bx.toFixed(1),
          y: (y + 6).toFixed(1),
          width: bw.toFixed(1),
          height: (ROW_H - 12).toFixed(1),
          fill: getColor(idx, item.color),
          rx: '3'
        });
        const titleEl = svgEl('title');
        titleEl.textContent = (item.label || '') + ': ' + (item.startDate || '') + ' → ' + (item.endDate || '');
        barEl.appendChild(titleEl);
        svg.appendChild(barEl);
      }
    });

    return svg;
  }

  /* ─────────────────────────────────────────────
     Public API
  ───────────────────────────────────────────── */
  window.Charts = {
    bar,
    pie,
    donut,
    line,
    timeline,
    _createSVG,
    _colors,
    _emptyState
  };
})();
