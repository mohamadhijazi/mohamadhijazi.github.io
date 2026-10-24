import { loadSavedState, saveState } from "./storage.js";
import { getState, replaceState } from "./state.js";
import { initializeEvents } from "./events.js";
import { renderSanctuaryView, renderSandboxView } from "./render.js";

let activeView = "sanctuary";
let noticeTimer = 0;
const filters = { search: "", category: "all", stage: "all", sort: "due" };

function showNotice(message, kind = "success") {
  const region = document.getElementById("notice-region");
  region.replaceChildren();
  const notice = document.createElement("div");
  notice.className = `notice${kind === "error" ? " is-error" : kind === "warning" ? " is-warning" : ""}`;
  notice.setAttribute("role", kind === "error" ? "alert" : "status");
  notice.textContent = message;
  region.append(notice);
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => region.replaceChildren(), 8000);
}

function render() {
  const sanctuary = document.getElementById("sanctuary-view");
  const sandbox = document.getElementById("sandbox-view");
  const sanctuaryButton = document.querySelector('[data-view="sanctuary"]');
  const sandboxButton = document.querySelector('[data-view="sandbox"]');
  sanctuary.hidden = activeView !== "sanctuary";
  sandbox.hidden = activeView !== "sandbox";
  sanctuaryButton.classList.toggle("is-active", activeView === "sanctuary");
  sandboxButton.classList.toggle("is-active", activeView === "sandbox");
  if (activeView === "sanctuary") {
    sanctuaryButton.setAttribute("aria-current", "page");
    sandboxButton.removeAttribute("aria-current");
  } else {
    sandboxButton.setAttribute("aria-current", "page");
    sanctuaryButton.removeAttribute("aria-current");
  }
  renderSanctuaryView();
  renderSandboxView(filters);
}

function changeView(view) {
  activeView = view;
  render();
}

function initialize() {
  const loaded = loadSavedState();
  if (loaded.state) replaceState(loaded.state);
  initializeEvents({ render, showNotice, changeView, sharedFilters: filters });
  render();
  if (!loaded.available) {
    const privacy = document.getElementById("persistence-notice");
    privacy.textContent = "Browser storage is unavailable or unreadable. Changes remain in memory for this session; export a backup before leaving.";
    showNotice(`${loaded.error} The app is using an in-memory workspace for this session.`, "warning");
  } else if (!loaded.state) {
    try { saveState(getState()); }
    catch (error) {
      document.getElementById("persistence-notice").textContent = "Browser storage is unavailable. Changes remain in memory for this session; export a backup before leaving.";
      showNotice(`Browser storage could not be initialized: ${error.message}`, "warning");
    }
  }
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    changeView(button.dataset.view);
  });
});

initialize();
