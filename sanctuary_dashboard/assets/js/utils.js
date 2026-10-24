export const clone = (value) => JSON.parse(JSON.stringify(value));

export function createId(prefix = "item") {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

export function todayISO() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dateOffsetISO(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatDate(value) {
  if (!value) return "No date";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function daysFromToday(value) {
  if (!value) return null;
  const target = new Date(`${value}T00:00:00`);
  const today = new Date(`${todayISO()}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  return Math.round((target - today) / 86400000);
}

export function textNode(tag, text, className = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = String(text);
  return element;
}

export function element(tag, options = {}, children = []) {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text !== undefined) el.textContent = String(options.text);
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (value === true) el.setAttribute(key, "");
      else el.setAttribute(key, String(value));
    });
  }
  if (options.dataset) Object.entries(options.dataset).forEach(([key, value]) => { el.dataset[key] = String(value); });
  if (options.value !== undefined) el.value = options.value;
  if (options.checked !== undefined) el.checked = options.checked;
  if (options.disabled) el.disabled = true;
  const list = Array.isArray(children) ? children : [children];
  list.flat(Infinity).forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
  return el;
}

export function button(label, action, options = {}) {
  const attrs = { type: "button", "data-action": action, "aria-label": options.ariaLabel || label };
  if (options.value !== undefined) attrs["data-value"] = options.value;
  if (options.confirm) attrs["data-confirm"] = options.confirm;
  return element("button", { className: options.className || "button button-secondary button-small", attrs, text: label, disabled: options.disabled });
}

export function field(labelText, input, help = "") {
  const wrapper = element("div", { className: "field" });
  const id = input.id || createId("field");
  input.id = id;
  wrapper.append(element("label", { attrs: { for: id }, text: labelText }), input);
  if (help) wrapper.append(element("p", { className: "help-text", text: help }));
  return wrapper;
}

export function inputControl(name, value = "", options = {}) {
  const control = element(options.multiline ? "textarea" : "input", {
    className: "control",
    attrs: { name, type: options.type || (options.multiline ? undefined : "text"), required: options.required, min: options.min, max: options.max, step: options.step, placeholder: options.placeholder, rows: options.rows, maxlength: options.maxlength },
  });
  if (options.multiline) control.value = value || "";
  else if (value !== undefined && value !== null) control.value = value;
  return control;
}

export function selectControl(name, options, selected) {
  const select = element("select", { className: "control", attrs: { name } });
  options.forEach((option) => select.append(element("option", { value: option.value, text: option.label, attrs: { value: option.value, selected: option.value === selected } })));
  return select;
}

export function parseLines(value) {
  return String(value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export function parseSystems(value) {
  return parseLines(value).map((line) => {
    const [name = "", purpose = "", dependencies = ""] = line.split("|").map((part) => part.trim());
    return { id: createId("system"), name, purpose, dependencies };
  }).filter((system) => system.name);
}

export function formatSystems(systems = []) {
  return systems.map((system) => [system.name, system.purpose, system.dependencies].filter(Boolean).join(" | ")).join("\n");
}

export function statusLabel(status) {
  return String(status || "unknown").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function progressFor(blueprint) {
  const milestones = blueprint.milestones || [];
  if (!milestones.length) return 0;
  return Math.round((milestones.filter((milestone) => milestone.done).length / milestones.length) * 100);
}

export function downloadJSON(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
