

// Mock AI Output
const mockBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  id="Definitions_1">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Vacancy Identified">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Publish Job Posting (Edited by AI)">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task_2" name="Screen Resumes">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task_3" name="Conduct Interviews">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task_4" name="Extend Employment Offer">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="Candidate Onboarded">
      <bpmn:incoming>Flow_5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Task_2"/>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_2" targetRef="Task_3"/>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_3" targetRef="Task_4"/>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_4" targetRef="EndEvent_1"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="Shape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="150" y="100" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_Task_1" bpmnElement="Task_1">
        <dc:Bounds x="250" y="78" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_Task_2" bpmnElement="Task_2">
        <dc:Bounds x="400" y="78" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_Task_3" bpmnElement="Task_3">
        <dc:Bounds x="550" y="78" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_Task_4" bpmnElement="Task_4">
        <dc:Bounds x="700" y="78" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Shape_EndEvent_1" bpmnElement="EndEvent_1">
        <dc:Bounds x="850" y="100" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Edge_Flow_1" bpmnElement="Flow_1">
        <di:waypoint x="186" y="118"/>
        <di:waypoint x="250" y="118"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_2" bpmnElement="Flow_2">
        <di:waypoint x="350" y="118"/>
        <di:waypoint x="400" y="118"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_3" bpmnElement="Flow_3">
        <di:waypoint x="500" y="118"/>
        <di:waypoint x="550" y="118"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_4" bpmnElement="Flow_4">
        <di:waypoint x="650" y="118"/>
        <di:waypoint x="700" y="118"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Edge_Flow_5" bpmnElement="Flow_5">
        <di:waypoint x="800" y="118"/>
        <di:waypoint x="850" y="118"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="empty-definitions" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// Initialize Modeler
const modeler = new window.BpmnJS({
  container: '#canvas',
  keyboard: { bindTo: document }
});

// Initialize Previous Viewer for side-by-side mode
const previousViewer = new window.BpmnJS({
  container: '#canvas-previous'
});

// Load empty diagram initially
modeler.importXML(emptyBpmn).then(() => {
  modeler.get('canvas').zoom('fit-viewport');
}).catch(console.error);

// ----------------------------------------------------
// Properties Panel Logic (Custom Implementation)
// ----------------------------------------------------
const eventBus = modeler.get('eventBus');
const propertiesContent = document.getElementById('properties-content');

// Helper to update properties panel UI
function updatePropertiesPanel(element) {
  if (!element || element.type === 'bpmn:Process') {
    propertiesContent.innerHTML = '<p class="placeholder-text">Select an element to view its properties.</p>';
    return;
  }

  const businessObject = element.businessObject;
  const name = businessObject.name || '';
  const id = businessObject.id;

  propertiesContent.innerHTML = `
    <div class="property-group">
      <label for="prop-id">ID</label>
      <input type="text" id="prop-id" value="${id}" readonly />
    </div>
    <div class="property-group">
      <label for="prop-name">Name</label>
      <input type="text" id="prop-name" value="${name}" />
    </div>
    <div class="property-group">
      <label for="prop-type">Type</label>
      <input type="text" id="prop-type" value="${element.type}" readonly />
    </div>
  `;

  // Allow basic name editing
  const nameInput = document.getElementById('prop-name');
  nameInput.addEventListener('input', (e) => {
    const modeling = modeler.get('modeling');
    modeling.updateProperties(element, {
      name: e.target.value
    });
  });
}

// Listen to selection changes
eventBus.on('selection.changed', (e) => {
  const selection = e.newSelection;
  if (selection && selection.length > 0) {
    updatePropertiesPanel(selection[0]);
  } else {
    updatePropertiesPanel(null);
  }
});

// Dblclick listener as requested
const detailModal = document.getElementById('detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');
const detailModalBody = document.getElementById('detail-modal-body');

closeDetailModal.addEventListener('click', () => detailModal.classList.add('hidden'));

eventBus.on('element.dblclick', (e) => {
  const element = e.element;
  console.log('Element double clicked:', element);

  if (element.type === 'bpmn:Process') return;

  const businessObject = element.businessObject;
  detailModalBody.innerHTML = `
    <p><strong>ID:</strong> ${businessObject.id}</p>
    <p><strong>Name:</strong> ${businessObject.name || 'Unnamed'}</p>
    <p><strong>Type:</strong> ${element.type}</p>
    <p><em>Additional technical details for this element would go here.</em></p>
  `;
  detailModal.classList.remove('hidden');
});

// Sub-process creation listener
eventBus.on('commandStack.shape.create.postExecute', (e) => {
  const context = e.context;
  const shape = context.shape;
  if (shape && shape.type === 'bpmn:SubProcess') {
    console.log('New SubProcess created:', shape);
    // Could trigger nested logic here
  }
});

// ----------------------------------------------------
// AI Copilot Integration
// ----------------------------------------------------
const copilotBtn = document.getElementById('copilot-btn');
const modal = document.getElementById('copilot-modal');
const closeModalBtn = document.getElementById('close-modal');
const aiPrompt = document.getElementById('ai-prompt');
const aiGenerateBtn = document.getElementById('ai-generate-btn');
const aiLoading = document.getElementById('ai-loading');
const aiFallbackControls = document.getElementById('ai-fallback-controls');
const aiRetryBtn = document.getElementById('ai-retry-btn');
const aiModifyBtn = document.getElementById('ai-modify-btn');

function openModal() {
  modal.classList.remove('hidden');
  resetAiState();
}

function closeModal() {
  modal.classList.add('hidden');
}

function resetAiState() {
  aiPrompt.classList.remove('hidden');
  aiGenerateBtn.classList.remove('hidden');
  aiLoading.classList.add('hidden');
  aiFallbackControls.classList.add('hidden');
}

copilotBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

let previousBpmnXml = emptyBpmn;
let currentBpmnXml = emptyBpmn;

async function generateProcess() {
  const promptText = aiPrompt.value.trim();
  if (!promptText) return;

  // Save current state as previous before generating new
  try {
    const { xml } = await modeler.saveXML({ format: true });
    previousBpmnXml = xml;
  } catch (err) {
    console.error('Failed to save previous XML', err);
  }

  // UI State: Loading
  aiPrompt.classList.add('hidden');
  aiGenerateBtn.classList.add('hidden');
  aiLoading.classList.remove('hidden');
  aiFallbackControls.classList.add('hidden');

  // Mock API Call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Render Result
  try {
    await modeler.importXML(mockBpmnXml);
    modeler.get('canvas').zoom('fit-viewport', 'auto');
    currentBpmnXml = mockBpmnXml;

    // UI State: Fallback Controls
    aiLoading.classList.add('hidden');
    aiFallbackControls.classList.remove('hidden');
  } catch (err) {
    console.error('Error rendering AI output:', err);
    alert('Failed to generate process. See console.');
    resetAiState();
  }
}

aiGenerateBtn.addEventListener('click', generateProcess);

aiRetryBtn.addEventListener('click', generateProcess);

aiModifyBtn.addEventListener('click', () => {
  resetAiState();
  aiPrompt.focus();
});

// ----------------------------------------------------
// Side-by-Side Version Compare (bpmn-js-differ)
// ----------------------------------------------------
const versionCompareBtn = document.getElementById('version-compare-btn');
const canvasEl = document.getElementById('canvas');
const canvasPrevEl = document.getElementById('canvas-previous');
const currentLabel = document.getElementById('current-label');

let isVersionCompareMode = false;

// Block modeling actions when in view mode
eventBus.on('element.mousedown', 10000, (e) => {
  if (isVersionCompareMode) return false; // Stop drag/drop
});
eventBus.on('element.click', 10000, (e) => {
  if (isVersionCompareMode) return false; // Stop selection/editing
});

function applyDiffMarkers(changes) {
  const currentCanvas = modeler.get('canvas');
  const prevCanvas = previousViewer.get('canvas');

  // Clear existing markers
  [currentCanvas, prevCanvas].forEach(canvas => {
    canvas.getRootElement().children.forEach(el => {
      canvas.removeMarker(el.id, 'diff-added');
      canvas.removeMarker(el.id, 'diff-removed');
      canvas.removeMarker(el.id, 'diff-changed');
      canvas.removeMarker(el.id, 'diff-layout-changed');
    });
  });

  // Apply new markers based on diff
  Object.keys(changes._added).forEach(id => currentCanvas.addMarker(id, 'diff-added'));
  Object.keys(changes._removed).forEach(id => prevCanvas.addMarker(id, 'diff-removed'));
  Object.keys(changes._changed).forEach(id => {
    currentCanvas.addMarker(id, 'diff-changed');
    prevCanvas.addMarker(id, 'diff-changed');
  });
  Object.keys(changes._layoutChanged).forEach(id => {
    currentCanvas.addMarker(id, 'diff-layout-changed');
    prevCanvas.addMarker(id, 'diff-layout-changed');
  });
}

versionCompareBtn.addEventListener('click', async () => {
  isVersionCompareMode = !isVersionCompareMode;

  if (isVersionCompareMode) {
    versionCompareBtn.classList.remove('secondary-btn');
    versionCompareBtn.classList.add('primary-btn');
    versionCompareBtn.innerText = 'Exit View Mode';

    // Show side-by-side layout
    canvasPrevEl.classList.remove('hidden');
    currentLabel.classList.remove('hidden');
    canvasEl.classList.add('view-mode-active');

    // Load the previous XML into the previousViewer
    try {
      await previousViewer.importXML(previousBpmnXml);
      previousViewer.get('canvas').zoom('fit-viewport', 'auto');

      // Compute differences using bpmn-js-differ
      const prevDefs = previousViewer.getDefinitions();
      const currDefs = modeler.getDefinitions();
      const differ = window.BpmnJsDiffer || window.bpmnJsDiffer || window.BpmnJSDiffer || window.BpmnDiffer || window.bpmnDiffer || window.diff;
      const diffFn = typeof differ === 'function' ? differ : differ.diff;
      const changes = diffFn(prevDefs, currDefs);
      
      applyDiffMarkers(changes);
    } catch (err) {
      console.error('Error during diff:', err);
    }

  } else {
    versionCompareBtn.classList.remove('primary-btn');
    versionCompareBtn.classList.add('secondary-btn');
    versionCompareBtn.innerText = 'Version Compare';

    // Hide previous canvas and clear markers
    canvasPrevEl.classList.add('hidden');
    currentLabel.classList.add('hidden');
    canvasEl.classList.remove('view-mode-active');
    applyDiffMarkers({ _added: {}, _removed: {}, _changed: {}, _layoutChanged: {} });
  }
});
