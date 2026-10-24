import { updateState } from "../state.js";
import { createId, todayISO } from "../utils.js";

export function addBlueprintInput(blueprintId, { contributor, context, kind, area, note }) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    if (!blueprint) return;
    if (!Array.isArray(blueprint.inputs)) blueprint.inputs = [];
    blueprint.inputs.unshift({
      id: createId("input"), date: todayISO(), contributor: contributor.trim(), context: context.trim(),
      kind, area: area.trim(), note: note.trim(), status: "considering",
    });
  });
}

export function setBlueprintInputStatus(blueprintId, inputId, status) {
  if (!["considering", "incorporated", "parked"].includes(status)) return;
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    const input = blueprint?.inputs?.find((item) => item.id === inputId);
    if (input) input.status = status;
  });
}

export function deleteBlueprintInput(blueprintId, inputId) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    if (blueprint) blueprint.inputs = (blueprint.inputs || []).filter((item) => item.id !== inputId);
  });
}
