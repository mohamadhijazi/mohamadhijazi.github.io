# OrgFold: Enterprise Protein Simulator
## Complete Master Prompt and Implementation Blueprint 

This blueprint directs a small language model to create a rich, interactive enterprise application while operating under tight context and capability constraints. It uses modular, explicit, self-contained tasks and a single-file, zero-dependency HTML/CSS/Vanilla JavaScript architecture.

The resulting application is **OrgFold: Enterprise Structural Simulator**, an interactive tool where users map organizational units like amino acids, apply operational constraints, simulate structural folding, and detect corporate misfolds such as silos, bottlenecks, overloaded shared services, and unmediated conflicts.

---

# 1. Master Prompt

```text
ROLE: Expert Frontend Developer, Simulation Engineer, Enterprise Architect, and UX Designer.
PROJECT: "OrgFold" - A single-file, offline HTML/CSS/Vanilla JavaScript interactive web application that applies protein-folding principles to organizational strategy, risk, resilience, and performance.

MANDATORY CONSTRAINTS
1. Output exactly one complete HTML document beginning with <!DOCTYPE html>. without comments in code and without testing
2. Put all CSS in an internal <style> element and all JavaScript in an internal <script> element.
3. Use no external libraries, frameworks, fonts, images, APIs, CDN links, or package imports.
4. Do not use React, Vue, Angular, Tailwind, Bootstrap, D3, Chart.js, jQuery, or icon libraries.
5. Use only semantic HTML5, CSS3, Canvas 2D, inline SVG, localStorage, Blob, FileReader, and other browser-native APIs.
6. The file must run directly from a local drive without a server or internet connection.
7. The UI must be a professional dark enterprise dashboard using deep slate/navy surfaces, cyan and violet accents, green stability, amber warnings, and red critical risks.
8. Use requestAnimationFrame for simulation and cancelAnimationFrame when paused or reset.
9. Render user and imported text with textContent, never unsafe innerHTML.
10. Validate imported JSON, numeric ranges, unique IDs, node references, and maximum array sizes.
11. Support keyboard navigation, visible focus, reduced motion, responsive layouts, and text alternatives for Canvas content.
12. Return the complete updated HTML after every task. Never return a fragment or pseudocode.
13. Preserve existing IDs, state fields, and working features across tasks.
14. Before final output, inspect for duplicate IDs, undefined functions, missing event handlers, syntax errors, invalid Canvas dimensions, NaN values, and unsafe text rendering.

APPLICATION TITLE
OrgFold: Enterprise Structural Simulator

METAPHOR
- Organizational nodes are amino acids.
- Dependencies are molecular bonds.
- Functional synergy creates attraction.
- Conflicting objectives create repulsion or tension.
- Budget, compliance, culture, capacity, and market pressure are folding constraints.
- Stable organizational structures have balanced dependencies and low internal friction.
- Silos, bottlenecks, overloaded hubs, and unresolved conflicts are enterprise misfolds.
- Metrics are organizational decision-support heuristics, not scientific protein predictions.
```

---

# 2. Architecture and Stable State Contract

Use one central state object with these fields: `schemaVersion`, `scenarioName`, `running`, `paused`, `selectedNodeId`, `hoveredNodeId`, `draggedNodeId`, `animationFrameId`, `lastTimestamp`, `elapsedMs`, `iteration`, `stressLevel`, `shockType`, `stabilityScore`, `tensionScore`, `siloRiskScore`, `resilienceScore`, `nodes`, `edges`, `constraints`, `riskLogs`, `recommendations`, `history`, `filters`, `viewport`, and `settings`.

Node fields: `id`, `name`, `type`, `subtype`, `description`, `energy`, `capacity`, `criticality`, `adaptability`, `complianceLoad`, `cost`, `headcount`, `x`, `y`, `vx`, `vy`, `radius`, `pinned`, `active`, and `tags`.

Dependency fields: `id`, `source`, `target`, `relationship`, `strength`, `desiredDistance`, `criticality`, `direction`, and `active`.

Constraint fields: `id`, `name`, `type`, `weight`, `threshold`, `enabled`, `color`, and `description`.

Risk fields: `id`, `severity`, `category`, `title`, `description`, `affectedNodeIds`, `evidence`, `recommendation`, and `timestamp`.

---

# 3. Task 1: HTML Shell and Dashboard UI

Build:

- Header with title, subtitle, scenario name, autosave status, Run, Pause, Step, Reset, Export, and Import.
- Three-column workspace.
- Left Model Builder with search, type filter, node list, Add Node, constraints, Stress Test slider, and shock selector.
- Center Canvas simulator with legend, status, zoom, fit-to-view, labels, node dragging, and empty state.
- Right Diagnostics with Stability, Tension, Misfold Risk, Resilience, alerts, recommendations, and node inspector.
- Bottom analysis area with score history, baseline comparison, and activity log.
- Accessible dialogs for node editing, dependency editing, confirmations, and import/export.
- Responsive single-column layout below approximately 900px.

Acceptance criteria:

- No horizontal overflow.
- Canvas always has nonzero dimensions.
- Every input has a visible label.
- Controls have hover, active, focus, disabled, and loading states.
- Core workflows are keyboard accessible.

---

# 4. Canonical Current HTML

This is the complete concrete replacement for the former placeholder. Use it as the current HTML for Task 2. After each task, use the model's complete returned HTML as the current HTML for the next task.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OrgFold: Enterprise Structural Simulator</title>
<style>
:root{--bg:#07111f;--panel:#0d1b2a;--panel2:#13263a;--line:#28445f;--text:#e8f1f8;--muted:#92a8bc;--cyan:#22d3ee;--violet:#8b5cf6;--green:#22c55e;--amber:#f59e0b;--red:#ef4444;--r:14px}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px system-ui,sans-serif}.app{padding:16px;min-height:100vh}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:16px;background:var(--panel);border:1px solid var(--line);border-radius:var(--r)}h1,h2,h3,p{margin-top:0}.muted{color:var(--muted)}.actions{display:flex;gap:8px;flex-wrap:wrap}button,input,select{min-height:40px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);padding:8px}button{cursor:pointer}.primary{background:linear-gradient(135deg,#0891b2,#7c3aed);border:0}:focus-visible{outline:3px solid var(--cyan);outline-offset:2px}.grid{display:grid;grid-template-columns:minmax(240px,.8fr) minmax(420px,1.7fr) minmax(280px,.9fr);gap:16px;margin-top:16px}.panel{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}.head{padding:14px 16px;border-bottom:1px solid var(--line)}.body{padding:16px}.field{display:grid;gap:6px;margin-bottom:12px}.field input,.field select{width:100%}.canvas-wrap{position:relative;min-height:600px;background:radial-gradient(circle at 50% 40%,#112a42,#07111f 70%)}#foldCanvas{width:100%;height:600px;display:block;touch-action:none}.overlay{position:absolute;top:12px;left:12px;background:#07111fd9;border:1px solid var(--line);border-radius:9px;padding:8px;color:var(--muted)}.metrics{display:grid;grid-template-columns:1fr 1fr;gap:10px}.metric,.list li{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:10px}.metric strong{display:block;font-size:1.5rem}.list{list-style:none;padding:0;display:grid;gap:8px}.bottom{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:16px;margin-top:16px}@media(max-width:1000px){.grid,.bottom{grid-template-columns:1fr}.canvas-wrap,#foldCanvas{min-height:480px;height:480px}}@media(max-width:620px){.app{padding:8px}.top{align-items:flex-start;flex-direction:column}.metrics{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body><div class="app">
<header class="top"><div><h1>OrgFold: Enterprise Structural Simulator</h1><p class="muted">Model dependencies, fold under constraints, and detect enterprise misfolds.</p><small id="scenarioName">Enterprise Baseline</small></div><nav class="actions" aria-label="Simulation controls"><button id="runBtn" class="primary">Run Strategic Fold</button><button id="pauseBtn">Pause</button><button id="stepBtn">Step</button><button id="resetBtn">Reset</button><button id="exportBtn">Export</button><button id="importBtn">Import</button></nav></header>
<main class="grid">
<aside class="panel"><div class="head"><h2>Model Builder</h2></div><div class="body"><div class="field"><label for="nodeSearch">Search nodes</label><input id="nodeSearch" type="search"></div><div class="field"><label for="nodeTypeFilter">Node type</label><select id="nodeTypeFilter"><option>All</option><option>Workflow</option><option>Skill</option><option>Asset</option></select></div><button id="addNodeBtn">Add node</button><ul id="nodeList" class="list"></ul><div class="field"><label for="stressLevel">Stress: <output id="stressValue">20</output>%</label><input id="stressLevel" type="range" min="0" max="100" value="20"></div><div class="field"><label for="shockType">Shock type</label><select id="shockType"><option>Market volatility</option><option>Budget reduction</option><option>Regulatory change</option><option>Cyber incident</option><option>Talent attrition</option><option>Supplier disruption</option><option>Demand surge</option></select></div></div></aside>
<section class="panel"><div class="head"><h2>Folding Simulator</h2></div><div class="canvas-wrap"><canvas id="foldCanvas">Organizational folding visualization.</canvas><div class="overlay"><span id="simulationStatus">Ready</span> · Drag nodes · Double-click to pin</div></div></section>
<aside class="panel"><div class="head"><h2>Diagnostics</h2></div><div class="body"><div class="metrics"><div class="metric"><span>Stability</span><strong id="stabilityScore">0</strong></div><div class="metric"><span>Tension</span><strong id="tensionScore">0</strong></div><div class="metric"><span>Misfold Risk</span><strong id="riskScore">0</strong></div><div class="metric"><span>Resilience</span><strong id="resilienceScore">0</strong></div></div><h3>Risk alerts</h3><ul id="riskList" class="list"></ul><h3>Recommendations</h3><ul id="recommendationList" class="list"></ul><h3>Selected node</h3><div id="nodeInspector" class="muted">Select a node.</div></div></aside>
</main>
<section class="bottom"><div class="panel"><div class="head"><h2>Score History</h2></div><div class="body"><canvas id="historyCanvas" height="180"></canvas></div></div><div class="panel"><div class="head"><h2>Comparison</h2></div><div id="comparisonPanel" class="body muted">Baseline comparison.</div></div><div class="panel"><div class="head"><h2>Activity Log</h2></div><div class="body"><ul id="activityLog" class="list"></ul></div></div></section>
</div><input id="importFile" type="file" accept="application/json,.json" hidden><div id="toastRegion" aria-live="polite" hidden></div>
<script>
"use strict";
const seedScenario={nodes:[
{id:"node-product",name:"Digital Product Team",type:"Workflow",energy:38,capacity:72,criticality:85,adaptability:78,complianceLoad:35,cost:60,x:210,y:180,vx:0,vy:0,radius:23,pinned:false,active:true,tags:["customer","agile","digital"]},
{id:"node-data",name:"Data and Analytics",type:"Asset",energy:55,capacity:58,criticality:92,adaptability:62,complianceLoad:48,cost:74,x:390,y:260,vx:0,vy:0,radius:25,pinned:false,active:true,tags:["data","shared-service"]},
{id:"node-compliance",name:"Compliance Audit",type:"Workflow",energy:64,capacity:68,criticality:80,adaptability:32,complianceLoad:95,cost:48,x:560,y:170,vx:0,vy:0,radius:23,pinned:false,active:true,tags:["risk","control"]},
{id:"node-architecture",name:"Enterprise Architecture",type:"Skill",energy:32,capacity:65,criticality:78,adaptability:70,complianceLoad:55,cost:42,x:430,y:420,vx:0,vy:0,radius:23,pinned:false,active:true,tags:["governance","digital","risk"]}],edges:[
{id:"edge-product-data",source:"node-product",target:"node-data",relationship:"Data dependency",strength:.85,desiredDistance:150,criticality:88,direction:"bidirectional",active:true},
{id:"edge-product-compliance",source:"node-product",target:"node-compliance",relationship:"Control assurance",strength:.7,desiredDistance:190,criticality:82,direction:"bidirectional",active:true},
{id:"edge-architecture-product",source:"node-architecture",target:"node-product",relationship:"Architecture guidance",strength:.65,desiredDistance:170,criticality:70,direction:"bidirectional",active:true},
{id:"edge-architecture-compliance",source:"node-architecture",target:"node-compliance",relationship:"Governance mediation",strength:.6,desiredDistance:165,criticality:75,direction:"bidirectional",active:true}],constraints:[{id:"constraint-budget",name:"Budget",type:"Budget",weight:60,threshold:65,enabled:true},{id:"constraint-compliance",name:"Compliance",type:"Compliance",weight:70,threshold:60,enabled:true},{id:"constraint-culture",name:"Culture",type:"Culture",weight:45,threshold:55,enabled:true}]};
const copy=v=>JSON.parse(JSON.stringify(v)),clamp=(v,a,b)=>Math.min(b,Math.max(a,Number.isFinite(v)?v:a)),byId=id=>document.getElementById(id);
const state={schemaVersion:1,scenarioName:"Enterprise Baseline",running:false,paused:false,selectedNodeId:null,draggedNodeId:null,animationFrameId:null,iteration:0,stressLevel:20,shockType:"Market volatility",stabilityScore:0,tensionScore:0,siloRiskScore:0,resilienceScore:0,nodes:copy(seedScenario.nodes),edges:copy(seedScenario.edges),constraints:copy(seedScenario.constraints),riskLogs:[],recommendations:[],history:[],filters:{query:"",type:"All",risk:"All"},viewport:{width:0,height:0,devicePixelRatio:1,panX:0,panY:0,zoom:1},settings:{showLabels:true,showGrid:true,showDependencies:true,reducedMotion:matchMedia("(prefers-reduced-motion:reduce)").matches,autosave:true}};
const canvas=byId("foldCanvas"),ctx=canvas.getContext("2d");
function resizeCanvas(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));state.viewport.width=r.width;state.viewport.height=r.height;state.viewport.devicePixelRatio=d;ctx.setTransform(d,0,0,d,0,0);draw()}
function draw(){const{width:w,height:h}=state.viewport;ctx.clearRect(0,0,w,h);for(const e of state.edges){const a=state.nodes.find(n=>n.id===e.source),b=state.nodes.find(n=>n.id===e.target);if(!a||!b||!e.active)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle="#8b5cf688";ctx.lineWidth=1+e.strength*3;ctx.stroke()}for(const n of state.nodes){if(!n.active)continue;ctx.beginPath();ctx.arc(n.x,n.y,n.radius,0,Math.PI*2);ctx.fillStyle=n.type==="Workflow"?"#22d3ee":n.type==="Skill"?"#8b5cf6":"#22c55e";ctx.fill();ctx.fillStyle="#e8f1f8";ctx.font="12px system-ui";ctx.textAlign="center";ctx.fillText(n.name,n.x,n.y+n.radius+16)}}
function diagnostics(){const s=state.stressLevel,avg=state.nodes.reduce((a,n)=>a+n.energy,0)/Math.max(1,state.nodes.length);state.stabilityScore=clamp(Math.round(82-s*.35-avg*.12),0,100);state.tensionScore=clamp(Math.round(18+s*.62),0,100);state.siloRiskScore=clamp(Math.round(24+s*.4),0,100);state.resilienceScore=clamp(Math.round(84-s*.45),0,100);byId("stabilityScore").textContent=state.stabilityScore;byId("tensionScore").textContent=state.tensionScore;byId("riskScore").textContent=state.siloRiskScore;byId("resilienceScore").textContent=state.resilienceScore}
function step(){const ns=state.nodes.filter(n=>n.active);for(const n of ns){if(n.pinned)continue;let fx=0,fy=0;for(const o of ns){if(o.id===n.id)continue;const dx=n.x-o.x,dy=n.y-o.y,d2=Math.max(100,dx*dx+dy*dy),d=Math.sqrt(d2);fx+=dx/d*900/d2;fy+=dy/d*900/d2}for(const e of state.edges){if(!e.active||(e.source!==n.id&&e.target!==n.id))continue;const o=state.nodes.find(x=>x.id===(e.source===n.id?e.target:e.source));if(!o)continue;const dx=o.x-n.x,dy=o.y-n.y,d=Math.max(1,Math.hypot(dx,dy)),f=(d-e.desiredDistance)*.0009*e.strength;fx+=dx/d*f;fy+=dy/d*f}fx+=(state.viewport.width/2-n.x)*.00015;fy+=(state.viewport.height/2-n.y)*.00015;n.vx=clamp((n.vx+fx)*.92,-4,4);n.vy=clamp((n.vy+fy)*.92,-4,4);n.x=clamp(n.x+n.vx,n.radius,Math.max(n.radius,state.viewport.width-n.radius));n.y=clamp(n.y+n.vy,n.radius,Math.max(n.radius,state.viewport.height-n.radius))}state.iteration++;diagnostics();draw()}
function loop(){if(!state.running||state.paused)return;step();state.animationFrameId=requestAnimationFrame(loop)}
function renderNodes(){const list=byId("nodeList");list.replaceChildren();const q=state.filters.query.toLowerCase();for(const n of state.nodes.filter(n=>(state.filters.type==="All"||n.type===state.filters.type)&&n.name.toLowerCase().includes(q))){const li=document.createElement("li"),b=document.createElement("button");b.textContent=`${n.name} · ${n.type} · Energy ${n.energy}`;b.onclick=()=>{state.selectedNodeId=n.id;byId("nodeInspector").textContent=`${n.name}: capacity ${n.capacity}, criticality ${n.criticality}, adaptability ${n.adaptability}.`};li.append(b);list.append(li)}}
function reset(){cancelAnimationFrame(state.animationFrameId);state.running=false;state.paused=false;state.nodes=copy(seedScenario.nodes);state.edges=copy(seedScenario.edges);state.constraints=copy(seedScenario.constraints);byId("simulationStatus").textContent="Ready";renderNodes();diagnostics();draw()}
byId("runBtn").onclick=()=>{cancelAnimationFrame(state.animationFrameId);state.running=true;state.paused=false;byId("simulationStatus").textContent="Folding";loop()};byId("pauseBtn").onclick=()=>{state.paused=true;cancelAnimationFrame(state.animationFrameId);byId("simulationStatus").textContent="Paused"};byId("stepBtn").onclick=step;byId("resetBtn").onclick=reset;byId("stressLevel").oninput=e=>{state.stressLevel=clamp(+e.target.value,0,100);byId("stressValue").textContent=state.stressLevel;diagnostics()};byId("shockType").onchange=e=>state.shockType=e.target.value;byId("nodeSearch").oninput=e=>{state.filters.query=e.target.value;renderNodes()};byId("nodeTypeFilter").onchange=e=>{state.filters.type=e.target.value;renderNodes()};byId("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="orgfold-scenario.json";a.click();URL.revokeObjectURL(a.href)};byId("importBtn").onclick=()=>byId("importFile").click();byId("addNodeBtn").onclick=()=>alert("Implement the complete accessible node dialog in Task 2.");new ResizeObserver(resizeCanvas).observe(canvas);renderNodes();resizeCanvas();diagnostics();
</script></body></html>
```

---

# 5. Task 2: Data Model and State Engine

Starting from the **Canonical Current HTML** above:

- Expand the seed model to at least ten nodes: Digital Product Team, Customer Experience, Data and Analytics, Cloud Platform, Cybersecurity, Enterprise Architecture, Compliance Audit, Finance and Procurement, People and Culture, and Operations.
- Add meaningful dependencies, including a speed-versus-compliance conflict and an overloaded shared-service node.
- Implement `addNode`, `updateNode`, `removeNode`, `addEdge`, `removeEdge`, `updateConstraint`, `selectNode`, `setStressLevel`, `setShockType`, `resetScenario`, `recordHistorySnapshot`, `recalculateDiagnostics`, and `renderAll`.
- Validate names at 1 to 80 characters, clamp numeric values, generate unique IDs, block self-links, and reject or merge duplicate edges.
- Removing a node must remove connected edges.
- Reset must restore a deep copy of the seed scenario.
- Implement accessible add/edit/delete node and dependency dialogs.

**Execution prompt:**

```text
Starting from the Canonical Current HTML in Section 4, implement Task 2 completely. Preserve all existing IDs, styles, state fields, and working controls. Return the entire updated HTML document only. The returned document becomes the current HTML for Task 3.
```

---

# 6. Task 3: Interactive Folding Engine

Implement a stable Canvas force simulation with:

- Edge attraction based on strength and desired distance.
- General node repulsion.
- Collision separation.
- Centering and viewport boundary forces.
- Constraint pressure from stress, compliance load, cost, and capacity.
- Velocity damping, capped delta time, capped force, and capped velocity.
- `getSynergyScore`, `getConflictScore`, and `getConstraintPressure` helpers.
- Run, Pause, Step, and Reset.
- Dragging, node selection, double-click pinning, pan, zoom, and fit-to-view.
- Sharp Canvas scaling using device pixel ratio.
- Tension lines that become amber or red when constraints are violated.

**Execution prompt:**

```text
Use the complete HTML returned by Task 2 as the current HTML. Implement Task 3 without removing or renaming existing features. Keep the state contract unchanged. Return the entire updated HTML document only. The returned document becomes the current HTML for Task 4.
```

---

# 7. Task 4: Misfold Detection and Diagnostics

Calculate four deterministic scores from 0 to 100:

- Structural Stability: 30% dependency-distance fit, 20% collision health, 20% constraint fit, 15% capacity balance, and 15% cohesion health.
- Constraint Tension: violations, unresolved conflicts, overcapacity, and stress amplification.
- Silo/Misfold Risk: disconnected components, weak cross-type links, bottlenecks, conflicts without mediators, and single points of failure.
- Resilience: redundant paths, spare capacity, distributed critical dependencies, adaptability, and shock performance.

Detect and deduplicate:

1. Isolated Silo.
2. Bottleneck Hub.
3. Unmediated Conflict.
4. Capacity Collapse.
5. Compliance Exposure.
6. Single Point of Failure.
7. Cost Compression.
8. Change Saturation.

Each alert must show affected nodes, measurable evidence, business impact, and a concrete recommendation. Recalculate expensive graph diagnostics every 250 to 500 milliseconds or after meaningful state changes, not every animation frame.

**Execution prompt:**

```text
Use the complete HTML returned by Task 3 as the current HTML. Implement Task 4 with deterministic scores, deduplicated alerts, evidence, and recommendations. Preserve all earlier functionality and return the complete HTML only.
```

---

# 8. Task 5: Enterprise Interactions and Scenario Management

Add:

- Node and dependency create, edit, delete, activate, deactivate, pin, and unpin.
- Stress types: Market volatility, Budget reduction, Regulatory change, Cyber incident, Talent attrition, Supplier disruption, and Demand surge.
- Shock-specific effects on costs, capacity, compliance, cybersecurity, adaptability, and dependency pressure.
- Scenario rename, autosave to localStorage, named snapshot, restore, duplicate, baseline comparison, and clear data with confirmation.
- Validated JSON import/export.
- PNG Canvas export.
- Downloadable text or JSON simulation report containing scenario, timestamp, stress, scores, counts, top five risks, top five recommendations, and the heuristic disclaimer.

**Execution prompt:**

```text
Use the complete HTML returned by Task 4 as the current HTML. Implement Task 5 fully. Preserve all earlier functionality. Return the entire updated HTML only.
```

---

# 9. Task 6: Rich Native UI

Add:

- Four accessible gauges using CSS conic gradients, SVG, or Canvas.
- Gauge values, labels, trends, status, and formula tooltips.
- Bounded score-history chart with at most 60 points.
- Baseline-versus-current comparison with absolute deltas and interpretation.
- Activity log for simulation, model, stress, risk, import, and snapshot events.
- Reusable keyboard-accessible tooltip.
- `aria-live` success, warning, and error toasts.
- Risk sorting and filtering.

**Execution prompt:**

```text
Use the complete HTML returned by Task 5 as the current HTML. Implement Task 6 using browser-native capabilities only. Return the complete HTML only.
```

---

# 10. Task 7: Accessibility, Security, Performance, and Reliability

Hardening requirements:

- Semantic regions and correctly associated labels.
- Visible focus and keyboard-operable dialogs.
- Non-Canvas node and risk representation.
- Reduced-motion support.
- Never use `eval`, `Function`, unsafe script insertion, or imported `innerHTML`.
- Limit imports to 200 nodes and 1,000 edges.
- Guard DOM lookups and avoid duplicate event bindings.
- Protect zero-distance calculations and invalid numbers.
- Cap delta time, zoom, history, force, and velocity.
- Handle empty, one-node, and disconnected scenarios.
- Target smooth interaction for 25 to 50 nodes and usable behavior near 100 nodes.

**Execution prompt:**

```text
Use the complete HTML returned by Task 6 as the current HTML. Perform the complete Task 7 hardening pass. Do not add unrelated features. Return the complete corrected HTML only.
```

---

# 11. Task 8: Final Integration and Self-Test

Verify:

- One complete offline HTML file with no external URLs.
- No duplicate IDs, undefined references, missing handlers, or syntax errors.
- Run, Pause, Step, Reset, drag, pin, pan, zoom, and stress test work.
- Scores remain within 0 to 100.
- Alerts are deduplicated.
- Autosave, snapshots, import, JSON export, PNG export, and report export work.
- Invalid imports produce usable errors.
- Keyboard use, reduced motion, Canvas fallback, and responsive layout work.
- No repeated animation loops after repeated Run/Pause actions.
- No uncaught errors during a five-minute manual test.

**Final execution prompt:**

```text
Use the complete HTML returned by Task 7 as the current HTML. Integrate and validate every requirement from Tasks 1 through 8. Fix all regressions. Return exactly one complete HTML document beginning with <!DOCTYPE html>. Do not include Markdown, explanation, pseudocode, or omitted sections.
```

---

# 12. Repair Prompts

### Truncated output

```text
Regenerate the complete HTML from the beginning. Reduce comments and whitespace, but remove no functionality. Return HTML only.
```

### Blank Canvas

```text
Fix Canvas CSS height, drawing-buffer dimensions, device-pixel-ratio scaling, seed positions, ResizeObserver behavior, and initial rendering. Return the complete HTML only.
```

### Unstable simulation

```text
Clamp delta time, forces, velocity, zoom, and positions. Protect zero-distance calculations, add damping, enforce boundaries, and cancel duplicate animation loops. Return the complete HTML only.
```

### Broken controls

```text
Audit every control ID and map it to exactly one event handler. Repair missing and duplicate bindings without renaming IDs. Return the complete HTML only.
```

### Unsafe import

```text
Validate schemaVersion, types, ranges, array limits, unique IDs, and edge references inside try/catch. Render imported labels with textContent. Return the complete HTML only.
```

### Regression

```text
Restore Run, Pause, Step, Reset, drag, pin, add/edit/delete, diagnostics, autosave, import, export, and responsive behavior. Preserve the current visual design. Return the complete HTML only.
```

---

# 13. Demonstration Scenario

1. Start with Product, Customer Experience, Data, Cloud, Cybersecurity, Architecture, Compliance, Finance, People, and Operations.
2. Select `Regulatory change` and set stress to `70`.
3. Run the fold and observe compliance tension and Data bottleneck risk.
4. Add `Risk and Controls Enablement` as a mediation node.
5. Connect it to Product, Compliance Audit, Cybersecurity, and Enterprise Architecture.
6. Re-run the fold and compare Stability, Tension, Misfold Risk, and Resilience.
7. Show the trade-off: mediation can reduce friction but may increase cost and structural complexity.

---

# 14. Definition of Done

The application is complete when a user can open one local HTML file, build an organizational model, manage dependencies and constraints, run and control the fold, drag and pin nodes, apply shocks, inspect transparent scores and risks, compare against baseline, save and restore locally, import and export validated scenarios, export a report and PNG, and use core workflows by keyboard.
