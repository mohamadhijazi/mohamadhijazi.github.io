/* ==========================================================================
   JQUERY DATATABLE COMPONENT MODULE
   Renders searchable, paginated jQuery DataTables grids
   Universal Component Studio: row/column editor
   ========================================================================== */

window.JqTableComponent = {
  type: 'jqtable',
  _tables: {},

  render(container, config) {
    container.innerHTML = '';
    const data = config.data || {};
    const settings = config.settings || {};

    if (typeof $ === 'undefined' || !$.fn.DataTable) {
      container.innerHTML = '<div style="padding:1rem;color:#ff9100;font-size:0.82rem;"><i class="fa-solid fa-triangle-exclamation"></i> jQuery DataTables not loaded</div>';
      return;
    }

    // Destroy existing table
    if (this._tables[config.id]) {
      try { this._tables[config.id].destroy(true); } catch(e) {}
      delete this._tables[config.id];
    }

    const columns = data.columns || ['Column 1'];
    const rows    = data.rows || [];

    // Build table HTML
    const thead = `<thead><tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;

    const tableEl = document.createElement('table');
    tableEl.id = `dt_${config.id}`;
    tableEl.className = 'display';
    tableEl.style.cssText = 'width:100%;font-size:0.78rem;';
    tableEl.innerHTML = thead + tbody;
    container.appendChild(tableEl);

    // Style overrides for dark theme
    const style = document.createElement('style');
    style.textContent = `
      #dt_${config.id}_wrapper { color: #94a3b8; }
      #dt_${config.id} thead th { background: rgba(0,0,0,0.4) !important; color: #64748b !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
      #dt_${config.id} tbody tr { background: transparent !important; }
      #dt_${config.id} tbody tr:hover td { background: rgba(255,255,255,0.03) !important; }
      #dt_${config.id} tbody td { border-bottom: 1px solid rgba(255,255,255,0.04) !important; color: #f0f4f8 !important; }
      #dt_${config.id}_filter input { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #f0f4f8 !important; border-radius: 6px !important; padding: 0.25rem 0.5rem; }
      #dt_${config.id}_paginate .paginate_button { color: #94a3b8 !important; border-radius: 4px !important; }
      #dt_${config.id}_paginate .paginate_button.current { background: rgba(0,242,254,0.15) !important; color: #00f2fe !important; border: 1px solid rgba(0,242,254,0.3) !important; }
    `;
    container.appendChild(style);

    $(`#dt_${config.id}`).DataTable({
      paging: true,
      pageLength: settings.pageLength || 5,
      searching: settings.searchable !== false,
      ordering: true,
      info: true,
      scrollX: true,
      autoWidth: false
    });

    this._tables[config.id] = $(`#dt_${config.id}`).DataTable();
  },

  getStudioConfig(config) {
    return {
      settingsFields: [
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'settings.pageLength', label: 'Rows per Page', type: 'text', value: config.settings?.pageLength || 5 },
        { key: 'columnSpan', label: 'Column Span', type: 'select',
          options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'table',
      dataDescription: 'First row = column headers, subsequent rows = data',
      getTableHeaders() { return config.data?.columns || ['Column 1']; },
      getTableRows()    { return config.data?.rows || []; },
      parseTableData(rows, headers) {
        return { columns: headers, rows };
      }
    };
  }
};
