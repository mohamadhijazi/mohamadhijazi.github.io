import { getState, getTodayCheckIn, getCurrentRoutineCount, getDerivedSummary } from "./state.js";
import { button, element, field, formatDate, daysFromToday, progressFor, selectControl, statusLabel, textNode, inputControl, todayISO } from "./utils.js";

const checkInStages = [
  { value: "draft", label: "Draft" },
  { value: "exploring", label: "Exploring" },
  { value: "ready", label: "Ready to review" },
  { value: "promoted", label: "Promoted" },
  { value: "archived", label: "Archived" },
];
const categories = ["Family project", "Family legacy", "Peer & mentor", "Creative work", "Venture"].map((value) => ({ value, label: value }));
const stages = ["concept", "shaping", "active", "paused", "complete", "archived"].map((value) => ({ value, label: statusLabel(value) }));

function sectionHeader(kicker, title, description, actions = [], headingId = "") {
  const heading = textNode("h2", title);
  if (headingId) heading.id = headingId;
  const copy = element("div", {}, [
    textNode("p", kicker, "eyebrow"),
    heading,
    textNode("p", description),
  ]);
  return element("div", { className: "section-heading" }, [copy, element("div", { className: "inline-actions" }, actions)]);
}

function statCard(label, value, note, accent = "") {
  const valueNode = textNode("div", value, `stat-value ${accent}`.trim());
  return element("article", { className: "stat-card" }, [textNode("div", label, "stat-label"), valueNode, textNode("div", note, "stat-note")]);
}

function badge(text, tone = "") { return textNode("span", text, `badge ${tone}`.trim()); }

function emptyState(message) { return element("div", { className: "empty-state", text: message }); }

function rangeField(labelText, name, value, helper) {
  const range = element("input", { className: "control", attrs: { type: "range", min: "0", max: "100", step: "1", name, value: String(value), "data-meter": name, "aria-label": labelText, "aria-describedby": `${name}-help` } });
  const wrap = field(labelText, range, helper);
  wrap.querySelector(".help-text").id = `${name}-help`;
  const line = element("div", { className: "range-heading" }, [
    textNode("span", labelText, "field-label"),
    textNode("output", `${value}%`, "accent-amber"),
  ]);
  line.lastChild.id = `${name}-value`;
  wrap.querySelector("label").remove();
  wrap.prepend(line);
  return wrap;
}

function routineCard(routine, today) {
  const completed = routine.completedDates.includes(today);
  const checkbox = element("input", { attrs: { type: "checkbox", checked: completed, "data-action": "toggle-routine", "data-id": routine.id, "aria-label": `Mark ${routine.title} ${completed ? "not complete" : "complete"}` } });
  const info = element("div", {}, [textNode("span", routine.title, "routine-title"), textNode("span", routine.boundary || "Boundary not set", "routine-boundary")]);
  return element("div", { className: `routine-card${completed ? " is-done" : ""}` }, [checkbox, info, element("div", { className: "inline-actions" }, [
    button("Edit", "edit-routine", { value: routine.id }),
    button("Remove", "delete-routine", { value: routine.id, className: "button button-danger button-small", confirm: "Remove this routine and its completion history?" }),
  ])]);
}

function checkInHistory(checkIns) {
  if (!checkIns.length) return emptyState("Check-ins will appear here after you log one.");
  const list = element("div", { className: "history-list" });
  checkIns.slice(0, 5).forEach((entry) => {
    const date = textNode("strong", formatDate(entry.date), "small");
    const meters = element("div", { className: "meter-list" }, [
      meterLine("Energy", entry.energy, ""),
      meterLine("Friction", entry.friction, "friction"),
    ]);
    const note = entry.privateNote ? textNode("p", entry.privateNote, "help-text no-margin") : null;
    list.append(element("article", { className: "history-card stack-sm" }, [date, meters, note]));
  });
  return list;
}

function meterLine(label, value, kind) {
  const track = element("div", { className: "meter-track", attrs: { role: "img", "aria-label": `${label}: ${value} percent` } });
  const fill = element("div", { className: `meter-fill ${kind}`.trim() });
  fill.style.width = `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
  track.append(fill);
  return element("div", { className: "meter-line" }, [textNode("span", label), track, textNode("span", `${value}%`)]);
}

function routinePanel(state) {
  const today = todayISO();
  const count = getCurrentRoutineCount();
  const panel = element("article", { className: "panel stack" });
  panel.append(element("div", { className: "panel-heading" }, [
    element("div", {}, [textNode("h3", "Routines & boundaries"), textNode("p", `${count.completed} of ${count.total} complete today`, "small muted")]),
    button("Add routine", "new-routine", { className: "button button-secondary button-small" }),
  ]));
  if (!state.sanctuary.routines.length) panel.append(emptyState("Set a routine that protects focus, responsibilities, or creative time."));
  else state.sanctuary.routines.forEach((routine) => panel.append(routineCard(routine, today)));
  return panel;
}

function ideaCard(idea) {
  const head = element("div", { className: "row-between" }, [
    textNode("h4", idea.title),
    badge(statusLabel(idea.state), idea.state === "ready" ? "badge-sage" : idea.state === "promoted" ? "badge-blue" : "badge-amber"),
  ]);
  const privateNotice = textNode("div", "Private to your Sanctuary. No collaborator can see this entry.", "micro quiet");
  const notes = textNode("p", idea.privateNotes || "No private notes yet.");
  const history = element("details", {}, [
    element("summary", { text: `Iteration history (${idea.iterations.length})` }),
    idea.iterations.length ? element("ul", { className: "decision-list" }, idea.iterations.map((iteration) => element("li", { className: "decision-item" }, [textNode("strong", formatDate(iteration.date)), textNode("span", iteration.note)]))) : textNode("p", "No iterations recorded yet.", "help-text"),
  ]);
  const stateOptions = checkInStages.filter((item) => item.value !== "promoted" || Boolean(idea.promotedBlueprintId));
  const stateSelect = selectControl("state", stateOptions, idea.state);
  stateSelect.dataset.action = "idea-state";
  stateSelect.dataset.id = idea.id;
  stateSelect.setAttribute("aria-label", `Change state for ${idea.title}`);
  const actions = [
    button("Edit", "edit-idea", { value: idea.id }),
    button("Add iteration", "add-iteration", { value: idea.id }),
  ];
  if (!idea.promotedBlueprintId && idea.state === "ready") actions.push(button("Promote to blueprint", "promote-idea", { value: idea.id, className: "button button-small" }));
  else if (!idea.promotedBlueprintId && idea.state !== "archived") actions.push(textNode("span", "Set to Ready to review before promoting.", "micro quiet"));
  if (idea.promotedBlueprintId) actions.push(button("View blueprint", "view-blueprint", { value: idea.promotedBlueprintId, className: "button button-secondary button-small" }));
  actions.push(button("Archive", "archive-idea", { value: idea.id, className: "button button-quiet button-small" }));
  actions.push(button("Delete", "delete-idea", { value: idea.id, className: "button button-danger button-small", confirm: "Permanently delete this private idea and its iteration history?" }));
  return element("article", { className: "idea-card is-private" }, [
    head, privateNotice, notes,
    textNode("div", `Created ${formatDate(idea.createdAt)}`, "micro quiet"),
    history,
    element("div", { className: "field" }, [textNode("label", "Idea stage"), stateSelect]),
    element("div", { className: "inline-actions" }, actions),
  ]);
}

function checkInForm() {
  const today = todayISO();
  const existing = getTodayCheckIn();
  const energy = existing?.energy ?? 55;
  const friction = existing?.friction ?? 30;
  const form = element("form", { className: "panel stack", attrs: { "data-form": "checkin" } });
  form.append(element("div", { className: "panel-heading" }, [element("div", {}, [textNode("h3", "Today's bandwidth"), textNode("p", "A private check-in to help choose the right kind of work.", "small muted")])]));
  form.append(field("Date", element("input", { className: "control", attrs: { type: "date", name: "date", value: existing?.date || today, max: today, required: true, "data-checkin-date": "" } })));
  form.append(element("div", { className: "range-grid" }, [
    rangeField("Energy / available bandwidth", "energy", energy, "How much capacity do you have available today?"),
    rangeField("Friction / external noise", "friction", friction, "How much outside noise or resistance is competing for attention?"),
  ]));
  form.append(field("Private reflection (optional)", inputControl("privateNote", existing?.privateNote || "", { multiline: true, rows: 3, placeholder: "A note for yourself; this stays in the Sanctuary." }), "This note is private and is never copied into a blueprint."));
  const guidance = energy < 30 ? "A lighter, lower-stakes work block may fit today's available bandwidth." : friction > 70 ? "Consider reducing outside inputs and protecting one clear focus window." : "Choose a focus block that fits your capacity and the boundaries you set.";
  form.append(textNode("p", guidance, "wellness-tip"));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: existing ? "Update today's check-in" : "Save private check-in" })]));
  return form;
}

function routinesAndLab(state) {
  const section = element("div", { className: "panel-stack" }, [routinePanel(state)]);
  const lab = element("article", { className: "panel stack" });
  lab.append(element("div", { className: "panel-heading" }, [
    element("div", {}, [textNode("h3", "Private Innovation Lab"), textNode("p", "Explore ideas without unsolicited critique. Promote only when you choose.", "small muted")]),
    button("New idea", "new-idea", { className: "button button-secondary button-small" }),
  ]));
  const ideas = state.sanctuary.labEntries.filter((idea) => idea.state !== "archived");
  if (!ideas.length) lab.append(emptyState("Your private lab is clear. Capture an idea when you are ready."));
  else {
    const grid = element("div", { className: "two-col" });
    ideas.forEach((idea) => grid.append(ideaCard(idea)));
    lab.append(grid);
  }
  const archived = state.sanctuary.labEntries.filter((idea) => idea.state === "archived");
  if (archived.length) lab.append(element("details", {}, [
    element("summary", { text: `Archived ideas (${archived.length})` }),
    element("div", { className: "two-col" }, archived.map(ideaCard)),
  ]));
  section.append(lab);
  return section;
}

export function renderSanctuaryView() {
  const root = document.getElementById("sanctuary-view");
  const state = getState();
  const count = getCurrentRoutineCount();
  const todayCheckIn = getTodayCheckIn();
  root.replaceChildren();
  const view = element("div", { className: "workspace" });
  view.append(sectionHeader("Control & focus", "Ground in your Sanctuary", "A predictable personal workspace for bandwidth, clear boundaries, and private creative work.", [
    button("Go to Sandbox", "switch-view", { value: "sandbox", className: "button button-secondary" }),
  ], "sanctuary-heading"));
  view.append(element("div", { className: "stats-grid" }, [
    statCard("Energy today", todayCheckIn ? `${todayCheckIn.energy}%` : "Not logged", todayCheckIn ? "Self-reported capacity" : "Log a private check-in", "accent-amber"),
    statCard("Friction today", todayCheckIn ? `${todayCheckIn.friction}%` : "Not logged", todayCheckIn ? "Self-reported external noise" : "Log a private check-in", "accent-blue"),
    statCard("Routines", `${count.completed} / ${count.total}`, "Completed today", "accent-sage"),
    statCard("Private ideas", String(state.sanctuary.labEntries.filter((idea) => idea.state !== "archived").length), "In your innovation lab", "accent-amber"),
  ]));
  const columns = element("div", { className: "content-grid" }, [
    element("div", { className: "panel-stack" }, [checkInForm(), element("article", { className: "panel stack" }, [
      element("div", { className: "panel-heading" }, [element("div", {}, [textNode("h3", "Recent check-ins"), textNode("p", "A simple personal trend, visible only here.", "small muted")])]),
      checkInHistory(state.sanctuary.checkIns),
    ])]),
    routinesAndLab(state),
  ]);
  view.append(columns);
  root.append(view);
}

function closestMilestone(blueprint) {
  return blueprint.milestones.filter((item) => !item.done && item.dueDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] || null;
}

function roleTone(role) { return `role-badge role-${role}`; }

function blueprintCard(blueprint) {
  const progress = progressFor(blueprint);
  const next = closestMilestone(blueprint);
  const card = element("article", { className: `blueprint-card${blueprint.stage === "paused" ? " is-blocked" : ""}`, attrs: { "data-blueprint-anchor": blueprint.id } });
  card.append(element("div", { className: "card-heading" }, [
    element("div", { className: "badge-row" }, [badge(blueprint.category, "badge-sage"), badge(statusLabel(blueprint.stage), blueprint.stage === "paused" ? "badge-rose" : blueprint.stage === "active" ? "badge-sage" : "badge-blue")]),
    textNode("span", `${progress}%`, "accent-sage small"),
  ]));
  card.append(textNode("h3", blueprint.title));
  card.append(element("div", { className: "stack-sm" }, [textNode("p", blueprint.purpose), blueprint.outcome ? textNode("p", `Intended outcome: ${blueprint.outcome}`, "small muted") : null]));
  if (blueprint.successMeasures?.length) card.append(element("div", { className: "stack-sm" }, [textNode("strong", "Success measures", "micro muted"), element("ul", { className: "success-measures" }, blueprint.successMeasures.map((measure) => textNode("li", measure)))]));
  const bar = element("div", { className: "progress-track", attrs: { role: "img", "aria-label": `${progress} percent of milestones complete` } });
  const fill = element("div", { className: "progress-fill" }); fill.style.width = `${progress}%`; bar.append(fill); card.append(bar);
  card.append(element("div", { className: "card-meta" }, [
    textNode("span", `${blueprint.systems.length} systems`),
    textNode("span", `${blueprint.milestones.filter((item) => item.done).length}/${blueprint.milestones.length} milestones`),
    textNode("span", `${blueprint.roles.length} planned role${blueprint.roles.length === 1 ? "" : "s"}`),
  ]));
  if (blueprint.sourceIdeaId) card.append(textNode("p", "Promoted from your private lab; private notes were kept in Sanctuary.", "micro quiet"));
  if (next) {
    const remaining = daysFromToday(next.dueDate);
    card.append(textNode("p", `Next milestone: ${next.title} - ${formatDate(next.dueDate)}${remaining < 0 ? " (overdue)" : remaining === 0 ? " (today)" : ""}`, remaining < 0 ? "small accent-rose" : "small muted"));
  }
  card.append(element("details", {}, [
    element("summary", { text: `Systems & building blocks (${blueprint.systems.length})` }),
    blueprint.systems.length ? element("ul", { className: "system-list" }, blueprint.systems.map((system) => element("li", { className: "system-item" }, [textNode("strong", system.name), textNode("span", system.purpose || "Purpose not set"), system.dependencies ? textNode("span", `Depends on: ${system.dependencies}`) : null]))) : textNode("p", "Add systems and building blocks as the idea takes shape.", "help-text"),
  ]));
  card.append(element("details", {}, [
    element("summary", { text: `Milestones (${blueprint.milestones.length})` }),
    blueprint.milestones.length ? element("ul", { className: "milestone-list" }, blueprint.milestones.map((milestone) => {
      const checkbox = element("input", { attrs: { type: "checkbox", checked: milestone.done, "data-action": "toggle-milestone", "data-id": blueprint.id, "data-child-id": milestone.id, "aria-label": `Mark milestone ${milestone.title} ${milestone.done ? "incomplete" : "complete"}` } });
      const label = element("span", {}, [textNode("strong", milestone.title), textNode("span", `${milestone.owner ? `${milestone.owner} - ` : ""}${formatDate(milestone.dueDate)}`, "micro quiet")]);
      const edit = button("Edit", "edit-milestone", { className: "button button-quiet button-small" });
      edit.dataset.id = blueprint.id; edit.dataset.childId = milestone.id;
      const remove = button("Remove", "delete-milestone", { className: "button button-danger button-small", confirm: "Remove this milestone from the blueprint?" });
      remove.dataset.id = blueprint.id; remove.dataset.childId = milestone.id;
      return element("li", { className: `milestone-item${milestone.done ? " is-complete" : ""}` }, [checkbox, label, element("div", { className: "inline-actions" }, [edit, remove])]);
    })) : textNode("p", "No milestones yet. Add a first step when the blueprint is ready.", "help-text"),
  ]));
  card.append(element("details", {}, [
    element("summary", { text: `Roles & ownership (${blueprint.roles.length})` }),
    blueprint.roles.length ? element("ul", { className: "role-list" }, blueprint.roles.map((role) => {
      const remove = button("Remove", "remove-role", { className: "button button-danger button-small", confirm: "Remove this planned role assignment?" });
      remove.dataset.id = blueprint.id; remove.dataset.childId = role.id;
      return element("li", { className: "role-item" }, [
        element("div", { className: "stack-sm" }, [element("div", { className: "row" }, [textNode("strong", role.displayName), textNode("span", statusLabel(role.role), roleTone(role.role))]), textNode("span", role.context || "Trusted circle", "micro muted"), textNode("span", role.ownership || "Scope not set", "micro muted")]),
        remove,
      ]);
    })) : textNode("p", "Assign an Architect, Builder, or Advisor as the blueprint takes shape.", "help-text"),
    textNode("p", "Planning records only - these people do not have access to this browser workspace.", "micro quiet"),
  ]));
  card.append(element("details", {}, [
    element("summary", { text: `Decision log (${blueprint.decisions.length})` }),
    blueprint.decisions.length ? element("ul", { className: "decision-list" }, blueprint.decisions.map((decision) => element("li", { className: "decision-item" }, [textNode("strong", decision.title), textNode("span", `${formatDate(decision.date)} - ${decision.detail}`)]))) : textNode("p", "No decisions recorded yet.", "help-text"),
  ]));
  const inputs = blueprint.inputs || [];
  card.append(element("details", {}, [
    element("summary", { text: `Feedback & advisory inputs (${inputs.length})` }),
    textNode("p", "Record useful input from a trusted conversation and decide how it affects the architecture. Participants do not enter this workspace directly.", "help-text"),
    inputs.length ? element("ul", { className: "decision-list" }, inputs.map((input) => {
      const status = selectControl("status", [
        { value: "considering", label: "Considering" },
        { value: "incorporated", label: "Incorporated" },
        { value: "parked", label: "Parked" },
      ], input.status);
      status.dataset.action = "input-status"; status.dataset.id = blueprint.id; status.dataset.childId = input.id;
      status.setAttribute("aria-label", `Update input from ${input.contributor}`);
      const remove = button("Remove", "delete-input", { className: "button button-danger button-small", confirm: "Remove this recorded input?" });
      remove.dataset.id = blueprint.id; remove.dataset.childId = input.id;
      return element("li", { className: "decision-item stack-sm" }, [
        element("div", { className: "row-between" }, [textNode("strong", `${input.contributor} - ${statusLabel(input.kind)}`), textNode("span", formatDate(input.date), "micro quiet")]),
        input.context ? textNode("span", input.context, "micro muted") : null,
        input.area ? textNode("span", `Related area: ${input.area}`, "micro muted") : null,
        textNode("span", input.note),
        element("div", { className: "row-between" }, [element("div", { className: "field" }, [textNode("label", "Review state"), status]), remove]),
      ]);
    })) : textNode("p", "No feedback or advisory input recorded yet.", "help-text"),
  ]));
  const actions = element("div", { className: "inline-actions" }, [
    button("Edit blueprint", "edit-blueprint", { value: blueprint.id }),
    button("Add milestone", "new-milestone", { value: blueprint.id }),
    button("Assign role", "new-role", { value: blueprint.id }),
    button("Record input", "new-input", { value: blueprint.id }),
    button("Log decision", "new-decision", { value: blueprint.id }),
  ]);
  const destructive = blueprint.stage === "archived"
    ? button("Delete", "delete-blueprint", { value: blueprint.id, className: "button button-danger button-small", confirm: "Permanently delete this blueprint? The source idea will remain in your Sanctuary." })
    : button("Archive", "archive-blueprint", { value: blueprint.id, className: "button button-quiet button-small" });
  actions.append(destructive);
  card.append(actions);
  return card;
}

export function renderSandboxView(filters = {}) {
  const root = document.getElementById("sandbox-view");
  const state = getState();
  const summary = getDerivedSummary();
  root.replaceChildren();
  const view = element("div", { className: "workspace" });
  view.append(sectionHeader("System design & expansion", "Build beyond the immediate", "Mature selected ideas into purposeful blueprints, with systems, milestones, and clear ownership.", [
    button("New blueprint", "new-blueprint", { className: "button" }),
    button("Back to Sanctuary", "switch-view", { value: "sanctuary", className: "button button-secondary" }),
  ], "sandbox-heading"));
  view.append(element("div", { className: "privacy-callout", text: "Roles are planning records, not app access. There are no accounts or live sync; use Export Sandbox and Import backup to exchange a blueprint snapshot manually. Sanctuary check-ins and private lab notes are excluded." }));
  view.append(element("div", { className: "stats-grid" }, [
    statCard("Blueprints", String(summary.blueprintCount), "Excludes archived blueprints", "accent-sage"),
    statCard("Active", String(summary.active), "In the active stage", "accent-amber"),
    statCard("Paused", String(summary.blocked), "Waiting for a decision or input", "accent-rose"),
    statCard("Milestones due soon", String(summary.dueSoon), "Open milestones due in 7 days", "accent-blue"),
  ]));
  const filtersPanel = element("section", { className: "panel stack" }, [
    element("div", { className: "panel-heading" }, [element("div", {}, [textNode("h3", "Blueprint portfolio"), textNode("p", "Review the architecture and the next meaningful milestone.", "small muted")])]),
  ]);
  const filterControls = element("div", { className: "filter-controls" });
  const search = inputControl("search", filters.search || "", { placeholder: "Search title, purpose, outcome, or owner" });
  search.id = "blueprint-search"; search.dataset.filter = "search"; search.setAttribute("aria-label", "Search blueprints");
  filterControls.append(search);
  const category = selectControl("category", [{ value: "all", label: "All categories" }, ...categories], filters.category || "all");
  category.id = "blueprint-category"; category.dataset.filter = "category"; category.setAttribute("aria-label", "Filter by category"); filterControls.append(category);
  const stage = selectControl("stage", [{ value: "all", label: "All stages" }, ...stages.filter((item) => item.value !== "archived")], filters.stage || "all");
  stage.id = "blueprint-stage"; stage.dataset.filter = "stage"; stage.setAttribute("aria-label", "Filter by stage"); filterControls.append(stage);
  const sort = selectControl("sort", [
    { value: "due", label: "Sort: next milestone" },
    { value: "recent", label: "Sort: recently created" },
    { value: "title", label: "Sort: title" },
  ], filters.sort || "due");
  sort.id = "blueprint-sort"; sort.dataset.filter = "sort"; sort.setAttribute("aria-label", "Sort blueprints"); filterControls.append(sort);
  filtersPanel.append(element("div", { className: "filter-row" }, [filterControls, button("Clear filters", "clear-filters", { className: "button button-quiet button-small" })]));
  const allBlueprints = state.sandbox.blueprints;
  const currentFilters = { search: "", category: "all", stage: "all", sort: "due", ...filters };
  let visible = allBlueprints.filter((blueprint) => {
    const term = String(currentFilters.search || "").trim().toLowerCase();
    const text = [blueprint.title, blueprint.purpose, blueprint.outcome, ...(blueprint.successMeasures || []), ...blueprint.roles.map((role) => role.displayName)].join(" ").toLowerCase();
    return blueprint.stage !== "archived"
      && (currentFilters.category === "all" || blueprint.category === currentFilters.category)
      && (currentFilters.stage === "all" || blueprint.stage === currentFilters.stage)
      && (!term || text.includes(term));
  });
  if (currentFilters.sort === "title") visible.sort((a, b) => a.title.localeCompare(b.title));
  else if (currentFilters.sort === "recent") visible.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  else visible.sort((a, b) => (closestMilestone(a)?.dueDate || "9999").localeCompare(closestMilestone(b)?.dueDate || "9999"));
  if (visible.length) filtersPanel.append(element("div", { className: "blueprint-grid" }, visible.map(blueprintCard)));
  else filtersPanel.append(emptyState(allBlueprints.length ? "No blueprints match these filters. Clear filters or adjust the search." : "Your Sandbox is ready. Promote a private idea or start a blueprint."));
  view.append(filtersPanel);
  const archived = allBlueprints.filter((blueprint) => blueprint.stage === "archived");
  if (archived.length) view.append(element("details", { className: "panel" }, [
    element("summary", { text: `Archived blueprints (${archived.length})` }),
    element("div", { className: "blueprint-grid" }, archived.map(blueprintCard)),
  ]));
  root.append(view);
}

export function openDialogContent(title, description, form, dialog) {
  const target = document.getElementById("dialog-content");
  target.replaceChildren();
  const heading = textNode("h2", title);
  heading.id = "dialog-title";
  target.append(element("div", { className: "dialog-heading" }, [element("div", {}, [heading, description ? textNode("p", description) : null])]));
  if (form) target.append(form);
  if (dialog && !dialog.open) dialog.showModal();
}

export function buildIdeaForm(idea = null) {
  const form = element("form", { className: "stack", attrs: { "data-form": "idea" } });
  if (idea) form.append(element("input", { attrs: { type: "hidden", name: "id", value: idea.id } }));
  form.append(field("Idea title", inputControl("title", idea?.title || "", { required: true, maxlength: 120, placeholder: "A personal idea, model, or experiment" })));
  form.append(field("Stage", selectControl("state", checkInStages.filter((item) => item.value !== "promoted" || idea?.state === "promoted"), idea?.state || "draft")));
  form.append(field("Private notes", inputControl("privateNotes", idea?.privateNotes || "", { multiline: true, rows: 5, placeholder: "Explore freely. These notes stay in your Sanctuary." }), "No comments or critique are attached to private lab entries."));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: idea ? "Save idea" : "Create private idea" })]));
  return form;
}

export function buildRoutineForm(routine = null) {
  const form = element("form", { className: "stack", attrs: { "data-form": "routine" } });
  if (routine) form.append(element("input", { attrs: { type: "hidden", name: "id", value: routine.id } }));
  form.append(field("Routine or rule", inputControl("title", routine?.title || "", { required: true, maxlength: 100, placeholder: "Protect a focused planning block" })));
  form.append(field("Boundary", selectControl("boundary", [
    { value: "Daily operations", label: "Daily operations" },
    { value: "Creative time", label: "Creative time" },
    { value: "Recovery", label: "Recovery" },
    { value: "End-of-day boundary", label: "End-of-day boundary" },
    { value: "Custom", label: "Custom" },
  ], routine?.boundary || "Creative time")));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: routine ? "Save routine" : "Add routine" })]));
  return form;
}

export function buildIterationForm(idea) {
  const form = element("form", { className: "stack", attrs: { "data-form": "iteration", "data-id": idea.id } });
  form.append(textNode("p", idea.title, "accent-amber"));
  form.append(field("What changed or became clearer?", inputControl("note", "", { multiline: true, required: true, rows: 4, placeholder: "Record one useful observation." })));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: "Save iteration" })]));
  return form;
}

export function buildPromotionForm(idea) {
  const form = element("form", { className: "stack", attrs: { "data-form": "promotion" } });
  form.append(element("input", { attrs: { type: "hidden", name: "ideaId", value: idea.id } }));
  form.append(element("div", { className: "privacy-callout", text: `Source idea: ${idea.title}. Its private notes and check-ins will stay in Sanctuary. Only the fields below become part of the blueprint.` }));
  form.append(field("Blueprint title", inputControl("title", idea.title, { required: true, maxlength: 120 })));
  form.append(field("Category", selectControl("category", categories, "Family project")));
  form.append(field("Purpose", inputControl("purpose", "", { multiline: true, required: true, rows: 3, placeholder: "What larger purpose will this blueprint serve?" })));
  form.append(field("Intended outcome", inputControl("outcome", "", { multiline: true, rows: 2, placeholder: "What useful change or long-term structure should result?" })));
  form.append(field("Success measures", inputControl("successMeasures", "", { multiline: true, rows: 3, placeholder: "One observable sign of success per line" }), "Use a few clear signals that tell you whether the larger outcome is taking shape."));
  form.append(field("Systems / building blocks", inputControl("systems", "", { multiline: true, rows: 3, placeholder: "Name | purpose | dependency (one per line)" }), "Create a shareable structural outline. Private source notes are never copied."));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: "Review and create blueprint" })]));
  return form;
}

export function buildBlueprintForm(blueprint = null) {
  const form = element("form", { className: "stack", attrs: { "data-form": "blueprint" } });
  if (blueprint) form.append(element("input", { attrs: { type: "hidden", name: "id", value: blueprint.id } }));
  form.append(field("Blueprint title", inputControl("title", blueprint?.title || "", { required: true, maxlength: 120, placeholder: "A system, shared asset, or long-term initiative" })));
  form.append(element("div", { className: "form-grid" }, [
    field("Category", selectControl("category", categories, blueprint?.category || "Family project")),
    field("Stage", selectControl("stage", stages, blueprint?.stage || "concept")),
  ]));
  form.append(field("Purpose", inputControl("purpose", blueprint?.purpose || "", { multiline: true, required: true, rows: 3, placeholder: "Why does this system or blueprint matter?" })));
  form.append(field("Long-term outcome", inputControl("outcome", blueprint?.outcome || "", { multiline: true, rows: 2, placeholder: "What should this make possible?" })));
  form.append(field("Success measures", inputControl("successMeasures", blueprint?.successMeasures?.join("\n") || "", { multiline: true, rows: 3, placeholder: "One observable sign of success per line" }), "Keep measures connected to the outcome and the system being built."));
  form.append(field("Systems / building blocks", inputControl("systems", blueprint?.systems?.map((item) => [item.name, item.purpose, item.dependencies].filter(Boolean).join(" | ")).join("\n") || "", { multiline: true, rows: 5, placeholder: "System name | purpose | dependency (one per line)" }), "Model the larger structure rather than breaking everything into daily tasks."));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: blueprint ? "Save blueprint" : "Create blueprint" })]));
  return form;
}

export function buildMilestoneForm(blueprint, milestone = null) {
  const form = element("form", { className: "stack", attrs: { "data-form": "milestone", "data-blueprint-id": blueprint.id } });
  if (milestone) form.append(element("input", { attrs: { type: "hidden", name: "id", value: milestone.id } }));
  form.append(textNode("p", blueprint.title, "accent-sage"));
  form.append(field("Milestone", inputControl("title", milestone?.title || "", { required: true, maxlength: 140, placeholder: "A meaningful architecture or review checkpoint" })));
  form.append(element("div", { className: "form-grid" }, [
    field("Target date", element("input", { className: "control", attrs: { type: "date", name: "dueDate", value: milestone?.dueDate || "" } })),
    field("Owner", inputControl("owner", milestone?.owner || "", { placeholder: "A planned owner" })),
  ]));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: milestone ? "Save milestone" : "Add milestone" })]));
  return form;
}

export function buildRoleForm(blueprint) {
  const form = element("form", { className: "stack", attrs: { "data-form": "role", "data-blueprint-id": blueprint.id } });
  form.append(textNode("p", blueprint.title, "accent-sage"));
  form.append(textNode("div", "This assigns a role in the plan. It does not grant access or send an invitation.", "privacy-callout"));
  form.append(field("Person or group", inputControl("displayName", "", { required: true, maxlength: 80, placeholder: "Family member, friend, or trusted peer" })));
  form.append(field("Circle", inputControl("context", "", { placeholder: "Family, friend, or peer/mentor" })));
  form.append(field("Role", selectControl("role", [
    { value: "architect", label: "Architect - owns the core architecture" },
    { value: "builder", label: "Builder - owns a defined part or milestone" },
    { value: "advisor", label: "Advisor - provides invited review or input" },
  ], "builder")));
  form.append(field("Ownership / scope", inputControl("ownership", "", { required: true, multiline: true, rows: 2, placeholder: "What can this person shape, build, or advise on?" })));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: "Assign planned role" })]));
  return form;
}

export function buildDecisionForm(blueprint) {
  const form = element("form", { className: "stack", attrs: { "data-form": "decision", "data-blueprint-id": blueprint.id } });
  form.append(textNode("p", blueprint.title, "accent-sage"));
  form.append(field("Decision", inputControl("title", "", { required: true, maxlength: 120, placeholder: "What was decided?" })));
  form.append(field("Rationale or context", inputControl("detail", "", { multiline: true, rows: 3, placeholder: "Capture why this choice supports the larger system." })));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: "Add to decision log" })]));
  return form;
}

export function buildInputForm(blueprint) {
  const form = element("form", { className: "stack", attrs: { "data-form": "blueprint-input", "data-blueprint-id": blueprint.id } });
  form.append(textNode("p", blueprint.title, "accent-sage"));
  form.append(textNode("div", "Capture input from a real conversation. The app stores this note locally and does not send it to the named person.", "privacy-callout"));
  form.append(element("div", { className: "form-grid" }, [
    field("Contributor", inputControl("contributor", "", { required: true, maxlength: 80, placeholder: "Family member, friend, peer, or mentor" })),
    field("Circle", inputControl("context", "", { placeholder: "Family, friends, or peer circle" })),
  ]));
  form.append(field("Input type", selectControl("kind", [
    { value: "feedback", label: "Feedback" },
    { value: "co-creation", label: "Co-creation" },
    { value: "advisory", label: "Advisory input" },
  ], "advisory")));
  form.append(field("Related system, milestone, or decision", inputControl("area", "", { placeholder: "Optional area of the blueprint" })));
  form.append(field("Input or contribution", inputControl("note", "", { required: true, multiline: true, rows: 4, placeholder: "What did they contribute, suggest, or help shape?" })));
  form.append(element("div", { className: "form-actions" }, [element("button", { className: "button", attrs: { type: "submit" }, text: "Save planning note" })]));
  return form;
}
