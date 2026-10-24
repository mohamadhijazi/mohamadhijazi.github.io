import { dateOffsetISO, todayISO } from "./utils.js";

export function createDefaultState() {
  const today = todayISO();
  return {
    version: 1,
    sanctuary: {
      checkIns: [
        { id: "checkin-today", date: today, energy: 68, friction: 24, privateNote: "Good focus window before the afternoon commitments." },
        { id: "checkin-yesterday", date: dateOffsetISO(-1), energy: 56, friction: 43, privateNote: "Kept the morning clear for planning." },
        { id: "checkin-two-days", date: dateOffsetISO(-2), energy: 74, friction: 18, privateNote: "" },
      ],
      routines: [
        { id: "routine-focus", title: "Protect a focused planning block", boundary: "Creative time", completedDates: [dateOffsetISO(-1), dateOffsetISO(-3)] },
        { id: "routine-operations", title: "Close the loop on core responsibilities", boundary: "Daily operations", completedDates: [dateOffsetISO(-1), dateOffsetISO(-2)] },
        { id: "routine-reset", title: "Reset the workspace before stopping", boundary: "End-of-day boundary", completedDates: [dateOffsetISO(-2)] },
      ],
      labEntries: [
        {
          id: "idea-workshop", title: "A family workshop that grows with us", state: "exploring", createdAt: today,
          privateNotes: "Explore a shared space for repairs, craft, and weekend projects. Keep the first conversations informal.",
          iterations: [{ id: "iteration-workshop-1", date: dateOffsetISO(-1), note: "Listed the activities and tools that matter most." }],
          promotedBlueprintId: null,
        },
        {
          id: "idea-archive", title: "A private family story archive", state: "promoted", createdAt: dateOffsetISO(-3),
          privateNotes: "Collect audio stories and family photos with a simple preservation plan.",
          iterations: [{ id: "iteration-archive-1", date: dateOffsetISO(-2), note: "Identified a first small pilot and a backup question." }],
          promotedBlueprintId: "blueprint-heritage",
        },
        {
          id: "idea-workflow", title: "A calmer weekly review", state: "draft", createdAt: dateOffsetISO(-4),
          privateNotes: "Try a short review that protects deep work and makes commitments visible.",
          iterations: [], promotedBlueprintId: null,
        },
      ],
    },
    sandbox: {
      people: [
        { id: "person-architect", displayName: "You", context: "Owner" },
        { id: "person-family", displayName: "Family member", context: "Family" },
        { id: "person-peer", displayName: "Trusted peer", context: "Peer circle" },
        { id: "person-advisor", displayName: "Mentor", context: "Peer circle" },
      ],
      blueprints: [
        {
          id: "blueprint-workshop", sourceIdeaId: null, title: "Family Workshop & Shared Making Space",
          category: "Family project", stage: "shaping", purpose: "Create a lasting place for family projects, learning, and repair.",
          outcome: "A useful, safe workshop with a clear shared-care model.",
          successMeasures: ["Family agrees on safety and shared-care principles", "The first layout supports the agreed priority activities"],
          systems: [
            { id: "system-layout", name: "Space and layout", purpose: "Plan zones for making, storage, and safe movement.", dependencies: "Site choice" },
            { id: "system-tools", name: "Tools and maintenance", purpose: "Select a starter set and a care routine.", dependencies: "Space and layout" },
          ],
          milestones: [
            { id: "mile-workshop-vision", title: "Agree on the shared vision", dueDate: dateOffsetISO(9), done: true, owner: "You" },
            { id: "mile-workshop-options", title: "Compare location and layout options", dueDate: dateOffsetISO(21), done: false, owner: "Family member" },
            { id: "mile-workshop-care", title: "Define upkeep and safety principles", dueDate: dateOffsetISO(35), done: false, owner: "You" },
          ],
          inputs: [
            { id: "input-workshop-family", date: dateOffsetISO(-1), contributor: "Family member", context: "Family", kind: "co-creation", area: "Space and layout", note: "Keep one flexible surface clear so adults and children can use the space together.", status: "considering" },
          ],
          decisions: [{ id: "decision-workshop-1", date: dateOffsetISO(-2), title: "Start with a modest, adaptable footprint", detail: "Keep the first layout flexible until the family's use cases are clear." }],
          roles: [
            { id: "role-workshop-architect", personId: "person-architect", displayName: "You", role: "architect", ownership: "Core blueprint and design principles" },
            { id: "role-workshop-builder", personId: "person-family", displayName: "Family member", role: "builder", ownership: "Layout options and practical needs" },
          ],
          createdAt: today,
        },
        {
          id: "blueprint-heritage", sourceIdeaId: "idea-archive", title: "Family Digital Heritage Archive",
          category: "Family legacy", stage: "active", purpose: "Preserve stories, photographs, and recordings in a system the family can maintain.",
          outcome: "A backed-up archive with clear stewardship and contribution paths.",
          successMeasures: ["A small family pilot can be added and found", "A backup can be restored from a second copy"],
          systems: [
            { id: "system-capture", name: "Capture and description", purpose: "Make it easy to add a story with useful context.", dependencies: "Consent and naming principles" },
            { id: "system-preserve", name: "Storage and backup", purpose: "Keep original files safe and recoverable.", dependencies: "Storage choice" },
          ],
          milestones: [
            { id: "mile-heritage-guidelines", title: "Agree on archive guidelines", dueDate: dateOffsetISO(-1), done: true, owner: "You" },
            { id: "mile-heritage-pilot", title: "Run a small family pilot", dueDate: dateOffsetISO(12), done: false, owner: "Family member" },
          ],
          inputs: [
            { id: "input-heritage-mentor", date: dateOffsetISO(-3), contributor: "Mentor", context: "Peer circle", kind: "advisory", area: "Storage and backup", note: "Practice restoring one small sample before trusting the archive to a single storage location.", status: "incorporated" },
          ],
          decisions: [],
          roles: [
            { id: "role-heritage-architect", personId: "person-architect", displayName: "You", role: "architect", ownership: "System structure and stewardship" },
            { id: "role-heritage-advisor", personId: "person-advisor", displayName: "Mentor", role: "advisor", ownership: "Backup approach and review" },
          ],
          createdAt: dateOffsetISO(-14),
        },
        {
          id: "blueprint-peer", sourceIdeaId: null, title: "Trusted Peer Learning Circle",
          category: "Peer & mentor", stage: "concept", purpose: "Create a small, purposeful circle for exchanging high-level technical and strategic thinking.",
          outcome: "A repeatable format for sharing blueprints and useful advisory input.",
          successMeasures: ["A first session has a clear blueprint and questions", "Participants can name a useful next decision"],
          systems: [{ id: "system-circle", name: "Session framework", purpose: "Set an agenda around a blueprint, questions, and decisions.", dependencies: "Member expectations" }],
          milestones: [
            { id: "mile-peer-principles", title: "Draft the participation principles", dueDate: dateOffsetISO(18), done: false, owner: "You" },
          ],
          inputs: [
            { id: "input-peer-feedback", date: dateOffsetISO(-2), contributor: "Trusted peer", context: "Peer circle", kind: "feedback", area: "Session framework", note: "Send one clear question with each blueprint so feedback stays focused and easy to act on.", status: "considering" },
          ],
          decisions: [],
          roles: [
            { id: "role-peer-architect", personId: "person-architect", displayName: "You", role: "architect", ownership: "Circle format and blueprint ownership" },
            { id: "role-peer-advisor", personId: "person-peer", displayName: "Trusted peer", role: "advisor", ownership: "Technical feedback when invited" },
          ],
          createdAt: dateOffsetISO(-4),
        },
        {
          id: "blueprint-advisory-practice", sourceIdeaId: null, title: "Independent Advisory Practice Pilot",
          category: "Venture", stage: "paused", purpose: "Shape a small, sustainable advisory offer around work the owner can deliver well.",
          outcome: "A focused pilot offer with a repeatable client intake and delivery process.",
          successMeasures: ["One clearly scoped pilot offer is ready to share", "The first delivery can be completed within the agreed weekly capacity"],
          systems: [
            { id: "system-offer", name: "Offer design", purpose: "Define the client, problem, scope, and useful outcome for the pilot.", dependencies: "Capacity and positioning" },
            { id: "system-delivery", name: "Client intake and delivery", purpose: "Create a lightweight path from first conversation to completed engagement.", dependencies: "Offer design" },
            { id: "system-learning", name: "Learning and refinement", purpose: "Capture client feedback and decide what to improve after the pilot.", dependencies: "First pilot delivery" },
          ],
          milestones: [
            { id: "mile-practice-capacity", title: "Set a sustainable weekly capacity", dueDate: dateOffsetISO(10), done: false, owner: "You" },
            { id: "mile-practice-offer", title: "Draft the pilot offer and boundaries", dueDate: dateOffsetISO(20), done: false, owner: "You" },
            { id: "mile-practice-review", title: "Review the pilot scope with an advisor", dueDate: dateOffsetISO(28), done: false, owner: "Trusted peer" },
          ],
          inputs: [
            { id: "input-practice-peer", date: dateOffsetISO(-1), contributor: "Trusted peer", context: "Peer circle", kind: "advisory", area: "Offer design", note: "Keep the first offer narrow enough to deliver without consuming the time reserved for core responsibilities.", status: "parked" },
          ],
          decisions: [
            { id: "decision-practice-capacity", date: dateOffsetISO(-1), title: "Define capacity before setting a launch date", detail: "Pause outreach until the weekly time boundary and pilot scope are clear." },
          ],
          roles: [
            { id: "role-practice-architect", personId: "person-architect", displayName: "You", role: "architect", ownership: "Offer direction, scope, and final decisions" },
            { id: "role-practice-advisor", personId: "person-peer", displayName: "Trusted peer", role: "advisor", ownership: "Review positioning and pilot assumptions when invited" },
          ],
          createdAt: dateOffsetISO(-5),
        },
      ],
    },
  };
}
