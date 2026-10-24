import { createDefaultState } from "./data.js";
import { daysFromToday, todayISO } from "./utils.js";

let appState = createDefaultState();

export function getState() { return appState; }

export function replaceState(nextState) { appState = nextState; }

export function resetState() { appState = createDefaultState(); return appState; }

export function updateState(mutator) {
  mutator(appState);
  return appState;
}

export function getTodayCheckIn() {
  return appState.sanctuary.checkIns.find((entry) => entry.date === todayISO()) || null;
}

export function getCurrentRoutineCount() {
  const localDate = todayISO();
  const completed = appState.sanctuary.routines.filter((routine) => routine.completedDates.includes(localDate)).length;
  return { completed, total: appState.sanctuary.routines.length };
}

export function getDerivedSummary() {
  const blueprints = appState.sandbox.blueprints.filter((blueprint) => blueprint.stage !== "archived");
  const active = blueprints.filter((blueprint) => blueprint.stage === "active").length;
  const blocked = blueprints.filter((blueprint) => blueprint.stage === "paused").length;
  const milestones = blueprints.flatMap((blueprint) => blueprint.milestones.map((milestone) => ({ ...milestone, blueprintTitle: blueprint.title })));
  const dueSoon = milestones.filter((milestone) => {
    if (milestone.done || !milestone.dueDate) return false;
    const days = daysFromToday(milestone.dueDate);
    return Number.isFinite(days) && days >= 0 && days <= 7;
  }).length;
  return { blueprintCount: blueprints.length, active, blocked, dueSoon };
}
