import { getState, updateState } from "../state.js";
import { createId, todayISO } from "../utils.js";

export const BLUEPRINT_STAGES = ["concept", "shaping", "active", "paused", "complete", "archived"];

export function saveBlueprint(record) {
  const id = record.id || createId("blueprint");
  updateState((app) => {
    const existing = app.sandbox.blueprints.find((blueprint) => blueprint.id === id);
    const values = {
      title: record.title.trim(), category: record.category, stage: record.stage,
      purpose: record.purpose.trim(), outcome: record.outcome.trim(),
      successMeasures: record.successMeasures || [], systems: record.systems, updatedAt: todayISO(),
    };
    if (existing) Object.assign(existing, values);
    else app.sandbox.blueprints.unshift({
      id, sourceIdeaId: record.sourceIdeaId || null, ...values,
      milestones: [], inputs: [], decisions: [], roles: [], createdAt: todayISO(),
    });
  });
  return id;
}

export function promoteIdeaToBlueprint({ ideaId, title, category, purpose, outcome, successMeasures, systems }) {
  const idea = getState().sanctuary.labEntries.find((entry) => entry.id === ideaId);
  if (!idea) throw new Error("This private idea could not be found.");
  if (idea.state !== "ready") throw new Error("Mark this private idea Ready to review before promoting it.");
  const id = saveBlueprint({ title, category, stage: "concept", purpose, outcome, successMeasures, systems, sourceIdeaId: idea.id });
  updateState((app) => {
    const source = app.sanctuary.labEntries.find((entry) => entry.id === ideaId);
    if (source) { source.state = "promoted"; source.promotedBlueprintId = id; source.updatedAt = todayISO(); }
  });
  return id;
}

export function changeBlueprintStage(id, stage) {
  if (!BLUEPRINT_STAGES.includes(stage)) return;
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === id);
    if (blueprint) { blueprint.stage = stage; blueprint.updatedAt = todayISO(); }
  });
}

export function deleteBlueprint(id) {
  updateState((app) => {
    app.sandbox.blueprints = app.sandbox.blueprints.filter((item) => item.id !== id);
    app.sanctuary.labEntries.forEach((idea) => {
      if (idea.promotedBlueprintId === id) { idea.promotedBlueprintId = null; if (idea.state === "promoted") idea.state = "ready"; }
    });
  });
}

export function addDecision(blueprintId, { title, detail }) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    if (blueprint) blueprint.decisions.unshift({ id: createId("decision"), date: todayISO(), title: title.trim(), detail: detail.trim() });
  });
}

export function getBlueprint(id) { return getState().sandbox.blueprints.find((item) => item.id === id); }
