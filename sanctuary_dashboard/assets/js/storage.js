const STORAGE_KEY = "sandbox-sanctuary-state-v1";

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: null, available: true, error: "" };
    const parsed = JSON.parse(raw);
    validateAppState(parsed);
    return { state: parsed, available: true, error: "" };
  } catch (error) {
    return { state: null, available: false, error: `Saved browser data could not be read: ${error.message}` };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function validateAppState(value) {
  if (!value || typeof value !== "object" || value.version !== 1) throw new Error("This is not a supported Sandbox & Sanctuary backup.");
  if (!value.sanctuary || !Array.isArray(value.sanctuary.checkIns) || !Array.isArray(value.sanctuary.routines) || !Array.isArray(value.sanctuary.labEntries)) {
    throw new Error("The backup is missing Sanctuary records.");
  }
  if (!value.sandbox || !Array.isArray(value.sandbox.blueprints) || !Array.isArray(value.sandbox.people)) {
    throw new Error("The backup is missing Sandbox records.");
  }
  value.sanctuary.checkIns.forEach((item) => {
    if (!item || typeof item.id !== "string" || typeof item.date !== "string" || !Number.isFinite(Number(item.energy)) || !Number.isFinite(Number(item.friction)) || Number(item.energy) < 0 || Number(item.energy) > 100 || Number(item.friction) < 0 || Number(item.friction) > 100) throw new Error("A Sanctuary check-in is incomplete or outside its 0-100 range.");
  });
  value.sanctuary.routines.forEach((item) => {
    if (!item || typeof item.id !== "string" || typeof item.title !== "string" || !Array.isArray(item.completedDates)) throw new Error("A Sanctuary routine is incomplete.");
  });
  value.sanctuary.labEntries.forEach((item) => {
    if (!item || typeof item.id !== "string" || typeof item.title !== "string" || !Array.isArray(item.iterations)) throw new Error("A private lab entry is incomplete.");
    item.iterations.forEach((iteration) => { if (!iteration || typeof iteration.id !== "string" || typeof iteration.note !== "string") throw new Error("A private idea iteration is incomplete."); });
  });
  value.sandbox.blueprints.forEach((item) => {
    if (!item || typeof item.id !== "string" || typeof item.title !== "string" || !Array.isArray(item.systems) || !Array.isArray(item.milestones) || !Array.isArray(item.roles) || !Array.isArray(item.decisions)) {
      throw new Error("A Sandbox blueprint is incomplete.");
    }
    if (!Array.isArray(item.inputs)) item.inputs = [];
    if (!Array.isArray(item.successMeasures)) item.successMeasures = [];
    item.successMeasures.forEach((measure) => { if (typeof measure !== "string") throw new Error("A blueprint success measure is invalid."); });
    item.systems.forEach((system) => { if (!system || typeof system.id !== "string" || typeof system.name !== "string") throw new Error("A blueprint system is incomplete."); });
    item.milestones.forEach((milestone) => { if (!milestone || typeof milestone.id !== "string" || typeof milestone.title !== "string") throw new Error("A blueprint milestone is incomplete."); });
    item.roles.forEach((role) => { if (!role || typeof role.id !== "string" || typeof role.displayName !== "string" || !["architect", "builder", "advisor"].includes(role.role)) throw new Error("A blueprint role is incomplete."); });
    item.decisions.forEach((decision) => { if (!decision || typeof decision.id !== "string" || typeof decision.title !== "string") throw new Error("A blueprint decision is incomplete."); });
    item.inputs.forEach((input) => {
      if (!input || typeof input.id !== "string" || typeof input.contributor !== "string" || typeof input.note !== "string" || !["feedback", "co-creation", "advisory"].includes(input.kind) || !["considering", "incorporated", "parked"].includes(input.status)) {
        throw new Error("A collaboration input is incomplete or has an unknown state.");
      }
    });
  });
  return value;
}

export function validateSandboxPackage(value) {
  if (!value || value.format !== "sandbox-only" || value.version !== 1 || !value.sandbox || !Array.isArray(value.sandbox.people) || !Array.isArray(value.sandbox.blueprints)) {
    throw new Error("This is not a supported Sandbox-only package.");
  }
  validateAppState({
    version: 1,
    sanctuary: { checkIns: [], routines: [], labEntries: [] },
    sandbox: value.sandbox,
  });
  return value;
}
