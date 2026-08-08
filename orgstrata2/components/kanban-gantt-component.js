/* ==========================================================================
   KANBAN & GANTT COMPONENT MODULE
   Renders Kanban board (drag-and-drop columns) or Gantt timeline
   Universal Component Studio: task data editor
   ========================================================================== */

window.KanbanGanttComponent = {
  type: 'kanban',

  render(container, config) {
    container.innerHTML = '';
    const data = config.data || {};
    const settings = config.settings || {};
    const mode = config.type === 'gantt' ? 'gantt' : 'kanban';

    if (mode === 'kanban') {
      this._renderKanban(container, config, data);
    } else {
      this._renderGantt(container, config, data);
    }
  },

  _renderKanban(container, config, data) {
    const columns = data.columns || [
      { id: 'backlog', title: 'Backlog', color: '#64748b' },
      { id: 'inprogress', title: 'In Progress', color: '#00f2fe' },
      { id: 'done', title: 'Done', color: '#00e676' }
    ];
    const tasks = data.tasks || [];

    const board = document.createElement('div');
    board.className = 'kanban-board';

    columns.forEach(col => {
      const colTasks = tasks.filter(t => t.column === col.id);
      const colEl = document.createElement('div');
      colEl.className = 'kanban-column';

      const header = document.createElement('div');
      header.className = 'kanban-col-header';
      header.style.borderTop = `3px solid ${col.color}`;
      header.innerHTML = `<span style="color:${col.color}">${col.title}</span>
                          <span class="kanban-col-count">${colTasks.length}</span>`;
      colEl.appendChild(header);

      const tasksContainer = document.createElement('div');
      tasksContainer.className = 'kanban-tasks';

      colTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'kanban-task-card';
        card.innerHTML = `<div style="font-weight:600;">${task.title}</div>
                          <div class="task-priority ${task.priority}">${task.priority}</div>`;
        tasksContainer.appendChild(card);
      });

      // Add task button
      const addBtn = document.createElement('button');
      addBtn.style.cssText = 'width:100%;padding:0.3rem;background:transparent;border:1px dashed rgba(255,255,255,0.1);border-radius:6px;color:#64748b;font-size:0.72rem;cursor:pointer;margin-top:0.25rem;font-family:inherit;';
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
      addBtn.addEventListener('click', () => {
        const title = prompt('Task title:');
        if (!title) return;
        const task = { id: `t_${Date.now()}`, title, column: col.id, priority: 'Medium' };
        if (!data.tasks) data.tasks = [];
        data.tasks.push(task);
        // Re-render
        this._renderKanban(container, config, data);
        // Persist via state manager
        if (window.AppOrchestrator) {
          window.AppOrchestrator.updateComponentData(config, data);
        }
      });

      tasksContainer.appendChild(addBtn);
      colEl.appendChild(tasksContainer);
      board.appendChild(colEl);
    });

    container.appendChild(board);
  },

  _renderGantt(container, config, data) {
    const tasks = data.tasks || [];
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'overflow-x:auto;height:260px;padding:0.5rem;';

    const now = new Date();
    const header = `<div style="font-size:0.75rem;color:#64748b;margin-bottom:0.5rem;font-weight:700;">GANTT TIMELINE VIEW</div>`;

    const rows = tasks.map(t => {
      const progress = { 'done': 100, 'inprogress': 50, 'backlog': 0 }[t.column] || 0;
      const color = { 'done': '#00e676', 'inprogress': '#00f2fe', 'backlog': '#64748b' }[t.column] || '#64748b';
      return `<div style="margin-bottom:0.5rem;">
        <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.2rem;">
          <span style="color:#f0f4f8;font-weight:600;">${t.title}</span>
          <span style="color:#64748b;font-size:0.7rem;">${t.column} · ${progress}%</span>
        </div>
        <div style="height:14px;background:rgba(255,255,255,0.06);border-radius:7px;overflow:hidden;">
          <div style="width:${progress}%;height:100%;background:${color};border-radius:7px;transition:width 0.8s ease;"></div>
        </div>
      </div>`;
    }).join('');

    wrapper.innerHTML = header + (rows || '<div style="color:#64748b;font-size:0.82rem;padding:1rem;">No tasks. Add tasks via Component Studio.</div>');
    container.appendChild(wrapper);
  },

  getStudioConfig(config) {
    return {
      settingsFields: [
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'type', label: 'Board Type', type: 'select',
          options: ['kanban','gantt'], value: config.type || 'kanban' },
        { key: 'columnSpan', label: 'Column Span', type: 'select',
          options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'tasks',
      dataDescription: 'One row per task (ID, Title, Column, Priority)',
      getTableHeaders() { return ['ID','Title','Column','Priority']; },
      getTableRows() {
        return (config.data?.tasks || []).map(t => [t.id, t.title, t.column, t.priority]);
      },
      parseTableData(rows, headers, config) {
        const columns = config?.data?.columns || [
          { id:'backlog', title:'Backlog', color:'#64748b' },
          { id:'inprogress', title:'In Progress', color:'#00f2fe' },
          { id:'done', title:'Done', color:'#00e676' }
        ];
        return {
          columns,
          tasks: rows.filter(r => r[1]).map((r, i) => ({
            id: r[0] || `t_${i}`, title: r[1], column: r[2] || 'backlog', priority: r[3] || 'Medium'
          }))
        };
      }
    };
  }
};
