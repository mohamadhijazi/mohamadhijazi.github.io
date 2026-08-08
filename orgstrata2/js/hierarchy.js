/* ==========================================================================
   DIGITAL TWIN WORKSPACE - HIERARCHY UI TREE NAVIGATION ENGINE
   Renders Org Structures, Process Hierarchies & Portfolios
   ========================================================================== */

class HierarchyTreeController {
  constructor() {
    this.treeContainer = null;
    this.searchInput = null;
  }

  init() {
    this.treeContainer = document.getElementById("hierarchyTreeContainer");
    this.searchInput = document.getElementById("treeSearchInput");

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => this.filterNodes(e.target.value));
    }

    this.renderCurrentWorkspaceTree();
  }

  renderCurrentWorkspaceTree() {
    if (!this.treeContainer) return;
    const ws = window.appState.getWorkspace();
    const hierarchy = ws.hierarchy;

    if (!hierarchy) {
      this.treeContainer.innerHTML = `<div style="padding:1rem; color:var(--text-muted); font-size:0.85rem;">No hierarchy found</div>`;
      return;
    }

    let html = '';

    // 1. Org Structure Section
    if (hierarchy.org && hierarchy.org.length > 0) {
      html += `<div class="tree-section-header">🏢 Org Structure</div>`;
      hierarchy.org.forEach(item => {
        html += `
          <div class="tree-node" data-node-id="${item.id}" onclick="window.hierarchyTree.selectNode('${item.id}', '${item.label}')">
            <span class="tree-node-icon">${item.icon || '👤'}</span>
            <span>${item.label}</span>
          </div>
        `;
      });
    }

    // 2. Process Hierarchy Section
    if (hierarchy.process && hierarchy.process.length > 0) {
      html += `<div class="tree-section-header">🔄 Process Hierarchy</div>`;
      hierarchy.process.forEach(item => {
        html += `
          <div class="tree-node" data-node-id="${item.id}" onclick="window.hierarchyTree.selectNode('${item.id}', '${item.label}')">
            <span class="tree-node-icon">⚡</span>
            <span>${item.label}</span>
          </div>
        `;
      });
    }

    // 3. Portfolio Management Section
    if (hierarchy.portfolio && hierarchy.portfolio.length > 0) {
      html += `<div class="tree-section-header">📁 Portfolios & Programs</div>`;
      hierarchy.portfolio.forEach(item => {
        html += `
          <div class="tree-node" data-node-id="${item.id}" onclick="window.hierarchyTree.selectNode('${item.id}', '${item.label}')">
            <span class="tree-node-icon">📌</span>
            <span>${item.label}</span>
          </div>
        `;
      });
    }

    this.treeContainer.innerHTML = html;

    // Select first node by default
    const firstNode = this.treeContainer.querySelector('.tree-node');
    if (firstNode) {
      firstNode.classList.add('active');
    }
  }

  selectNode(nodeId, nodeLabel) {
    document.querySelectorAll('.tree-node').forEach(el => el.classList.remove('active'));
    const target = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (target) target.classList.add('active');

    // Update current active node in window & refresh tools
    window.activeSelectedNode = { id: nodeId, label: nodeLabel };
    
    // Update toolbar indicator if present
    const nodeDisplay = document.getElementById("activeNodeTitleDisplay");
    if (nodeDisplay) nodeDisplay.textContent = nodeLabel;

    // Refresh entity tools panel
    if (window.entityTools) {
      window.entityTools.renderActiveTools(nodeLabel);
    }
  }

  filterNodes(query) {
    const term = query.toLowerCase();
    const nodes = this.treeContainer.querySelectorAll('.tree-node');
    nodes.forEach(node => {
      const txt = node.textContent.toLowerCase();
      if (txt.includes(term)) {
        node.style.display = 'flex';
      } else {
        node.style.display = 'none';
      }
    });
  }
}

window.hierarchyTree = new HierarchyTreeController();
