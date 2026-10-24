import { getState, replaceState } from "./state.js";
import { saveState, validateAppState, validateSandboxPackage } from "./storage.js";
import { addIdeaIteration, deleteIdea, getIdea, saveIdea, setIdeaState } from "./sanctuary/lab.js";
import { deleteRoutine, getRoutine, saveRoutine, toggleRoutine } from "./sanctuary/routines.js";
import { saveCheckIn } from "./sanctuary/checkins.js";
import { addDecision, changeBlueprintStage, deleteBlueprint, getBlueprint, promoteIdeaToBlueprint, saveBlueprint } from "./sandbox/blueprints.js";
import { deleteMilestone, getMilestone, saveMilestone, toggleMilestone } from "./sandbox/milestones.js";
import { addRole, removeRole } from "./sandbox/roles.js";
import { addBlueprintInput, deleteBlueprintInput, setBlueprintInputStatus } from "./sandbox/inputs.js";
import {
  buildBlueprintForm, buildDecisionForm, buildIdeaForm, buildIterationForm, buildMilestoneForm,
  buildInputForm, buildPromotionForm, buildRoleForm, buildRoutineForm, openDialogContent, renderSandboxView,
} from "./render.js";
import { clone, downloadJSON, parseLines, parseSystems, todayISO } from "./utils.js";

let filters = { search: "", category: "all", stage: "all", sort: "due" };
let rerender = () => {};
let notify = () => {};
let setActiveView = () => {};

function closeDialog() {
  const dialog = document.getElementById("app-dialog");
  if (dialog.open) dialog.close();
}

function showForm(title, description, form) {
  openDialogContent(title, description, form, document.getElementById("app-dialog"));
}

function commit(message) {
  try {
    saveState(getState());
    rerender();
    notify(message, "success");
  } catch (error) {
    rerender();
    notify(`${message} This change is only in memory because browser storage is unavailable: ${error.message}`, "warning");
  }
}

function safeConfirm(button) {
  const question = button.dataset.confirm;
  return !question || window.confirm(question);
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function mergeSandboxPackage(pkg) {
  const next = clone(getState());
  const peopleById = new Map(next.sandbox.people.map((person) => [person.id, person]));
  pkg.sandbox.people.forEach((person) => peopleById.set(person.id, person));
  next.sandbox.people = [...peopleById.values()];
  const blueprintsById = new Map(next.sandbox.blueprints.map((blueprint) => [blueprint.id, blueprint]));
  pkg.sandbox.blueprints.forEach((blueprint) => blueprintsById.set(blueprint.id, blueprint));
  next.sandbox.blueprints = [...blueprintsById.values()];
  return next;
}

async function importFile(file) {
  try {
    const parsed = JSON.parse(await file.text());
    if (parsed?.format === "sandbox-only") {
      validateSandboxPackage(parsed);
      const proceed = window.confirm("Merge this Sandbox package into the current Sandbox? Matching blueprint and person IDs will be replaced. Your Sanctuary check-ins, routines, and private ideas will stay untouched.");
      if (!proceed) return;
      const merged = mergeSandboxPackage(parsed);
      validateAppState(merged);
      replaceState(merged);
      commit("Sandbox package merged. Sanctuary records were left untouched.");
      return;
    }
    validateAppState(parsed);
    const proceed = window.confirm("Replace all Sanctuary and Sandbox records in this browser with this full backup? It may contain private check-ins, reflections, and lab notes.");
    if (!proceed) return;
    replaceState(parsed);
    commit("Full backup imported.");
  } catch (error) {
    notify(`Import was not applied: ${error.message}`, "error");
  }
}

function exportFullBackup() {
  const proceed = window.confirm("This private backup includes Sanctuary check-ins, reflections, routines, and private lab notes. Store or share the file carefully. Export it now?");
  if (!proceed) return;
  downloadJSON(`sandbox-sanctuary-private-${todayISO()}.json`, getState());
  notify("Private full backup downloaded. It includes your Sanctuary data.", "success");
}

function exportSandbox() {
  const proceed = window.confirm("This package includes Sandbox blueprints, systems, milestones, role names, and recorded input. It excludes Sanctuary check-ins and private lab notes. Export it for manual exchange?");
  if (!proceed) return;
  const state = getState();
  const pack = { format: "sandbox-only", version: 1, sandbox: clone(state.sandbox) };
  downloadJSON(`sandbox-blueprints-${todayISO()}.json`, pack);
  notify("Sandbox-only package downloaded for manual exchange. Sanctuary check-ins and private lab notes are not included.", "success");
}

function openMilestoneForm(blueprint, milestone = null) {
  showForm(milestone ? "Edit milestone" : "Add a milestone", "A meaningful checkpoint in the larger system.", buildMilestoneForm(blueprint, milestone));
}

function handleAction(button) {
  if (!safeConfirm(button)) return;
  const action = button.dataset.action;
  const id = button.dataset.value;
  if (action === "switch-view") { setActiveView(id); return; }
  if (action === "new-idea") { showForm("Private Innovation Lab", "Capture and shape an idea in your Sanctuary.", buildIdeaForm()); return; }
  if (action === "edit-idea") { const idea = getIdea(id); if (idea) showForm("Edit private idea", "These notes remain in Sanctuary.", buildIdeaForm(idea)); return; }
  if (action === "add-iteration") { const idea = getIdea(id); if (idea) showForm("Add an iteration", "Record what changed or became clearer.", buildIterationForm(idea)); return; }
  if (action === "promote-idea") { const idea = getIdea(id); if (idea) showForm("Promote idea to blueprint", "Choose what becomes part of the Sandbox. Private notes are excluded.", buildPromotionForm(idea)); return; }
  if (action === "new-routine") { showForm("Set a routine or boundary", "Make space for both core responsibilities and creative output.", buildRoutineForm()); return; }
  if (action === "edit-routine") { const routine = getRoutine(id); if (routine) showForm("Edit routine", "Adjust the boundary this routine protects.", buildRoutineForm(routine)); return; }
  if (action === "new-blueprint") { setActiveView("sandbox"); showForm("Create a Sandbox blueprint", "Shape a larger system, shared asset, or long-term structure.", buildBlueprintForm()); return; }
  if (action === "edit-blueprint") { const blueprint = getBlueprint(id); if (blueprint) showForm("Edit blueprint", "Update the architecture and intended outcome.", buildBlueprintForm(blueprint)); return; }
  if (action === "new-milestone") { const blueprint = getBlueprint(id); if (blueprint) showForm("Add a milestone", "Choose a meaningful point to review or advance the blueprint.", buildMilestoneForm(blueprint)); return; }
  if (action === "edit-milestone") {
    const blueprintId = button.dataset.id; const milestoneId = button.dataset.childId; const blueprint = getBlueprint(blueprintId); const milestone = getMilestone(blueprintId, milestoneId);
    if (blueprint && milestone) openMilestoneForm(blueprint, milestone); return;
  }
  if (action === "delete-milestone") { deleteMilestone(button.dataset.id, button.dataset.childId); commit("Milestone removed."); return; }
  if (action === "new-role") { const blueprint = getBlueprint(id); if (blueprint) showForm("Assign a planned role", "Make ownership meaningful while keeping the core system clear.", buildRoleForm(blueprint)); return; }
  if (action === "new-input") { const blueprint = getBlueprint(id); if (blueprint) showForm("Record trusted input", "Capture feedback, co-creation, or advice from a conversation.", buildInputForm(blueprint)); return; }
  if (action === "remove-role") { removeRole(button.dataset.id, button.dataset.childId); commit("Planned role removed."); return; }
  if (action === "delete-input") { deleteBlueprintInput(button.dataset.id, button.dataset.childId); commit("Recorded input removed."); return; }
  if (action === "new-decision") { const blueprint = getBlueprint(id); if (blueprint) showForm("Log a blueprint decision", "Keep important architectural choices and their rationale visible.", buildDecisionForm(blueprint)); return; }
  if (action === "archive-idea") { setIdeaState(id, "archived"); commit("Private idea archived."); return; }
  if (action === "delete-idea") { deleteIdea(id); commit("Private idea and its iteration history deleted."); return; }
  if (action === "delete-routine") { deleteRoutine(id); commit("Routine and its completion history removed."); return; }
  if (action === "archive-blueprint") { changeBlueprintStage(id, "archived"); commit("Blueprint archived. It remains available in the archive."); return; }
  if (action === "delete-blueprint") { deleteBlueprint(id); commit("Blueprint deleted. Any source idea remains in your Sanctuary."); return; }
  if (action === "view-blueprint") { filters.search = ""; filters.category = "all"; filters.stage = "all"; setActiveView("sandbox"); return; }
  if (action === "clear-filters") { Object.assign(filters, { search: "", category: "all", stage: "all", sort: "due" }); renderSandboxView(filters); return; }
  if (action === "export-full") { exportFullBackup(); return; }
  if (action === "export-sandbox") { exportSandbox(); }
  if (action === "trigger-import") { document.getElementById("import-file").click(); }
}

function handleSubmit(event) {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  for (const control of form.querySelectorAll("[required]")) {
    if (typeof control.value === "string" && !control.value.trim()) {
      control.setCustomValidity("Enter a value before saving.");
      control.reportValidity();
      control.addEventListener("input", () => control.setCustomValidity(""), { once: true });
      return;
    }
  }
  const values = formValues(form);
  try {
    if (form.dataset.form === "checkin") {
      saveCheckIn(values); commit("Private check-in saved.");
    } else if (form.dataset.form === "routine") {
      saveRoutine(values); closeDialog(); commit(values.id ? "Routine updated." : "Routine added.");
    } else if (form.dataset.form === "idea") {
      saveIdea(values); closeDialog(); commit(values.id ? "Private idea updated." : "Private idea created.");
    } else if (form.dataset.form === "iteration") {
      addIdeaIteration(form.dataset.id, values.note); closeDialog(); commit("Private iteration saved.");
    } else if (form.dataset.form === "promotion") {
      const id = promoteIdeaToBlueprint({ ...values, successMeasures: parseLines(values.successMeasures), systems: parseSystems(values.systems) });
      closeDialog(); setActiveView("sandbox"); commit("Idea promoted. Private notes remain in Sanctuary.");
      [...document.querySelectorAll("[data-blueprint-anchor]")].find((card) => card.dataset.blueprintAnchor === id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (form.dataset.form === "blueprint") {
      saveBlueprint({ ...values, successMeasures: parseLines(values.successMeasures), systems: parseSystems(values.systems) }); closeDialog(); setActiveView("sandbox"); commit(values.id ? "Blueprint updated." : "Blueprint created.");
    } else if (form.dataset.form === "milestone") {
      saveMilestone(form.dataset.blueprintId, values); closeDialog(); commit(values.id ? "Milestone updated." : "Milestone added.");
    } else if (form.dataset.form === "role") {
      addRole(form.dataset.blueprintId, values); closeDialog(); commit("Planned role assigned.");
    } else if (form.dataset.form === "blueprint-input") {
      addBlueprintInput(form.dataset.blueprintId, values); closeDialog(); commit("Trusted input saved to the blueprint.");
    } else if (form.dataset.form === "decision") {
      addDecision(form.dataset.blueprintId, values); closeDialog(); commit("Decision added to the blueprint log.");
    }
  } catch (error) {
    notify(`Could not save this change: ${error.message}`, "error");
  }
}

export function initializeEvents({ render, showNotice, changeView, sharedFilters }) {
  rerender = render;
  notify = showNotice;
  setActiveView = changeView;
  filters = sharedFilters;
  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (control && control.matches("button")) handleAction(control);
  });
  document.addEventListener("submit", handleSubmit);
  document.addEventListener("change", (event) => {
    const control = event.target;
    if (control.matches("[data-checkin-date]")) {
      const form = control.closest("form");
      const record = getState().sanctuary.checkIns.find((item) => item.date === control.value);
      const energy = form.querySelector("[name='energy']");
      const friction = form.querySelector("[name='friction']");
      energy.value = record?.energy ?? 55;
      friction.value = record?.friction ?? 30;
      form.querySelector("#energy-value").textContent = `${energy.value}%`;
      form.querySelector("#friction-value").textContent = `${friction.value}%`;
      form.querySelector("[name='privateNote']").value = record?.privateNote || "";
      const submit = form.querySelector("[type='submit']");
      submit.textContent = record ? "Update check-in" : "Save private check-in";
      form.querySelector(".wellness-tip").textContent = Number(energy.value) < 30
        ? "A lighter, lower-stakes work block may fit today's available bandwidth."
        : Number(friction.value) > 70
          ? "Consider reducing outside inputs and protecting one clear focus window."
          : "Choose a focus block that fits your capacity and the boundaries you set.";
      return;
    }
    if (control.matches("[data-action='toggle-routine']")) { toggleRoutine(control.dataset.id); commit(control.checked ? "Routine marked complete." : "Routine marked incomplete."); return; }
    if (control.matches("[data-action='toggle-milestone']")) { toggleMilestone(control.dataset.id, control.dataset.childId); commit(control.checked ? "Milestone completed." : "Milestone reopened."); return; }
    if (control.matches("[data-action='idea-state']")) { setIdeaState(control.dataset.id, control.value); commit("Private idea stage updated."); return; }
    if (control.matches("[data-action='input-status']")) { setBlueprintInputStatus(control.dataset.id, control.dataset.childId, control.value); commit("Input review state updated."); return; }
    if (control.matches("[data-filter]")) {
      filters[control.dataset.filter] = control.value;
      renderSandboxView(filters);
    }
  });
  document.addEventListener("input", (event) => {
    const control = event.target;
    if (control.matches("[data-meter]")) {
      const output = document.getElementById(`${control.dataset.meter}-value`);
      if (output) output.textContent = `${control.value}%`;
      const form = control.closest("form");
      const energy = Number(form.querySelector("[name='energy']").value);
      const friction = Number(form.querySelector("[name='friction']").value);
      const guidance = energy < 30
        ? "A lighter, lower-stakes work block may fit today's available bandwidth."
        : friction > 70
          ? "Consider reducing outside inputs and protecting one clear focus window."
          : "Choose a focus block that fits your capacity and the boundaries you set.";
      form.querySelector(".wellness-tip").textContent = guidance;
      return;
    }
    if (control.matches("[data-filter='search']")) {
      filters.search = control.value;
      const selection = control.selectionStart;
      renderSandboxView(filters);
      const replacement = document.getElementById("blueprint-search");
      replacement?.focus();
      if (replacement && selection !== null) replacement.setSelectionRange(selection, selection);
    }
  });
  document.getElementById("import-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (file) await importFile(file);
    event.target.value = "";
  });
  document.getElementById("app-dialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });
}

