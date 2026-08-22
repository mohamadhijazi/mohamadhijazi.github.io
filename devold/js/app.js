/**
 * Impact360 Command Center - Application Router & Bootstrap
 */

const App = (function () {

  // Navigation router map
  const views = {
    dashboard: UI.renderExecutiveDashboard,
    financials: UI.renderFinancialsModule,
    routines: UI.renderRoutinesModule,
    facilities: UI.renderFacilitiesModule,
    employees: UI.renderEmployeeDashboard,
    objectives: UI.renderObjectivesModule,
    projects: UI.renderProjectsModule,
    innovation: UI.renderInnovationMarketplace,
    events: UI.renderEventsCenter,
    risk: UI.renderRiskCenter,
    citizen: UI.renderCitizenImpactModule,
    heatmap: UI.renderStrategicHeatmap
  };

  let currentView = 'dashboard';

  function toggleSidebar(forceState) {
    const appContainer = $('#app-container');
    const shouldCollapse = typeof forceState === 'boolean' ? forceState : !appContainer.hasClass('sidebar-collapsed');

    appContainer.toggleClass('sidebar-collapsed', shouldCollapse);
    const toggleIcon = $('.sidebar-toggle .toggle-icon');
    toggleIcon.text(shouldCollapse ? '›' : '‹');

    if (typeof Storage !== 'undefined') {
      localStorage.setItem('impact360-sidebar-collapsed', shouldCollapse ? '1' : '0');
    }
  }

  function getCurrentView() {
    return currentView;
  }

  function navigateTo(viewName, params = null) {
    if (!views[viewName]) viewName = 'dashboard';
    currentView = viewName;

    // Update Sidebar Navigation state
    $('.nav-item').removeClass('active');
    $(`.nav-item[data-view="${viewName}"]`).addClass('active');

    // Update view sections
    $('.view-section').removeClass('active');
    $(`#view-${viewName}`).addClass('active');

    // Render corresponding view
    if (params) {
      views[viewName](params);
    } else {
      views[viewName]();
    }

    // Scroll viewport to top
    $('#view-viewport').scrollTop(0);
  }

  function refreshCurrentView() {
    if (views[currentView]) {
      views[currentView]();
    }
    initTopBarStats();
  }

  function setupGlobalSearch() {
    $('#global-search-input').on('input', function () {
      const query = $(this).val().toLowerCase().trim();
      const dropdown = $('#search-dropdown');

      if (query.length < 2) {
        dropdown.hide();
        return;
      }

      const data = ImpactData.getState();
      const results = [];

      // Search Financial Records (Income, Spendings, Assets, Liabilities)
      (data.financials || []).forEach(f => {
        if (f.title.toLowerCase().includes(query) || f.type.toLowerCase().includes(query) || f.owner.toLowerCase().includes(query) || (f.metamodelTags && f.metamodelTags.some(t => t.toLowerCase().includes(query)))) {
          results.push({ title: `${f.type}: ${f.title} ($${f.amountUsdM}M)`, category: `Financial (${f.type})`, view: 'financials', id: f.id });
        }
      });

      // Search Routines, Trips & Shopping Lists
      (data.routines || []).forEach(r => {
        const itemMatch = (r.items || []).some(i => i.text.toLowerCase().includes(query));
        if (r.title.toLowerCase().includes(query) || r.category.toLowerCase().includes(query) || r.frequency.toLowerCase().includes(query) || itemMatch) {
          results.push({ title: `${r.frequency}: ${r.title}`, category: `Routine (${r.category})`, view: 'routines', id: r.id });
        }
      });

      // Search Projects
      (data.projects || []).forEach(p => {
        if (p.name.toLowerCase().includes(query) || p.owner.toLowerCase().includes(query) || (p.department && p.department.toLowerCase().includes(query))) {
          results.push({ title: p.name, category: 'Project', view: 'projects', id: p.id });
        }
      });

      // Search Objectives
      (data.objectives || []).forEach(o => {
        if (o.title.toLowerCase().includes(query) || o.owner.toLowerCase().includes(query)) {
          results.push({ title: o.title, category: 'Objective', view: 'objectives', id: o.id });
        }
      });

      // Search Events
      (data.events || []).forEach(e => {
        if (e.title.toLowerCase().includes(query) || e.category.toLowerCase().includes(query) || (e.tags && e.tags.some(t => t.toLowerCase().includes(query)))) {
          results.push({ title: e.title, category: 'Event', view: 'events', id: e.id });
        }
      });

      // Search Geo Locations / Campuses
      (data.locations || []).forEach(l => {
        if (l.name.toLowerCase().includes(query) || l.code.toLowerCase().includes(query) || (l.metamodelTags && l.metamodelTags.some(t => t.toLowerCase().includes(query)))) {
          results.push({ title: `${l.name} (${l.code})`, category: 'Geo Location', view: 'facilities', id: l.id });
        }
      });

      // Search Buildings
      (data.buildings || []).forEach(b => {
        if (b.name.toLowerCase().includes(query) || b.code.toLowerCase().includes(query) || (b.metamodelTags && b.metamodelTags.some(t => t.toLowerCase().includes(query)))) {
          results.push({ title: `${b.name} (${b.code})`, category: 'Building', view: 'facilities', id: b.id });
        }
      });

      // Search Rooms / Zones
      (data.rooms || []).forEach(r => {
        if (r.name.toLowerCase().includes(query) || r.roomNumber.toLowerCase().includes(query) || (r.metamodelTags && r.metamodelTags.some(t => t.toLowerCase().includes(query)))) {
          results.push({ title: `${r.roomNumber}: ${r.name}`, category: 'Room / Zone', view: 'facilities', id: r.id });
        }
      });

      // Search Employees
      (data.employees || []).forEach(e => {
        if (e.name.toLowerCase().includes(query) || e.department.toLowerCase().includes(query)) {
          results.push({ title: e.name, category: 'Employee', view: 'employees', id: e.id });
        }
      });

      // Search Innovations
      (data.innovations || []).forEach(i => {
        if (i.title.toLowerCase().includes(query) || i.owner.toLowerCase().includes(query)) {
          results.push({ title: i.title, category: 'Innovation', view: 'innovation', id: i.id });
        }
      });

      if (results.length === 0) {
        dropdown.html('<div style="padding:12px; font-size:12px; color:#64748B;">No matching records found.</div>').show();
      } else {
        const html = results.slice(0, 10).map(r => `
          <div class="search-result-item" onclick="App.navigateTo('${r.view}'); $('#search-dropdown').hide();">
            <span class="search-result-title">${r.title}</span>
            <span class="search-result-category">${r.category}</span>
          </div>
        `).join('');
        dropdown.html(html).show();
      }
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('.search-container').length) {
        $('#search-dropdown').hide();
      }
    });
  }

  function initTopBarStats() {
    const data = ImpactData.getState();
    const globalRisk = RiskEngine.calculateGlobalRiskIndex(data.projects, data.events);
    const activeEventsCount = (data.events || []).filter(e => e.status === 'Active').length;

    $('#top-risk-pill').text(`Global Risk: ${globalRisk} / 100`);
    $('#top-events-pill').text(`Active Events: ${activeEventsCount}`);

    const riskPill = $('#top-risk-pill-container');
    if (globalRisk > 60) {
      riskPill.removeClass('risk-amber risk-green').addClass('risk-high');
    } else if (globalRisk > 35) {
      riskPill.removeClass('risk-high risk-green').addClass('risk-amber');
    } else {
      riskPill.removeClass('risk-high risk-amber').addClass('risk-green');
    }
  }

  function init() {
    const savedSidebarState = (typeof Storage !== 'undefined') ? localStorage.getItem('impact360-sidebar-collapsed') : null;
    if (savedSidebarState === '1') {
      toggleSidebar(true);
    } else {
      toggleSidebar(false);
    }

    $('.sidebar-toggle').on('click', function () {
      toggleSidebar();
    });

    // Setup Sidebar Nav Click Handlers
    $('.nav-item').on('click', function () {
      const viewName = $(this).data('view');
      navigateTo(viewName);
    });

    setupGlobalSearch();
    initTopBarStats();

    // Listen to state changes
    ImpactData.onStateChange(() => {
      initTopBarStats();
    });

    // Default start view
    navigateTo('dashboard');
  }

  return {
    init: init,
    navigateTo: navigateTo,
    getCurrentView: getCurrentView,
    refreshCurrentView: refreshCurrentView,
    initTopBarStats: initTopBarStats
  };
})();

// Bootstrap Application on Document Ready
$(document).ready(function () {
  App.init();
});
