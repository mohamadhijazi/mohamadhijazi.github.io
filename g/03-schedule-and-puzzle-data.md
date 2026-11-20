# 03 — Local Slot Schedule and Puzzle Catalog

## Goal

Implement one deterministic schedule and a validated catalog of 252 prebuilt puzzle definitions. The same game and local 8-hour slot must always return the same puzzle, including after reload.

## Schedule contract

Use the browser's local wall clock. Slot boundaries are exactly 00:00, 08:00, and 16:00 local time:

```text
slotOfDay = 0 for 00:00 <= local time < 08:00
slotOfDay = 1 for 08:00 <= local time < 16:00
slotOfDay = 2 for 16:00 <= local time < 24:00
```

Compute `localDayIndex` from the local calendar date (not elapsed milliseconds since midnight), normalized to `0..13`. Use `1970-01-01` as the fixed cycle anchor: convert the current local year/month/day components and the anchor date to UTC day ordinals, subtract, then apply positive modulo 14. Use calendar-day arithmetic so daylight-saving transitions do not skip or duplicate a local day. A timezone change may change the user's current local challenge; do not claim a globally synchronized challenge.

For storage, create a numeric `slotIndex` as:

```text
slotIndex = (UTC day ordinal of the local calendar date * 3) + slotOfDay
```

The UTC day ordinal is derived from the local date's year/month/day components using `Date.UTC(year, month, day) / 86_400_000`. This gives a stable integer for a given local date and drop. Do not compute it by dividing `Date.now()` into fixed eight-hour intervals.

Create reusable functions with explicit inputs/outputs for:

- current slot number and slot index,
- local day index (`0..13`),
- milliseconds until the next local boundary,
- slot label/drop number for display.

Handle exact boundaries correctly: at 08:00:00 the active slot is slot 1, with a full 8 hours remaining.

## Catalog contract

`puzzles-db.js` exports a catalog keyed by the six IDs. Every game has an array of exactly 42 immutable puzzle definitions indexed by `localDayIndex * 3 + slotOfDay`. A catalog entry includes a stable puzzle ID, game ID, day index, slot of day, schema version, and `difficulty` (`easy`, `medium`, or `hard`) in addition to game-specific data.

Requirements:

- Each of the 42 entries per game is distinct (compare normalized game-specific content, not only generated IDs).
- Puzzle selection is direct index lookup, not random selection and not a network request.
- Puzzle definitions are deterministic constants. Never generate a new random board at runtime for a scheduled challenge.
- Practice mode may select any of the same 42 catalog entries by game and puzzle ID. It must not depend on the current slot and must run under a separate unscored mode.
- Give each entry a difficulty label. Use game-specific review/solver evidence: easy has direct or low-branching deductions; medium requires interacting constraints; hard requires multiple dependent deductions or deeper search. Record labels consistently; they never affect rank or points.
- Keep data readable and validate all entries on startup/development. If an entry is missing or malformed, show a useful error rather than silently selecting another puzzle.
- Include a catalog metadata version so a future data change can be identified. Do not mutate old completed history when catalog data changes.
- Keep each game's 42 definitions in its own clearly labeled section or data file area inside `puzzles-db.js`. Do not add files beyond the layout in brief 01 unless the user approves.

## Puzzle quality gate

Every puzzle must have at least one valid solution. Require exactly one valid solution for Zip, SumBreak, Tango, and Queens. BreakLogic must have a valid target obeying its symbol/duplicate rules. Tic-Tac-Toe must have at least one forced-win strategy within its declared user-move limit against optimal legal opponent responses; multiple valid winning strategies are allowed. All constraints and locked cells must be satisfiable. Do not label a board as a forced-win puzzle without checking it with the game solver.

Puzzle verification must be repeatable: use deterministic game-specific solvers in development/tests, count solutions only up to two when checking uniqueness, and assert the stored answer passes the game's normal completion validator. Store a canonical answer for Zip, SumBreak, Tango, and Queens in each catalog definition for solver checks and contextual hints; BreakLogic's `target` is its answer. Tic-Tac-Toe is verified by its forced-win solver. Keep answer/solver data out of visible UI and hint text must not reveal a complete answer. The static client cannot make embedded puzzle data secret from a technically curious user.

The data brief for each game specifies its complete shape. Add a small deterministic integrity check that validates count, IDs, indices, and required fields. A full solver may be used for uniqueness checks during development, but production must not block startup with a slow exhaustive search.

## Acceptance checks

- Check timestamps just before and exactly at each 8-hour boundary.
- Check that local midnight, a month/year rollover, and daylight-saving transition retain correct local slot and day index.
- For each of six games, enumerate all 42 indices and assert each lookup returns the matching entry every time.
- Assert there are 42 unique normalized definitions per game and 252 total definitions.
- Assert every entry has an allowed difficulty label and passes its solution/uniqueness policy.
- Change system time and reload; the selected puzzle changes only when its schedule key changes.
