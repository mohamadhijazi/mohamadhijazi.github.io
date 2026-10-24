import { getState, updateState } from "../state.js";
import { createId, todayISO } from "../utils.js";

export function saveIdea({ id, title, state: stage, privateNotes }) {
  const ideaId = id || createId("idea");
  updateState((app) => {
    const existing = app.sanctuary.labEntries.find((idea) => idea.id === ideaId);
    if (existing) Object.assign(existing, { title: title.trim(), state: stage, privateNotes: privateNotes.trim(), updatedAt: todayISO() });
    else app.sanctuary.labEntries.unshift({ id: ideaId, title: title.trim(), state: stage, privateNotes: privateNotes.trim(), createdAt: todayISO(), iterations: [], promotedBlueprintId: null });
  });
  return ideaId;
}

export function addIdeaIteration(id, note) {
  updateState((app) => {
    const idea = app.sanctuary.labEntries.find((item) => item.id === id);
    if (idea) idea.iterations.unshift({ id: createId("iteration"), date: todayISO(), note: note.trim() });
  });
}

export function setIdeaState(id, stage) {
  updateState((app) => {
    const idea = app.sanctuary.labEntries.find((item) => item.id === id);
    if (idea) { idea.state = stage; idea.updatedAt = todayISO(); }
  });
}

export function deleteIdea(id) {
  updateState((app) => {
    app.sanctuary.labEntries = app.sanctuary.labEntries.filter((idea) => idea.id !== id);
    app.sandbox.blueprints.forEach((blueprint) => { if (blueprint.sourceIdeaId === id) blueprint.sourceIdeaId = null; });
  });
}

export function getIdea(id) { return getState().sanctuary.labEntries.find((idea) => idea.id === id); }
