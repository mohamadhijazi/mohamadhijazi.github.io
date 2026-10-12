/**
 * C4 Diagram Renderer (SVG-based Interactive Visualizer)
 * Supports:
 * - C4 Level 1: System Context Diagram
 * - C4 Level 2: Container Diagram
 * - C4 Level 3: Component Diagram (Agentic Orchestrator Deep Dive)
 * Pan & Zoom, Team Highlighting, Node Click Inspection, and SVG Export.
 */

class C4Renderer {
  constructor(canvasContainerId, data) {
    this.container = document.getElementById(canvasContainerId);
    this.data = data;
    this.currentView = "c4-container"; // 'c4-context', 'c4-container', 'c4-component'
    this.activeTeam = "all";
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.startPan = { x: 0, y: 0 };
    this.highlightedNodeId = null;
    this.componentLayer = "orchestrator-runtime";
  }

  init() {
    const select = document.getElementById("c4-component-layer");
    if (select) {
      const options = this.data.layers.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
      select.innerHTML = `${options}<option value="orchestrator-runtime">Orchestrator runtime (detailed)</option>`;
      select.value = this.componentLayer;
    }
    this.render();
    this.setupPanAndZoom();
  }

  setView(viewKey) {
    this.currentView = viewKey;
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.render();
  }

  setComponentLayer(layerId) {
    this.componentLayer = layerId;
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.render();
  }

  setTeamFilter(teamId) {
    this.activeTeam = teamId;
    this.render();
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.15, 2.2);
    this.applyTransform();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.15, 0.4);
    this.applyTransform();
  }

  resetZoom() {
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }

  applyTransform() {
    const svgGroup = this.container.querySelector("#svg-pan-zoom-group");
    if (svgGroup) {
      svgGroup.setAttribute("transform", `translate(${this.panX}, ${this.panY}) scale(${this.zoomLevel})`);
    }
    const zoomIndicator = document.getElementById("zoom-level-text");
    if (zoomIndicator) {
      zoomIndicator.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
  }

  setupPanAndZoom() {
    if (!this.container) return;

    this.container.addEventListener("mousedown", (e) => {
      // If clicking inside a node or button, don't initiate pan
      if (e.target.closest(".c4-node-card") || e.target.closest("button")) return;
      this.isPanning = true;
      this.startPan = { x: e.clientX - this.panX, y: e.clientY - this.panY };
      this.container.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isPanning) return;
      this.panX = e.clientX - this.startPan.x;
      this.panY = e.clientY - this.startPan.y;
      this.applyTransform();
    });

    window.addEventListener("mouseup", () => {
      this.isPanning = false;
      if (this.container) this.container.style.cursor = "grab";
    });

    this.container.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      const newZoom = Math.min(Math.max(this.zoomLevel + delta, 0.4), 2.2);
      this.zoomLevel = newZoom;
      this.applyTransform();
    }, { passive: false });
  }

  render() {
    if (!this.container) return;

    if (this.currentView === "c4-context") {
      this.renderContextL1();
    } else if (this.currentView === "c4-container") {
      this.renderContainerL2();
    } else if (this.currentView === "c4-component") {
      this.renderComponentL3();
    }

    this.applyTransform();
  }

  getTeamColor(teamId) {
    return this.data.teams[teamId]?.color || "#64748b";
  }

  // --- C4 LEVEL 1: SYSTEM CONTEXT ---
  renderContextL1() {
    const ctx = this.data.c4.context;
    const width = 1200;
    const height = 750;

    let nodesHtml = "";
    ctx.nodes.forEach(node => {
      const isActor = node.type === "actor";
      const isExt = node.type === "system-ext";
      const isCore = node.type === "system-core";

      let nodeW = node.width || (isActor ? 230 : (isExt ? 220 : 360));
      let nodeH = node.height || (isActor ? 100 : (isExt ? 110 : 280));
      let fillClass = isActor ? "node-actor" : (isExt ? "node-external" : "node-core-system");

      nodesHtml += `
        <g class="c4-node-card ${fillClass}" id="${node.id}" transform="translate(${node.x}, ${node.y})" onclick="window.app.inspectC4Item('${node.id}', 'context')">
          <rect width="${nodeW}" height="${nodeH}" rx="12" class="node-rect" />
          
          <!-- Header / Icon -->
          <g transform="translate(16, 24)">
            ${isActor ? `
              <circle cx="12" cy="10" r="8" class="actor-icon-head" />
              <path d="M4 26 C4 20, 20 20, 20 26" class="actor-icon-body" stroke-width="2" />
            ` : (isExt ? `
              <rect width="18" height="18" rx="4" class="ext-icon" />
              <path d="M4 9 L14 9 M9 4 L9 14" stroke="#94a3b8" stroke-width="1.5" />
            ` : `
              <circle cx="10" cy="10" r="9" fill="none" stroke="#38bdf8" stroke-width="2.5" />
              <circle cx="10" cy="10" r="4" fill="#38bdf8" />
            `)}
            <text x="28" y="14" class="node-title">${node.label}</text>
          </g>

          <!-- Type pill -->
          <g transform="translate(${nodeW - 90}, 16)">
            <rect width="76" height="20" rx="10" class="pill-bg" />
            <text x="38" y="14" text-anchor="middle" class="pill-text">${isActor ? "Person" : (isExt ? "External" : "Software System")}</text>
          </g>

          <!-- Description text -->
          <foreignObject x="16" y="52" width="${nodeW - 32}" height="${nodeH - 60}">
            <div xmlns="http://www.w3.org/1999/xhtml" class="node-html-desc">
              ${node.desc}
            </div>
          </foreignObject>

          ${isCore ? `
            <!-- Core system inner badges -->
            <g transform="translate(16, 220)">
              <rect width="100" height="24" rx="6" fill="rgba(56, 189, 248, 0.15)" stroke="rgba(56, 189, 248, 0.4)" />
              <text x="50" y="16" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="600">Enterprise AI</text>
            </g>
            <g transform="translate(126, 220)">
              <rect width="90" height="24" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.4)" />
              <text x="45" y="16" text-anchor="middle" fill="#10b981" font-size="11" font-weight="600">Multi-Agent</text>
            </g>
            <g transform="translate(226, 220)">
              <rect width="90" height="24" rx="6" fill="rgba(245, 158, 11, 0.15)" stroke="rgba(245, 158, 11, 0.4)" />
              <text x="45" y="16" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="600">Governed</text>
            </g>
          ` : ""}
        </g>
      `;
    });

    let edgesHtml = this.renderEdges(ctx.edges, ctx.nodes);

    this.container.innerHTML = `
      <svg class="c4-svg-canvas" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>${this.getSvgDefs()}</defs>
        <g id="svg-pan-zoom-group">
          <!-- Title overlay -->
          <text x="40" y="40" class="canvas-title">${ctx.title}</text>
          <text x="40" y="65" class="canvas-subtitle">${ctx.subtitle}</text>
          
          <!-- Outer Boundary for Enterprise System -->
          <rect x="440" y="220" width="420" height="350" rx="16" class="system-boundary-box" />
          <text x="460" y="248" class="boundary-label">ENTERPRISE CLOUD BOUNDARY</text>

          <!-- Edges -->
          <g class="edges-group">${edgesHtml}</g>

          <!-- Nodes -->
          <g class="nodes-group">${nodesHtml}</g>
        </g>
      </svg>
    `;
  }

  // --- C4 LEVEL 2: CONTAINER DIAGRAM ---
  renderContainerL2() {
    const c2 = this.data.c4.contextL2;
    const width = 1240;
    const height = 750;

    let containersHtml = "";
    c2.containers.forEach(cnt => {
      const team = this.data.teams[cnt.team];
      const mappedLayerNames = (cnt.layerIds || []).map(id => this.data.layers.find(layer => layer.id === id)?.name).filter(Boolean);
      const isDimmed = this.activeTeam !== "all" && this.activeTeam !== cnt.team;
      const isHighlighted = this.activeTeam !== "all" && this.activeTeam === cnt.team;

      containersHtml += `
        <g class="c4-node-card node-container ${isDimmed ? 'node-dimmed' : ''} ${isHighlighted ? 'node-pulse' : ''}" 
           id="${cnt.id}" transform="translate(${cnt.x}, ${cnt.y})" onclick="window.app.inspectC4Item('${cnt.id}', 'container')">
          <title>Architecture layers: ${mappedLayerNames.join(", ")}</title>
          <rect width="${cnt.w}" height="${cnt.h}" rx="10" class="container-rect" style="border-color:${team.color}" />
          
          <!-- Accent Header Bar -->
          <path d="M 0 10 Q 0 0 10 0 L ${cnt.w - 10} 0 Q ${cnt.w} 0 ${cnt.w} 10 L ${cnt.w} 28 L 0 28 Z" fill="${team.lightBg}" />
          <line x1="0" y1="28" x2="${cnt.w}" y2="28" stroke="${team.border}" stroke-width="1" />

          <!-- Team indicator pill -->
          <g transform="translate(10, 6)">
            <circle cx="5" cy="8" r="4" fill="${team.color}" />
            <text x="14" y="11" font-size="10" font-weight="600" fill="${team.color}">${team.short}</text>
          </g>

          <!-- Type tag -->
          <g transform="translate(${cnt.w - 70}, 6)">
            <rect width="60" height="16" rx="4" fill="rgba(255,255,255,0.06)" />
            <text x="30" y="11" font-size="9" text-anchor="middle" fill="#94a3b8">Container</text>
          </g>

          <!-- Title -->
          <text x="12" y="48" class="container-title">${cnt.name}</text>

          <!-- Tech stack text -->
          <text x="12" y="65" class="container-tech">[${cnt.tech}]</text>

          <!-- Description -->
          <foreignObject x="12" y="72" width="${cnt.w - 24}" height="32">
            <div xmlns="http://www.w3.org/1999/xhtml" class="container-html-desc">
              ${cnt.desc}
            </div>
          </foreignObject>
        </g>
      `;
    });

    let edgesHtml = this.renderEdges(c2.edges, c2.containers);

    this.container.innerHTML = `
      <svg class="c4-svg-canvas" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>${this.getSvgDefs()}</defs>
        <g id="svg-pan-zoom-group">
          <!-- Title overlay -->
          <text x="40" y="38" class="canvas-title">${c2.title}</text>
          <text x="40" y="62" class="canvas-subtitle">${c2.subtitle}</text>

          <!-- Outer Platform Boundary -->
          <rect x="30" y="85" width="1160" height="630" rx="16" class="container-boundary-box" />
          <text x="50" y="112" class="boundary-label">${c2.boundary}</text>

          <!-- Edges -->
          <g class="edges-group">${edgesHtml}</g>

          <!-- Containers -->
          <g class="nodes-group">${containersHtml}</g>
        </g>
      </svg>
    `;
  }

  // --- C4 LEVEL 3: COMPONENT DIAGRAM ---
  renderComponentL3() {
    if (this.componentLayer !== "orchestrator-runtime") {
      this.renderLayerComponentsL3();
      return;
    }

    const c3 = this.data.c4.contextL3;
    const width = 1240;
    const height = 750;

    let componentsHtml = "";
    c3.components.forEach(cmp => {
      const team = this.data.teams[cmp.team];
      const isDimmed = this.activeTeam !== "all" && this.activeTeam !== cmp.team;
      const isHighlighted = this.activeTeam !== "all" && this.activeTeam === cmp.team;

      componentsHtml += `
        <g class="c4-node-card node-component ${isDimmed ? 'node-dimmed' : ''} ${isHighlighted ? 'node-pulse' : ''}" 
           id="${cmp.id}" transform="translate(${cmp.x}, ${cmp.y})" onclick="window.app.inspectC4Item('${cmp.id}', 'component')">
          <rect width="${cmp.w}" height="${cmp.h}" rx="8" class="component-rect" style="border-color:${team.color}" />

          <!-- Top team badge -->
          <g transform="translate(10, 8)">
            <circle cx="5" cy="6" r="4" fill="${team.color}" />
            <text x="14" y="9" font-size="10" font-weight="600" fill="${team.color}">${team.short}</text>
          </g>

          <!-- Type tag -->
          <g transform="translate(${cmp.w - 74}, 6)">
            <rect width="64" height="16" rx="4" fill="rgba(255,255,255,0.06)" />
            <text x="32" y="11" font-size="9" text-anchor="middle" fill="#94a3b8">Component</text>
          </g>

          <!-- Title -->
          <text x="12" y="42" class="component-title">${cmp.name}</text>
          <text x="12" y="58" class="component-tech">[${cmp.tech}]</text>

          <!-- Desc -->
          <foreignObject x="12" y="65" width="${cmp.w - 24}" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="component-html-desc">
              ${cmp.desc}
            </div>
          </foreignObject>
        </g>
      `;
    });

    let edgesHtml = this.renderEdges(c3.edges, c3.components);

    this.container.innerHTML = `
      <svg class="c4-svg-canvas" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>${this.getSvgDefs()}</defs>
        <g id="svg-pan-zoom-group">
          <!-- Title overlay -->
          <text x="40" y="38" class="canvas-title">${c3.title}</text>
          <text x="40" y="62" class="canvas-subtitle">${c3.subtitle}</text>

          <!-- Boundary box for Container -->
          <rect x="30" y="80" width="1180" height="630" rx="16" class="container-boundary-box" />
          <text x="50" y="105" class="boundary-label">CONTAINER: Agentic Orchestrator & Swarm Runtime (LangGraph / Async Core)</text>

          <!-- Edges -->
          <g class="edges-group">${edgesHtml}</g>

          <!-- Components -->
          <g class="nodes-group">${componentsHtml}</g>
        </g>
      </svg>
    `;
  }

  renderLayerComponentsL3() {
    const layer = this.data.layers.find(item => item.id === this.componentLayer) || this.data.layers[0];
    const width = 1240;
    const height = 750;
    const select = document.getElementById("c4-component-layer");
    if (select) {
      const options = this.data.layers.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
      select.innerHTML = `${options}<option value="orchestrator-runtime">Orchestrator runtime (detailed)</option>`;
      select.value = this.componentLayer;
    }

    const owner = Object.entries(layer.raci).find(([, info]) => info.role.includes("R"))?.[0]
      || Object.entries(layer.raci).find(([, info]) => info.role.includes("A"))?.[0]
      || "ai";
    const team = this.data.teams[owner];
    const componentNodes = layer.components.map((component, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = 40 + col * 295;
      const y = 130 + row * 180;
      const isDimmed = this.activeTeam !== "all" && this.activeTeam !== owner;
      const isHighlighted = this.activeTeam !== "all" && this.activeTeam === owner;
      return `
        <g class="c4-node-card node-component ${isDimmed ? 'node-dimmed' : ''} ${isHighlighted ? 'node-pulse' : ''}" transform="translate(${x}, ${y})"
           onclick="window.app.inspectLayer('${layer.id}')" style="cursor:pointer">
          <rect width="270" height="150" rx="9" class="component-rect" style="border-color:${team.color}" />
          <rect width="270" height="34" rx="9" fill="${team.lightBg}" />
          <text x="14" y="22" font-size="11" font-weight="600" fill="${team.color}">${team.short} · ${layer.category}</text>
          <foreignObject x="14" y="43" width="242" height="65">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:14px;font-weight:700;line-height:1.25;color:#f8fafc;">${component}</div>
          </foreignObject>
          <foreignObject x="14" y="112" width="242" height="32">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:10px;line-height:1.2;color:#94a3b8;">${layer.name}</div>
          </foreignObject>
        </g>
      `;
    }).join("");

    this.container.innerHTML = `
      <svg class="c4-svg-canvas" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>${this.getSvgDefs()}</defs>
        <g id="svg-pan-zoom-group">
          <text x="40" y="38" class="canvas-title">C4 Level 3: ${layer.name} Components</text>
          <text x="40" y="62" class="canvas-subtitle">Every component listed for this architecture layer. Select a card to inspect the full layer specification.</text>
          <rect x="30" y="85" width="1180" height="630" rx="16" class="container-boundary-box" />
          <text x="50" y="111" class="boundary-label">LAYER: ${layer.name} · ${layer.components.length} COMPONENTS</text>
          <g class="nodes-group">${componentNodes}</g>
        </g>
      </svg>
    `;
  }

  // --- SVG EDGE CONNECTOR GENERATOR ---
  renderEdges(edges, nodes) {
    const nodeMap = {};
    nodes.forEach(n => {
      nodeMap[n.id] = {
        x: n.x,
        y: n.y,
        w: n.width || n.w || 220,
        h: n.height || n.h || 110,
        name: n.name || n.label
      };
    });

    let html = "";
    edges.forEach((edge, idx) => {
      const from = nodeMap[edge.from];
      const to = nodeMap[edge.to];
      if (!from || !to) return;

      const team = this.data.teams[edge.team] || { color: "#64748b", name: "System" };
      const isDimmed = this.activeTeam !== "all" && this.activeTeam !== edge.team;

      // Calculate center points
      const fromCx = from.x + from.w / 2;
      const fromCy = from.y + from.h / 2;
      const toCx = to.x + to.w / 2;
      const toCy = to.y + to.h / 2;

      // Determine exit and entry edge sides based on relative positioning
      let startX = fromCx;
      let startY = fromCy;
      let endX = toCx;
      let endY = toCy;

      if (Math.abs(toCx - fromCx) > Math.abs(toCy - fromCy)) {
        // Horizontal connection
        if (toCx > fromCx) {
          startX = from.x + from.w;
          endX = to.x;
        } else {
          startX = from.x;
          endX = to.x + to.w;
        }
      } else {
        // Vertical connection
        if (toCy > fromCy) {
          startY = from.y + from.h;
          endY = to.y;
        } else {
          startY = from.y;
          endY = to.y + to.h;
        }
      }

      // Bezier curve path
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const pathD = `M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${midY} T ${endX} ${endY}`;

      const edgeTitleEscaped = encodeURIComponent(edge.label);
      const fromNameEscaped = encodeURIComponent(from.name);
      const toNameEscaped = encodeURIComponent(to.name);

      html += `
        <g class="c4-edge-group ${isDimmed ? 'edge-dimmed' : ''}" 
           id="edge-${edge.from}-${edge.to}"
           data-from="${edge.from}" 
           data-to="${edge.to}"
           onclick="window.app.inspectEdge('${edge.from}', '${edge.to}', '${edgeTitleEscaped}', '${fromNameEscaped}', '${toNameEscaped}', '${edge.team || 'ai'}')"
           style="cursor: pointer;">
          
          <!-- Invisible thick stroke for easier clicking -->
          <path d="${pathD}" fill="none" stroke="transparent" stroke-width="14" />
          
          <!-- Visible dashed animated edge line -->
          <path d="${pathD}" class="edge-line" stroke="${team.color}" stroke-dasharray="6,4" marker-end="url(#arrow-${edge.team || 'default'})" />
          
          <!-- Edge label pill -->
          <g transform="translate(${midX}, ${midY - 10})" class="edge-label-group">
            <rect x="-85" y="-12" width="170" height="22" rx="6" class="edge-label-bg" />
            <text x="0" y="2" text-anchor="middle" class="edge-label-text">${edge.label.length > 32 ? edge.label.slice(0, 30) + '...' : edge.label}</text>
          </g>
        </g>
      `;
    });

    return html;
  }

  getSvgDefs() {
    return `
      <!-- Arrow markers for each team -->
      <marker id="arrow-ai" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="#3b82f6" />
      </marker>
      <marker id="arrow-product" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
      </marker>
      <marker id="arrow-governance" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
      </marker>
      <marker id="arrow-security" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444" />
      </marker>
      <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748b" />
      </marker>

      <!-- Glow filters -->
      <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    `;
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.C4Renderer = C4Renderer;
}
