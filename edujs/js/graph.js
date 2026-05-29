/* ==========================================
   EduJS - Canvas-Based Force-Directed Graph
   ========================================== */

class KnowledgeGraph {
  constructor() {
    this.canvas = document.getElementById("knowledge-graph-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    // Physics Engine Settings
    this.nodes = [];
    this.edges = [];
    this.repulsionConstant = 6000; // Adjusted dynamically by slider
    this.springLength = 120;
    this.springConstant = 0.04;
    this.damping = 0.82;
    this.centerGravity = 0.015;

    // View State (Pan & Zoom)
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;

    // Mouse Interaction States
    this.draggedNode = null;
    this.isPanning = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.focusedNode = null;

    // Category Color Dictionary
    this.categoryColors = {
      "PBI Azure fabric": { fill: "#00F2FE", stroke: "#ffffff" },
      "Azure databricks": { fill: "#00F2FE", stroke: "#ffffff" },
      "Azure AI": { fill: "#00E5FF", stroke: "#ffffff" },
      "togaf": { fill: "#a78bfa", stroke: "#ffffff" },
      "pmp": { fill: "#c084fc", stroke: "#ffffff" },
      "powerplatform": { fill: "#60a5fa", stroke: "#ffffff" },
      "Geographic": { fill: "#2dd4bf", stroke: "#ffffff" },
      "Math": { fill: "#fbbf24", stroke: "#ffffff" },
      "Biology": { fill: "#34d399", stroke: "#ffffff" },
      "Physics": { fill: "#ff007a", stroke: "#ffffff" },
      "Chemistry": { fill: "#f87171", stroke: "#ffffff" },
      "History": { fill: "#fb923c", stroke: "#ffffff" },
      "default": { fill: "#9ca3af", stroke: "#ffffff" }
    };

    // Event Bindings
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.bindGraphEvents();
    this.initPhysicsSimulation();

    // Start Animation Loop
    this.animate();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  // Seed coordinates and build physics arrays
  initPhysicsSimulation() {
    const topics = state.knowledgeBase.topics;
    const connections = state.knowledgeBase.edges;

    // Keep positions if already loaded, otherwise seed randomly
    const oldNodeMap = new Map(this.nodes.map(n => [n.id, n]));

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.nodes = topics.map(topic => {
      const existing = oldNodeMap.get(topic.id);
      if (existing) return existing;

      // Seed nodes in circular formation
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 100;
      return {
        id: topic.id,
        title: topic.title,
        category: topic.category,
        description: topic.description,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 20
      };
    });

    // Map connections
    this.edges = connections.map(conn => {
      return {
        from: this.nodes.find(n => n.id === conn.from),
        to: this.nodes.find(n => n.id === conn.to),
        label: conn.label
      };
    }).filter(e => e.from && e.to); // Filter broken references

    // Reset focused node info if it is no longer in data
    if (this.focusedNode) {
      const stillExists = this.nodes.some(n => n.id === this.focusedNode.id);
      if (!stillExists) this.closeSidebar();
    }
  }

  // ==========================================
  // Mouse and Pan/Zoom Event Bindings
  // ==========================================
  bindGraphEvents() {
    // Zoom Slider overlay
    const repulsionSlider = document.getElementById("graph-physics-strength");
    if (repulsionSlider) {
      repulsionSlider.addEventListener("input", (e) => {
        this.repulsionConstant = parseFloat(e.target.value) * 100;
      });
    }

    // Zoom Buttons
    document.getElementById("graph-btn-zoom-in").addEventListener("click", () => this.adjustZoom(1.2));
    document.getElementById("graph-btn-zoom-out").addEventListener("click", () => this.adjustZoom(0.8));
    document.getElementById("graph-btn-reset").addEventListener("click", () => {
      this.zoom = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.focusedNode = null;
      this.closeSidebar();
    });

    // Sidebar Close Button
    document.getElementById("graph-sidebar-close").addEventListener("click", () => this.closeSidebar());

    // Sidebar "View in Feed" jump button
    document.getElementById("node-sidebar-view-feed-btn").addEventListener("click", () => {
      if (!this.focusedNode) return;
      // Switch tab to feed
      switchTab("feed");

      // Set feed filter to match node category
      const targetCategory = this.focusedNode.category;
      let matchedPill = 'all';

      // Match category pills
      const pillMap = {
        "PBI Azure fabric": "Tech",
        "Azure databricks": "Tech",
        "Azure AI": "Tech",
        "powerplatform": "Tech",
        "togaf": "Tech",
        "pmp": "Tech",
        "Math": "Math",
        "Biology": "Biology",
        "Physics": "Physics",
        "Chemistry": "Chemistry",
        "History": "History",
        "Geographic": "Geographic"
      };

      const pillCategory = pillMap[targetCategory] || 'all';
      state.activeFilter = pillCategory;

      // Update Active Pill state
      document.querySelectorAll("#category-pills-container .pill").forEach(p => {
        if (p.getAttribute("data-category") === pillCategory) {
          p.classList.add("active");
        } else {
          p.classList.remove("active");
        }
      });

      renderFeedPosts();

      // Scroll targeted post card into view
      setTimeout(() => {
        const card = document.querySelector(`.feed-card[data-post-id="${this.focusedNode.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          // Highlight card border temporary
          card.style.borderColor = "var(--accent-pink)";
          setTimeout(() => card.style.borderColor = "var(--border-glass)", 2000);
        }
      }, 300);
    });

    // Canvas Events
    const getCoords = (evt) => {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = evt.clientX - rect.left;
      const screenY = evt.clientY - rect.top;

      // Convert screen pixel position to virtual graph coordinates based on pan & zoom
      const graphX = (screenX - this.canvas.width / 2 - this.panX) / this.zoom + this.canvas.width / 2;
      const graphY = (screenY - this.canvas.height / 2 - this.panY) / this.zoom + this.canvas.height / 2;

      return { screenX, screenY, graphX, graphY };
    };

    this.canvas.addEventListener("mousedown", (e) => {
      const coords = getCoords(e);
      this.lastMouseX = coords.screenX;
      this.lastMouseY = coords.screenY;

      // Check click node collision
      let clickedNode = null;
      for (let n of this.nodes) {
        const d = Math.sqrt(Math.pow(n.x - coords.graphX, 2) + Math.pow(n.y - coords.graphY, 2));
        if (d <= n.radius + 8) {
          clickedNode = n;
          break;
        }
      }

      if (clickedNode) {
        this.draggedNode = clickedNode;
        this.focusedNode = clickedNode;
        this.openSidebar(clickedNode);
      } else {
        this.isPanning = true;
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const coords = getCoords(e);

      if (this.draggedNode) {
        this.draggedNode.x = coords.graphX;
        this.draggedNode.y = coords.graphY;
        this.draggedNode.vx = 0;
        this.draggedNode.vy = 0;
      } else if (this.isPanning) {
        const dx = coords.screenX - this.lastMouseX;
        const dy = coords.screenY - this.lastMouseY;
        this.panX += dx;
        this.panY += dy;
        this.lastMouseX = coords.screenX;
        this.lastMouseY = coords.screenY;
      }
    });

    window.addEventListener("mouseup", () => {
      this.draggedNode = null;
      this.isPanning = false;
    });

    // Zoom mouse wheel support
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.adjustZoom(zoomFactor);
    });
  }

  adjustZoom(factor) {
    const nextZoom = this.zoom * factor;
    // Bounds limits
    if (nextZoom > 0.3 && nextZoom < 3.0) {
      this.zoom = nextZoom;
    }
  }

  // ==========================================
  // Sidebar Inspector Mechanics
  // ==========================================
  openSidebar(node) {
    const sidebar = document.getElementById("graph-node-sidebar");
    const titleEl = document.getElementById("node-sidebar-title");
    const categoryEl = document.getElementById("node-sidebar-category");
    const descEl = document.getElementById("node-sidebar-desc");
    const connectionsList = document.getElementById("node-sidebar-connections");

    titleEl.textContent = node.title;
    categoryEl.textContent = node.category;
    descEl.textContent = node.description;

    // Filter coloring of category tag
    const palette = this.categoryColors[node.category] || this.categoryColors.default;
    categoryEl.style.color = palette.fill;
    categoryEl.style.borderColor = palette.fill;

    // Find linked concepts
    connectionsList.innerHTML = "";
    const nodeEdges = this.edges.filter(e => e.from.id === node.id || e.to.id === node.id);

    if (nodeEdges.length > 0) {
      nodeEdges.forEach(edge => {
        const isFrom = edge.from.id === node.id;
        const neighbor = isFrom ? edge.to : edge.from;

        const item = document.createElement("div");
        item.className = "connection-item";
        item.innerHTML = `
          <span class="conn-name">${neighbor.title}</span>
          <span class="conn-label">${edge.label}</span>
        `;

        item.addEventListener("click", () => {
          this.focusedNode = neighbor;
          this.openSidebar(neighbor);
        });

        connectionsList.appendChild(item);
      });
    } else {
      connectionsList.innerHTML = `<span class="empty-msg">No active links</span>`;
    }

    sidebar.classList.add("active");
  }

  closeSidebar() {
    document.getElementById("graph-node-sidebar").classList.remove("active");
  }

  // ==========================================
  // Force-Directed Physics Engine Solver
  // ==========================================
  solvePhysics() {
    const len = this.nodes.length;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // 1) Repulsion Force: Coulomb repulses all pairs
    for (let i = 0; i < len; i++) {
      const nodeA = this.nodes[i];
      for (let j = i + 1; j < len; j++) {
        const nodeB = this.nodes[j];

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // Repulsion pushes away
        const force = this.repulsionConstant / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        // Skip dragged nodes forces
        if (nodeA !== this.draggedNode) {
          nodeA.vx -= fx;
          nodeA.vy -= fy;
        }
        if (nodeB !== this.draggedNode) {
          nodeB.vx += fx;
          nodeB.vy += fy;
        }
      }
    }

    // 2) Attraction Force: Hooke's spring forces pull linked nodes together
    this.edges.forEach(edge => {
      const dx = edge.to.x - edge.from.x;
      const dy = edge.to.y - edge.from.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Spring displacement
      const displacement = dist - this.springLength;
      const force = this.springConstant * displacement;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (edge.from !== this.draggedNode) {
        edge.from.vx += fx;
        edge.from.vy += fy;
      }
      if (edge.to !== this.draggedNode) {
        edge.to.vx -= fx;
        edge.to.vy -= fy;
      }
    });

    // 3) Center Gravity: pulls elements inward to prevent drift
    this.nodes.forEach(node => {
      if (node === this.draggedNode) return;

      const dx = centerX - node.x;
      const dy = centerY - node.y;

      node.vx += dx * this.centerGravity;
      node.vy += dy * this.centerGravity;

      // 4) Apply forces & Integrate Velocities
      node.vx *= this.damping;
      node.vy *= this.damping;

      node.x += node.vx;
      node.y += node.vy;
    });
  }

  // ==========================================
  // Render Loop & Canvas Drawing
  // ==========================================
  drawGraph() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const isDark = state.theme === 'dark';

    this.ctx.save();

    // Zoom/Pan Matrix Transformation
    // Center pan scaling
    this.ctx.translate(this.canvas.width / 2 + this.panX, this.canvas.height / 2 + this.panY);
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);

    // 1) Draw Edge Lines
    this.edges.forEach(edge => {
      this.ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)";
      this.ctx.lineWidth = 2.0;

      // Highlight edge if either node is focused
      if (this.focusedNode && (edge.from.id === this.focusedNode.id || edge.to.id === this.focusedNode.id)) {
        this.ctx.strokeStyle = isDark ? "rgba(0, 242, 254, 0.6)" : "rgba(0, 136, 204, 0.6)";
        this.ctx.lineWidth = 3.0;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(edge.from.x, edge.from.y);
      this.ctx.lineTo(edge.to.x, edge.to.y);
      this.ctx.stroke();

      // Draw connection label text
      const midX = (edge.from.x + edge.to.x) / 2;
      const midY = (edge.from.y + edge.to.y) / 2;
      this.ctx.fillStyle = isDark ? "#8888aa" : "#666688";
      this.ctx.font = "italic 9px Inter";
      this.ctx.textAlign = "center";
      this.ctx.fillText(edge.label, midX, midY - 4);
    });

    // 2) Draw Node Circles & Labels
    this.nodes.forEach(node => {
      const palette = this.categoryColors[node.category] || this.categoryColors.default;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      // Node shadow glow for dark mode
      if (isDark) {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = palette.fill;
      }

      this.ctx.fillStyle = palette.fill;
      this.ctx.fill();

      // Inner border ring
      this.ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.15)";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();

      // Focused ring highlight
      if (this.focusedNode && node.id === this.focusedNode.id) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        this.ctx.strokeStyle = "#ff007a";
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();
      }

      // Draw text label
      this.ctx.fillStyle = isDark ? "#ffffff" : "#111827";
      this.ctx.font = "bold 11px Inter";
      this.ctx.textAlign = "center";
      this.ctx.fillText(node.title, node.x, node.y + node.radius + 15);
    });

    this.ctx.restore();
  }

  animate() {
    this.solvePhysics();
    this.drawGraph();
    requestAnimationFrame(() => this.animate());
  }
}

// Bind load listener
window.addEventListener("load", () => {
  window.eduGraph = new KnowledgeGraph();
});
