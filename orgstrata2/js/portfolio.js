/* ==========================================================================
   PORTFOLIO & LANDING PAGE INTERACTION CONTROLLER
   Author: Mohammad Hijazi
   ========================================================================== */

class PortfolioController {
  init() {
    this.bindButtons();
  }

  bindButtons() {
    // Launch Workspace App Button
    const launchBtns = document.querySelectorAll(".btn-launch-workspace");
    launchBtns.forEach(btn => {
      btn.addEventListener("click", () => this.openWorkspaceApp());
    });

    // Exit Workspace App Button
    const exitBtn = document.getElementById("btnExitWorkspace");
    if (exitBtn) {
      exitBtn.addEventListener("click", () => this.closeWorkspaceApp());
    }

    // Modal triggers for Import JSON
    const importBtn = document.getElementById("btnImportJsonModal");
    if (importBtn) {
      importBtn.addEventListener("click", () => this.openImportModal());
    }

    const closeImportBtn = document.getElementById("btnCloseImportModal");
    if (closeImportBtn) {
      closeImportBtn.addEventListener("click", () => this.closeImportModal());
    }

    const submitImportBtn = document.getElementById("btnSubmitImportJson");
    if (submitImportBtn) {
      submitImportBtn.addEventListener("click", () => this.handleJsonImport());
    }
  }

  openWorkspaceApp() {
    const appContainer = document.getElementById("workspaceAppContainer");
    if (appContainer) {
      appContainer.classList.add("active");
      document.body.style.overflow = "hidden";
      
      // Start signal engine & initialize tree
      window.signalEngine.start();
      window.hierarchyTree.init();
      window.viewportManager.init();
      window.entityTools.init();
    }
  }

  closeWorkspaceApp() {
    const appContainer = document.getElementById("workspaceAppContainer");
    if (appContainer) {
      appContainer.classList.remove("active");
      document.body.style.overflow = "auto";
      window.signalEngine.stop();
    }
  }

  openImportModal() {
    const modal = document.getElementById("importModalOverlay");
    if (modal) modal.classList.add("active");
  }

  closeImportModal() {
    const modal = document.getElementById("importModalOverlay");
    if (modal) modal.classList.remove("active");
  }

  handleJsonImport() {
    const textarea = document.getElementById("jsonImportTextArea");
    if (!textarea || !textarea.value.trim()) {
      alert("Please paste valid JSON workspace data.");
      return;
    }

    const res = window.appState.importWorkspaceJSON(textarea.value);
    if (res.success) {
      alert(`Workspace imported successfully! Loading workspace: ${res.workspaceId}`);
      this.closeImportModal();
      this.openWorkspaceApp();
      window.hierarchyTree.renderCurrentWorkspaceTree();
      window.viewportManager.renderActiveViewport();
    } else {
      alert(`Import Failed: ${res.error}`);
    }
  }
}

window.portfolioController = new PortfolioController();
