import { getState, updateState } from "../state.js";
import { createId } from "../utils.js";

export function saveMilestone(blueprintId, { id, title, dueDate, owner }) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    if (!blueprint) return;
    const existing = blueprint.milestones.find((milestone) => milestone.id === id);
    if (existing) Object.assign(existing, { title: title.trim(), dueDate, owner: owner.trim() });
    else {
      blueprint.milestones.push({ id: createId("milestone"), title: title.trim(), dueDate, owner: owner.trim(), done: false });
      if (blueprint.stage === "complete") blueprint.stage = "active";
    }
  });
}

export function toggleMilestone(blueprintId, milestoneId) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    const milestone = blueprint?.milestones.find((item) => item.id === milestoneId);
    if (!milestone) return;
    milestone.done = !milestone.done;
    if (blueprint.milestones.length && blueprint.milestones.every((item) => item.done)) blueprint.stage = "complete";
    else if (blueprint.stage === "complete") blueprint.stage = "active";
  });
}

export function deleteMilestone(blueprintId, milestoneId) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    if (blueprint) blueprint.milestones = blueprint.milestones.filter((item) => item.id !== milestoneId);
  });
}

export function getMilestone(blueprintId, milestoneId) {
  return getState().sandbox.blueprints.find((item) => item.id === blueprintId)?.milestones.find((item) => item.id === milestoneId);
}
