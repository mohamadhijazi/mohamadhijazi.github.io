/* ==========================================================================
   FULLCALENDAR COMPONENT MODULE
   Renders FullCalendar 5 with configurable events
   Universal Component Studio data table integration
   ========================================================================== */

window.FullCalendarComponent = {
  type: 'calendar',
  _instances: {},

  render(container, config) {
    container.innerHTML = '';
    const data = config.data || {};
    const settings = config.settings || {};

    if (typeof FullCalendar === 'undefined') {
      container.innerHTML = '<div style="padding:1rem;color:#ff9100;font-size:0.82rem;"><i class="fa-solid fa-triangle-exclamation"></i> FullCalendar not loaded</div>';
      return;
    }

    // Destroy any existing instance
    if (this._instances[config.id]) {
      try { this._instances[config.id].destroy(); } catch(e) {}
      delete this._instances[config.id];
    }

    const el = document.createElement('div');
    el.style.cssText = 'width:100%;height:100%;font-size:0.78rem;';
    container.appendChild(el);

    const events = (data.events || []).map(e => ({
      id: e.id, title: e.title,
      start: e.start, end: e.end || undefined,
      color: e.color || '#00f2fe',
      textColor: '#070a12',
      extendedProps: { tags: Array.isArray(e.tags) ? e.tags : [] }
    }));

    const calendar = new FullCalendar.Calendar(el, {
      initialView: settings.defaultView || 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listMonth'
      },
      events,
      height: 'auto',
      contentHeight: 260,
      eventBorderColor: 'transparent',
      nowIndicator: true
    });

    calendar.render();
    this._instances[config.id] = calendar;
  },

  getStudioConfig(config) {
    return {
      settingsFields: [
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'settings.defaultView', label: 'Default View', type: 'select',
          options: ['dayGridMonth','timeGridWeek','listMonth'], value: config.settings?.defaultView || 'dayGridMonth' },
        { key: 'columnSpan', label: 'Column Span', type: 'select',
          options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'events',
      dataDescription: 'One row per calendar event',
      getTableHeaders() { return ['ID','Title','Start','End','Color']; },
      getTableRows() {
        return (config.data?.events || []).map(e => [e.id, e.title, e.start, e.end||'', e.color||'#00f2fe']);
      },
      parseTableData(rows) {
        return {
          events: rows.filter(r => r[1]).map((r, i) => ({
            id: r[0] || `ev_${i}`,
            title: r[1] || 'Event',
            start: r[2] || new Date().toISOString().slice(0,10),
            end: r[3] || undefined,
            color: r[4] || '#00f2fe'
          }))
        };
      }
    };
  }
};
