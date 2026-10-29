/**
 * app.js — Main application controller and router for EA Tool
 * Depends on: utils, metamodel, storage, records, forms, charts, studio, dashboard
 * Exposes window.App
 */
(function () {
  'use strict';

  // ── Navigation order & icons ─────────────────────────────────────────
  var NAV_ORDER = ['Dashboard', 'Planning', 'Organization', 'Strategy', 'Processes', 'Solutions', 'Applications', 'Integrations', 'Technology', 'Reports'];

  var DOMAIN_ICONS = {
    Planning:     '📋',
    Organization: '🏢',
    Strategy:     '🎯',
    Processes:    '⚙️',
    Solutions:    '🧩',
    Applications: '🖥️',
    Integrations: '🔀',
    Technology:   '🔧',
    Reports:      '📄',
    Other:        '📁'
  };

  var CLASS_ICONS = {
    OrgaUnit:              '🏢',
    Person:                '👤',
    UserGroup:             '👥',
    VirtualOrgaUnit:       '🏢',
    OrganizationGroup:     '🏬',
    Domain:                '🗂️',
    BusinessCapability:    '🎯',
    Goal:                  '🏁',
    BusinessCapabilityMap: '🗺️',
    DomainGroup:           '📂',
    ITStrategy:            '📘',
    BusinessProcess:       '⚙️',
    BFActivity:            '🔄',
    BFEvent:               '⚡',
    BFGateway:             '🚪',
    BusinessProcessModel:  '📋',
    BusinessProcessGroup:  '📦',
    BusinessFunction:      '🔧',
    BusinessService:       '🛠️',
    SolutionComponent:     '🧩',
    SolutionBusinessSupport:'🤝',
    SolutionApplication:   '📱',
    SolutionDomain:        '🌐',
    SystemBuildingBlock:   '🧱',
    Application:           '🖥️',
    ApplicationGroup:      '📁',
    Component:             '📦',
    ComponentGroup:        '📚',
    FunctionalModule:      '🔌',
    InformationFlow:       '🔀',
    InterfaceSystem:       '🔌',
    IntegrationConnectionDetails: '🔗',
    ProposedInformationFlow:      '📤',
    Technology:            '🔧',
    TechnologyGroup:       '🏭',
    StandardPlatform:      '💻',
    StandardPlatformCategory:'📑',
    PlatformLayer:         '🏗️'
  };

  // ── Element refs ─────────────────────────────────────────────────────
  var App = {
    contentEl:      null,
    sidebarBodyEl:  null,
    sidebarEl:      null,
    hamburgerEl:    null,
    overlayEl:      null,
    breadcrumbCurEl: null,

    currentRoute:   null,
    metamodelReady: false
  };

  // ── Tiny DOM helpers (local scope) ──────────────────────────────────
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

  function clearEl(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function esc(s) {
    return Utils.escapeHtml(s);
  }

  // ── Shell setup ─────────────────────────────────────────────────────
  App.init = function () {
    App.contentEl      = document.getElementById('app-content');
    App.sidebarBodyEl  = document.getElementById('sidebar-body');
    App.sidebarEl      = document.getElementById('sidebar');
    App.hamburgerEl    = document.getElementById('hamburger');
    App.breadcrumbCurEl = document.getElementById('breadcrumb-current');

    App.overlayEl = document.createElement('div');
    App.overlayEl.className = 'sidebar-overlay';
    document.body.appendChild(App.overlayEl);

    App._setupShellListeners();
    App.bootstrap();
  };

  App._setupShellListeners = function () {
    // Toggle sidebar (mobile)
    App.hamburgerEl.addEventListener('click', function () {
      var open = App.sidebarEl.classList.toggle('open');
      App.overlayEl.classList.toggle('visible', open);
    });
    App.overlayEl.addEventListener('click', function () {
      App.sidebarEl.classList.remove('open');
      App.overlayEl.classList.remove('visible');
    });

    // Hash-based routing
    window.addEventListener('hashchange', function () {
      App.route(location.hash);
    });

    // Global search
    var searchInput = document.getElementById('topbar-search');
    if (searchInput) {
      searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          var q = searchInput.value.trim();
          if (q) App.route('#search/' + encodeURIComponent(q));
          searchInput.blur();
        }
      });
    }

    // Export / Import
    var btnExport = document.getElementById('btn-export');
    var btnImport = document.getElementById('btn-import');
    var btnClear  = document.getElementById('btn-clear-data');

    if (btnExport) btnExport.addEventListener('click', function () {
      Storage.exportAll();
      Utils.showToast('Data exported.', 'success');
    });

    var importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';
    document.body.appendChild(importInput);
    importInput.addEventListener('change', function () {
      var file = importInput.files && importInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var ok = Storage.importAll(ev.target.result);
        if (ok) {
          Utils.showToast('Data imported. Reloading view.', 'success');
          App.route(App.currentRoute || '#/dashboard');
        } else {
          Utils.showToast('Import failed: invalid file.', 'error');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
    if (btnImport) btnImport.addEventListener('click', function () { importInput.click(); });

    if (btnClear) btnClear.addEventListener('click', function () {
      if (window.confirm('Clear all local data? This cannot be undone.')) {
        localStorage.removeItem(Storage.STORAGE_KEY);
        location.reload();
      }
    });
  };

  // ── Bootstrap ───────────────────────────────────────────────────────
  App.bootstrap = function () {
    App.renderLoading(App.contentEl);

    if (typeof MetaModel === 'undefined' || typeof MetaModel.load !== 'function') {
      App.renderError('Failed to initialize metamodel: MetaModel not loaded.');
      return;
    }

    try {
      var loadPromise = MetaModel.load();
      if (!loadPromise || typeof loadPromise.then !== 'function') {
        App.metamodelReady = true;
        if (typeof Storage !== 'undefined') Storage.init();
        if (typeof SampleData !== 'undefined' && SampleData.seed) SampleData.seed();
        App.buildNav();
        App.route(location.hash || '#/dashboard');
        return;
      }
      loadPromise
        .then(function () {
          App.metamodelReady = true;
          if (typeof Storage !== 'undefined') Storage.init();
          if (typeof SampleData !== 'undefined' && SampleData.seed) SampleData.seed();
          App.buildNav();
          App.route(location.hash || '#/dashboard');
        })
        .catch(function (err) {
          App.renderError('Failed to initialize metamodel: ' + esc((err && err.message) ? err.message : String(err)));
        });
    } catch (err) {
      App.renderError('Failed to initialize metamodel: ' + esc((err && err.message) ? err.message : String(err)));
    }
  };

  // ── Navigation (sidebar) ────────────────────────────────────────────
  App.buildNav = function () {
    clearEl(App.sidebarBodyEl);

    var frag = document.createDocumentFragment();

    // Dashboard (top level)
    frag.appendChild(App._navItem('📊', 'Dashboard', '#/dashboard', true));

    // Planning
    var planningHeader = el('div', { className: 'nav-section-header' }, 'Planning');
    frag.appendChild(planningHeader);
    frag.appendChild(App._subNavItem('📋', 'Kanban', '#/planning/kanban'));
    frag.appendChild(App._subNavItem('📆', 'Timeline', '#/planning/timeline'));

    // Domain sections with class sub-items
    NAV_ORDER.slice(2).forEach(function (domainName) {
      var classes = [];
      if (MetaModel.getClassesForDomain) {
        classes = MetaModel.getClassesForDomain(domainName) || [];
      }
      if (!classes || classes.length === 0) return;

      var header = el('div', { className: 'nav-section-header' }, domainName);
      frag.appendChild(header);

      classes.forEach(function (cls) {
        var icon = CLASS_ICONS[cls.id] || DOMAIN_ICONS[domainName] || '📄';
        frag.appendChild(App._subNavItem(icon, cls.caption || cls.id, '#/class/' + cls.id));
      });
    });

    // Studio (top level)
    frag.appendChild(App._navItem('🛠️', 'Studio', '#/studio'));

    // Reports (top level -> Studio, where charts & pages are built)
    frag.appendChild(App._navItem('📄', 'Reports', '#/studio'));

    App.sidebarBodyEl.appendChild(frag);
  };

  App._navItem = function (icon, label, href, active) {
    var item = el('a', {
      className: 'nav-item' + (active ? ' active' : ''),
      href: href
    });
    item.appendChild(el('span', { className: 'nav-item-icon' }, icon));
    item.appendChild(el('span', { className: 'nav-item-label' }, label));
    item.addEventListener('click', function (e) {
      if (href.charAt(0) === '#') {
        e.preventDefault();
        App.route(href);
      }
      App.sidebarEl.classList.remove('open');
      App.overlayEl.classList.remove('visible');
    });
    return item;
  };

  App._subNavItem = function (icon, label, href) {
    var item = el('a', {
      className: 'nav-sub-item',
      href: href
    });
    item.appendChild(el('span', { className: 'nav-item-icon' }, icon));
    item.appendChild(el('span', { className: 'nav-item-label' }, label));
    item.addEventListener('click', function (e) {
      if (href.charAt(0) === '#') {
        e.preventDefault();
        App.route(href);
      }
      App.sidebarEl.classList.remove('open');
      App.overlayEl.classList.remove('visible');
    });
    return item;
  };

  // ── Routing ─────────────────────────────────────────────────────────
  App.route = function (hash) {
    if (!App.metamodelReady) {
      App.renderLoading(App.contentEl);
      return;
    }
    var r = App._parseHash(hash || location.hash);
    App.currentRoute = r.path;
    App._updateActiveNav(r.path);
    App._setBreadcrumb(r);

    clearEl(App.contentEl);

    switch (r.section) {
      case 'dashboard':
        App._renderDashboard();
        break;
      case 'studio':
      case 'reports':
        App._renderStudio();
        break;
      case 'planning':
        if (window.Planning) {
          if (r.view === 'timeline') Planning.renderTimeline(App.contentEl);
          else Planning.renderKanban(App.contentEl);
        } else {
          App._renderDashboard();
        }
        break;
      case 'class':
        App._renderClassList(r.classId);
        break;
      case 'detail':
        App._renderClassDetail(r.classId, r.id);
        break;
      case 'search':
        App._renderSearch(r.query);
        break;
      default:
        // Two-segment path like "organization/orgaunit" (used by KPI cards)
        if (r.domain && r.classId) {
          App._renderClassList(r.classId);
        } else {
          App._renderDashboard();
        }
        break;
    }
  };

  App._parseHash = function (hash) {
    var h = hash.replace(/^#/, '');
    if (!h || h === '/') { return { section: 'dashboard', path: 'dashboard', domain: null, classId: null, id: null, query: null, view: null }; }
    var parts = h.split('/').filter(function (p) { return p !== ''; });
    var first = parts[0];
    var second = parts[1];
    var third = parts[2];

    if (first === 'dashboard') return { section: 'dashboard', path: 'dashboard', domain: null, classId: null, id: null, query: null, view: null };
    if (first === 'studio')    return { section: 'studio', path: 'studio', domain: null, classId: null, id: null, query: null, view: null };
    if (first === 'reports')   return { section: 'reports', path: 'reports', domain: null, classId: null, id: null, query: null, view: null };
    if (first === 'planning')  return { section: 'planning', path: 'planning/' + (second || 'kanban'), domain: null, classId: null, id: null, query: null, view: second || 'kanban' };
    if (first === 'class')     return { section: 'class', path: 'class/' + second, domain: null, classId: second, id: third, query: null, view: null };
    if (first === 'detail')    return { section: 'detail', path: 'detail/' + second + '/' + third, domain: null, classId: second, id: third, query: null, view: null };
    if (first === 'search')    return { section: 'search', path: 'search/' + second, domain: null, classId: null, id: null, query: second ? decodeURIComponent(second) : null, view: null };

    // domain/classId (e.g. organization/orgaunit)
    if (second) {
      var cls = null;
      var all = MetaModel.getAllClasses();
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === second) { cls = all[i]; break; }
      }
      if (cls) {
        return { section: 'class', path: first + '/' + second, domain: first, classId: second, id: null, query: null };
      }
    }

    return { section: 'dashboard', path: 'dashboard', domain: null, classId: null, id: null, query: null };
  };

  App._updateActiveNav = function (path) {
    var links = App.sidebarBodyEl.querySelectorAll('.nav-item, .nav-sub-item');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute('href') || '';
      var active = false;
      if (path === 'dashboard' && href === '#/dashboard') active = true;
      else if (path === 'studio' && (href === '#/studio')) active = true;
      else if (path.indexOf('planning/') === 0 && href.indexOf('#/planning/') === 0) {
        if (path === href.replace('#', '')) active = true;
      }
      else if (href === ('#' + path)) active = true;
      link.classList.toggle('active', active);
    }
  };

  App._setBreadcrumb = function (r) {
    if (!App.breadcrumbCurEl) return;
    var label = 'Dashboard';
    if (r.section === 'studio' || r.section === 'reports') label = 'Studio';
    else if (r.section === 'planning') label = r.view === 'timeline' ? 'Planning › Timeline' : 'Planning › Kanban';
    else if (r.section === 'detail' && r.classId) {
      var clsD = MetaModel.getClass(r.classId);
      var domainD = MetaModel.getDomain(r.classId);
      label = domainD + ' › ' + (clsD ? clsD.caption : r.classId) + ' › Detail';
    } else if (r.section === 'class' && r.classId) {
      var cls = MetaModel.getClass(r.classId);
      var domain = MetaModel.getDomain(r.classId);
      label = domain + ' › ' + (cls ? cls.caption : r.classId);
    } else if (r.section === 'search') {
      label = 'Search: ' + esc(r.query);
    }
    App.breadcrumbCurEl.textContent = label;
  };

  // ── Views ───────────────────────────────────────────────────────────
  App._renderDashboard = function () {
    Dashboard.render(App.contentEl);
  };

  App._renderStudio = function () {
    Studio.init(App.contentEl);
  };

  App._renderClassList = function (classId) {
    var cls = MetaModel.getClass(classId);
    var caption = (cls && cls.caption) ? cls.caption : classId;
    Forms.renderList(classId, App.contentEl);
  };

  App._renderClassDetail = function (classId, id) {
    Forms.renderDetail(classId, id, App.contentEl);
  };

  App._renderSearch = function (query) {
    var results = [];
    var all = MetaModel.getAllClasses();
    for (var i = 0; i < all.length; i++) {
      var cls = all[i];
      var recs = Records.search(cls.id, query);
      recs.forEach(function (r) {
        results.push({ record: r, cls: cls });
      });
    }

    var wrapper = el('div', { style: 'max-width:900px' });
    var title = el('h2', { style: 'margin:0 0 16px;font-size:1.5rem;font-weight:700' });
    title.textContent = 'Search results for "' + esc(query) + '"';
    wrapper.appendChild(title);

    if (results.length === 0) {
      wrapper.appendChild(el('p', { style: 'color:#9ca3af' }, 'No records found.'));
      App.contentEl.appendChild(wrapper);
      return;
    }

    var tableWrap = el('div', { style: 'overflow-x:auto' });
    var table = el('table', { className: 'data-table striped', style: 'width:100' });
    var thead = el('thead');
    var hr = el('tr', { style: 'background:#f9fafb;border-bottom:2px solid #e5e7eb' });
    ['Class', 'Name', 'Status', 'Actions'].forEach(function (col) {
      var th = el('th', { style: 'text-align:left;padding:10px 14px;font-weight:600;color:#374151;white-space:nowrap' });
      th.textContent = col;
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = el('tbody');
    results.forEach(function (item) {
      var rec = item.record;
      var tr = el('tr', { style: 'border-bottom:1px solid #e5e7eb' });
      tr.appendChild(el('td', { style: 'padding:10px 14px;font-size:13px;color:#6b7280' }, item.cls.caption || item.cls.id));
      tr.appendChild(el('td', { style: 'padding:10px 14px;font-weight:500' }, rec.name || '(Unnamed)'));
      tr.appendChild(el('td', { style: 'padding:10px 14px' }, rec.status || '—'));
      var tdAct = el('td', { style: 'padding:10px 14px;white-space:nowrap' });
      var viewBtn = el('button', { style: 'padding:4px 10px;border-radius:4px;border:1px solid #2563eb;cursor:pointer;background:#eff6ff;color:#2563eb;font-size:12px' });
      viewBtn.textContent = 'View';
      viewBtn.addEventListener('click', function () {
        App.route('#detail/' + item.cls.id + '/' + rec.id);
      });
      tdAct.appendChild(viewBtn);
      tr.appendChild(tdAct);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrapper.appendChild(tableWrap);
    App.contentEl.appendChild(wrapper);
  };

  App.renderLoading = function (container) {
    clearEl(container);
    var wrap = el('div', { style: 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;color:#6b7280' });
    var spin = el('div', { className: 'loading-spinner lg' });
    var msg = el('div', { style: 'margin-top:12px;font-size:14px' });
    msg.textContent = 'Loading metamodel…';
    wrap.appendChild(spin);
    wrap.appendChild(msg);
    container.appendChild(wrap);
  };

  App.renderError = function (message) {
    clearEl(App.contentEl);
    var wrap = el('div', { style: 'max-width:640px;margin:48px auto;padding:0 20px' });
    var alert = el('div', {
      className: 'alert alert-error',
      style: 'padding:20px'
    });
    var icon = el('div', { className: 'alert-icon' }, '⚠️');
    var text = el('div');
    text.textContent = message;
    alert.appendChild(icon);
    alert.appendChild(text);
    wrap.appendChild(alert);
    App.contentEl.appendChild(wrap);
  };

  // ── Public navigate (used by dashboard KPI cards) ───────────────────
  App.navigate = function (path) {
    if (path.charAt(0) === '#') {
      App.route(path);
    } else {
      App.route('#/' + path.replace(/^#\//, ''));
    }
  };

  // ── Expose ──────────────────────────────────────────────────────────
  window.App = App;

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { App.init(); });
  } else {
    App.init();
  }

})();