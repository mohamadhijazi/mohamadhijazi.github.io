import { getState, updateState } from "../state.js";
import { createId, todayISO } from "../utils.js";

export function saveRoutine({ id, title, boundary }) {
  const routineId = id || createId("routine");
  updateState((state) => {
    const existing = state.sanctuary.routines.find((routine) => routine.id === routineId);
    if (existing) Object.assign(existing, { title: title.trim(), boundary: boundary.trim() });
    else state.sanctuary.routines.push({ id: routineId, title: title.trim(), boundary: boundary.trim(), completedDates: [] });
  });
}

export function toggleRoutine(id) {
  const date = todayISO();
  updateState((state) => {
    const routine = state.sanctuary.routines.find((item) => item.id === id);
    if (!routine) return;
    if (routine.completedDates.includes(date)) routine.completedDates = routine.completedDates.filter((entry) => entry !== date);
    else routine.completedDates.push(date);
  });
}

export function deleteRoutine(id) {
  updateState((state) => { state.sanctuary.routines = state.sanctuary.routines.filter((item) => item.id !== id); });
}

export function getRoutine(id) { return getState().sanctuary.routines.find((routine) => routine.id === id); }
