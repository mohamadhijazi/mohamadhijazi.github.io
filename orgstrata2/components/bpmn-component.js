/* ==========================================================================
   BPMN.JS COMPONENT MODULE
   Renders BPMN 2.0 process diagrams via bpmn-js navigated viewer
   Universal Component Studio: XML editor + node table
   ========================================================================== */

window.BpmnComponent = {
  type: 'bpmn',
  _viewers: {},

  buildDefaultModel() {
    return {
      processId: 'Process_1',
      elements: [
        { id: 'Start_1', type: 'startEvent', name: 'Start', x: 130, y: 90, width: 36, height: 36 },
        { id: 'Task_1', type: 'task', name: 'Task 1', x: 250, y: 70, width: 120, height: 80 },
        { id: 'End_1', type: 'endEvent', name: 'End', x: 500, y: 90, width: 36, height: 36 }
      ],
      flows: [
        { id: 'Flow_1', source: 'Start_1', target: 'Task_1' },
        { id: 'Flow_2', source: 'Task_1', target: 'End_1' }
      ]
    };
  },

  parseXmlToModel(xml) {
    try {
      const text = (xml || '').trim();
      if (!text) return this.buildDefaultModel();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'application/xml');
      const processEl = doc.querySelector('bpmn\:process, process');
      const processId = processEl?.getAttribute('id') || 'Process_1';

      const elements = [];
      const flows = [];
      const shapes = Array.from(doc.querySelectorAll('bpmndi\:BPMNShape, BPMNShape'));
      const shapeMap = new Map();
      shapes.forEach(shape => {
        const bpmnId = shape.getAttribute('bpmnElement');
        if (!bpmnId) return;
        const bounds = shape.querySelector('dc\:Bounds, Bounds');
        const x = Number(bounds?.getAttribute('x') || 100);
        const y = Number(bounds?.getAttribute('y') || 80);
        const width = Number(bounds?.getAttribute('width') || 120);
        const height = Number(bounds?.getAttribute('height') || 80);
        shapeMap.set(bpmnId, { x, y, width, height });
      });

      const actuators = Array.from(processEl?.children || []).filter(el => el.tagName && !/^sequenceFlow$/i.test(el.localName || el.tagName));
      actuators.forEach(el => {
        const id = el.getAttribute('id');
        const type = (el.localName || el.tagName || 'task').replace(/^[a-z]/, c => c.toUpperCase());
        const name = el.getAttribute('name') || type;
        const bounds = shapeMap.get(id) || { x: 100, y: 80, width: 120, height: 80 };
        elements.push({
          id,
          type: (el.localName || el.tagName || 'task').replace(/\b[A-Z]/g, m => m.toLowerCase()).replace(/^./, s => s.toLowerCase()),
          name,
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height
        });
      });

      Array.from(doc.querySelectorAll('bpmn\:sequenceFlow, sequenceFlow')).forEach(el => {
        const id = el.getAttribute('id');
        const source = el.getAttribute('sourceRef');
        const target = el.getAttribute('targetRef');
        if (source && target) flows.push({ id: id || `${source}_to_${target}`, source, target });
      });

      if (!elements.length) return this.buildDefaultModel();
      return { processId, elements, flows };
    } catch (err) {
      console.warn('Failed to parse BPMN XML, using default model:', err);
      return this.buildDefaultModel();
    }
  },

  generateXmlFromModel(model) {
    const safeModel = model || this.buildDefaultModel();
    const processId = safeModel.processId || 'Process_1';
    const elements = Array.isArray(safeModel.elements) ? safeModel.elements : [];
    const flows = Array.isArray(safeModel.flows) ? safeModel.flows : [];

    const bpmnElements = elements.map(el => {
      const type = el.type || 'task';
      const tag = type === 'startEvent' ? 'startEvent' : type === 'endEvent' ? 'endEvent' : type === 'gateway' ? 'exclusiveGateway' : 'task';
      const label = el.name ? ` name="${(el.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}"` : '';
      return `    <bpmn:${tag} id="${el.id}"${label}/>`;
    }).join('\n');

    const flowElements = flows.map(flow => `    <bpmn:sequenceFlow id="${flow.id}" sourceRef="${flow.source}" targetRef="${flow.target}"/>`).join('\n');

    const shapeDefs = elements.map((el, index) => {
      const width = el.width || 120;
      const height = el.height || 80;
      const x = el.x || 100;
      const y = el.y || 80;
      return `      <bpmndi:BPMNShape id="${el.id}_di" bpmnElement="${el.id}"><dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}"/></bpmndi:BPMNShape>`;
    }).join('\n');

    const flowDefs = flows.map(flow => {
      const source = elements.find(el => el.id === flow.source); const target = elements.find(el => el.id === flow.target);
      const sourceX = (source?.x || 100) + (source?.width || 120) / 2;
      const sourceY = (source?.y || 80) + (source?.height || 80) / 2;
      const targetX = (target?.x || 100) + (target?.width || 120) / 2;
      const targetY = (target?.y || 80) + (target?.height || 80) / 2;
      return `      <bpmndi:BPMNEdge id="${flow.id}_di" bpmnElement="${flow.id}"><di:waypoint x="${sourceX}" y="${sourceY}"/><di:waypoint x="${targetX}" y="${targetY}"/></bpmndi:BPMNEdge>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${processId}" isExecutable="false">
${bpmnElements}
${flowElements}
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
${shapeDefs}
${flowDefs}
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
  },

  render(container, config) {
    container.innerHTML = '';
    const data = config.data || {};
    let xml = data.bpmnXml;

    // Default minimal diagram if none provided
    if (!xml) {
      xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="Start_1" name="Start"/>
    <bpmn:endEvent id="End_1" name="End"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane bpmnElement="Process_1">
      <bpmndi:BPMNShape bpmnElement="Start_1"><dc:Bounds x="150" y="80" width="36" height="36"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="End_1"><dc:Bounds x="350" y="80" width="36" height="36"/></bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
    }

    // Destroy existing viewer
    if (this._viewers[config.id]) {
      try { this._viewers[config.id].destroy(); } catch(e) {}
      delete this._viewers[config.id];
    }

    // Check if BpmnJS is available (the navigated viewer)
    if (typeof BpmnJS === 'undefined') {
      // Render XML preview fallback
      const pre = document.createElement('div');
      pre.style.cssText = 'padding:0.75rem;font-size:0.72rem;color:#94a3b8;font-family:monospace;overflow:auto;height:260px;background:rgba(0,0,0,0.2);border-radius:8px;';
      pre.innerHTML = `<div style="color:#00f2fe;margin-bottom:0.5rem;"><i class="fa-solid fa-diagram-project"></i> BPMN XML (bpmn-js viewer loading...)</div><pre style="white-space:pre-wrap;word-break:break-all;">${xml.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>`;
      container.appendChild(pre);
      return;
    }

    const el = document.createElement('div');
    el.style.cssText = 'width:100%;height:260px;';
    container.appendChild(el);

    const viewer = new BpmnJS({ container: el });
    viewer.importXML(xml).then(() => {
      viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
      el.innerHTML = `<div style="padding:1rem;color:#ff9100;font-size:0.8rem;">BPMN load error: ${err.message}</div>`;
    });

    this._viewers[config.id] = viewer;
  },

  getStudioConfig(config) {
    return {
      settingsFields: [
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'subtitle', label: 'Subtitle', type: 'text', value: config.subtitle || '' },
        { key: 'columnSpan', label: 'Column Span', type: 'select',
          options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'bpmn-xml',
      dataDescription: 'Paste BPMN 2.0 XML below to update the diagram',
      getTableHeaders() { return ['BPMN XML Content']; },
      getTableRows() { return [[config.data?.bpmnXml || '']]; },
      parseTableData(rows) {
        return { bpmnXml: rows[0]?.[0] || '' };
      }
    };
  }
};
