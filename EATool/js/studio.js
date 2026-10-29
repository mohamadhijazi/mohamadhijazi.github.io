(function () {
  'use strict';

  // --- DOM Helper ---
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === 'className') e.className = v;
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
        else e.setAttribute(k, v);
      }
    }
    if (children) {
      children.forEach(c => {
        if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return e;
  }

  function clearEl(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  // --- Tab System ---
  function buildTabBar(tabs, container) {
    const bar = el('div', { className: 'studio-tab-bar' });
    const panelContainer = el('div', { className: 'studio-panel-container' });
    const panels = {};

    tabs.forEach((tab, index) => {
      const panel = el('div', { className: 'studio-tab-panel' });
      if (index > 0) panel.style.display = 'none';

      const btn = el('button', {
        className: 'studio-tab-btn' + (index === 0 ? ' active' : ''),
        onclick: () => {
          Object.values(panels).forEach(p => {
            p.btn.classList.remove('active');
            p.panel.style.display = 'none';
          });
          btn.classList.add('active');
          panel.style.display = '';
          if (!panel.dataset.built) {
            tab.builder(panel);
            panel.dataset.built = 'true';
          }
        }
      }, [tab.label]);

      panels[tab.id] = { btn, panel };
      bar.appendChild(btn);
      panelContainer.appendChild(panel);
    });

    container.appendChild(bar);
    container.appendChild(panelContainer);

    // Build the first tab immediately
    if (tabs.length > 0) {
      const firstTab = tabs[0];
      const firstPanel = panels[firstTab.id].panel;
      firstTab.builder(firstPanel);
      firstPanel.dataset.built = 'true';
    }
  }

  // --- Tab Builders ---
  function buildModelTab(container) {
    clearEl(container);
    container.appendChild(el('h2', { className: 'studio-header' }, ['Metamodel Builder']));

    const content = el('div', { className: 'studio-properties-content' });
    const leftPanel = el('div', { className: 'studio-properties-left' });
    const rightPanel = el('div', { className: 'studio-properties-right' });

    content.appendChild(leftPanel);
    content.appendChild(rightPanel);
    container.appendChild(content);

    const refreshClassList = () => {
        clearEl(leftPanel);
        const classes = Storage.getMetaClasses();

        const addBtn = el('button', {
            className: 'btn btn-primary btn-block',
            style: { marginBottom: '16px' },
            onclick: () => showClassForm(null, rightPanel, refreshClassList)
        }, ['+ Add Class']);
        leftPanel.appendChild(addBtn);

        if (Object.keys(classes).length === 0) {
            leftPanel.appendChild(el('p', { className: 'studio-placeholder' }, ['No custom classes defined.']));
        } else {
            Object.values(classes).forEach(cls => {
                const item = el('div', { className: 'studio-class-item' }, [
                    el('span', {}, [cls.caption]),
                    el('div', { className: 'studio-class-item-actions' }, [
                        el('button', { className: 'btn btn-xs btn-secondary', onclick: (e) => { e.stopPropagation(); showClassForm(cls, rightPanel, refreshClassList); } }, ['Edit']),
                        el('button', { className: 'btn btn-xs btn-danger', onclick: (e) => {
                            e.stopPropagation();
                            if (confirm(`Delete class \\\"${cls.caption}\\\"? This will also remove associated relations.`)) {
                                Storage.deleteMetaClass(cls.id);
                                refreshClassList();
                                clearEl(rightPanel); // Clear detail panel
                            }
                        }}, ['Delete'])
                    ])
                ]);
                item.onclick = () => {
                    leftPanel.querySelectorAll('.studio-class-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    renderModelDetail(cls, rightPanel, refreshClassList);
                };
                leftPanel.appendChild(item);
            });
        }
    };

    refreshClassList();
    clearEl(rightPanel);
    rightPanel.appendChild(el('p', { className: 'studio-placeholder' }, ['Select a class to see details or add a new class.']));
  }

  function renderModelDetail(cls, container, onUpdate) {
    clearEl(container);
    container.appendChild(el('h3', {}, [cls.caption]));

    // Relations Section
    container.appendChild(el('h4', { style: { marginTop: '20px', marginBottom: '10px' } }, ['Relations']));

    const relationsContainer = el('div');
    container.appendChild(relationsContainer);

    const refreshRelations = () => {
        clearEl(relationsContainer);
        const allRelations = Storage.getMetaRelations();
        const related = allRelations.filter(r => r.source === cls.id || r.target === cls.id);

        if (related.length === 0) {
            relationsContainer.appendChild(el('p', { className: 'studio-placeholder' }, ['No relations defined for this class.']));
        } else {
            const list = el('div', { className: 'studio-relations-list' });
            related.forEach(rel => {
                const isSource = rel.source === cls.id;
                const allClassObjects = Storage.getMetaClasses();
                const otherClassId = isSource ? rel.target : rel.source;
                const otherClass = allClassObjects[otherClassId];
                const otherCaption = otherClass ? otherClass.caption : otherClassId;

                const relationText = isSource
                    ? `[This] → [${otherCaption}] (as ${rel.relation})`
                    : `[${otherCaption}] → [This] (as ${rel.relation})`;

                const item = el('div', { className: 'studio-relation-item' }, [
                    el('span', {}, [relationText]),
                    el('button', {
                        className: 'btn btn-xs btn-danger',
                        onclick: () => {
                            if (confirm(`Delete relation \"${rel.relation}\"?`)) {
                                Storage.deleteMetaRelation(rel);
                                refreshRelations();
                            }
                        }
                    }, ['Delete'])
                ]);
                list.appendChild(item);
            });
            relationsContainer.appendChild(list);
        }
    };

    const addRelationBtn = el('button', {
        className: 'btn btn-primary',
        style: { marginTop: '16px' },
        onclick: () => showRelationForm(cls, container, refreshRelations)
    }, ['+ Add Relation']);

    container.appendChild(addRelationBtn);
    refreshRelations();
  }

  function showClassForm(cls, container, onSave) {
    clearEl(container);
    const form = el('form');
    const domains = Object.keys(MetaModel.getDomains());

    const captionInput = el('input', { type: 'text', name: 'caption', placeholder: 'Class Caption', required: true, className: 'studio-input' });
    const idInput = el('input', { type: 'text', name: 'id', placeholder: 'Class ID (e.g., MyClass)', required: true, className: 'studio-input' });
    const domainSelect = el('select', { name: 'domain', className: 'studio-input' }, domains.map(d => el('option', { value: d }, [d])));

    if (cls) {
        captionInput.value = cls.caption;
        idInput.value = cls.id;
        idInput.disabled = true; // Don't allow ID change on edit
        domainSelect.value = cls.domain;
    }

    const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary' }, [cls ? 'Update Class' : 'Save Class']);
    const cancelBtn = el('button', { type: 'button', className: 'btn btn-secondary', onclick: () => {
        clearEl(container);
        container.appendChild(el('p', { className: 'studio-placeholder' }, ['Select a class to see details or add a new class.']));
    }}, ['Cancel']);

    form.appendChild(el('div', { className: 'studio-form-grid' }, [
        el('label', {}, ['Caption']), captionInput,
        el('label', {}, ['ID']), idInput,
        el('label', {}, ['Domain']), domainSelect,
    ]));
    form.appendChild(el('div', { className: 'studio-form-actions' }, [saveBtn, cancelBtn]));

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const classData = {
            id: cls ? cls.id : fd.get('id').trim(),
            caption: fd.get('caption').trim(),
            domain: fd.get('domain')
        };
        Storage.saveMetaClass(classData);
        onSave(); // This will refresh the class list
        renderModelDetail(classData, container, onSave); // Show the detail view of the saved class
    });

    container.appendChild(el('h3', {}, [cls ? 'Edit Class' : 'New Class']));
    container.appendChild(form);
  }

  function showRelationForm(sourceCls, container, onSave) {
    const formArea = el('div', { className: 'studio-form-area' });
    const form = el('form');

    const allClassObjects = Storage.getMetaClasses();
    const classOptions = Object.values(allClassObjects).map(c => el('option', { value: c.id }, [c.caption]));

    const targetSelect = el('select', { name: 'target', className: 'studio-input' }, classOptions);
    const relationInput = el('input', { type: 'text', name: 'relation', placeholder: 'Relation Name (e.g., Contains)', required: true, className: 'studio-input' });
    const captionInput = el('input', { type: 'text', name: 'caption', placeholder: 'Relation Caption (e.g., Contains)', required: true, className: 'studio-input' });
    const cardinalityInput = el('input', { type: 'text', name: 'cardinality', placeholder: 'e.g., 1/N', className: 'studio-input' });

    const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary' }, ['Save Relation']);
    const cancelBtn = el('button', { type: 'button', className: 'btn btn-secondary', onclick: () => formArea.remove() }, ['Cancel']);

    form.appendChild(el('div', { className: 'studio-form-grid' }, [
        el('label', {}, ['Source']), el('strong', {}, [sourceCls.caption]),
        el('label', {}, ['Target']), targetSelect,
        el('label', {}, ['Relation Name']), relationInput,
        el('label', {}, ['Caption']), captionInput,
        el('label', {}, ['Cardinality']), cardinalityInput,
    ]));
    form.appendChild(el('div', { className: 'studio-form-actions' }, [saveBtn, cancelBtn]));

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const relationData = {
            source: sourceCls.id,
            target: fd.get('target'),
            relation: fd.get('relation').trim(),
            caption: fd.get('caption').trim(),
            cardinality: fd.get('cardinality').trim(),
            hint: '' // Hint not captured in this form for simplicity
        };
        Storage.saveMetaRelation(relationData);
        formArea.remove();
        onSave();
    });

    formArea.appendChild(el('h4', { style: { marginTop: '20px', marginBottom: '10px' } }, ['Add New Relation']));
    formArea.appendChild(form);
    container.appendChild(formArea);
  }

  function buildPagesTab(container) {
    clearEl(container);
    container.appendChild(el('h2', { className: 'studio-header' }, ['Page Builder']));

    const content = el('div', { className: 'studio-properties-content' });
    const leftPanel = el('div', { className: 'studio-properties-left' });
    const rightPanel = el('div', { className: 'studio-properties-right' });

    content.appendChild(leftPanel);
    content.appendChild(rightPanel);
    container.appendChild(content);

    const refreshPageList = () => {
        clearEl(leftPanel);
        const pages = Storage.getPages();

        const addBtn = el('button', {
            className: 'btn btn-primary btn-block',
            style: { marginBottom: '16px' },
            onclick: () => showPageForm(null, rightPanel, refreshPageList)
        }, ['+ Add Page']);
        leftPanel.appendChild(addBtn);

        if (Object.keys(pages).length === 0) {
            leftPanel.appendChild(el('p', { className: 'studio-placeholder' }, ['No custom pages created.']));
        } else {
            Object.values(pages).forEach(page => {
                const item = el('div', { className: 'studio-class-item' }, [
                    el('span', {}, [page.title]),
                    el('div', { className: 'studio-class-item-actions' }, [
                        el('button', { className: 'btn btn-xs btn-secondary', onclick: (e) => { e.stopPropagation(); showPageForm(page, rightPanel, refreshPageList); } }, ['Settings']),
                        el('button', { className: 'btn btn-xs btn-danger', onclick: (e) => {
                            e.stopPropagation();
                            if (confirm(`Delete page \\\"${page.title}\\\"?`)) {
                                Storage.deletePage(page.id);
                                refreshPageList();
                                clearEl(rightPanel);
                            }
                        }}, ['Delete'])
                    ])
                ]);
                item.onclick = () => {
                    leftPanel.querySelectorAll('.studio-class-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    renderPageEditor(page, rightPanel, refreshPageList);
                };
                leftPanel.appendChild(item);
            });
        }
    };

    refreshPageList();
    clearEl(rightPanel);
    rightPanel.appendChild(el('p', { className: 'studio-placeholder' }, ['Select a page to edit or add a new one.']));
  }

  function renderPageEditor(page, container, onUpdate) {
      clearEl(container);
      container.appendChild(el('h3', {}, [page.title]));
      container.appendChild(el('p', {}, ['Page editor will be here.']));
  }

  function showPageForm(page, container, onSave) {
    clearEl(container);
    const form = el('form');

    const titleInput = el('input', { type: 'text', name: 'title', placeholder: 'Page Title', required: true, className: 'studio-input' });

    if (page) {
        titleInput.value = page.title;
    }

    const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary' }, [page ? 'Update Page' : 'Save Page']);
    const cancelBtn = el('button', { type: 'button', className: 'btn btn-secondary', onclick: () => {
        clearEl(container);
        container.appendChild(el('p', { className: 'studio-placeholder' }, ['Select a page to edit or add a new one.']));
    }}, ['Cancel']);

    form.appendChild(el('div', { className: 'studio-form-grid' }, [
        el('label', {}, ['Title']), titleInput,
    ]));
    form.appendChild(el('div', { className: 'studio-form-actions' }, [saveBtn, cancelBtn]));

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const pageData = {
            id: page ? page.id : null,
            title: fd.get('title').trim(),
            content: page ? page.content : [] // Preserve existing content
        };
        Storage.savePage(pageData);
        onSave();
        renderPageEditor(pageData, container, onSave);
    });

    container.appendChild(el('h3', {}, [page ? 'Page Settings' : 'New Page']));
    container.appendChild(form);
  }

  function buildChartsTab(container) {
    clearEl(container);
    container.appendChild(el('h2', { className: 'studio-header' }, ['Chart Builder']));

    const chartList = el('div', { className: 'studio-chart-list' });
    container.appendChild(chartList);

    const refreshChartList = () => {
        clearEl(chartList);
        const charts = Storage.getCharts();
        if (Object.keys(charts).length === 0) {
            chartList.appendChild(el('p', { className: 'studio-placeholder' }, ['No charts created yet.']));
        } else {
            Object.values(charts).forEach(chart => {
                const chartItem = el('div', { className: 'studio-chart-item' }, [
                    el('strong', {}, [chart.name]),
                    el('span', {}, [` (Type: ${chart.type})`]),
                    el('div', { className: 'studio-chart-actions' }, [
                        el('button', { className: 'btn btn-xs btn-secondary', onclick: () => showChartForm(chart, container) }, ['Edit']),
                        el('button', { className: 'btn btn-xs btn-danger', onclick: () => {
                            if (confirm(`Delete chart \"${chart.name}\"?`)) {
                                Storage.deleteChart(chart.id);
                                refreshChartList();
                            }
                        }}, ['Delete'])
                    ])
                ]);
                chartList.appendChild(chartItem);
            });
        }
    };

    const addBtn = el('button', {
        className: 'btn btn-primary',
        style: { marginTop: '16px' },
        onclick: () => showChartForm(null, container)
    }, ['+ Add Chart']);
    container.appendChild(addBtn);

    refreshChartList();
}

function showChartForm(chart, container) {
    const formArea = el('div', { className: 'studio-form-area' });
    const form = el('form', { className: 'studio-inline-form' });

    const nameInput = el('input', { type: 'text', name: 'name', placeholder: 'Chart Name', required: true, className: 'studio-input' });
    const typeSelect = el('select', { name: 'type', className: 'studio-input' }, [
        el('option', { value: 'bar' }, ['Bar']),
        el('option', { value: 'line' }, ['Line']),
        el('option', { value: 'pie' }, ['Pie']),
    ]);

    if (chart) {
        nameInput.value = chart.name;
        typeSelect.value = chart.type;
    }

    const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary' }, [chart ? 'Update' : 'Save']);
    const cancelBtn = el('button', { type: 'button', className: 'btn btn-secondary', onclick: () => formArea.remove() }, ['Cancel']);

    form.appendChild(el('div', { className: 'studio-form-grid' }, [
        el('label', {}, ['Name']), nameInput,
        el('label', {}, ['Type']), typeSelect,
    ]));
    form.appendChild(el('div', { className: 'studio-form-actions' }, [saveBtn, cancelBtn]));

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const chartData = {
            id: chart ? chart.id : null,
            name: fd.get('name').trim(),
            type: fd.get('type')
        };
        Storage.saveChart(chartData);
        formArea.remove();
        buildChartsTab(container);
    });

    // Replace existing form if any, or append
    const existingForm = container.querySelector('.studio-form-area');
    if (existingForm) {
        existingForm.replaceWith(formArea);
    } else {
        container.appendChild(formArea);
    }
    formArea.appendChild(form);
}

  function buildDataSourcesTab(container) {
    clearEl(container);
    container.appendChild(el('h2', { className: 'studio-header' }, ['Data Source Manager']));
    container.appendChild(el('p', { className: 'studio-placeholder' }, ['Coming soon: A tool for defining and managing data sources for your visuals.']));
  }

  function buildPropertiesTab(container) {
    clearEl(container);
    container.appendChild(el('h2', { className: 'studio-header' }, ['Custom Property Manager']));

    const content = el('div', { className: 'studio-properties-content' });
    const leftPanel = el('div', { className: 'studio-properties-left' });
    const rightPanel = el('div', { className: 'studio-properties-right' });

    content.appendChild(leftPanel);
    content.appendChild(rightPanel);
    container.appendChild(content);

    // Build class list
    const classes = MetaModel.getAllClasses();
    const byDomain = {};
    classes.forEach(cls => {
      const domain = cls.domain || 'General';
      if (!byDomain[domain]) byDomain[domain] = [];
      byDomain[domain].push(cls);
    });

    Object.entries(byDomain).forEach(([domain, clsList]) => {
      const groupLabel = el('div', { className: 'studio-class-group-label' }, [domain]);
      leftPanel.appendChild(groupLabel);
      clsList.forEach(cls => {
        const item = el('div', {
          className: 'studio-class-item',
          onclick: () => {
            leftPanel.querySelectorAll('.studio-class-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            renderRightPanel(cls, rightPanel);
          }
        }, [cls.name]);
        leftPanel.appendChild(item);
      });
    });
  }

  function renderRightPanel(cls, container) {
    clearEl(container);
    container.appendChild(el('h3', { className: 'studio-class-heading' }, [cls.name]));

    const props = Studio.getCustomProps(cls.id) || [];
    const table = el('table', { className: 'studio-props-table' });
    const thead = el('thead', {}, [
      el('tr', {}, [
        el('th', {}, ['Name']),
        el('th', {}, ['Key']),
        el('th', {}, ['Type']),
        el('th', {}, ['Actions'])
      ])
    ]);
    table.appendChild(thead);

    const tbody = el('tbody', {}, props.map(prop => {
      return el('tr', {}, [
        el('td', {}, [prop.name]),
        el('td', {}, [el('code', {}, [prop.key])]),
        el('td', {}, [prop.type]),
        el('td', { className: 'studio-action-cell' }, [
          el('button', {
            className: 'btn btn-xs btn-secondary',
            onclick: () => showPropertyForm(cls, prop, container)
          }, ['Edit']),
          el('button', {
            className: 'btn btn-xs btn-danger',
            onclick: () => {
              if (confirm(`Delete property \"${prop.name}\"?`)) {
                Storage.deleteCustomProp(cls.id, prop.key);
                renderRightPanel(cls, container);
              }
            }
          }, ['Delete'])
        ])
      ]);
    }));
    table.appendChild(tbody);

    container.appendChild(table);

    const addBtn = el('button', {
      className: 'btn btn-primary',
      style: { marginTop: '16px' },
      onclick: () => showPropertyForm(cls, null, container)
    }, ['+ Add Property']);
    container.appendChild(addBtn);
  }

  function showPropertyForm(cls, prop, container) {
    const formArea = el('div', { className: 'studio-form-area' });
    const form = el('form', { className: 'studio-inline-form' });

    const nameInput = el('input', { type: 'text', name: 'name', placeholder: 'Property Name', required: true, className: 'studio-input' });
    const keyInput = el('input', { type: 'text', name: 'key', placeholder: 'property_key', className: 'studio-input' });
    const typeSelect = el('select', { name: 'type', className: 'studio-input' }, [
      el('option', { value: 'text' }, ['Text']),
      el('option', { value: 'number' }, ['Number']),
      el('option', { value: 'datetime' }, ['DateTime']),
      el('option', { value: 'lookup' }, ['Lookup'])
    ]);

    if (prop) {
      nameInput.value = prop.name;
      keyInput.value = prop.key;
      typeSelect.value = prop.type;
    }

    const saveBtn = el('button', { type: 'submit', className: 'btn btn-primary' }, [prop ? 'Update' : 'Save']);
    const cancelBtn = el('button', { type: 'button', className: 'btn btn-secondary', onclick: () => formArea.remove() }, ['Cancel']);

    form.appendChild(el('div', { className: 'studio-form-grid' }, [
      el('label', {}, ['Name']), nameInput,
      el('label', {}, ['Key']), keyInput,
      el('label', {}, ['Type']), typeSelect
    ]));
    form.appendChild(el('div', { className: 'studio-form-actions' }, [saveBtn, cancelBtn]));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const propData = {
        name: fd.get('name').trim(),
        key: fd.get('key').trim() || slugify(fd.get('name').trim()),
        type: fd.get('type')
      };
      Storage.saveCustomProp(cls.id, propData);
      formArea.remove();
      renderRightPanel(cls, container);
    });

    formArea.appendChild(form);
    container.appendChild(formArea);
  }

  // --- Main ---
  const Studio = {
    init(container) {
      clearEl(container);
      container.className = 'studio-workspace';

      const tabs = [
        { id: 'model', label: 'Model', builder: buildModelTab },
        { id: 'pages', label: 'Pages', builder: buildPagesTab },
        { id: 'charts', label: 'Charts', builder: buildChartsTab },
        { id: 'datasources', label: 'Data', builder: buildDataSourcesTab },
        { id: 'properties', label: 'Properties', builder: buildPropertiesTab },
      ];

      buildTabBar(tabs, container);
    },

    getCustomProps(classId) {
      const allProps = Storage.getCustomProps ? Storage.getCustomProps() : {};
      return allProps[classId];
    }
  };

  window.Studio = Studio;
})();