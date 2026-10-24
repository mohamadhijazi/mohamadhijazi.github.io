import { getState, updateState } from "../state.js";
import { createId } from "../utils.js";

export function saveCheckIn({ date, energy, friction, privateNote }) {
  const record = {
    id: getState().sanctuary.checkIns.find((item) => item.date === date)?.id || createId("checkin"),
    date,
    energy: Math.max(0, Math.min(100, Number(energy))),
    friction: Math.max(0, Math.min(100, Number(friction))),
    privateNote: String(privateNote || "").trim(),
  };
  updateState((state) => {
    const index = state.sanctuary.checkIns.findIndex((item) => item.date === date);
    if (index === -1) state.sanctuary.checkIns.push(record);
    else state.sanctuary.checkIns[index] = record;
    state.sanctuary.checkIns.sort((a, b) => b.date.localeCompare(a.date));
  });
  return record;
}

export function deleteCheckIn(id) {
  updateState((state) => { state.sanctuary.checkIns = state.sanctuary.checkIns.filter((item) => item.id !== id); });
}
