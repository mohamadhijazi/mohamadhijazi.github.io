import { updateState } from "../state.js";
import { createId } from "../utils.js";

export function addRole(blueprintId, { displayName, context, role, ownership }) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    if (!blueprint) return;
    const personId = createId("person");
    app.sandbox.people.push({ id: personId, displayName: displayName.trim(), context: context.trim() || "Trusted circle" });
    blueprint.roles.push({ id: createId("role"), personId, displayName: displayName.trim(), context: context.trim() || "Trusted circle", role, ownership: ownership.trim() });
  });
}

export function removeRole(blueprintId, roleId) {
  updateState((app) => {
    const blueprint = app.sandbox.blueprints.find((item) => item.id === blueprintId);
    if (blueprint) blueprint.roles = blueprint.roles.filter((role) => role.id !== roleId);
  });
}
