/**
 * planning.js — Kanban and Timeline views for EA Tool
 * Exposes window.Planning
 */
(function () {
  'use strict';

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
        if (typeof c === 'string') node.appendChild(document.createTextNode(c));
        else node.appendChild(c);
      });
    }
    return node;
  }

  function clearEl(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function esc(s) { return Utils.escapeHtml ? Utils.escapeHtml(s) : s; }

  function getStatusOptions() {
    return ['Draft', 'Active', 'In Progress', 'Review', 'Done', 'Archived'];
  }

  function renderKanban(container) {
    clearEl(container);

    var header = el('div', { className: 'page-header' });
    var titleWrap = el('div');
    var title = el('h1', { className: 'page-title' }, 'Kanban');
    var subtitle = el('p', { className: 'page-subtitle' }, 'Track work by status across your architecture records');
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);
    header.appendChild(titleWrap);

    var actions = el('div', { className: 'page-actions' });
    var timelineBtn = el('button', { className: 'btn btn-secondary' });
    timelineBtn.textContent = 'View Timeline';
    timelineBtn.addEventListener('click', function () { if (window.App) App.route('#/planning/timeline'); });
    actions.appendChild(timelineBtn);
    header.appendChild(actions);
    container.appendChild(header);

    var classes = (MetaModel.getAllClasses ? MetaModel.getAllClasses() : []);
    var classFilter = el('select', { className: 'form-control', style: 'max-width:240px;margin-bottom:16px' });
    var allOpt = el('option'); allOpt.value = ''; allOpt.textContent = 'All classes';
    classFilter.appendChild(allOpt);
    classes.forEach(function (cls) {
      var opt = el('option'); opt.value = cls.id; opt.textContent = cls.caption || cls.id;
      classFilter.appendChild(opt);
    });

    container.appendChild(classFilter);

    var boardWrap = el('div', { className: 'kanban-wrapper' });
    var board = el('div', { className: 'kanban-board' });
    boardWrap.appendChild(board);
    container.appendChild(boardWrap);

    function refresh() {
      clearEl(board);
      var statuses = getStatusOptions();
      var selectedClass = classFilter.value;
      statuses.forEach(function (status) {
        var column = el('div', { className: 'kanban-column' });
        var colHeader = el('div', { className: 'kanban-column-header' });
        var colTitle = el('div', { className: 'kanban-column-title' });
        colTitle.textContent = status;
        var count = el('span', { className: 'kanban-column-count' }, '0');
        colTitle.appendChild(count);
        colHeader.appendChild(colTitle);
        column.appendChild(colHeader);

        var list = el('div', { className: 'kanban-card-list' });
        column.appendChild(list);
        board.appendChild(column);

        var records = [];
        if (selectedClass) {
          records = (Records.list ? Records.list(selectedClass, {}) : Storage.getRecords(selectedClass));
        } else {
          classes.forEach(function (cls) {
            var recs = Storage.getRecords(cls.id) || [];
            recs.forEach(function (r) { records.push(r); });
          });
        }

        var filtered = records.filter(function (r) { return (r.status || 'Draft') === status; });
        count.textContent = filtered.length;

        if (filtered.length === 0) {
          var empty = el('div', { style: 'text-align:center;padding:12px;color:#9ca3af;font-size:12px' }, 'No items');
          list.appendChild(empty);
        } else {
          filtered.forEach(function (rec) {
            var card = el('div', { className: 'kanban-card' });
            var handle = el('div', { className: 'kanban-card-handle' });
            card.appendChild(handle);
            var top = el('div', { className: 'kanban-card-top' });
            var titleEl = el('div', { className: 'kanban-card-title' }, esc(rec.name || '(Unnamed)'));
            top.appendChild(titleEl);
            card.appendChild(top);

            var meta = el('div', { className: 'kanban-card-meta' });
            var metaLeft = el('div', { className: 'kanban-card-meta-left' });
            var clsId = rec._classId || '';
            var clsName = clsId && MetaModel.getClass ? ((MetaModel.getClass(clsId) || {}).caption || clsId) : '';
            if (clsName) {
              var badge = el('span', { className: 'badge' }, clsName);
              metaLeft.appendChild(badge);
            }
            meta.appendChild(metaLeft);
            card.appendChild(meta);

            card.addEventListener('click', function () {
              if (clsId) {
                if (window.App) App.route('#/detail/' + clsId + '/' + rec.id);
                else if (window.Forms) Forms.renderDetail(clsId, rec.id, container);
              }
            });
            list.appendChild(card);
          });
        }
      });
    }

    classFilter.addEventListener('change', refresh);
    refresh();
  }

  function renderTimeline(container) {
    clearEl(container);

    var header = el('div', { className: 'page-header' });
    var titleWrap = el('div');
    var title = el('h1', { className: 'page-title' }, 'Timeline');
    var subtitle = el('p', { className: 'page-subtitle' }, 'Schedule view for records with dates');
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);
    header.appendChild(titleWrap);

    var actions = el('div', { className: 'page-actions' });
    var kanbanBtn = el('button', { className: 'btn btn-secondary' });
    kanbanBtn.textContent = 'View Kanban';
    kanbanBtn.addEventListener('click', function () { if (window.App) App.route('#/planning/kanban'); });
    actions.appendChild(kanbanBtn);
    header.appendChild(actions);
    container.appendChild(header);

    var classes = (MetaModel.getAllClasses ? MetaModel.getAllClasses() : []);
    var classFilter = el('select', { className: 'form-control', style: 'max-width:240px;margin-bottom:16px' });
    var allOpt = el('option'); allOpt.value = ''; allOpt.textContent = 'All classes';
    classFilter.appendChild(allOpt);
    classes.forEach(function (cls) {
      var opt = el('option'); opt.value = cls.id; opt.textContent = cls.caption || cls.id;
      classFilter.appendChild(opt);
    });
    container.appendChild(classFilter);

    var chartWrap = el('div', { style: 'background:#fff;padding:16px;border:1px solid #e5e7eb;border-radius:8px' });
    container.appendChild(chartWrap);

    function refresh() {
      clearEl(chartWrap);
      var items = [];
      if (classFilter.value) {
        var recs = Storage.getRecords(classFilter.value) || [];
        recs.forEach(function (r) {
          var start = r.startDate || r.start || r.createdAt;
          var end = r.endDate || r.dueDate || r.end || r.updatedAt || r.createdAt;
          if (start && end) {
            items.push({ label: r.name || r.id, startDate: start, endDate: end });
          }
        });
      } else {
        classes.forEach(function (cls) {
          var recs = Storage.getRecords(cls.id) || [];
          recs.forEach(function (r) {
            var start = r.startDate || r.start || r.createdAt;
            var end = r.endDate || r.dueDate || r.end || r.updatedAt || r.createdAt;
            if (start && end) {
              items.push({ label: (r.name || r.id), startDate: start, endDate: end });
            }
          });
        });
      }

      if (items.length === 0) {
        chartWrap.appendChild(el('div', { style: 'text-align:center;color:#9ca3af;padding:40px' }, 'No records with start/end dates found. Add startDate/endDate or use dueDate on records.'));
        return;
      }

      if (window.Charts && Charts.timeline) {
        var svg = Charts.timeline(items, { width: 700, height: Math.max(200, 60 + items.length * 32) });
        chartWrap.appendChild(svg);
      } else {
        chartWrap.appendChild(el('div', { style: 'color:#9ca3af' }, 'Timeline chart not available'));
      }
    }

    classFilter.addEventListener('change', refresh);
    refresh();
  }

  window.Planning = {
    renderKanban: renderKanban,
    renderTimeline: renderTimeline
  };
})();
